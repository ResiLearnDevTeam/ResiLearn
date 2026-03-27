import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { exportToWord } from '@/lib/wordExport';

/**
 * GET /api/courses/[courseId]/announcements/[announcementId]/export-word
 * 
 * Export announcement to Word document
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

    // Check permissions
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
        { error: 'You can only export announcements from your own courses' },
        { status: 403 }
      );
    }

    // Generate Word document
    const blob = await exportToWord(announcement.title, announcement.content);

    // Convert blob to buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return as download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${announcement.title.replace(/[^a-z0-9]/gi, '_')}.docx"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting announcement to Word:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
