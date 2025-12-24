import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

/**
 * DELETE /api/courses/[courseId]/enrollments/[userId]
 * 
 * Remove enrollment (teacher can remove any student, student can remove themselves)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, userId } = await params;

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check permissions: teacher can remove anyone, student can only remove themselves
    if (session.user.role === 'TEACHER' && course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only manage enrollments in your own courses' },
        { status: 403 }
      );
    }

    if (session.user.role === 'STUDENT' && session.user.id !== userId) {
      return NextResponse.json(
        { error: 'You can only remove your own enrollment' },
        { status: 403 }
      );
    }

    // Check if enrollment exists
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    await db.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return NextResponse.json({ message: 'Enrollment removed successfully' });
  } catch (error: any) {
    console.error('Error removing enrollment:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
