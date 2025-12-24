import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateAssignmentData } from '@/types/classroom';

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
      levelId: assignment.levelId,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate?.toISOString() || null,
      maxPoints: assignment.maxPoints,
      order: assignment.order,
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

    const updatedAssignment = await db.courseAssignment.update({
      where: { id: assignmentId },
      data: {
        ...(body.levelId && { levelId: body.levelId }),
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.dueDate !== undefined && {
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        }),
        ...(body.maxPoints !== undefined && { maxPoints: body.maxPoints }),
        ...(body.order !== undefined && { order: body.order }),
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
      levelId: updatedAssignment.levelId,
      title: updatedAssignment.title,
      description: updatedAssignment.description,
      dueDate: updatedAssignment.dueDate?.toISOString() || null,
      maxPoints: updatedAssignment.maxPoints,
      order: updatedAssignment.order,
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
