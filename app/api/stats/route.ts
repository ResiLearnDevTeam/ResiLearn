import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get total user count
    const totalUsers = await db.user.count();

    // Get total lessons count
    const totalLessons = await db.lesson.count();

    // Calculate success rate from level attempts
    const totalAttempts = await db.levelAttempt.count({
      where: {
        mode: 'QUIZ', // Only count quiz attempts, not practice
        passed: { not: null }, // Only count attempts that have a pass/fail result
      },
    });

    const passedAttempts = await db.levelAttempt.count({
      where: {
        mode: 'QUIZ',
        passed: true,
      },
    });

    // Calculate success rate percentage
    const successRate = totalAttempts > 0 
      ? Math.round((passedAttempts / totalAttempts) * 100) 
      : 0;

    return NextResponse.json({
      totalUsers,
      totalLessons,
      successRate,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

