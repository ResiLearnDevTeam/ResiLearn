import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { getMockStudents } from '@/lib/google-classroom-mock';

/**
 * POST /api/google-classroom/import-students
 * 
 * Import additional students from Google Classroom (mock)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can import students' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, classroomId } = body;

    if (!courseId || !classroomId) {
      return NextResponse.json(
        { error: 'courseId and classroomId are required' },
        { status: 400 }
      );
    }

    // Check if course exists and user is the owner
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only import students to your own courses' },
        { status: 403 }
      );
    }

    // Check if course is linked to Google Classroom
    if (course.googleClassroomId !== classroomId) {
      return NextResponse.json(
        { error: 'Course is not linked to this Google Classroom' },
        { status: 400 }
      );
    }

    // Generate additional mock students (2-5 students)
    const additionalStudentCount = Math.floor(Math.random() * 4) + 2;
    const mockStudents = getMockStudents(classroomId, additionalStudentCount);

    const importedStudents: Array<{ id: string; name: string; email: string }> = [];

    // Create User records and Enrollments for new students
    for (const student of mockStudents) {
      // Check if user exists by email
      let user = await db.user.findUnique({
        where: { email: student.profile.emailAddress },
      });

      // Create user if doesn't exist
      if (!user) {
        user = await db.user.create({
          data: {
            email: student.profile.emailAddress,
            name: student.profile.name.fullName,
            role: 'STUDENT',
          },
        });
      }

      // Check if already enrolled
      const existingEnrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
      });

      if (!existingEnrollment) {
        // Create enrollment
        await db.enrollment.create({
          data: {
            userId: user.id,
            courseId: courseId,
            progress: 0,
          },
        });

        // Create ClassroomStudent record
        await db.classroomStudent.upsert({
          where: {
            userId_classroomId: {
              userId: user.id,
              classroomId: classroomId,
            },
          },
          create: {
            userId: user.id,
            classroomId: classroomId,
          },
          update: {},
        });

        importedStudents.push({
          id: user.id,
          name: user.name || student.profile.name.fullName,
          email: user.email,
        });
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: importedStudents.length,
      students: importedStudents,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error importing students:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
