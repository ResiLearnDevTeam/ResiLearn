import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

/**
 * GET /api/lessons/[lessonId]
 * 
 * ดึงข้อมูลบทเรียน (Lesson Template) จาก database
 * 
 * หมายเหตุ: บทเรียนเป็น template หลักที่เก็บไว้ใน database
 * - Lesson, Module, Sections, Quiz Questions ฯลฯ เป็น template ที่ใช้ร่วมกันทุก user
 * - แต่ละ user แค่ดึง template ไปแสดงผล
 * - ข้อมูลเฉพาะ user (เช่น completed status) เก็บใน LessonProgress แยกต่างหาก
 * 
 * @returns Lesson template data + user's progress (completed status)
 */
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

    // Fetch lesson template from database (shared across all users)
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: true,
        heroStats: {
          orderBy: {
            order: 'asc',
          },
        },
        objectives: {
          orderBy: {
            order: 'asc',
          },
        },
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        quizQuestions: {
          orderBy: {
            order: 'asc',
          },
        },
        practiceLink: true,
        resources: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get user-specific progress (completed status) - this is the only user-specific data
    // Lesson content itself is a template shared by all users
    const progress = await db.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lesson.id,
        },
      },
    });

    const heroStats = lesson.heroStats.map((stat) => ({
      label: stat.label,
      value: stat.value,
      description: stat.description,
    }));

    const objectives = lesson.objectives.map((objective) => ({
      icon: objective.icon,
      text: objective.text,
    }));

    // If no sections exist, create a default section from fallback content
    let sections = lesson.sections.map((section) => ({
      id: section.slug,
      title: section.title,
      description: section.description,
      content: Array.isArray(section.content) ? section.content : [],
      order: section.order,
    }));

    // If no sections and we have fallback content, create a default section
    if (sections.length === 0 && lesson.content) {
      sections = [
        {
          id: 'content',
          title: 'เนื้อหาบทเรียน',
          description: null,
          content: [
            {
              type: 'text',
              text: lesson.content,
              variant: 'default',
            },
          ],
          order: 0,
        },
      ];
    }

    const quiz =
      lesson.quizQuestions.length > 0
        ? {
            title: `Quiz: ${lesson.title}`,
            questions: lesson.quizQuestions.map((question) => ({
              prompt: question.prompt,
              options: Array.isArray(question.options) ? question.options : [],
              answerIndex: question.answerIndex,
              explanation: question.explanation,
              order: question.order,
            })),
            practiceLink: lesson.practiceLink
              ? {
                  href: lesson.practiceLink.href,
                  label: lesson.practiceLink.title,
                }
              : undefined,
          }
        : null;

    const practice = lesson.practiceLink
      ? {
          title: lesson.practiceLink.title,
          description: lesson.practiceLink.description,
          href: lesson.practiceLink.href,
          badge: lesson.practiceLink.badge,
          highlight: lesson.practiceLink.highlight,
        }
      : null;

    const resources =
      lesson.resources.length > 0
        ? lesson.resources.map((resource) => ({
            label: resource.label,
            description: resource.description,
            href: resource.href,
            order: resource.order,
          }))
        : [];

    return NextResponse.json({
      id: lesson.id,
      title: lesson.title,
      strapline: lesson.strapline,
      summary: lesson.summary,
      fallbackContent: lesson.content,
      module: {
        id: lesson.module.id,
        title: lesson.module.title,
      },
      heroStats,
      objectives,
      sections,
      quiz,
      practice,
      resources,
      manageUrl: `/teacher/lessons/manage?lessonId=${lesson.id}`,
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
    // Note: For self-learning, courseId must be explicitly set to null
    const lessonProgress = await db.lessonProgress.upsert({
      where: {
        userId_lessonId_courseId: {
          userId: session.user.id,
          lessonId: lesson.id,
          courseId: null, // Self-learning
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonId: lesson.id,
        courseId: null, // Self-learning - explicitly set to null
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
    // Note: For self-learning, courseId must be explicitly set to null
    await db.moduleProgress.upsert({
      where: {
        userId_moduleId_courseId: {
          userId: session.user.id,
          moduleId: lesson.moduleId,
          courseId: null, // Self-learning
        },
      },
      update: {
        progress: moduleProgress,
      },
      create: {
        userId: session.user.id,
        moduleId: lesson.moduleId,
        courseId: null, // Self-learning - explicitly set to null
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

