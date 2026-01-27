import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { generateMockSyncHistory } from '@/lib/google-classroom-mock';

/**
 * GET /api/google-classroom/sync-status
 * 
 * Get sync status and history for a course
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        sync: true,
        enrollments: {
          select: { id: true },
        },
        assignments: {
          select: { id: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is the teacher or has access
    if (course.teacherId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have access to this course' },
        { status: 403 }
      );
    }

    // If not linked, return not linked status
    if (!course.sync) {
      return NextResponse.json({
        linked: false,
        message: 'Course is not linked to Google Classroom',
      }, { status: 200 });
    }

    // Get sync history (mock)
    const syncHistory = generateMockSyncHistory(courseId, 10);

    // Get statistics
    const levelAttempts = await db.levelAttempt.count({
      where: {
        courseId: courseId,
        mode: 'QUIZ',
      },
    });

    return NextResponse.json({
      linked: true,
      sync: {
        id: course.sync.id,
        classroomId: course.sync.classroomId,
        classroomName: course.sync.classroomName,
        lastSyncAt: course.sync.lastSyncAt.toISOString(),
        syncEnabled: course.sync.syncEnabled,
        autoSyncGrades: course.sync.autoSyncGrades,
      },
      statistics: {
        studentsCount: course.enrollments.length,
        assignmentsCount: course.assignments.length,
        gradesSynced: levelAttempts,
      },
      history: syncHistory.map(h => ({
        ...h,
        syncedAt: h.syncedAt.toISOString(),
      })),
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error getting sync status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
