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

      // Get practice sessions for this course
      const practiceSessions = await db.practiceSession.findMany({
        where: {
          userId: session.user.id,
          courseId,
        },
        orderBy: {
          completedAt: 'desc',
        },
        take: 50,
      });

      return NextResponse.json(
        practiceSessions.map(s => ({
          id: s.id,
          presetId: s.presetId,
          presetName: s.presetName,
          totalQuestions: s.totalQuestions,
          correctAnswers: s.correctAnswers,
          incorrectAnswers: s.incorrectAnswers,
          accuracy: s.accuracy,
          averageTime: s.averageTime,
          totalTime: s.totalTime,
          settings: s.settings,
          questions: s.questions,
          startedAt: s.startedAt.toISOString(),
          completedAt: s.completedAt.toISOString(),
        }))
      );
    } else if (session.user.role === 'TEACHER' && course.teacherId === session.user.id) {
      // Teacher: Get all practice sessions for all students in this course
      const enrollments = await db.enrollment.findMany({
        where: { courseId },
        select: {
          userId: true,
        },
      });

      const userIds = enrollments.map(e => e.userId);

      const practiceSessions = await db.practiceSession.findMany({
        where: {
          userId: { in: userIds },
          courseId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          completedAt: 'desc',
        },
        take: 100,
      });

      return NextResponse.json(
        practiceSessions.map(s => ({
          id: s.id,
          userId: s.userId,
          user: s.user,
          presetId: s.presetId,
          presetName: s.presetName,
          totalQuestions: s.totalQuestions,
          correctAnswers: s.correctAnswers,
          incorrectAnswers: s.incorrectAnswers,
          accuracy: s.accuracy,
          averageTime: s.averageTime,
          totalTime: s.totalTime,
          settings: s.settings,
          questions: s.questions,
          startedAt: s.startedAt.toISOString(),
          completedAt: s.completedAt.toISOString(),
        }))
      );
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (error: any) {
    console.error('Error fetching practice sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can create practice sessions' },
        { status: 403 }
      );
    }

    const { courseId } = await params;

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

    const body = await request.json();
    const {
      presetId,
      presetName,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      averageTime,
      totalTime,
      settings,
      questions,
    } = body;

    if (!totalQuestions || accuracy === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const practiceSession = await db.practiceSession.create({
      data: {
        userId: session.user.id,
        courseId,
        presetId: presetId || null,
        presetName: presetName || null,
        totalQuestions,
        correctAnswers: correctAnswers || 0,
        incorrectAnswers: incorrectAnswers || 0,
        accuracy,
        averageTime: averageTime || null,
        totalTime: totalTime || 0,
        settings: settings || {},
        questions: questions || null,
      },
    });

    return NextResponse.json(
      {
        id: practiceSession.id,
        presetId: practiceSession.presetId,
        presetName: practiceSession.presetName,
        totalQuestions: practiceSession.totalQuestions,
        correctAnswers: practiceSession.correctAnswers,
        incorrectAnswers: practiceSession.incorrectAnswers,
        accuracy: practiceSession.accuracy,
        averageTime: practiceSession.averageTime,
        totalTime: practiceSession.totalTime,
        settings: practiceSession.settings,
        questions: practiceSession.questions,
        startedAt: practiceSession.startedAt.toISOString(),
        completedAt: practiceSession.completedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating practice session:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

