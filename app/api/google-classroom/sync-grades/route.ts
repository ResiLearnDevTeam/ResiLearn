import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { mockSyncGrades } from '@/lib/google-classroom-mock';

/**
 * POST /api/google-classroom/sync-grades
 * 
 * Sync grades to Google Classroom Gradebook (mock)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can sync grades' },
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
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only sync grades for your own courses' },
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

    // Get LevelAttempt records
    const whereClause: any = {
      courseId: courseId,
      mode: 'QUIZ', // Only sync quiz attempts
    };

    if (assignmentId) {
      whereClause.assignmentId = assignmentId;
    }

    const attempts = await db.levelAttempt.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            maxPoints: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // Mock sync grades
    const syncResult = mockSyncGrades(courseId, attempts);

    // Update lastSyncAt
    await db.googleClassroomSync.update({
      where: { courseId: courseId },
      data: {
        lastSyncAt: new Date(),
      },
    });

    // Update sync history (store in JSON field if exists, or we can create a separate table)
    // For now, we'll just return the sync result

    return NextResponse.json({
      success: syncResult.success,
      syncedCount: syncResult.syncedCount,
      details: syncResult.details,
      syncedAt: new Date().toISOString(),
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error syncing grades:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
