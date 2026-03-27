import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateMockClassroomData } from '@/lib/google-classroom-mock';

/**
 * POST /api/google-classroom/create-classroom
 * 
 * Create a new Google Classroom with mock data
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can create classrooms' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Course name is required' },
        { status: 400 }
      );
    }

    // Generate mock classroom data
    const classroom = generateMockClassroomData(
      courseId || 'temp',
      { name, description },
      session.user.id
    );

    return NextResponse.json({
      success: true,
      classroom: classroom,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating mock classroom:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
