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
          assignmentId: true,
          percentage: true,
          passed: true,
        },
      });

      // Create maps for both levelId and assignmentId
      const levelAttemptMap = new Map(
        levelAttempts
          .filter(a => a.levelId)
          .map(a => [
            a.levelId!,
            { score: a.percentage || 0, passed: a.passed || false },
          ])
      );

      const assignmentAttemptMap = new Map(
        levelAttempts
          .filter(a => a.assignmentId)
          .map(a => [
            a.assignmentId!,
            { score: a.percentage || 0, passed: a.passed || false },
          ])
      );

      assignmentsWithProgress = assignments.map(assignment => {
        // ใช้ assignmentId สำหรับทุก assignment type
        const attempt = assignmentAttemptMap.get(assignment.id);
        return {
          ...assignment,
          completed: attempt?.passed || false,
          bestScore: attempt?.score || 0,
        };
      });
    }

    return NextResponse.json(
      assignmentsWithProgress.map(a => ({
        id: a.id,
        courseId: a.courseId,
        assignmentType: a.assignmentType || 'CUSTOM_QUIZ',
        assignmentMode: a.assignmentMode,
        levelId: a.levelId,
        title: a.title,
        description: a.description,
        descriptionFormat: a.descriptionFormat || 'PLAIN',
        instructions: a.instructions,
        dueDate: a.dueDate?.toISOString() || null,
        maxPoints: a.maxPoints,
        passThreshold: a.passThreshold,
        showScore: a.showScore,
        allowRetake: a.allowRetake,
        hasScore: a.hasScore,
        order: a.order,
        quizSettings: a.quizSettings,
        questions: a.questions,
        quizSettingsForFixed: a.quizSettingsForFixed,
        priority: a.priority,
        isPinned: a.isPinned || false,
        isDraft: a.isDraft || false,
        publishedAt: a.publishedAt?.toISOString() || null,
        attachments: a.attachments,
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
    const { 
      assignmentType = 'CUSTOM_QUIZ',
      assignmentMode,
      levelId, 
      title, 
      description, 
      descriptionFormat = 'PLAIN',
      instructions,
      dueDate, 
      maxPoints,
      passThreshold,
      showScore,
      allowRetake,
      hasScore,
      order,
      quizSettings,
      questions,
      quizSettingsForFixed,
      priority,
      isPinned = false,
      isDraft = false,
      publishedAt,
      attachments,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    // Validate assignment mode
    if (!assignmentMode || (assignmentMode !== 'PRACTICE' && assignmentMode !== 'EXAM')) {
      return NextResponse.json(
        { error: 'Missing or invalid assignmentMode (must be PRACTICE or EXAM)' },
        { status: 400 }
      );
    }

    // Validate assignment type specific fields
    if (assignmentType === 'CUSTOM_QUIZ' && !quizSettings) {
      return NextResponse.json(
        { error: 'Missing required field: quizSettings (required for CUSTOM_QUIZ)' },
        { status: 400 }
      );
    }

    if (assignmentType === 'FIXED_QUESTIONS') {
      if (!questions || questions.length === 0) {
        return NextResponse.json(
          { error: 'Missing required field: questions (must have at least 1 question for FIXED_QUESTIONS)' },
          { status: 400 }
        );
      }
      // Auto-calculate maxPoints from question points
      const calculatedMaxPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);
      if (!maxPoints || maxPoints !== calculatedMaxPoints) {
        body.maxPoints = calculatedMaxPoints;
      }
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

    // ไม่ต้องตรวจสอบ level แล้ว (ไม่ใช้ LEVEL_BASED)

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
        assignmentType: assignmentType || 'CUSTOM_QUIZ',
        assignmentMode: assignmentMode || null,
        levelId: null, // ไม่ใช้ levelId แล้ว
        title,
        description: description || null,
        descriptionFormat: descriptionFormat || 'PLAIN',
        instructions: instructions || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        maxPoints: maxPoints || 100,
        passThreshold: passThreshold !== undefined ? passThreshold : 50,
        showScore: showScore !== undefined ? showScore : (assignmentMode === 'EXAM' ? true : undefined),
        allowRetake: allowRetake !== undefined ? allowRetake : (assignmentMode === 'PRACTICE' ? true : false),
        hasScore: hasScore !== undefined ? hasScore : (assignmentMode === 'PRACTICE' ? true : undefined),
        order: assignmentOrder,
        quizSettings: quizSettings ? JSON.parse(JSON.stringify(quizSettings)) : null,
        questions: questions ? JSON.parse(JSON.stringify(questions)) : null,
        quizSettingsForFixed: quizSettingsForFixed ? JSON.parse(JSON.stringify(quizSettingsForFixed)) : null,
        priority: priority || null,
        isPinned: isPinned || false,
        isDraft: isDraft || false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        attachments: attachments ? JSON.parse(JSON.stringify(attachments)) : null,
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
        assignmentType: assignment.assignmentType || 'CUSTOM_QUIZ',
        assignmentMode: assignment.assignmentMode,
        levelId: assignment.levelId,
        title: assignment.title,
        description: assignment.description,
        descriptionFormat: assignment.descriptionFormat || 'PLAIN',
        instructions: assignment.instructions,
        dueDate: assignment.dueDate?.toISOString() || null,
        maxPoints: assignment.maxPoints,
        passThreshold: assignment.passThreshold,
        showScore: assignment.showScore,
        allowRetake: assignment.allowRetake,
        hasScore: assignment.hasScore,
        order: assignment.order,
        quizSettings: assignment.quizSettings,
        questions: assignment.questions,
        quizSettingsForFixed: assignment.quizSettingsForFixed,
        priority: assignment.priority,
        isPinned: assignment.isPinned || false,
        isDraft: assignment.isDraft || false,
        publishedAt: assignment.publishedAt?.toISOString() || null,
        attachments: assignment.attachments,
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
