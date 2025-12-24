import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

/**
 * GET /api/courses/[courseId]/progress
 * 
 * Get course progress for current user (student) or overall progress (teacher)
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

    if (session.user.role === 'STUDENT') {
      // Student: Get their own progress
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

      // Get assignment completion
      const assignments = await db.courseAssignment.findMany({
        where: { courseId },
        select: {
          id: true,
          levelId: true,
          maxPoints: true,
        },
      });

      const attempts = await db.levelAttempt.findMany({
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
        attempts.map(a => [a.levelId, { score: a.percentage || 0, passed: a.passed || false }])
      );

      const completedAssignments = assignments.filter(a => 
        attemptMap.get(a.levelId)?.passed
      ).length;

      const totalPoints = assignments.reduce((sum, a) => sum + a.maxPoints, 0);
      const earnedPoints = attempts
        .filter(a => a.passed)
        .reduce((sum, a) => sum + (a.percentage || 0), 0);

      return NextResponse.json({
        progress: enrollment.progress,
        completedAssignments,
        totalAssignments: assignments.length,
        earnedPoints: Math.round(earnedPoints),
        totalPoints,
        assignments: assignments.map(a => ({
          id: a.id,
          levelId: a.levelId,
          completed: attemptMap.get(a.levelId)?.passed || false,
          score: attemptMap.get(a.levelId)?.score || 0,
        })),
      });
    } else if (session.user.role === 'TEACHER' && course.teacherId === session.user.id) {
      // Teacher: Get overall course statistics
      const enrollments = await db.enrollment.findMany({
        where: { courseId },
        select: {
          progress: true,
        },
      });

      const assignments = await db.courseAssignment.findMany({
        where: { courseId },
        select: {
          id: true,
        },
      });

      const averageProgress =
        enrollments.length > 0
          ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
          : 0;

      return NextResponse.json({
        totalStudents: enrollments.length,
        totalAssignments: assignments.length,
        averageProgress: Math.round(averageProgress),
      });
    } else {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
