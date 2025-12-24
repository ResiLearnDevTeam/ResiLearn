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
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      );
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
      },
    });

    return NextResponse.json({
      id: updatedAnnouncement.id,
      courseId: updatedAnnouncement.courseId,
      title: updatedAnnouncement.title,
      content: updatedAnnouncement.content,
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
