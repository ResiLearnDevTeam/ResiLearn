import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { UpdateCourseData } from '@/types/classroom';

/**
 * GET /api/courses/[courseId]
 * 
 * Get course details with enrollments, assignments, and announcements
 */
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
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            enrolledAt: 'desc',
          },
        },
        assignments: {
          include: {
            level: {
              select: {
                id: true,
                number: true,
                name: true,
                description: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        announcements: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is enrolled (for students)
    let enrollment = null;
    let userProgress = 0;
    if (session.user.role === 'STUDENT') {
      enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
      });
      userProgress = enrollment?.progress || 0;
    }

    // For students, check assignment completion
    let assignmentsWithProgress = course.assignments;
    if (session.user.role === 'STUDENT' && enrollment) {
      const levelAttempts = await db.levelAttempt.findMany({
        where: {
          userId: session.user.id,
          courseId: course.id,
          mode: 'QUIZ',
        },
        select: {
          levelId: true,
          percentage: true,
          passed: true,
        },
      });

      const attemptMap = new Map(
        levelAttempts.map(a => [
          a.levelId,
          { score: a.percentage || 0, passed: a.passed || false },
        ])
      );

      assignmentsWithProgress = course.assignments.map(assignment => {
        const attempt = attemptMap.get(assignment.levelId);
        return {
          ...assignment,
          completed: attempt?.passed || false,
          bestScore: attempt?.score || 0,
        };
      });
    }

    return NextResponse.json({
      id: course.id,
      name: course.name,
      description: course.description,
      code: course.code,
      teacherId: course.teacherId,
      teacher: course.teacher,
      image: course.image,
      startDate: course.startDate.toISOString(),
      endDate: course.endDate?.toISOString() || null,
      isPublished: course.isPublished,
      googleClassroomId: course.googleClassroomId,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      enrollments: course.enrollments.map(e => ({
        id: e.id,
        userId: e.userId,
        courseId: e.courseId,
        enrolledAt: e.enrolledAt.toISOString(),
        progress: e.progress,
        user: e.user,
      })),
      assignments: assignmentsWithProgress.map(a => ({
        id: a.id,
        courseId: a.courseId,
        levelId: a.levelId,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate?.toISOString() || null,
        maxPoints: a.maxPoints,
        order: a.order,
        createdAt: a.createdAt.toISOString(),
        level: a.level,
        completed: (a as any).completed || false,
        bestScore: (a as any).bestScore || 0,
      })),
      announcements: course.announcements.map(a => ({
        id: a.id,
        courseId: a.courseId,
        title: a.title,
        content: a.content,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
      isEnrolled: !!enrollment,
      progress: userProgress,
    });
  } catch (error: any) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses/[courseId]
 * 
 * Update course (teacher only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can update courses' },
        { status: 403 }
      );
    }

    const { courseId } = await params;
    const body: UpdateCourseData = await request.json();

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only update your own courses' },
        { status: 403 }
      );
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate !== undefined && {
          endDate: body.endDate ? new Date(body.endDate) : null,
        }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.isPublished !== undefined && {
          isPublished: body.isPublished,
        }),
        // ❌ ไม่มี code แล้ว
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: updatedCourse.id,
      name: updatedCourse.name,
      description: updatedCourse.description,
      code: updatedCourse.code, // ยังส่งกลับได้ แต่แก้ไม่ได้
      teacherId: updatedCourse.teacherId,
      teacher: updatedCourse.teacher,
      image: updatedCourse.image,
      startDate: updatedCourse.startDate.toISOString(),
      endDate: updatedCourse.endDate?.toISOString() || null,
      isPublished: updatedCourse.isPublished,
      googleClassroomId: updatedCourse.googleClassroomId,
      createdAt: updatedCourse.createdAt.toISOString(),
      updatedAt: updatedCourse.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[courseId]
 * 
 * Delete course (teacher only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can delete courses' },
        { status: 403 }
      );
    }

    const { courseId } = await params;

    // Check if course exists and user is the teacher
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own courses' },
        { status: 403 }
      );
    }

    await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
