import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// POST - Save a new practice session
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      questions: questionHistory
    } = data;

    // Create practice session
    const practiceSession = await db.practiceSession.create({
      data: {
        userId: session.user.id,
        presetId: presetId || null,
        presetName: presetName || 'Quick Practice',
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        accuracy,
        averageTime,
        totalTime,
        settings: settings || {},
        questions: questionHistory || null
      }
    });

    return NextResponse.json({ success: true, session: practiceSession });
  } catch (error) {
    console.error('Error saving practice session:', error);
    return NextResponse.json(
      { error: 'Failed to save practice session' },
      { status: 500 }
    );
  }
}

// GET - Fetch practice sessions for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('id');
    const limit = parseInt(url.searchParams.get('limit') || '10');

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
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json(practiceSession);
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

    return NextResponse.json(practiceSessions);
  } catch (error) {
    console.error('Error fetching practice sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch practice sessions' },
      { status: 500 }
    );
  }
}

