import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { mockSyncAssignments } from '@/lib/google-classroom-mock';

/**
 * POST /api/google-classroom/sync-assignments
 * 
 * Sync assignments to Google Classroom (mock)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can sync assignments' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, assignmentId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      );
    }

    // Check if course exists and user is the owner
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        sync: true,
        assignments: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only sync assignments for your own courses' },
        { status: 403 }
      );
    }

    // Check if course is linked to Google Classroom
    if (!course.sync) {
      return NextResponse.json(
        { error: 'Course is not linked to Google Classroom' },
        { status: 400 }
      );
    }

    // Get assignments to sync
    let assignments = course.assignments;
    if (assignmentId) {
      assignments = assignments.filter(a => a.id === assignmentId);
    }

    // Filter only published assignments
    assignments = assignments.filter(a => !a.isDraft);

    // Mock sync assignments
    const syncResult = mockSyncAssignments(courseId, assignments);

    // Update lastSyncAt
    await db.googleClassroomSync.update({
      where: { courseId: courseId },
      data: {
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.json({
      success: syncResult.success,
      syncedCount: syncResult.syncedCount,
      details: syncResult.details,
      syncedAt: new Date().toISOString(),
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error syncing assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
