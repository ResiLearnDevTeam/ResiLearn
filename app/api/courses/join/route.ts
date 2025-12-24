import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { EnrollData } from '@/types/classroom';

/**
 * POST /api/courses/join
 * 
 * Join course by code (for students)
 * - Find course by code
 * - Check if course is published
 * - Check if student is already enrolled
 * - Create enrollment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can join courses' },
        { status: 403 }
      );
    }

    const body: EnrollData = await request.json();
    const { courseCode } = body;

    if (!courseCode || courseCode.trim() === '') {
      return NextResponse.json(
        { error: 'Course code is required' },
        { status: 400 }
      );
    }

    // Find course by code
    const course = await db.course.findUnique({
      where: { code: courseCode.toUpperCase().trim() },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            assignments: true,
            announcements: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'ไม่พบหลักสูตรที่ตรงกับรหัสนี้' },
        { status: 404 }
      );
    }

    if (!course.isPublished) {
      return NextResponse.json(
        { error: 'หลักสูตรนี้ยังไม่เปิดให้ลงทะเบียน' },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'คุณได้ลงทะเบียนในหลักสูตรนี้แล้ว' },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        progress: 0,
      },
    });

    // Return course with enrollment info
    return NextResponse.json(
      {
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
        enrollmentCount: course._count.enrollments + 1, // +1 for new enrollment
        assignmentCount: course._count.assignments,
        announcementCount: course._count.announcements,
        isEnrolled: true,
        progress: 0,
        enrollment: {
          id: enrollment.id,
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          enrolledAt: enrollment.enrolledAt.toISOString(),
          progress: enrollment.progress,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error joining course:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

