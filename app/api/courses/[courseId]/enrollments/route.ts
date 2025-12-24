import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { EnrollData } from '@/types/classroom';

/**
 * GET /api/courses/[courseId]/enrollments
 * 
 * List enrollments for a course
 * - Teachers: See all enrollments
 * - Students: See only their own enrollment
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

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Teachers can see all enrollments, students only their own
    if (session.user.role === 'TEACHER' && course.teacherId === session.user.id) {
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
        orderBy: {
          enrolledAt: 'desc',
        },
      });

      return NextResponse.json(
        enrollments.map(e => ({
          id: e.id,
          userId: e.userId,
          courseId: e.courseId,
          enrolledAt: e.enrolledAt.toISOString(),
          progress: e.progress,
          user: e.user,
        }))
      );
    } else {
      // Students see only their enrollment
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
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

      if (!enrollment) {
        return NextResponse.json([]);
      }

      return NextResponse.json([
        {
          id: enrollment.id,
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          enrolledAt: enrollment.enrolledAt.toISOString(),
          progress: enrollment.progress,
          user: enrollment.user,
        },
      ]);
    }
  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses/[courseId]/enrollments
 * 
 * Enroll student in course (by course code)
 */
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
        { error: 'Only students can enroll in courses' },
        { status: 403 }
      );
    }

    const { courseId } = await params;
    const body: EnrollData = await request.json();
    const { courseCode } = body;

    // Verify course code matches
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.code !== courseCode) {
      return NextResponse.json(
        { error: 'Invalid course code' },
        { status: 400 }
      );
    }

    if (!course.isPublished) {
      return NextResponse.json(
        { error: 'Course is not published' },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        progress: 0,
      },
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

    return NextResponse.json(
      {
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt.toISOString(),
        progress: enrollment.progress,
        user: enrollment.user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
