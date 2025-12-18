import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// 🟢 POST: เข้าร่วมคอร์ส
export async function POST(req: Request) {
  try {
    // ดึง session ของผู้ใช้
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code }: { code: string } = await req.json()

    if (!code || code.trim() === '') {
      return NextResponse.json({ error: 'กรุณากรอกรหัสคอร์ส' }, { status: 400 })
    }

    // 🔍 หาคอร์สจากรหัส
    const course = await db.course.findUnique({
      where: { code },
      select: { id: true, name: true, courseStatus: true, isPublished: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'ไม่พบคอร์สนี้' }, { status: 404 })
    }

    if (course.courseStatus === 'end') {
      return NextResponse.json({ error: 'คอร์สนี้ได้จบไปแล้ว' }, { status: 400 })
    }

    // ตรวจสอบ isPublished (สมมติว่าเป็น boolean ใน DB)
    if (course.isPublished) {
      return NextResponse.json({
        error: 'ไม่สามารถเข้าร่วมจาก course code ได้กรุณาติดต่อผู้สอน',
      }, { status: 400 })
    }

    // ✅ ลงทะเบียนผู้ใช้ (upsert ป้องกันลงซ้ำ)
    await db.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
      update: {}, // ไม่มีอะไรต้อง update
      create: {
        userId: session.user.id,
        courseId: course.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: `เข้าร่วมคอร์ส ${course.name} เรียบร้อยแล้ว`,
    })
  } catch (error) {
    console.error('POST /api/courses/enroll error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
