import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateAssignmentData, FixedQuestion } from '@/types/classroom';

/**
 * GET /api/courses/[courseId]/assignments/[assignmentId]
 * 
 * Get assignment details
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

    const assignment = await db.courseAssignment.findUnique({
      where: { id: assignmentId },
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

    // Check access permissions
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
    } else if (
      session.user.role === 'TEACHER' &&
      assignment.course.teacherId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'You can only view assignments for your own courses' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: assignment.id,
      courseId: assignment.courseId,
      assignmentType: assignment.assignmentType || 'LEVEL_BASED',
      levelId: assignment.levelId,
      title: assignment.title,
      description: assignment.description,
      descriptionFormat: assignment.descriptionFormat || 'PLAIN',
      instructions: assignment.instructions,
      dueDate: assignment.dueDate?.toISOString() || null,
      maxPoints: assignment.maxPoints,
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
    });
  } catch (error: any) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses/[courseId]/assignments/[assignmentId]
 * 
 * Update assignment (teacher only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can update assignments' },
        { status: 403 }
      );
    }

    const { courseId, assignmentId } = await params;
    const body: Partial<CreateAssignmentData> = await request.json();

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

    if (assignment.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only update assignments in your own courses' },
        { status: 403 }
      );
    }

    // Validate assignment type specific fields
    if (body.assignmentType === 'FIXED_QUESTIONS') {
      if (body.questions && body.questions.length === 0) {
        return NextResponse.json(
          { error: 'FIXED_QUESTIONS must have at least 1 question' },
          { status: 400 }
        );
      }
      // Auto-calculate maxPoints from question points
      if (body.questions && body.questions.length > 0) {
        const calculatedMaxPoints = body.questions.reduce((sum: number, q: FixedQuestion) => sum + (q.points || 10), 0);
        body.maxPoints = calculatedMaxPoints;
      }
    }

    const updatedAssignment = await db.courseAssignment.update({
      where: { id: assignmentId },
      data: {
        ...(body.assignmentType && { assignmentType: body.assignmentType }),
        ...(body.levelId !== undefined && { 
          levelId: body.assignmentType === 'LEVEL_BASED' ? body.levelId : null 
        }),
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.descriptionFormat && { descriptionFormat: body.descriptionFormat }),
        ...(body.instructions !== undefined && { instructions: body.instructions }),
        ...(body.dueDate !== undefined && {
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        }),
        ...(body.maxPoints !== undefined && { maxPoints: body.maxPoints }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.quizSettings !== undefined && { 
          quizSettings: body.quizSettings ? JSON.parse(JSON.stringify(body.quizSettings)) : null 
        }),
        ...(body.questions !== undefined && { 
          questions: body.questions ? JSON.parse(JSON.stringify(body.questions)) : null 
        }),
        ...(body.quizSettingsForFixed !== undefined && { 
          quizSettingsForFixed: body.quizSettingsForFixed ? JSON.parse(JSON.stringify(body.quizSettingsForFixed)) : null 
        }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.isPinned !== undefined && { isPinned: body.isPinned }),
        ...(body.isDraft !== undefined && { isDraft: body.isDraft }),
        ...(body.publishedAt !== undefined && {
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        }),
        ...(body.attachments !== undefined && { 
          attachments: body.attachments ? JSON.parse(JSON.stringify(body.attachments)) : null 
        }),
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

    return NextResponse.json({
      id: updatedAssignment.id,
      courseId: updatedAssignment.courseId,
      assignmentType: updatedAssignment.assignmentType || 'LEVEL_BASED',
      levelId: updatedAssignment.levelId,
      title: updatedAssignment.title,
      description: updatedAssignment.description,
      descriptionFormat: updatedAssignment.descriptionFormat || 'PLAIN',
      instructions: updatedAssignment.instructions,
      dueDate: updatedAssignment.dueDate?.toISOString() || null,
      maxPoints: updatedAssignment.maxPoints,
      order: updatedAssignment.order,
      quizSettings: updatedAssignment.quizSettings,
      questions: updatedAssignment.questions,
      quizSettingsForFixed: updatedAssignment.quizSettingsForFixed,
      priority: updatedAssignment.priority,
      isPinned: updatedAssignment.isPinned || false,
      isDraft: updatedAssignment.isDraft || false,
      publishedAt: updatedAssignment.publishedAt?.toISOString() || null,
      attachments: updatedAssignment.attachments,
      createdAt: updatedAssignment.createdAt.toISOString(),
      level: updatedAssignment.level,
    });
  } catch (error: any) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[courseId]/assignments/[assignmentId]
 * 
 * Delete assignment (teacher only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can delete assignments' },
        { status: 403 }
      );
    }

    const { courseId, assignmentId } = await params;

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

    if (assignment.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete assignments in your own courses' },
        { status: 403 }
      );
    }

    await db.courseAssignment.delete({
      where: { id: assignmentId },
    });

    return NextResponse.json({ message: 'Assignment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
