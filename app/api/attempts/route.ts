import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      levelId, 
      assignmentId, 
      assignmentType, 
      courseId,
      mode, 
      questions, 
      score, 
      percentage, 
      timeTaken, 
      passed 
    } = body;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate assignment if provided
    if (assignmentId) {
      const assignment = await db.courseAssignment.findUnique({
        where: { id: assignmentId },
      });

      if (!assignment) {
        return NextResponse.json(
          { error: 'Assignment not found' },
          { status: 404 }
        );
      }

      // Check if assignment is published
      const now = new Date();
      if (assignment.isDraft) {
        return NextResponse.json(
          { error: 'Assignment is not yet published' },
          { status: 403 }
        );
      }

      if (assignment.publishedAt && new Date(assignment.publishedAt) > now) {
        return NextResponse.json(
          { error: 'Assignment is scheduled for future publication' },
          { status: 403 }
        );
      }

      // Check due date
      if (assignment.dueDate && new Date(assignment.dueDate) < now) {
        // Allow submission even if overdue, but could add warning
      }
    }

    // Create level attempt
    const attempt = await db.levelAttempt.create({
      data: {
        userId: user.id,
        levelId: levelId || null,
        assignmentId: assignmentId || null,
        assignmentType: assignmentType || null,
        courseId: courseId || null,
        mode,
        questions,
        score,
        percentage,
        timeTaken,
        passed,
      },
      include: {
        level: true,
        course: true,
      },
    });

    // Update user progress if passed (only for LEVEL_BASED assignments)
    if (passed && levelId && mode === 'QUIZ') {
      const level = await db.level.findUnique({
        where: { id: levelId },
      });

      if (level) {
        // Unlock next level
        const nextLevelNumber = level.number + 1;
        const currentUnlocked = user.levelsUnlocked || [];
        
        if (!currentUnlocked.includes(nextLevelNumber)) {
          await db.user.update({
            where: { id: user.id },
            data: {
              levelsUnlocked: [...currentUnlocked, nextLevelNumber],
              currentLevel: nextLevelNumber,
            },
          });
        }
      }
    }

    // Auto-sync grades to Google Classroom if enabled
    if (courseId && mode === 'QUIZ') {
      try {
        const course = await db.course.findUnique({
          where: { id: courseId },
          include: {
            sync: true,
          },
        });

        if (course?.sync && course.sync.autoSyncGrades && course.sync.syncEnabled) {
          // Trigger sync in background (don't wait for it)
          // Use internal API call by importing the handler directly would be better,
          // but for simplicity, we'll use a background fetch
          // In production, consider using a queue system or background job
          const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : 'http://localhost:3000';
          
          fetch(`${baseUrl}/api/google-classroom/sync-grades`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Pass a special header to indicate this is an internal call
              'X-Internal-Request': 'true',
            },
            body: JSON.stringify({
              courseId: courseId,
              assignmentId: assignmentId || undefined,
            }),
          }).catch((err) => {
            console.error('Error auto-syncing grades:', err);
            // Don't fail the request if sync fails
          });
        }
      } catch (syncError) {
        console.error('Error checking Google Classroom sync:', syncError);
        // Don't fail the request if sync check fails
      }
    }

    return NextResponse.json(attempt);
  } catch (error: any) {
    console.error('Error creating attempt:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode'); // e.g., 'QUIZ'
    const assignmentId = searchParams.get('assignmentId');
    const courseId = searchParams.get('courseId');

    // For teachers, if courseId is provided, get attempts for all students in the course
    if (session.user.role === 'TEACHER' && courseId) {
      const course = await db.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      if (course.teacherId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Get all enrollments for this course
      const enrollments = await db.enrollment.findMany({
        where: { courseId },
        select: { userId: true },
      });

      const userIds = enrollments.map(e => e.userId);

      // Get all attempts for all students in this course
      const attempts = await db.levelAttempt.findMany({
        where: {
          userId: { in: userIds },
          courseId,
          ...(mode && { mode: mode as any }),
          ...(assignmentId && { assignmentId }),
        },
        include: {
          level: {
            select: {
              id: true,
              number: true,
              name: true,
            },
          },
        },
        orderBy: {
          completedAt: 'desc',
        },
      });

      return NextResponse.json(attempts);
    }

    // For students, get only their own attempts
    const attempts = await db.levelAttempt.findMany({
      where: {
        userId: session.user.id,
        ...(mode && { mode: mode as any }), // Filter by mode if provided
        ...(assignmentId && { assignmentId }), // Filter by assignment if provided
        ...(courseId && { courseId }), // Filter by course if provided
      },
      include: {
        level: {
          select: {
            id: true,
            number: true,
            name: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return NextResponse.json(attempts);
  } catch (error: any) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

