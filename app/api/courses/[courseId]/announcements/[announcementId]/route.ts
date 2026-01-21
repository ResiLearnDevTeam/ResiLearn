import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateAnnouncementData } from '@/types/classroom';

/**
 * GET /api/courses/[courseId]/announcements/[announcementId]
 * 
 * Get announcement details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; announcementId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, announcementId } = await params;

    const announcement = await db.announcement.findUnique({
      where: { id: announcementId },
      include: {
        course: {
          select: {
            id: true,
            teacherId: true,
          },
        },
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    if (announcement.courseId !== courseId) {
      return NextResponse.json(
        { error: 'Announcement does not belong to this course' },
        { status: 400 }
      );
    }

    // Check access permissions
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
    } else if (
      session.user.role === 'TEACHER' &&
      announcement.course.teacherId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'You can only view announcements for your own courses' },
        { status: 403 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses/[courseId]/announcements/[announcementId]
 * 
 * Update announcement (teacher only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; announcementId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can update announcements' },
        { status: 403 }
      );
    }

    const { courseId, announcementId } = await params;
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

    const announcement = await db.announcement.findUnique({
      where: { id: announcementId },
      include: {
        course: {
          select: {
            id: true,
            teacherId: true,
          },
        },
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    if (announcement.courseId !== courseId) {
      return NextResponse.json(
        { error: 'Announcement does not belong to this course' },
        { status: 400 }
      );
    }

    if (announcement.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only update announcements in your own courses' },
        { status: 403 }
      );
    }

    const updatedAnnouncement = await db.announcement.update({
      where: { id: announcementId },
      data: {
        title,
        content,
        contentFormat: contentFormat || 'HTML',
        priority: priority || null,
        isPinned: isPinned !== undefined ? isPinned : false,
        isDraft: isDraft !== undefined ? isDraft : false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        attachments: attachments ? JSON.parse(JSON.stringify(attachments)) : null,
      },
    });

    return NextResponse.json({
      id: updatedAnnouncement.id,
      courseId: updatedAnnouncement.courseId,
      title: updatedAnnouncement.title,
      content: updatedAnnouncement.content,
      contentFormat: updatedAnnouncement.contentFormat || 'HTML',
      priority: updatedAnnouncement.priority || null,
      isPinned: updatedAnnouncement.isPinned || false,
      isDraft: updatedAnnouncement.isDraft || false,
      publishedAt: updatedAnnouncement.publishedAt ? updatedAnnouncement.publishedAt.toISOString() : null,
      attachments: updatedAnnouncement.attachments || null,
      wordDocumentUrl: updatedAnnouncement.wordDocumentUrl || null,
      createdAt: updatedAnnouncement.createdAt.toISOString(),
      updatedAt: updatedAnnouncement.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[courseId]/announcements/[announcementId]
 * 
 * Delete announcement (teacher only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; announcementId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can delete announcements' },
        { status: 403 }
      );
    }

    const { courseId, announcementId } = await params;

    const announcement = await db.announcement.findUnique({
      where: { id: announcementId },
      include: {
        course: {
          select: {
            id: true,
            teacherId: true,
          },
        },
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    if (announcement.courseId !== courseId) {
      return NextResponse.json(
        { error: 'Announcement does not belong to this course' },
        { status: 400 }
      );
    }

    if (announcement.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete announcements in your own courses' },
        { status: 403 }
      );
    }

    await db.announcement.delete({
      where: { id: announcementId },
    });

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
