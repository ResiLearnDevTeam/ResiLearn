import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { formatSessionName, getSessionType, validateSessionSettings } from '@/lib/practiceSessionUtils';
import type { PracticeSessionResponse } from '@/types/practiceSession';

// POST - Save a new practice session
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<PracticeSessionResponse>(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const data = await req.json();
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
      questions: questionHistory,
      analytics
    } = data;

    // Validate required fields
    if (totalQuestions === undefined || totalQuestions === null) {
      return NextResponse.json<PracticeSessionResponse>(
        { error: 'Missing required field: totalQuestions' },
        { status: 400 }
      );
    }

    if (correctAnswers === undefined || correctAnswers === null) {
      return NextResponse.json<PracticeSessionResponse>(
        { error: 'Missing required field: correctAnswers' },
        { status: 400 }
      );
    }

    if (accuracy === undefined || accuracy === null) {
      return NextResponse.json<PracticeSessionResponse>(
        { error: 'Missing required field: accuracy' },
        { status: 400 }
      );
    }

    if (totalTime === undefined || totalTime === null) {
      return NextResponse.json<PracticeSessionResponse>(
        { error: 'Missing required field: totalTime' },
        { status: 400 }
      );
    }

    // Validate settings
    const validation = validateSessionSettings(settings);
    if (!validation.valid) {
      return NextResponse.json<PracticeSessionResponse>(
        { 
          error: 'Invalid settings',
          details: validation.errors.join(', ')
        },
        { status: 400 }
      );
    }

    // Generate session name from settings
    const sessionName = formatSessionName(presetName, settings);

    // Create practice session
    // Note: courseId is not set, so it will be null (self-learning)
    const practiceSession = await db.practiceSession.create({
      data: {
        userId: session.user.id,
        courseId: null, // Explicitly set to null for self-learning
        presetId: presetId || null,
        presetName: sessionName,
        totalQuestions,
        correctAnswers: correctAnswers || 0,
        incorrectAnswers: incorrectAnswers || 0,
        accuracy,
        averageTime: averageTime || null,
        totalTime,
        settings: {
          ...(settings || {}),
          analytics: analytics ?? (settings as any)?.analytics ?? null // Store analytics in settings JSON field
        },
        questions: questionHistory || null
      }
    });

    return NextResponse.json<PracticeSessionResponse>({ 
      success: true, 
      session: {
        id: practiceSession.id,
        sessionName: practiceSession.presetName || 'Unknown',
        sessionType: getSessionType(settings as any, presetId),
        totalQuestions: practiceSession.totalQuestions,
        correctAnswers: practiceSession.correctAnswers,
        incorrectAnswers: practiceSession.incorrectAnswers,
        accuracy: practiceSession.accuracy,
        averageTime: practiceSession.averageTime,
        totalTime: practiceSession.totalTime,
        settings: practiceSession.settings as any,
        questions: practiceSession.questions as any,
        startedAt: practiceSession.startedAt.toISOString(),
        completedAt: practiceSession.completedAt.toISOString(),
        presetId: practiceSession.presetId,
        courseId: practiceSession.courseId
      }
    });
  } catch (error: any) {
    console.error('Error saving practice session:', error);
    return NextResponse.json<PracticeSessionResponse>(
      { 
        error: 'Failed to save practice session',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Fetch practice sessions for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json<PracticeSessionResponse>(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('id');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return NextResponse.json<PracticeSessionResponse>(
        { error: 'Invalid limit. Must be between 1 and 1000' },
        { status: 400 }
      );
    }

    // If sessionId is provided, return single session
    if (sessionId) {
      const practiceSession = await db.practiceSession.findFirst({
        where: {
          id: sessionId,
          userId: session.user.id
        },
        include: {
          preset: {
            select: {
              name: true,
              resistorType: true
            }
          }
        }
      });

      if (!practiceSession) {
        return NextResponse.json<PracticeSessionResponse>(
          { error: 'Session not found' }, 
          { status: 404 }
        );
      }

      const settings = practiceSession.settings as any;
      return NextResponse.json<PracticeSessionResponse>({
        success: true,
        session: {
          id: practiceSession.id,
          sessionName: formatSessionName(practiceSession.presetName, settings),
          sessionType: getSessionType(settings, practiceSession.presetId),
          totalQuestions: practiceSession.totalQuestions,
          correctAnswers: practiceSession.correctAnswers,
          incorrectAnswers: practiceSession.incorrectAnswers,
          accuracy: practiceSession.accuracy,
          averageTime: practiceSession.averageTime,
          totalTime: practiceSession.totalTime,
          settings: settings,
          questions: practiceSession.questions as any,
          startedAt: practiceSession.startedAt.toISOString(),
          completedAt: practiceSession.completedAt.toISOString(),
          presetId: practiceSession.presetId,
          courseId: practiceSession.courseId
        }
      });
    }

    // Otherwise return list of sessions
    const practiceSessions = await db.practiceSession.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: limit,
      include: {
        preset: {
          select: {
            name: true,
            resistorType: true
          }
        }
      }
    });

    // Transform sessions to include sessionName and sessionType
    const transformedSessions = practiceSessions.map(session => {
      const settings = session.settings as any;
      return {
        id: session.id,
        sessionName: formatSessionName(session.presetName, settings),
        sessionType: getSessionType(settings, session.presetId),
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        incorrectAnswers: session.incorrectAnswers,
        accuracy: session.accuracy,
        averageTime: session.averageTime,
        totalTime: session.totalTime,
        settings: settings,
        questions: session.questions,
        startedAt: session.startedAt.toISOString(),
        completedAt: session.completedAt.toISOString(),
        presetId: session.presetId,
        courseId: session.courseId,
        preset: session.preset
      };
    });

    return NextResponse.json(transformedSessions);
  } catch (error: any) {
    console.error('Error fetching practice sessions:', error);
    return NextResponse.json<PracticeSessionResponse>(
      { 
        error: 'Failed to fetch practice sessions',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

