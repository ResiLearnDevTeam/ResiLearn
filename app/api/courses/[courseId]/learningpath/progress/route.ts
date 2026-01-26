import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    console.log('[API] Learning path progress request - session:', { 
      userId: session?.user?.id, 
      role: session?.user?.role 
    });
    
    if (!session?.user?.id) {
      console.log('[API] Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;
    console.log('[API] CourseId:', courseId);

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      console.log('[API] Course not found:', courseId);
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    console.log('[API] Course found:', { id: course.id, name: course.name });

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

      console.log('[API] Enrollment check:', { 
        userId: session.user.id, 
        courseId, 
        enrolled: !!enrollment 
      });

      if (!enrollment) {
        console.log('[API] Student not enrolled');
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

      console.log(`[Learning Path Progress] Found ${modules.length} modules for course ${courseId}`);

      // Get lesson progress for this course
      // Note: Filter by courseId after query since Prisma client may not support it directly
      const allLessonProgress = await db.lessonProgress.findMany({
        where: {
          userId: session.user.id,
        },
      });
      const lessonProgress = allLessonProgress.filter(p => (p as any).courseId === courseId);

      const allModuleProgress = await db.moduleProgress.findMany({
        where: {
          userId: session.user.id,
        },
      });
      const moduleProgress = allModuleProgress.filter(p => (p as any).courseId === courseId);

      const progressMap = new Map(
        lessonProgress.map(p => [p.lessonId, { completed: p.completed, completedAt: p.completedAt }])
      );

      const moduleProgressMap = new Map(
        moduleProgress.map(p => [p.moduleId, { progress: p.progress, completed: (p as any).completed }])
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
          description: module.description || null,
          order: module.order,
          progress: moduleProg?.progress || progress,
          completed: moduleProg?.completed || (completedLessons === totalLessons && totalLessons > 0),
          lessons: module.lessons.map(lesson => {
            const lessonProg = progressMap.get(lesson.id);
            return {
              id: lesson.id,
              title: lesson.title,
              description: (lesson as any).description || null,
              order: lesson.order,
              completed: lessonProg?.completed || false,
              completedAt: lessonProg?.completedAt?.toISOString() || null,
            };
          }),
        };
      });

      console.log(`[Learning Path Progress] Returning ${modulesWithProgress.length} modules with progress`);

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

      // Get all progress and filter by courseId
      const allLessonProgress = await db.lessonProgress.findMany({
        where: {
          userId: { in: userIds },
        },
      });
      const lessonProgress = allLessonProgress.filter(p => (p as any).courseId === courseId);

      const allModuleProgress = await db.moduleProgress.findMany({
        where: {
          userId: { in: userIds },
        },
      });
      const moduleProgress = allModuleProgress.filter(p => (p as any).courseId === courseId);

      const studentProgress = enrollments.map(enrollment => {
        const userLessonProgress = lessonProgress.filter(p => p.userId === enrollment.userId);
        const userModuleProgress = moduleProgress.filter(p => p.userId === enrollment.userId);

        const progressMap = new Map(
          userLessonProgress.map(p => [p.lessonId, { completed: p.completed, completedAt: p.completedAt }])
        );

        const moduleProgressMap = new Map(
          userModuleProgress.map(p => [p.moduleId, { progress: p.progress, completed: (p as any).completed }])
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
    let courseIdForLog = 'unknown';
    try {
      const { courseId } = await params;
      courseIdForLog = courseId;
    } catch {
      // Ignore error getting courseId
    }
    
    console.error('Error fetching learning path progress:', {
      error: error.message,
      stack: error.stack,
      courseId: courseIdForLog,
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message || 'Unknown error',
        message: 'Failed to fetch learning path progress'
      },
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
      // Find existing progress - filter by courseId after query
      const allProgress = await db.lessonProgress.findMany({
        where: {
          userId: session.user.id,
          lessonId,
        },
      });
      const existing = allProgress.find(p => (p as any).courseId === (courseId || null));

      const lessonProgress = existing
        ? await db.lessonProgress.update({
            where: { id: existing.id },
            data: {
              completed: completed !== undefined ? completed : true,
              completedAt: completed !== undefined ? (completed ? new Date() : null) : new Date(),
            },
          })
        : await db.lessonProgress.create({
            data: {
              userId: session.user.id,
              lessonId,
              courseId: courseId || null,
              completed: completed !== undefined ? completed : true,
              completedAt: completed !== undefined ? (completed ? new Date() : null) : new Date(),
            } as any,
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
          // Count completed lessons for this course and module
          const allModuleLessonProgress = await db.lessonProgress.findMany({
            where: {
              userId: session.user.id,
              completed: true,
              lesson: {
                moduleId: module.id,
              },
            },
          });
          const completedLessons = allModuleLessonProgress.filter(p => (p as any).courseId === courseId).length;

          const totalLessons = module.lessons.length;
          const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          // Find existing module progress
          const allModuleProg = await db.moduleProgress.findMany({
            where: {
              userId: session.user.id,
              moduleId: module.id,
            },
          });
          const existingModule = allModuleProg.find(p => (p as any).courseId === (courseId || null));

          if (existingModule) {
            await db.moduleProgress.update({
              where: { id: existingModule.id },
              data: {
                progress,
                completed: completedLessons === totalLessons && totalLessons > 0,
              } as any,
            });
          } else {
            await db.moduleProgress.create({
              data: {
                userId: session.user.id,
                moduleId: module.id,
                courseId: courseId || null,
                progress,
                completed: completedLessons === totalLessons && totalLessons > 0,
              } as any,
            });
          }
        }
      }

      // Calculate enrollment progress
      // Get all modules and lessons
      const allModulesForEnrollment = await db.module.findMany({
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      });
      
      // Get all lesson progress for this course
      const allCourseLessonProgress = await db.lessonProgress.findMany({
        where: {
          userId: session.user.id,
        },
      });
      const courseLessonProgress = allCourseLessonProgress.filter(
        p => (p as any).courseId === courseId
      );
      
      // Calculate total completed lessons for enrollment
      const totalLessonsForEnrollment = allModulesForEnrollment.reduce((sum, m) => sum + m.lessons.length, 0);
      const completedLessonsForEnrollment = courseLessonProgress.filter(p => p.completed).length;
      
      // Calculate enrollment progress (0-100)
      const enrollmentProgress = totalLessonsForEnrollment > 0
        ? Math.round((completedLessonsForEnrollment / totalLessonsForEnrollment) * 100)
        : 0;
      
      // Update enrollment progress
      await db.enrollment.update({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
        data: {
          progress: enrollmentProgress,
        },
      });

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

      // Count completed lessons for this course and module
      const allModuleLessonProgress = await db.lessonProgress.findMany({
        where: {
          userId: session.user.id,
          completed: true,
          lesson: {
            moduleId: module.id,
          },
        },
      });
      const moduleCompletedLessons = allModuleLessonProgress.filter(p => (p as any).courseId === courseId).length;

      const moduleTotalLessons = module.lessons.length;
      const progress = moduleTotalLessons > 0 ? (moduleCompletedLessons / moduleTotalLessons) * 100 : 0;

      // Find existing module progress
      const allModuleProg = await db.moduleProgress.findMany({
        where: {
          userId: session.user.id,
          moduleId: module.id,
        },
      });
      const existingModule = allModuleProg.find(p => (p as any).courseId === (courseId || null));

      const moduleProgress = existingModule
        ? await db.moduleProgress.update({
            where: { id: existingModule.id },
            data: {
              progress,
              completed: moduleCompletedLessons === moduleTotalLessons && moduleTotalLessons > 0,
            } as any,
          })
        : await db.moduleProgress.create({
            data: {
              userId: session.user.id,
              moduleId: module.id,
              courseId: courseId || null,
              progress,
              completed: moduleCompletedLessons === moduleTotalLessons && moduleTotalLessons > 0,
            } as any,
          });

      // Calculate enrollment progress
      // Get all modules and lessons
      const allModules = await db.module.findMany({
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      });
      
      // Get all lesson progress for this course
      const allCourseLessonProgress = await db.lessonProgress.findMany({
        where: {
          userId: session.user.id,
        },
      });
      const courseLessonProgress = allCourseLessonProgress.filter(
        p => (p as any).courseId === courseId
      );
      
      // Calculate total completed lessons for enrollment
      const totalLessonsForEnrollment = allModules.reduce((sum, m) => sum + m.lessons.length, 0);
      const completedLessonsForEnrollment = courseLessonProgress.filter(p => p.completed).length;
      
      // Calculate enrollment progress (0-100)
      const enrollmentProgress = totalLessonsForEnrollment > 0
        ? Math.round((completedLessonsForEnrollment / totalLessonsForEnrollment) * 100)
        : 0;
      
      // Update enrollment progress
      await db.enrollment.update({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
        data: {
          progress: enrollmentProgress,
        },
      });

      return NextResponse.json({
        moduleProgress: {
          id: moduleProgress.id,
          moduleId: moduleProgress.moduleId,
          progress: moduleProgress.progress,
          completed: (moduleProgress as any).completed,
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

