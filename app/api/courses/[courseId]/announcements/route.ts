import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateAnnouncementData } from '@/types/classroom';

/**
 * GET /api/courses/[courseId]/announcements
 * 
 * List announcements for a course
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user has access (enrolled or is teacher)
    if (session.user.role === 'STUDENT') {
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
      });

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You are not enrolled in this course' },
          { status: 403 }
        );
      }
    } else if (session.user.role === 'TEACHER' && course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only view announcements for your own courses' },
        { status: 403 }
      );
    }

    const announcements = await db.announcement.findMany({
      where: { courseId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      announcements.map(a => ({
        id: a.id,
        courseId: a.courseId,
        title: a.title,
        content: a.content,
        contentFormat: a.contentFormat || 'HTML',
        priority: a.priority || null,
        isPinned: a.isPinned || false,
        isDraft: a.isDraft || false,
        publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
        attachments: a.attachments || null,
        wordDocumentUrl: a.wordDocumentUrl || null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      }))
    );
  } catch (error: any) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses/[courseId]/announcements
 * 
 * Create announcement (teacher only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can create announcements' },
        { status: 403 }
      );
    }

    const { courseId } = await params;
    const body: CreateAnnouncementData = await request.json();
    const { 
      title, 
      content, 
      contentFormat, 
      priority, 
      isPinned, 
      isDraft, 
      publishedAt, 
      attachments 
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      );
    }

    // Validate published date if provided
    if (publishedAt) {
      const publishedDate = new Date(publishedAt);
      const now = new Date();
      if (publishedDate <= now) {
        return NextResponse.json(
          { error: 'Published date must be in the future' },
          { status: 400 }
        );
      }
    }

    // Check if course exists and user is the teacher
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only create announcements for your own courses' },
        { status: 403 }
      );
    }

    const announcement = await db.announcement.create({
      data: {
        courseId,
        title,
        content,
        contentFormat: contentFormat || 'HTML',
        priority: priority || null,
        isPinned: isPinned || false,
        isDraft: isDraft || false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        attachments: attachments ? JSON.parse(JSON.stringify(attachments)) : null,
      },
    });

    return NextResponse.json(
      {
        id: announcement.id,
        courseId: announcement.courseId,
        title: announcement.title,
        content: announcement.content,
        contentFormat: announcement.contentFormat || 'HTML',
        priority: announcement.priority || null,
        isPinned: announcement.isPinned || false,
        isDraft: announcement.isDraft || false,
        publishedAt: announcement.publishedAt ? announcement.publishedAt.toISOString() : null,
        attachments: announcement.attachments || null,
        wordDocumentUrl: announcement.wordDocumentUrl || null,
        createdAt: announcement.createdAt.toISOString(),
        updatedAt: announcement.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
