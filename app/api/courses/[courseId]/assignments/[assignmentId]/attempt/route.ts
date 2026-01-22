import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

/**
 * GET /api/courses/[courseId]/assignments/[assignmentId]/attempt
 * 
 * Get student's attempt for this assignment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, assignmentId } = await params;

    // Check enrollment
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
    }

    // Get assignment
    const assignment = await db.courseAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          select: {
            id: true,
            teacherId: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    if (assignment.courseId !== courseId) {
      return NextResponse.json(
        { error: 'Assignment does not belong to this course' },
        { status: 400 }
      );
    }

    // Check permissions
    if (session.user.role === 'TEACHER' && assignment.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only view attempts for your own courses' },
        { status: 403 }
      );
    }

    // Get attempt for this assignment
    const attempt = await db.levelAttempt.findFirst({
      where: {
        userId: session.user.id,
        assignmentId,
        courseId,
        mode: 'QUIZ',
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
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'No attempt found for this assignment' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: attempt.id,
      userId: attempt.userId,
      assignmentId: attempt.assignmentId,
      assignmentType: attempt.assignmentType,
      courseId: attempt.courseId,
      levelId: attempt.levelId,
      mode: attempt.mode,
      score: attempt.score,
      percentage: attempt.percentage,
      timeTaken: attempt.timeTaken,
      completedAt: attempt.completedAt.toISOString(),
      passed: attempt.passed,
      questions: attempt.questions,
      level: attempt.level,
      course: attempt.course,
    });
  } catch (error: any) {
    console.error('Error fetching attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
