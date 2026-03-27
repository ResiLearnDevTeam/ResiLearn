import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

/**
 * GET /api/modules
 * 
 * ดึงข้อมูล modules และ lessons (Templates) จาก database
 * 
 * หมายเหตุ: Modules และ Lessons เป็น template หลักที่เก็บไว้ใน database
 * - Module, Lesson, LessonSection, LessonQuizQuestion ฯลฯ เป็น template ที่ใช้ร่วมกันทุก user
 * - แต่ละ user แค่ดึง template ไปแสดงผล
 * - ข้อมูลเฉพาะ user (เช่น completed status, progress) เก็บใน LessonProgress/ModuleProgress แยกต่างหาก
 * 
 * @returns Modules with lessons (templates) + user's progress data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all modules and lessons (templates - shared across all users)
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

    // Get user-specific progress data (completed status for each lesson)
    // This is the only user-specific data - lesson content itself is a template
    const lessonProgress = await db.lessonProgress.findMany({
      where: {
        userId: session.user.id,
      },
    });

    // Map user's progress to lessons
    const progressMap = new Map(
      lessonProgress.map(p => [p.lessonId, p.completed])
    );

    // Combine template data (modules/lessons) with user's progress
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

