import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (session.user.role === 'STUDENT') {
      // Check enrollment
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
      });

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You are not enrolled in this course' },
          { status: 403 }
        );
      }

      // Get all modules
      const modules = await db.module.findMany({
        include: {
          lessons: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      // Get lesson progress for this course
      const lessonProgress = await db.lessonProgress.findMany({
        where: {
          userId: session.user.id,
          courseId,
        },
      });

      const moduleProgress = await db.moduleProgress.findMany({
        where: {
          userId: session.user.id,
          courseId,
        },
      });

      const progressMap = new Map(
        lessonProgress.map(p => [p.lessonId, { completed: p.completed, completedAt: p.completedAt }])
      );

      const moduleProgressMap = new Map(
        moduleProgress.map(p => [p.moduleId, { progress: p.progress, completed: p.completed }])
      );

      const modulesWithProgress = modules.map(module => {
        const completedLessons = module.lessons.filter(l => 
          progressMap.get(l.id)?.completed
        ).length;
        const totalLessons = module.lessons.length;
        const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        const moduleProg = moduleProgressMap.get(module.id);

        return {
          id: module.id,
          title: module.title,
          description: module.description,
          order: module.order,
          progress: moduleProg?.progress || progress,
          completed: moduleProg?.completed || (completedLessons === totalLessons && totalLessons > 0),
          lessons: module.lessons.map(lesson => {
            const lessonProg = progressMap.get(lesson.id);
            return {
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              order: lesson.order,
              completed: lessonProg?.completed || false,
              completedAt: lessonProg?.completedAt?.toISOString() || null,
            };
          }),
        };
      });

      return NextResponse.json({
        modules: modulesWithProgress,
      });
    } else if (session.user.role === 'TEACHER' && course.teacherId === session.user.id) {
      // Teacher: Get progress for all students
      const enrollments = await db.enrollment.findMany({
        where: { courseId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const modules = await db.module.findMany({
        include: {
          lessons: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      const userIds = enrollments.map(e => e.userId);

      const lessonProgress = await db.lessonProgress.findMany({
        where: {
          userId: { in: userIds },
          courseId,
        },
      });

      const moduleProgress = await db.moduleProgress.findMany({
        where: {
          userId: { in: userIds },
          courseId,
        },
      });

      const studentProgress = enrollments.map(enrollment => {
        const userLessonProgress = lessonProgress.filter(p => p.userId === enrollment.userId);
        const userModuleProgress = moduleProgress.filter(p => p.userId === enrollment.userId);

        const progressMap = new Map(
          userLessonProgress.map(p => [p.lessonId, { completed: p.completed, completedAt: p.completedAt }])
        );

        const moduleProgressMap = new Map(
          userModuleProgress.map(p => [p.moduleId, { progress: p.progress, completed: p.completed }])
        );

        const modulesWithProgress = modules.map(module => {
          const completedLessons = module.lessons.filter(l => 
            progressMap.get(l.id)?.completed
          ).length;
          const totalLessons = module.lessons.length;
          const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          const moduleProg = moduleProgressMap.get(module.id);

          return {
            id: module.id,
            title: module.title,
            progress: moduleProg?.progress || progress,
            completed: moduleProg?.completed || (completedLessons === totalLessons && totalLessons > 0),
            lessonsCompleted: completedLessons,
            totalLessons,
          };
        });

        return {
          userId: enrollment.userId,
          user: enrollment.user,
          modules: modulesWithProgress,
        };
      });

      return NextResponse.json({
        students: studentProgress,
      });
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (error: any) {
    console.error('Error fetching learning path progress:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can update progress' },
        { status: 403 }
      );
    }

    const { courseId } = await params;

    // Check enrollment
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { lessonId, moduleId, completed } = body;

    if (!lessonId && !moduleId) {
      return NextResponse.json(
        { error: 'Missing required field: lessonId or moduleId' },
        { status: 400 }
      );
    }

    if (lessonId) {
      // Update lesson progress
      const existing = await db.lessonProgress.findFirst({
        where: {
          userId: session.user.id,
          lessonId,
          courseId: courseId || null,
        },
      });

      const lessonProgress = existing
        ? await db.lessonProgress.update({
            where: { id: existing.id },
            data: {
              completed: completed !== undefined ? completed : true,
              completedAt: completed ? new Date() : null,
            },
          })
        : await db.lessonProgress.create({
            data: {
              userId: session.user.id,
              lessonId,
              courseId: courseId || null,
              completed: completed !== undefined ? completed : true,
              completedAt: completed ? new Date() : null,
            },
          });

      // Update module progress
      if (moduleId) {
        const module = await db.module.findUnique({
          where: { id: moduleId },
          include: {
            lessons: true,
          },
        });

        if (module) {
          const completedLessons = await db.lessonProgress.count({
            where: {
              userId: session.user.id,
              courseId,
              completed: true,
              lesson: {
                moduleId: module.id,
              },
            },
          });

          const totalLessons = module.lessons.length;
          const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          const existingModule = await db.moduleProgress.findFirst({
            where: {
              userId: session.user.id,
              moduleId: module.id,
              courseId: courseId || null,
            },
          });

          if (existingModule) {
            await db.moduleProgress.update({
              where: { id: existingModule.id },
              data: {
                progress,
                completed: completedLessons === totalLessons && totalLessons > 0,
              },
            });
          } else {
            await db.moduleProgress.create({
              data: {
                userId: session.user.id,
                moduleId: module.id,
                courseId: courseId || null,
                progress,
                completed: completedLessons === totalLessons && totalLessons > 0,
              },
            });
          }
        }
      }

      return NextResponse.json({
        lessonProgress: {
          id: lessonProgress.id,
          lessonId: lessonProgress.lessonId,
          completed: lessonProgress.completed,
          completedAt: lessonProgress.completedAt?.toISOString() || null,
        },
      });
    } else if (moduleId) {
      // Update module progress only
      const module = await db.module.findUnique({
        where: { id: moduleId },
        include: {
          lessons: true,
        },
      });

      if (!module) {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 });
      }

      const completedLessons = await db.lessonProgress.count({
        where: {
          userId: session.user.id,
          courseId,
          completed: true,
          lesson: {
            moduleId: module.id,
          },
        },
      });

      const totalLessons = module.lessons.length;
      const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      const existingModule = await db.moduleProgress.findFirst({
        where: {
          userId: session.user.id,
          moduleId: module.id,
          courseId: courseId || null,
        },
      });

      const moduleProgress = existingModule
        ? await db.moduleProgress.update({
            where: { id: existingModule.id },
            data: {
              progress,
              completed: completedLessons === totalLessons && totalLessons > 0,
            },
          })
        : await db.moduleProgress.create({
            data: {
              userId: session.user.id,
              moduleId: module.id,
              courseId: courseId || null,
              progress,
              completed: completedLessons === totalLessons && totalLessons > 0,
            },
          });

      return NextResponse.json({
        moduleProgress: {
          id: moduleProgress.id,
          moduleId: moduleProgress.moduleId,
          progress: moduleProgress.progress,
          completed: moduleProgress.completed,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

