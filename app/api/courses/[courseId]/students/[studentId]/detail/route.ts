import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; studentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can view student details' },
        { status: 403 }
      );
    }

    const { courseId, studentId } = await params;

    // Check if course exists and user is the teacher
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only view students in your own courses' },
        { status: 403 }
      );
    }

    // Check if student is enrolled
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Student is not enrolled in this course' },
        { status: 404 }
      );
    }

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
      orderBy: {
        order: 'asc',
      },
    });

    // Get all quiz attempts for this student in this course
    const quizAttempts = await db.levelAttempt.findMany({
      where: {
        userId: studentId,
        courseId,
        mode: 'QUIZ',
      },
      include: {
        level: {
          select: {
            id: true,
            number: true,
            name: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // Get practice sessions
    const practiceSessions = await db.practiceSession.findMany({
      where: {
        userId: studentId,
        courseId,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // Get learning path progress
    const lessonProgress = await db.lessonProgress.findMany({
      where: {
        userId: studentId,
        courseId,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            moduleId: true,
            module: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const moduleProgress = await db.moduleProgress.findMany({
      where: {
        userId: studentId,
        courseId,
      },
      include: {
        module: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Calculate assignment history with attempts
    const assignmentHistory = assignments.map(assignment => {
      const attempts = quizAttempts.filter(a => a.levelId === assignment.levelId);
      const bestAttempt = attempts.length > 0
        ? attempts.reduce((best, current) => 
            (current.percentage || 0) > (best.percentage || 0) ? current : best
          )
        : null;
      
      return {
        id: assignment.id,
        title: assignment.title,
        level: assignment.level,
        maxPoints: assignment.maxPoints,
        dueDate: assignment.dueDate?.toISOString() || null,
        completed: bestAttempt?.passed || false,
        bestScore: bestAttempt?.percentage || 0,
        attempts: attempts.map(a => ({
          id: a.id,
          score: a.percentage || 0,
          passed: a.passed || false,
          timeTaken: a.timeTaken,
          completedAt: a.completedAt.toISOString(),
          questions: a.questions,
        })),
        attemptCount: attempts.length,
      };
    });

    // Calculate time analysis
    const totalTimeSpent = quizAttempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0) +
      practiceSessions.reduce((sum, s) => sum + (s.totalTime || 0), 0);

    // Calculate weak areas
    const allQuestions: any[] = [];
    practiceSessions.forEach(session => {
      if (session.questions && Array.isArray(session.questions)) {
        allQuestions.push(...session.questions);
      }
    });

    const weakAreas = {
      resistorTypes: {
        FOUR_BAND: { correct: 0, incorrect: 0 },
        FIVE_BAND: { correct: 0, incorrect: 0 },
      },
      answerTypes: {} as Record<string, { correct: number; incorrect: number }>,
      difficulties: {} as Record<string, { correct: number; incorrect: number }>,
      colorConfusion: {} as Record<string, number>,
    };

    allQuestions.forEach(q => {
      const resistorType = q.resistorType || 'FOUR_BAND';
      const answerType = q.answerType || 'multiple_choice';
      const difficulty = q.difficulty || 'medium';

      if (q.isCorrect) {
        weakAreas.resistorTypes[resistorType as 'FOUR_BAND' | 'FIVE_BAND'].correct++;
        weakAreas.answerTypes[answerType] = weakAreas.answerTypes[answerType] || { correct: 0, incorrect: 0 };
        weakAreas.answerTypes[answerType].correct++;
        weakAreas.difficulties[difficulty] = weakAreas.difficulties[difficulty] || { correct: 0, incorrect: 0 };
        weakAreas.difficulties[difficulty].correct++;
      } else {
        weakAreas.resistorTypes[resistorType as 'FOUR_BAND' | 'FIVE_BAND'].incorrect++;
        weakAreas.answerTypes[answerType] = weakAreas.answerTypes[answerType] || { correct: 0, incorrect: 0 };
        weakAreas.answerTypes[answerType].incorrect++;
        weakAreas.difficulties[difficulty] = weakAreas.difficulties[difficulty] || { correct: 0, incorrect: 0 };
        weakAreas.difficulties[difficulty].incorrect++;
      }
    });

    // Calculate performance trends
    const performanceTrends = quizAttempts.map(a => ({
      date: a.completedAt.toISOString(),
      score: a.percentage || 0,
      passed: a.passed || false,
    }));

    return NextResponse.json({
      student: {
        id: enrollment.user.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
        studentId: enrollment.user.studentId,
        enrolledAt: enrollment.enrolledAt.toISOString(),
        progress: enrollment.progress,
      },
      assignmentHistory,
      quizAttempts: quizAttempts.map(a => ({
        id: a.id,
        level: a.level,
        score: a.percentage || 0,
        passed: a.passed || false,
        timeTaken: a.timeTaken,
        completedAt: a.completedAt.toISOString(),
        questions: a.questions,
      })),
      practiceSessions: practiceSessions.map(s => ({
        id: s.id,
        presetName: s.presetName,
        accuracy: s.accuracy,
        totalQuestions: s.totalQuestions,
        correctAnswers: s.correctAnswers,
        incorrectAnswers: s.incorrectAnswers,
        averageTime: s.averageTime,
        totalTime: s.totalTime,
        settings: s.settings,
        startedAt: s.startedAt.toISOString(),
        completedAt: s.completedAt.toISOString(),
      })),
      learningPathProgress: {
        lessons: lessonProgress.map(lp => ({
          id: lp.id,
          lesson: lp.lesson,
          completed: lp.completed,
          completedAt: lp.completedAt?.toISOString() || null,
        })),
        modules: moduleProgress.map(mp => ({
          id: mp.id,
          module: mp.module,
          progress: mp.progress,
          completed: mp.completed,
        })),
      },
      timeAnalysis: {
        totalTimeSpent,
        timePerAssignment: assignmentHistory.map(a => ({
          assignmentId: a.id,
          totalTime: a.attempts.reduce((sum, att) => sum + (att.timeTaken || 0), 0),
          attemptCount: a.attemptCount,
        })),
        timePerPracticeSession: practiceSessions.map(s => ({
          sessionId: s.id,
          totalTime: s.totalTime,
        })),
      },
      weakAreas,
      performanceTrends,
    });
  } catch (error: any) {
    console.error('Error fetching student detail:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

