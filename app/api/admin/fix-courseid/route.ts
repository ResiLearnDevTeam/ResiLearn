import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

/**
 * API endpoint to fix courseId in existing database records
 * This ensures all self-learning records have courseId explicitly set to null
 * 
 * Note: This should only be run once to fix existing data
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admin or for development
    if (process.env.NODE_ENV === 'production' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('Starting to fix courseId for self-learning records...');

    // Fix PracticeSession records - update all where courseId is null/undefined
    const practiceSessionResult = await db.$executeRaw`
      UPDATE "PracticeSession"
      SET "course_id" = NULL
      WHERE "course_id" IS NULL
    `;

    console.log(`Updated ${practiceSessionResult} practice sessions`);

    // Fix LessonProgress records
    const lessonProgressResult = await db.$executeRaw`
      UPDATE "LessonProgress"
      SET "course_id" = NULL
      WHERE "course_id" IS NULL
    `;

    console.log(`Updated ${lessonProgressResult} lesson progress records`);

    // Fix ModuleProgress records
    const moduleProgressResult = await db.$executeRaw`
      UPDATE "ModuleProgress"
      SET "course_id" = NULL
      WHERE "course_id" IS NULL
    `;

    console.log(`Updated ${moduleProgressResult} module progress records`);

    return NextResponse.json({
      success: true,
      message: 'CourseId fixes completed',
      results: {
        practiceSessions: practiceSessionResult,
        lessonProgress: lessonProgressResult,
        moduleProgress: moduleProgressResult,
      },
    });
  } catch (error: any) {
    console.error('Error fixing courseId:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
