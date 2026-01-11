import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

/**
 * GET /api/courses/[courseId]/students
 *
 * - no query     → list students in course (เดิม)
 * - ?search=xxx  → search students (ยังไม่อยู่ในคอร์ส)
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

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can view student lists' },
        { status: 403 }
      );
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only view students in your own courses' },
        { status: 403 }
      );
    }

    /* =========================
       🔍 SEARCH STUDENT (เพิ่มใหม่)
       ========================= */
    const search = request.nextUrl.searchParams.get('search');

    if (search) {
      // หา user ที่อยู่ในคอร์สแล้ว
      const enrolled = await db.enrollment.findMany({
        where: { courseId },
        select: { userId: true },
      });

      const enrolledIds = enrolled.map(e => e.userId);

      const users = await db.user.findMany({
        where: {
          role: 'STUDENT',
          email: {
            contains: search,
            mode: 'insensitive',
          },
          NOT: {
            id: {
              in: enrolledIds.length ? enrolledIds : ['__none__'],
            },
          },
        },
        orderBy: { email: 'asc' },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      return NextResponse.json(users);
    }

    /* =========================
       👩‍🎓 LIST STUDENTS (ของเดิม)
       ========================= */
    const enrollments = await db.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const attempts = await db.levelAttempt.findMany({
          where: {
            userId: enrollment.userId,
            courseId,
            mode: 'QUIZ',
          },
          select: {
            levelId: true,
            percentage: true,
            passed: true,
            completedAt: true,
          },
        });

        const completedAssignments = attempts.filter(a => a.passed).length;
        const totalAssignments = await db.courseAssignment.count({
          where: { courseId },
        });

        return {
          id: enrollment.user.id,
          name: enrollment.user.name,
          email: enrollment.user.email,
          studentId: enrollment.user.studentId,
          enrolledAt: enrollment.enrolledAt.toISOString(),
          progress: enrollment.progress,
          completedAssignments,
          totalAssignments,
          attempts: attempts.map(a => ({
            levelId: a.levelId,
            score: a.percentage || 0,
            passed: a.passed || false,
            completedAt: a.completedAt?.toISOString(),
          })),
        };
      })
    );

    return NextResponse.json(studentsWithProgress);
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
