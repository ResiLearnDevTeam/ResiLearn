import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch lessons progress (แทน levels)
    // Note: Prisma may not support courseId: null directly, so we fetch all and filter
    const allLessonProgress = await db.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        completed: true,
      },
    });
    
    // Filter for self-learning (courseId is null or undefined)
    const lessonProgress = allLessonProgress.filter((p: any) => p.courseId === null || p.courseId === undefined);

    const totalLessons = await db.lesson.count();

    // 2. Fetch practice sessions
    // Note: Prisma may not support courseId: null directly, so we fetch all and filter
    const allPracticeSessions = await db.practiceSession.findMany({
      where: {
        userId: session.user.id,
      },
    });
    
    console.log('[Dashboard Stats API] All practice sessions:', allPracticeSessions.length);
    console.log('[Dashboard Stats API] Sample session courseId:', allPracticeSessions[0]?.courseId);
    
    // Filter for self-learning (courseId is null or undefined)
    const practiceSessions = allPracticeSessions.filter((s: any) => s.courseId === null || s.courseId === undefined);
    
    console.log('[Dashboard Stats API] Self-learning sessions:', practiceSessions.length);
    console.log('[Dashboard Stats API] Lesson progress (all):', allLessonProgress.length);
    console.log('[Dashboard Stats API] Lesson progress (self-learning):', lessonProgress.length);

    // 3. Calculate stats
    const completedLessons = lessonProgress.length;
    const totalSessions = practiceSessions.length;
    
    const validSessions = practiceSessions.filter((s: any) => s.accuracy !== null && s.accuracy !== undefined);
    const overallAccuracy = validSessions.length > 0
      ? Math.round(validSessions.reduce((sum: number, s: any) => sum + s.accuracy, 0) / validSessions.length)
      : 0;

    const totalPracticeTime = practiceSessions.reduce((sum: number, s: any) => sum + (s.totalTime || 0), 0);
    const totalPracticeTimeMinutes = Math.round(totalPracticeTime / 60);

    const result = {
      lessonsCompleted: completedLessons,
      totalLessons,
      overallAccuracy,
      totalSessions,
      totalPracticeTime: totalPracticeTimeMinutes,
    };

    console.log('[Dashboard Stats API] Result:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
