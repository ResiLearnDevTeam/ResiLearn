import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// 🟢 POST: สร้างคอร์สใหม่ (Teacher เท่านั้น)
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, image, startDate, endDate } = await req.json()

    if (!title || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const teacherId = session.user.id

    // ตรวจสอบชื่อคอร์สซ้ำ
    const existingCourse = await db.course.findFirst({
      where: { name: title.trim(), teacherId },
    })

    if (existingCourse) {
      return NextResponse.json({ error: 'ชื่อคอร์สนี้มีอยู่แล้ว' }, { status: 400 })
    }

    // สร้างรหัสคอร์ส 6 ตัว
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const start = new Date(startDate)
    const end = new Date(endDate)

    const newCourse = await db.course.create({
      data: {
        name: title.trim(),
        description: description || '',
        image: image || null,
        code: randomCode,
        teacherId,
        startDate: start,
        endDate: end,
        isPublished: false,
      },
    })

    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    console.error('❌ Failed to create course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}

// 🟡 GET: ดึงคอร์สตาม role ของ user (Teacher / Student)
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const role = session.user.role

    // =======================================
    // 👩‍🏫 Teacher → ดึงคอร์สที่ตัวเองสร้าง
    // =======================================
    if (role === 'TEACHER') {
      const courses = await db.course.findMany({
        where: { teacherId: userId },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json(courses)
    }

    // =======================================
    // 🧑‍🎓 Student → ดึงคอร์สที่ลงทะเบียนไว้
    // =======================================
    if (role === 'STUDENT') {
      const enrollments = await db.enrollment.findMany({
        where: { userId },
        include: {
          course: true,
        },
      })

      // ส่งเฉพาะข้อมูลคอร์สออกไป
      const courses = enrollments.map((e) => e.course)

      return NextResponse.json(courses)
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 403 })
  } catch (error) {
    console.error('❌ Failed to fetch courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
