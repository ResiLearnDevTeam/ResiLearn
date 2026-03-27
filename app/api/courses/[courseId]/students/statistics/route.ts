import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

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

    // Verify course exists and teacher owns it
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (session.user.role !== 'TEACHER' || course.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all enrollments
    const enrollments = await db.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Get assignment attempts for each student
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const attempts = await db.levelAttempt.findMany({
          where: {
            userId: enrollment.userId,
            courseId,
            mode: 'QUIZ',
          },
          select: {
            levelId: true,
            percentage: true,
            passed: true,
          },
        });

        const completedAssignments = attempts.filter(a => a.passed).length;
        const totalAssignments = await db.courseAssignment.count({
          where: { courseId },
        });

        return {
          progress: enrollment.progress,
          completedAssignments,
          totalAssignments,
        };
      })
    );

    // Calculate statistics
    const total = studentsWithProgress.length;
    const averageProgress = total > 0
      ? Math.round(studentsWithProgress.reduce((sum, s) => sum + s.progress, 0) / total)
      : 0;
    const totalCompletedAssignments = studentsWithProgress.reduce(
      (sum, s) => sum + s.completedAssignments,
      0
    );
    const totalAssignments = total > 0
      ? Math.round(studentsWithProgress.reduce((sum, s) => sum + s.totalAssignments, 0) / total)
      : 0;

    return NextResponse.json({
      total,
      averageProgress,
      totalCompletedAssignments,
      totalAssignments,
    });
  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

