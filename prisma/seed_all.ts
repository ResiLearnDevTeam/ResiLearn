import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ================= UTILS =================
function emailFromName(name: string) {
  return name.split(' ')[0].toLowerCase() + '@gmail.com'
}

function randomEnrolledAt(year: number) {
  const day = Math.floor(Math.random() * 4) + 20 // 20–23
  const hour = Math.floor(Math.random() * 24)
  const minute = Math.floor(Math.random() * 60)
  const second = Math.floor(Math.random() * 60)

  return new Date(year, 0, day, hour, minute, second)
}

// ================= MAIN =================
async function main() {
  // ==================================================
  // 1) SEED USERS
  // ==================================================
  const password = await bcrypt.hash('123456', 10)

  const users = [
    // ===== STUDENT =====
    { name: 'Anot Worachan', role: 'STUDENT' },
    { name: 'Saran Kitthanon', role: 'STUDENT' },
    { name: 'Phurin Chantira', role: 'STUDENT' },
    { name: 'Kittin Nawarun', role: 'STUDENT' },
    { name: 'Tanat Sorawit', role: 'STUDENT' },
    { name: 'Narin Phatsakon', role: 'STUDENT' },
    { name: 'Pawat Chintara', role: 'STUDENT' },
    { name: 'Warin Sittanon', role: 'STUDENT' },
    { name: 'Koran Thavisin', role: 'STUDENT' },
    { name: 'Jarin Worasak', role: 'STUDENT' },
    { name: 'Sittipon Kranon', role: 'STUDENT' },
    { name: 'Purin Anawat', role: 'STUDENT' },
    { name: 'Nopparat Silarin', role: 'STUDENT' },
    { name: 'Tharin Wachanon', role: 'STUDENT' },
    { name: 'Kawin Rattanor', role: 'STUDENT' },
    { name: 'Chanon Woraphan', role: 'STUDENT' },
    { name: 'Patsanun Kitrun', role: 'STUDENT' },
    { name: 'Ratchanon Suthira', role: 'STUDENT' },
    { name: 'Thaworn Phonrat', role: 'STUDENT' },
    { name: 'Anawin Jantarat', role: 'STUDENT' },
    { name: 'Sakarin Woradet', role: 'STUDENT' },
    { name: 'Thanin Kulchan', role: 'STUDENT' },
    { name: 'Boripat Saranon', role: 'STUDENT' },
    { name: 'Phanupong Worasin', role: 'STUDENT' },
    { name: 'Kittiphat Janorin', role: 'STUDENT' },
    { name: 'Surasak Thiranon', role: 'STUDENT' },
    { name: 'Nattapon Phanrit', role: 'STUDENT' },
    { name: 'Woraphat Chanarin', role: 'STUDENT' },
    { name: 'Teerachai Sothira', role: 'STUDENT' },
    { name: 'Komsan Nawarach', role: 'STUDENT' },
    { name: 'Phakorn Sitthin', role: 'STUDENT' },
    { name: 'Anurak Chantarin', role: 'STUDENT' },
    { name: 'Somporn Worakit', role: 'STUDENT' },
    { name: 'Thitipong Narasin', role: 'STUDENT' },
    { name: 'Ravin Tharun', role: 'STUDENT' },
    { name: 'Kriangsak Woraphon', role: 'STUDENT' },
    { name: 'Phichit Soranon', role: 'STUDENT' },
    { name: 'Surasin Kantira', role: 'STUDENT' },
    { name: 'Wichanon Phatsin', role: 'STUDENT' },
    { name: 'Thanawat Jorasin', role: 'STUDENT' },
    { name: 'Noppasin Waranon', role: 'STUDENT' },
    { name: 'Chakkrit Suttiron', role: 'STUDENT' },
    { name: 'Panyawat Tharaphon', role: 'STUDENT' },
    { name: 'Kantapon Worasin', role: 'STUDENT' },
    { name: 'Ronnakrit Phanarin', role: 'STUDENT' },
    { name: 'Suphakit Nantarun', role: 'STUDENT' },
    { name: 'Tanakorn Sitthara', role: 'STUDENT' },
    { name: 'Prachaya Woranan', role: 'STUDENT' },
    { name: 'Jirawat Phorasin', role: 'STUDENT' },
    { name: 'Narong Sittinon', role: 'STUDENT' },
    { name: 'Atthapon Chantarot', role: 'STUDENT' },

    // ===== STUDENT เพิ่ม =====
    { name: 'Kittisak Woranan', role: 'STUDENT' },
    { name: 'Phanuwat Sittira', role: 'STUDENT' },
    { name: 'Nattakit Phorach', role: 'STUDENT' },
    { name: 'Anusorn Chantara', role: 'STUDENT' },
    { name: 'Chayut Worasin', role: 'STUDENT' },
    { name: 'Thanapol Sitthin', role: 'STUDENT' },
    { name: 'Rachanon Phatsara', role: 'STUDENT' },
    { name: 'Worakit Silarun', role: 'STUDENT' },
    { name: 'Kornchai Tharasin', role: 'STUDENT' },
    { name: 'Pachara Worach', role: 'STUDENT' },
    { name: 'Suphachai Chantip', role: 'STUDENT' },
    { name: 'Narit Woranan', role: 'STUDENT' },
    { name: 'Thanachot Phanrit', role: 'STUDENT' },
    { name: 'Wirot Sittinon', role: 'STUDENT' },
    { name: 'Kriwat Narasin', role: 'STUDENT' },
    { name: 'Phurin Worakit', role: 'STUDENT' },
    { name: 'Anupong Chantarun', role: 'STUDENT' },
    { name: 'Sorasak Woraphon', role: 'STUDENT' },
    { name: 'Jakkrit Sitthara', role: 'STUDENT' },
    { name: 'Piyawat Narathin', role: 'STUDENT' },

    // ===== TEACHER =====
    { name: 'Somchai Suksan', role: 'TEACHER' },
    { name: 'Pradit Sitthanon', role: 'TEACHER' },
    { name: 'Thawatchai Narathin', role: 'TEACHER' },
    { name: 'Nirun Chantip', role: 'TEACHER' },
    { name: 'Suriya Phatsara', role: 'TEACHER' },
  ]

  for (const u of users) {
    const email = emailFromName(u.name)
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name: u.name, email, role: u.role, password },
    })
  }

  console.log('✅ Seed users completed')

  // ==================================================
  // 2) SEED COURSES
  // ==================================================
  const teacher = await prisma.user.findFirst({
    where: { name: 'Somchai Suksan' },
  })
  if (!teacher) throw new Error('❌ ไม่พบ teacher')

  const description =
    'รายวิชาพื้นฐานทางไฟฟ้าและการอ่านค่าตัวต้านทานจากรหัสแถบสี'

  const courses = [
    {
      name: 'Electrical Basic Sec 1 2569',
      code: 'K9xP2A',
      startDate: new Date('2026-01-20'),
      status: 'START',
      isPublished: true,
    },
    {
      name: 'Electrical Basic Sec 2 2569',
      code: 'Q7MZr4',
      startDate: new Date('2026-01-20'),
      status: 'START',
      isPublished: false,
    },
    {
      name: 'Electrical Basic Sec 1/2568',
      code: 'Z3p8N',
      startDate: new Date('2025-01-20'),
      status: 'end',
      isPublished: true,
    },
    {
      name: 'Electrical Basic Sec 2/2568',
      code: 'mK6R9x',
      startDate: new Date('2025-01-20'),
      status: 'end',
      isPublished: false,
    },
  ]

  for (const c of courses) {
    await prisma.course.create({
      data: {
        ...c,
        description,
        teacherId: teacher.id,
      },
    })
  }

  console.log('✅ Seed courses completed')

  // ==================================================
  // 3) SEED ENROLLMENTS
  // ==================================================
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { email: 'asc' },
  })

  const [sec1_2569, sec2_2569, sec1_2568, sec2_2568] =
    await prisma.course.findMany({
      orderBy: { startDate: 'desc' },
    })

  const enrollments = [
    ...students.slice(0, 25).map((s) => ({
      userId: s.id,
      courseId: sec1_2569.id,
      enrolledAt: randomEnrolledAt(2026),
    })),
    ...students.slice(25, 45).map((s) => ({
      userId: s.id,
      courseId: sec2_2569.id,
      enrolledAt: randomEnrolledAt(2026),
    })),
    ...students.slice(45, 60).map((s) => ({
      userId: s.id,
      courseId: sec1_2568.id,
      enrolledAt: randomEnrolledAt(2025),
    })),
    ...students.slice(60, 70).map((s) => ({
      userId: s.id,
      courseId: sec2_2568.id,
      enrolledAt: randomEnrolledAt(2025),
    })),
  ]

  for (const e of enrollments) {
    await prisma.enrollment.create({
      data: { ...e, progress: 0 },
    })
  }

  console.log('✅ Seed enrollments completed')
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect())