import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; studentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, studentId } = await params;

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

    // Get student detail (reuse existing API logic)
    const detailRes = await fetch(`${request.nextUrl.origin}/api/courses/${courseId}/students/${studentId}/detail`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!detailRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch student details' }, { status: 500 });
    }

    const studentData = await detailRes.json();

    // Generate simple text report (can be enhanced to PDF later)
    const report = `รายงานความก้าวหน้านักเรียน
=====================================

ข้อมูลนักเรียน:
- ชื่อ: ${studentData.student.name || 'ไม่มีชื่อ'}
- Email: ${studentData.student.email}
- รหัสนักเรียน: ${studentData.student.studentId || '-'}
- ลงทะเบียนเมื่อ: ${new Date(studentData.student.enrolledAt).toLocaleDateString('th-TH')}

สถิติภาพรวม:
- ความคืบหน้า: ${studentData.student.progress}%
- งานที่เสร็จ: ${studentData.assignmentHistory.filter((a: any) => a.completed).length}/${studentData.assignmentHistory.length}
- คะแนนเฉลี่ย: ${studentData.quizAttempts.length > 0 ? Math.round(studentData.quizAttempts.reduce((sum: number, a: any) => sum + a.score, 0) / studentData.quizAttempts.length) : 0}%
- เวลาที่ใช้: ${Math.floor(studentData.timeAnalysis.totalTimeSpent / 3600)} ชั่วโมง ${Math.floor((studentData.timeAnalysis.totalTimeSpent % 3600) / 60)} นาที

รายงานนี้ถูกสร้างเมื่อ: ${new Date().toLocaleString('th-TH')}
`;

    return new NextResponse(report, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="student-report-${studentData.student.name || studentId}-${new Date().toISOString().split('T')[0]}.txt"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting student report:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

