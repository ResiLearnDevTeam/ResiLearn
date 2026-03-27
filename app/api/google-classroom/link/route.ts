import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { generateMockClassroomData, getMockClassroomById } from '@/lib/google-classroom-mock';

/**
 * POST /api/google-classroom/link
 * 
 * Link course with Google Classroom and create mock classroom with data
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can link courses to Google Classroom' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, name, description, classroomId } = body;

    if (!courseId || !name) {
      return NextResponse.json(
        { error: 'courseId and name are required' },
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
        { error: 'You can only link your own courses' },
        { status: 403 }
      );
    }

    // Check if already linked
    if (course.googleClassroomId) {
      return NextResponse.json(
        { error: 'Course is already linked to a Google Classroom' },
        { status: 400 }
      );
    }

    // Check if user has Google Classroom connection
    const account = await db.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google-classroom',
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Please connect Google Classroom first' },
        { status: 400 }
      );
    }

    // Get or generate mock classroom data
    let classroom;
    if (classroomId) {
      // Use selected classroom
      const selectedClassroom = getMockClassroomById(classroomId, session.user.id);
      if (!selectedClassroom) {
        return NextResponse.json(
          { error: 'Selected classroom not found' },
          { status: 404 }
        );
      }
      classroom = selectedClassroom;
      
      // Update classroom name and description to match course
      classroom.name = name;
      classroom.description = description || course.description || classroom.description;
    } else {
      // Generate new classroom (backward compatibility)
      classroom = generateMockClassroomData(
        courseId,
        { name: name, description: description || course.description || undefined },
        session.user.id
      );
    }

    // Update course with Google Classroom ID
    await db.course.update({
      where: { id: courseId },
      data: {
        googleClassroomId: classroom.id,
      },
    });

    // Create or update GoogleClassroomSync record
    await db.googleClassroomSync.upsert({
      where: { courseId: courseId },
      create: {
        userId: session.user.id,
        courseId: courseId,
        classroomId: classroom.id,
        classroomName: classroom.name,
        lastSyncAt: new Date(),
        syncEnabled: true,
        autoSyncGrades: true,
      },
      update: {
        classroomId: classroom.id,
        classroomName: classroom.name,
        lastSyncAt: new Date(),
      },
    });

    // Create User records and Enrollments for mock students
    const enrolledUserIds: string[] = [];
    
    if (classroom.students && classroom.students.length > 0) {
      for (const student of classroom.students) {
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

        enrolledUserIds.push(user.id);

        // Create enrollment if doesn't exist
        const existingEnrollment = await db.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: courseId,
            },
          },
        });

        if (!existingEnrollment) {
          await db.enrollment.create({
            data: {
              userId: user.id,
              courseId: courseId,
              progress: 0,
            },
          });
        }

        // Create ClassroomStudent record
        await db.classroomStudent.upsert({
          where: {
            userId_classroomId: {
              userId: user.id,
              classroomId: classroom.id,
            },
          },
          create: {
            userId: user.id,
            classroomId: classroom.id,
          },
          update: {},
        });
      }
    }

    return NextResponse.json({
      success: true,
      classroom: {
        id: classroom.id,
        name: classroom.name,
        section: classroom.section,
        description: classroom.description,
        room: classroom.room,
        enrollmentCode: classroom.enrollmentCode,
        studentsCount: classroom.students?.length || 0,
        assignmentsCount: classroom.assignments?.length || 0,
        announcementsCount: classroom.announcements?.length || 0,
      },
      enrolledStudents: enrolledUserIds.length,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error linking course to Google Classroom:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
