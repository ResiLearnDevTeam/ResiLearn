import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { levelId, mode, questions, score, percentage, timeTaken, passed } = body;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create level attempt
    const attempt = await db.levelAttempt.create({
      data: {
        userId: user.id,
        levelId,
        mode,
        questions,
        score,
        percentage,
        timeTaken,
        passed,
      },
      include: {
        level: true,
      },
    });

    // Update user progress if passed
    if (passed) {
      const level = await db.level.findUnique({
        where: { id: levelId },
      });

      if (level && mode === 'QUIZ') {
        // Unlock next level
        const nextLevelNumber = level.number + 1;
        const currentUnlocked = user.levelsUnlocked || [];
        
        if (!currentUnlocked.includes(nextLevelNumber)) {
          await db.user.update({
            where: { id: user.id },
            data: {
              levelsUnlocked: [...currentUnlocked, nextLevelNumber],
              currentLevel: nextLevelNumber,
            },
          });
        }
      }
    }

    return NextResponse.json(attempt);
  } catch (error: any) {
    console.error('Error creating attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode'); // e.g., 'QUIZ'

    // Get all attempts for the user
    const attempts = await db.levelAttempt.findMany({
      where: {
        userId: session.user.id,
        ...(mode && { mode: mode as any }), // Filter by mode if provided
      },
      include: {
        level: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return NextResponse.json(attempts);
  } catch (error: any) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

