import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: true,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get user's progress for this lesson
    const progress = await db.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lesson.id,
        },
      },
    });

    return NextResponse.json({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      module: {
        id: lesson.module.id,
        title: lesson.module.title,
      },
      completed: progress?.completed || false,
      completedAt: progress?.completedAt || null,
    });
  } catch (error: any) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const body = await request.json();
    const { completed } = body;

    // Get lesson to find module
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Update or create lesson progress
    const lessonProgress = await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lesson.id,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonId: lesson.id,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Calculate module progress
    const allLessons = lesson.module.lessons;
    const completedLessons = await db.lessonProgress.count({
      where: {
        userId: session.user.id,
        lessonId: {
          in: allLessons.map(l => l.id),
        },
        completed: true,
      },
    });

    const moduleProgress = allLessons.length > 0
      ? Math.round((completedLessons / allLessons.length) * 100)
      : 0;

    // Update or create module progress
    await db.moduleProgress.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId: lesson.moduleId,
        },
      },
      update: {
        progress: moduleProgress,
      },
      create: {
        userId: session.user.id,
        moduleId: lesson.moduleId,
        progress: moduleProgress,
      },
    });

    return NextResponse.json(lessonProgress);
  } catch (error: any) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

