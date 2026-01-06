import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/courses/public
 * 
 * Get all published courses for public display (no auth required)
 */
export async function GET() {
  try {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Limit to 6 courses for landing page
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      code: course.code,
      teacher: course.teacher,
      image: course.image,
      enrollmentCount: course.enrollments.length,
      createdAt: course.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedCourses);
  } catch (error: any) {
    console.error('Error fetching public courses:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

