import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateCourseData } from '@/types/classroom';
import { customAlphabet } from 'nanoid';
import { Filter } from 'bad-words';

const filter = new Filter();
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nanoidCustom = customAlphabet(alphabet);

/**
 * Generate unique course code
 * - a-z A-Z 0-9
 * - length 5-8
 * - no bad words
 * - unique in DB
 */
async function generateUniqueCourseCode() {
  let code = '';
  let exists = true;

  while (exists) {
    const length = Math.floor(Math.random() * 4) + 5; // 5–8
    const random = nanoidCustom(length);

    if (filter.isProfane(random)) continue;

    code = random;

    const found = await db.course.findUnique({
      where: { code },
    });

    exists = !!found;
  }

  return code;
}

/**
 * GET /api/courses
 * 
 * List courses:
 * - Students: Returns enrolled courses
 * - Teachers: Returns created courses
 * - Optional: ?all=true to get all published courses (for browsing)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const showAll = searchParams.get('all') === 'true';

    // If showAll is true, return all published courses (for browsing)
    if (showAll) {
      const courses = await db.course.findMany({
        where: {
          isPublished: true,
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          enrollments: {
            select: {
              id: true,
            },
          },
          assignments: {
            select: {
              id: true,
            },
          },
          announcements: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Check enrollment status for current user
      const userEnrollments = await db.enrollment.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          courseId: true,
          progress: true,
        },
      });

      const enrollmentMap = new Map(
        userEnrollments.map(e => [e.courseId, e.progress])
      );

      const coursesWithEnrollment = courses.map(course => ({
        id: course.id,
        name: course.name,
        description: course.description,
        code: course.code,
        teacherId: course.teacherId,
        teacher: course.teacher,
        image: course.image,
        startDate: course.startDate.toISOString(),
        endDate: course.endDate?.toISOString() || null,
        status: course.status,
        isPublished: course.isPublished,
        googleClassroomId: course.googleClassroomId,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        enrollmentCount: course.enrollments.length,
        assignmentCount: course.assignments.length,
        announcementCount: course.announcements.length,
        isEnrolled: enrollmentMap.has(course.id),
        progress: enrollmentMap.get(course.id) || 0,
      }));

      return NextResponse.json(coursesWithEnrollment);
    }

    // Role-based course listing
    if (session.user.role === 'TEACHER') {
      // Teachers see their created courses
      const courses = await db.course.findMany({
        where: {
          teacherId: session.user.id,
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          enrollments: {
            select: {
              id: true,
            },
          },
          assignments: {
            select: {
              id: true,
            },
          },
          announcements: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const formattedCourses = courses.map(course => ({
        id: course.id,
        name: course.name,
        description: course.description,
        code: course.code,
        teacherId: course.teacherId,
        teacher: course.teacher,
        image: course.image,
        startDate: course.startDate.toISOString(),
        endDate: course.endDate?.toISOString() || null,
        status: course.status,
        isPublished: course.isPublished,
        googleClassroomId: course.googleClassroomId,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        enrollmentCount: course.enrollments.length,
        assignmentCount: course.assignments.length,
        announcementCount: course.announcements.length,
      }));

      return NextResponse.json(formattedCourses);
    } else {
      // Students see enrolled courses
      const enrollments = await db.enrollment.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          course: {
            include: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              enrollments: {
                select: {
                  id: true,
                },
              },
              assignments: {
                select: {
                  id: true,
                },
              },
              announcements: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: {
          enrolledAt: 'desc',
        },
      });

      const courses = enrollments.map(enrollment => ({
        id: enrollment.course.id,
        name: enrollment.course.name,
        description: enrollment.course.description,
        code: enrollment.course.code,
        teacherId: enrollment.course.teacherId,
        teacher: enrollment.course.teacher,
        image: enrollment.course.image,
        startDate: enrollment.course.startDate.toISOString(),
        endDate: enrollment.course.endDate?.toISOString() || null,
        status: enrollment.course.status,
        isPublished: enrollment.course.isPublished,
        googleClassroomId: enrollment.course.googleClassroomId,
        createdAt: enrollment.course.createdAt.toISOString(),
        updatedAt: enrollment.course.updatedAt.toISOString(),
        enrollmentCount: enrollment.course.enrollments.length,
        assignmentCount: enrollment.course.assignments.length,
        announcementCount: enrollment.course.announcements.length,
        isEnrolled: true,
        progress: enrollment.progress,
      }));

      return NextResponse.json(courses);
    }
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses
 * 
 * Create a new course (teachers only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can create courses' },
        { status: 403 }
      );
    }

    const body: CreateCourseData = await request.json();
    const { name, description, startDate, endDate, image, isPublished } = body;

    if (!name || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startDate' },
        { status: 400 }
      );
    }

    const code = await generateUniqueCourseCode();

    const course = await db.course.create({
      data: {
        name,
        description: description || null,
        code,
        teacherId: session.user.id,
        image: image || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isPublished: isPublished || false,
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
      enrollmentCount: 0,
      assignmentCount: 0,
      announcementCount: 0,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
