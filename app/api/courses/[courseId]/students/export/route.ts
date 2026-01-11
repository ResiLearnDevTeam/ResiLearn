import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

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

    // Verify course exists and teacher owns it
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (session.user.role !== 'TEACHER' || course.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all enrollments
    const enrollments = await db.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    // Get assignment attempts for each student
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const attempts = await db.levelAttempt.findMany({
          where: {
            userId: enrollment.userId,
            courseId,
            mode: 'QUIZ',
          },
          select: {
            levelId: true,
            percentage: true,
            passed: true,
            completedAt: true,
          },
        });

        const completedAssignments = attempts.filter(a => a.passed).length;
        const totalAssignments = await db.courseAssignment.count({
          where: { courseId },
        });

        return {
          name: enrollment.user.name || 'ไม่มีชื่อ',
          email: enrollment.user.email,
          studentId: enrollment.user.studentId || '',
          enrolledAt: enrollment.enrolledAt.toISOString().split('T')[0],
          progress: enrollment.progress,
          completedAssignments,
          totalAssignments,
        };
      })
    );

    // Generate CSV
    const headers = ['ชื่อ', 'Email', 'รหัสนักเรียน', 'ลงทะเบียนเมื่อ', 'ความคืบหน้า (%)', 'งานที่เสร็จ', 'งานทั้งหมด'];
    const rows = studentsWithProgress.map(s => [
      s.name,
      s.email,
      s.studentId,
      s.enrolledAt,
      s.progress.toString(),
      s.completedAssignments.toString(),
      s.totalAssignments.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="students-${courseId}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting students:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

