import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randomEnrolledAt(year: number) {
  const day = Math.floor(Math.random() * 4) + 20 // 20–23
  const hour = Math.floor(Math.random() * 24)
  const minute = Math.floor(Math.random() * 60)
  const second = Math.floor(Math.random() * 60)

  return new Date(year, 0, day, hour, minute, second) // เดือน 0 = มกราคม
}

async function main() {
  // ================= COURSES =================
  const sec1_2569 = await prisma.course.findFirst({
    where: { name: 'Electrical Basic Sec 1 2569' },
  })
  const sec2_2569 = await prisma.course.findFirst({
    where: { name: 'Electrical Basic Sec 2 2569' },
  })
  const sec1_2568 = await prisma.course.findFirst({
    where: { name: 'Electrical Basic Sec 1/2568' },
  })
  const sec2_2568 = await prisma.course.findFirst({
    where: { name: 'Electrical Basic Sec 2/2568' },
  })

  if (!sec1_2569 || !sec2_2569 || !sec1_2568 || !sec2_2568) {
    throw new Error('❌ ไม่พบ course ครบทั้ง 4 รายวิชา')
  }

  // ================= STUDENTS =================
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { email: 'asc' }, // ให้ผลลัพธ์คงที่
  })

  if (students.length < 70) {
    throw new Error('❌ จำนวนนักเรียนไม่พอ (ต้องการอย่างน้อย 70 คน)')
  }

  // ================= FIXED ASSIGN =================
  const enrollments = [
    // ===== 2569 =====
    ...students.slice(0, 25).map((s) => ({
      userId: s.id,
      courseId: sec1_2569.id,
      enrolledAt: randomEnrolledAt(sec1_2569.startDate.getFullYear()),
    })),
    ...students.slice(25, 45).map((s) => ({
      userId: s.id,
      courseId: sec2_2569.id,
      enrolledAt: randomEnrolledAt(sec2_2569.startDate.getFullYear()),
    })),

    // ===== 2568 =====
    ...students.slice(45, 60).map((s) => ({
      userId: s.id,
      courseId: sec1_2568.id,
      enrolledAt: randomEnrolledAt(sec1_2568.startDate.getFullYear()),
    })),
    ...students.slice(60, 70).map((s) => ({
      userId: s.id,
      courseId: sec2_2568.id,
      enrolledAt: randomEnrolledAt(sec2_2568.startDate.getFullYear()),
    })),
  ]

  // ================= INSERT =================
  for (const e of enrollments) {
    await prisma.enrollment.create({
      data: {
        userId: e.userId,
        courseId: e.courseId,
        enrolledAt: e.enrolledAt,
        progress: 0,
      },
    })
  }

  console.log('✅ Seed enrollment completed (fixed counts + random enrolledAt)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
