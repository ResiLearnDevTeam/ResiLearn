import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateAssignmentData } from '@/types/classroom';

/**
 * GET /api/courses/[courseId]/assignments
 * 
 * List assignments for a course
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user has access (enrolled or is teacher)
    if (session.user.role === 'STUDENT') {
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
      });

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You are not enrolled in this course' },
          { status: 403 }
        );
      }
    } else if (session.user.role === 'TEACHER' && course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only view assignments for your own courses' },
        { status: 403 }
      );
    }

    const assignments = await db.courseAssignment.findMany({
      where: { courseId },
      include: {
        level: {
          select: {
            id: true,
            number: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // For students, add completion status
    let assignmentsWithProgress = assignments;
    if (session.user.role === 'STUDENT') {
      const levelAttempts = await db.levelAttempt.findMany({
        where: {
          userId: session.user.id,
          courseId,
          mode: 'QUIZ',
        },
        select: {
          levelId: true,
          percentage: true,
          passed: true,
        },
      });

      const attemptMap = new Map(
        levelAttempts.map(a => [
          a.levelId,
          { score: a.percentage || 0, passed: a.passed || false },
        ])
      );

      assignmentsWithProgress = assignments.map(assignment => ({
        ...assignment,
        completed: attemptMap.get(assignment.levelId)?.passed || false,
        bestScore: attemptMap.get(assignment.levelId)?.score || 0,
      }));
    }

    return NextResponse.json(
      assignmentsWithProgress.map(a => ({
        id: a.id,
        courseId: a.courseId,
        levelId: a.levelId,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate?.toISOString() || null,
        maxPoints: a.maxPoints,
        order: a.order,
        createdAt: a.createdAt.toISOString(),
        level: a.level,
        completed: (a as any).completed || false,
        bestScore: (a as any).bestScore || 0,
      }))
    );
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses/[courseId]/assignments
 * 
 * Create assignment (teacher only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can create assignments' },
        { status: 403 }
      );
    }

    const { courseId } = await params;
    const body: CreateAssignmentData = await request.json();
    const { levelId, title, description, dueDate, maxPoints, order } = body;

    if (!levelId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: levelId, title' },
        { status: 400 }
      );
    }

    // Check if course exists and user is the teacher
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only create assignments for your own courses' },
        { status: 403 }
      );
    }

    // Check if level exists
    const level = await db.level.findUnique({
      where: { id: levelId },
    });

    if (!level) {
      return NextResponse.json({ error: 'Level not found' }, { status: 404 });
    }

    // Get next order if not provided
    let assignmentOrder = order;
    if (assignmentOrder === undefined) {
      const lastAssignment = await db.courseAssignment.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
      });
      assignmentOrder = lastAssignment ? lastAssignment.order + 1 : 0;
    }

    const assignment = await db.courseAssignment.create({
      data: {
        courseId,
        levelId,
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        maxPoints: maxPoints || 100,
        order: assignmentOrder,
      },
      include: {
        level: {
          select: {
            id: true,
            number: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: assignment.id,
        courseId: assignment.courseId,
        levelId: assignment.levelId,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate?.toISOString() || null,
        maxPoints: assignment.maxPoints,
        order: assignment.order,
        createdAt: assignment.createdAt.toISOString(),
        level: assignment.level,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
