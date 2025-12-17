import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { aggregateDeepAnalytics } from '@/lib/analyticsUtils';

// GET - Fetch aggregate analytics for practice sessions
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const resistorType = searchParams.get('resistorType'); // Optional filter: 'FOUR_BAND' or 'FIVE_BAND'
    const startDate = searchParams.get('startDate'); // Optional: ISO date string
    const endDate = searchParams.get('endDate'); // Optional: ISO date string

    // Build query conditions
    const where: any = {
      userId: session.user.id
    };

    // Apply date filters if provided
    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) {
        where.completedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.completedAt.lte = new Date(endDate);
      }
    }

    // Fetch all practice sessions for the user
    let sessions = await db.practiceSession.findMany({
      where,
      orderBy: {
        completedAt: 'desc'
      }
    });

    // Filter by resistorType in memory (since Prisma doesn't support JSON field filtering easily)
    if (resistorType) {
      sessions = sessions.filter(session => {
        const settings = session.settings as any;
        return settings?.resistorType === resistorType;
      });
    }

    if (sessions.length === 0) {
      return NextResponse.json({
        overall: {
          totalSessions: 0,
          totalQuestions: 0,
          overallAccuracy: 0
        },
        resistorTypeErrors: {
          FOUR_BAND: { correct: 0, incorrect: 0, accuracy: 0 },
          FIVE_BAND: { correct: 0, incorrect: 0, accuracy: 0 }
        },
        digitPositionErrors: {
          position1: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} },
          position2: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} },
          position3: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} },
          multiplier: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} },
          tolerance: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} }
        },
        colorConfusion: {},
        questionTypeErrors: {},
        resistorValueErrors: {},
        toleranceErrors: {},
        topWeakAreas: []
      });
    }

    // Aggregate analytics from all sessions
    const aggregated = aggregateDeepAnalytics(sessions);

    return NextResponse.json(aggregated);
  } catch (error) {
    console.error('Error fetching aggregate analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aggregate analytics' },
      { status: 500 }
    );
  }
}

