import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement proper auth check once auth is fully set up
    // For now, we'll skip auth for development
    const body = await request.json();
    const { levelId, mode, questions, score, percentage, timeTaken, passed, userId } = body;

    // Find user - use provided userId for now
    const user = userId ? await db.user.findUnique({
      where: { id: userId },
    }) : null;

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
    // TODO: Implement proper auth check once auth is fully set up
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all attempts for the user
    const attempts = await db.levelAttempt.findMany({
      where: { userId: user.id },
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

