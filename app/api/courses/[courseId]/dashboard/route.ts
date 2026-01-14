import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
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

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (session.user.role === 'STUDENT') {
      // Check enrollment
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

      // Get progress data
      const progress = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
        select: {
          progress: true,
        },
      });

      // Get assignments
      const assignments = await db.courseAssignment.findMany({
        where: { courseId },
        include: {
          level: {
            select: {
              id: true,
              number: true,
              name: true,
            },
          },
        },
      });

      // Get assignment attempts
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
      const assignmentMaxPointsMap = new Map(
        assignments.map(a => [a.levelId, a.maxPoints])
      );
      const earnedPoints = attempts
        .filter(a => a.passed)
        .reduce((sum, a) => {
          const maxPoints = assignmentMaxPointsMap.get(a.levelId) || 0;
          return sum + ((a.percentage || 0) / 100) * maxPoints;
        }, 0);

      // Get practice sessions
      const practiceSessions = await db.practiceSession.findMany({
        where: {
          userId: session.user.id,
          courseId,
        },
        orderBy: {
          completedAt: 'desc',
        },
        take: 20,
      });

      return NextResponse.json({
        progress: progress?.progress || 0,
        completedAssignments,
        totalAssignments: assignments.length,
        earnedPoints: Math.round(earnedPoints),
        totalPoints,
        assignments: assignments.map(a => ({
          id: a.id,
          title: a.title,
          levelId: a.levelId,
          level: a.level,
          maxPoints: a.maxPoints,
          dueDate: a.dueDate?.toISOString(),
          completed: attemptMap.get(a.levelId)?.passed || false,
          bestScore: attemptMap.get(a.levelId)?.score || 0,
        })),
        practiceSessions: practiceSessions.map(s => ({
          id: s.id,
          presetName: s.presetName,
          accuracy: s.accuracy,
          totalQuestions: s.totalQuestions,
          completedAt: s.completedAt.toISOString(),
        })),
      });
    } else if (session.user.role === 'TEACHER' && course.teacherId === session.user.id) {
      // Teacher dashboard data
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

      const totalStudents = enrollments.length;
      const activeStudents = enrollments.filter(e => e.progress > 0).length;

      // Get all assignments
      const assignments = await db.courseAssignment.findMany({
        where: { courseId },
      });

      // Get all attempts
      const allAttempts = await db.levelAttempt.findMany({
        where: {
          courseId,
          mode: 'QUIZ',
        },
      });

      const completedAttempts = allAttempts.filter(a => a.passed).length;
      const averageScore = allAttempts.length > 0
        ? allAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / allAttempts.length
        : 0;

      return NextResponse.json({
        totalStudents,
        activeStudents,
        totalAssignments: assignments.length,
        completedAttempts,
        totalAttempts: allAttempts.length,
        averageScore: Math.round(averageScore),
        enrollments: enrollments.map(e => ({
          id: e.id,
          userId: e.userId,
          user: e.user,
          progress: e.progress,
          enrolledAt: e.enrolledAt.toISOString(),
        })),
      });
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

