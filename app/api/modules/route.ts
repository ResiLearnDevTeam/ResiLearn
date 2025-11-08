import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all modules with lessons
    const modules = await db.module.findMany({
      include: {
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
        progress: {
          where: {
            userId: session.user.id,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Get user's lesson progress
    const lessonProgress = await db.lessonProgress.findMany({
      where: {
        userId: session.user.id,
      },
    });

    // Map progress to lessons
    const progressMap = new Map(
      lessonProgress.map(p => [p.lessonId, p.completed])
    );

    // Calculate module progress
    const modulesWithProgress = modules.map(module => {
      const moduleProgress = module.progress[0];
      const lessons = module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        completed: progressMap.get(lesson.id) || false,
      }));

      // Calculate progress percentage
      const completedLessons = lessons.filter(l => l.completed).length;
      const totalLessons = lessons.length;
      const progress = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100)
        : moduleProgress?.progress || 0;

      return {
        id: module.id,
        title: module.title,
        progress,
        expanded: false,
        lessons,
      };
    });

    return NextResponse.json(modulesWithProgress);
  } catch (error: any) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

