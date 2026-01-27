import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';

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

      // Get practice sessions for this course
      const practiceSessions = await db.practiceSession.findMany({
        where: {
          userId: session.user.id,
          courseId,
        },
        orderBy: {
          completedAt: 'desc',
        },
      });

      // Calculate analytics from practice sessions
      const allQuestions: any[] = [];
      practiceSessions.forEach(session => {
        if (session.questions && Array.isArray(session.questions)) {
          allQuestions.push(...session.questions);
        }
      });

      if (allQuestions.length === 0) {
        return NextResponse.json({
          overall: {
            totalSessions: 0,
            totalQuestions: 0,
            overallAccuracy: 0,
          },
          topWeakAreas: [],
        });
      }

      const deepAnalytics = calculateDeepAnalytics(allQuestions);

      // Calculate overall stats
      const totalSessions = practiceSessions.length;
      const totalQuestions = allQuestions.length;
      const correctAnswers = allQuestions.filter(q => q.isCorrect).length;
      const overallAccuracy = totalQuestions > 0
        ? (correctAnswers / totalQuestions) * 100
        : 0;

      // Get top weak areas
      const topWeakAreas = [];
      if (deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect > 0) {
        const errorRate = (deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect /
          (deepAnalytics.resistorTypeErrors.FOUR_BAND.correct + deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect)) * 100;
        topWeakAreas.push({
          type: '4-band',
          description: '4-band resistor errors',
          errorRate,
        });
      }
      if (deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect > 0) {
        const errorRate = (deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect /
          (deepAnalytics.resistorTypeErrors.FIVE_BAND.correct + deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect)) * 100;
        topWeakAreas.push({
          type: '5-band',
          description: '5-band resistor errors',
          errorRate,
        });
      }

      topWeakAreas.sort((a, b) => b.errorRate - a.errorRate);

      return NextResponse.json({
        overall: {
          totalSessions,
          totalQuestions,
          overallAccuracy: Math.round(overallAccuracy),
        },
        topWeakAreas: topWeakAreas.slice(0, 5),
        deepAnalytics,
      });
    } else if (session.user.role === 'TEACHER' && course.teacherId === session.user.id) {
      // Teacher analytics - aggregate all students
      const enrollments = await db.enrollment.findMany({
        where: { courseId },
        select: {
          userId: true,
        },
      });

      const userIds = enrollments.map(e => e.userId);

      // Get all practice sessions for all students in this course
      const practiceSessions = await db.practiceSession.findMany({
        where: {
          userId: { in: userIds },
          courseId,
        },
        orderBy: {
          completedAt: 'desc',
        },
      });

      // Get all quiz attempts (LevelAttempt mode: QUIZ) for all students in this course
      const quizAttempts = await db.levelAttempt.findMany({
        where: {
          userId: { in: userIds },
          courseId,
          mode: 'QUIZ',
        },
        orderBy: {
          completedAt: 'desc',
        },
      });

      // Calculate aggregate analytics from both practice sessions and quiz attempts
      const allQuestions: any[] = [];
      
      // From PracticeSession (แบบฝึกหัด)
      practiceSessions.forEach(session => {
        if (session.questions && Array.isArray(session.questions)) {
          allQuestions.push(...session.questions);
        }
      });

      // From LevelAttempt (แบบทดสอบ)
      quizAttempts.forEach(attempt => {
        if (attempt.questions && Array.isArray(attempt.questions)) {
          allQuestions.push(...attempt.questions);
        }
      });

      if (allQuestions.length === 0) {
        return NextResponse.json({
          overall: {
            totalSessions: 0,
            totalQuestions: 0,
            overallAccuracy: 0,
          },
          topWeakAreas: [],
        });
      }

      const deepAnalytics = calculateDeepAnalytics(allQuestions);

      // Total sessions includes both practice sessions and quiz attempts
      const totalSessions = practiceSessions.length + quizAttempts.length;
      const totalQuestions = allQuestions.length;
      const correctAnswers = allQuestions.filter(q => q.isCorrect).length;
      const overallAccuracy = totalQuestions > 0
        ? (correctAnswers / totalQuestions) * 100
        : 0;

      // Get top weak areas
      const topWeakAreas = [];
      if (deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect > 0) {
        const errorRate = (deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect /
          (deepAnalytics.resistorTypeErrors.FOUR_BAND.correct + deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect)) * 100;
        topWeakAreas.push({
          type: '4-band',
          description: '4-band resistor errors',
          errorRate,
        });
      }
      if (deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect > 0) {
        const errorRate = (deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect /
          (deepAnalytics.resistorTypeErrors.FIVE_BAND.correct + deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect)) * 100;
        topWeakAreas.push({
          type: '5-band',
          description: '5-band resistor errors',
          errorRate,
        });
      }

      topWeakAreas.sort((a, b) => b.errorRate - a.errorRate);

      return NextResponse.json({
        overall: {
          totalSessions,
          totalQuestions,
          overallAccuracy: Math.round(overallAccuracy),
        },
        topWeakAreas: topWeakAreas.slice(0, 5),
        deepAnalytics,
      });
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

