import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth' // ✅ ใช้ auth() จาก lib/auth.ts

// 🟢 POST: สร้างคอร์สใหม่
export async function POST(req: Request) {
  try {
    // 🔒 ตรวจสอบ session ว่ามีการล็อกอินหรือไม่
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 📦 ดึงข้อมูลจาก body ที่ส่งมา
    const { title, description, image, startDate, endDate } = await req.json()

    if (!title || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const teacherId = session.user.id

    // ⚙️ ตรวจสอบชื่อคอร์สซ้ำ
    const existingCourse = await db.course.findFirst({
      where: { name: title.trim(), teacherId },
    })

    if (existingCourse) {
      return NextResponse.json({ error: 'ชื่อคอร์สนี้มีอยู่แล้ว' }, { status: 400 })
    }

    // 🔢 สร้าง code แบบสุ่ม (6 ตัวอักษร)
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // 🧠 แปลง string -> Date (สำคัญมาก!)
    const start = new Date(startDate)
    const end = new Date(endDate)

    // ✅ สร้างคอร์สใหม่ในฐานข้อมูล
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

// 🟡 GET: ดึงคอร์สของอาจารย์ที่ล็อกอินอยู่
export async function GET() {
  try {
    const session = await auth()

    // 🔒 ต้องล็อกอินเท่านั้นถึงจะดูได้
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teacherId = session.user.id

    // 🔍 ดึงเฉพาะคอร์สของอาจารย์คนนั้น
    const courses = await db.course.findMany({
      where: { teacherId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('❌ Failed to fetch teacher courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
