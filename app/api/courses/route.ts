import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// 🟢 POST: สร้างคอร์สใหม่
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // รับค่าจาก form รวม toggle ใหม่
    const { title, description, image, isPublished, isResistorContent } =
      await req.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const teacherId = session.user.id

    // ตรวจสอบชื่อซ้ำของครูเดียวกัน
    const existingCourse = await db.course.findFirst({
      where: { name: title.trim(), teacherId },
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: 'ชื่อคอร์สนี้มีอยู่แล้ว' },
        { status: 400 }
      )
    }

    // รหัสคอร์ส 6 ตัว
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // ใช้วันที่ปัจจุบัน
    const start = new Date()

    const newCourse = await db.course.create({
      data: {
        name: title.trim(),
        description: description || '',
        image: image || null,
        code: randomCode,
        teacherId,
        startDate: start,
        endDate: null,

        // ⭐ เพิ่มการบันทึก toggle ลง database
        isPublished: Boolean(isPublished),
        isResistorContent: Boolean(isResistorContent),
      },
    })

    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    console.error('❌ Failed to create course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

// 🟡 GET: ดึงคอร์สของ Teacher / Student
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const role = session.user.role

    // 👩‍🏫 Teacher — คอร์สที่สร้างเอง
    if (role === 'TEACHER') {
      const courses = await db.course.findMany({
        where: { teacherId: userId },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json(courses)
    }

    // 🧑‍🎓 Student — คอร์สที่ลงทะเบียนไว้
    if (role === 'STUDENT') {
      const enrollments = await db.enrollment.findMany({
        where: { userId },
        include: { course: true },
      })

      const courses = enrollments.map((e) => e.course)

      return NextResponse.json(courses)
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 403 })
  } catch (error) {
    console.error('❌ Failed to fetch courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
