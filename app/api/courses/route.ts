import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { customAlphabet } from 'nanoid'
import { Filter } from 'bad-words'

// สร้างตัวกรองคำหยาบ
const filter = new Filter()
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateCourseCode(): string {
  let code = ''
  do {
    // ความยาวสุ่ม 5–8
    const length = Math.floor(Math.random() * 4) + 5
    const nanoidCustom = customAlphabet(alphabet, length)
    code = nanoidCustom()
  } while (filter.isProfane(code)) // ถ้าเป็นคำหยาบจะสุ่มใหม่
  return code
}

// 🟢 POST: สร้างคอร์สใหม่
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // 🔹 รหัสคอร์สแบบสุ่ม 5–8 ตัว ป้องกันคำหยาบ
    const randomCode = generateCourseCode()

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
