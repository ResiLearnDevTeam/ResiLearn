import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateMockClassroomsList } from '@/lib/google-classroom-mock';

/**
 * GET /api/google-classroom/list
 * 
 * Get list of mock Google Classrooms for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can list Google Classrooms' },
        { status: 403 }
      );
    }

    // Check if user has Google Classroom connection
    const { db } = await import('@/lib/db');
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

    // Generate mock classrooms list
    const classrooms = generateMockClassroomsList(session.user.id, 8);

    // Return simplified list structure
    const classroomsList = classrooms.map((classroom) => ({
      id: classroom.id,
      name: classroom.name,
      section: classroom.section,
      room: classroom.room,
      enrollmentCode: classroom.enrollmentCode,
      description: classroom.description,
      studentsCount: classroom.students?.length || 0,
      assignmentsCount: classroom.assignments?.length || 0,
      announcementsCount: classroom.announcements?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      classrooms: classroomsList,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error listing Google Classrooms:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
