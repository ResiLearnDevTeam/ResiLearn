import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(
    '🚀 Seeding FILL-IN answers for 5 students (resolve assignmentId by title)...'
  )

  // ================= CONFIG =================
  const courseName = 'Electrical Basic Sec 2 2569'
  const assignmentTitle = 'แบบฝึกหัดอ่านค่าตัวต้านทาน (Fill-in)'

  const studentNames = [
    'Jarin Worasak',
    'Kawin Rattanor',
    'Kittin Nawarun',
    'Kittiphat Janorin',
    'Kittisak Woranan',
  ]

  // ================= FILL-IN ANSWERS =================
  const answers = [
    {
      question: {
        id: 'fi_q1',
        bands: ['brown', 'black', 'red', 'gold'],
        order: 1,
        points: 10,
        options: ['1kΩ ±5%', '10kΩ ±5%', '100Ω ±5%', '1Ω ±5%'],
        answerType: 'fill_in',
        resistorType: 'FOUR_BAND',
        correctAnswer: '1kΩ ±5%',
      },
      isCorrect: true,
      timestamp: 1769534207973,
      userAnswer: '1kΩ ±5%',
    },
    {
      question: {
        id: 'fi_q2',
        bands: ['yellow', 'violet', 'orange', 'gold'],
        order: 2,
        points: 10,
        options: ['47kΩ ±5%', '4.7kΩ ±5%', '470Ω ±5%', '470kΩ ±5%'],
        answerType: 'fill_in',
        resistorType: 'FOUR_BAND',
        correctAnswer: '47kΩ ±5%',
      },
      isCorrect: true,
      timestamp: 1769534214172,
      userAnswer: '47kΩ ±5%',
    },
    {
      question: {
        id: 'fi_q3',
        bands: ['brown', 'blue', 'brown', 'gold'],
        order: 3,
        points: 10,
        options: ['560Ω ±5%', '56Ω ±5%', '5.6kΩ ±5%', '560kΩ ±5%'],
        answerType: 'fill_in',
        resistorType: 'FOUR_BAND',
        correctAnswer: '560Ω ±5%',
      },
      isCorrect: false,
      timestamp: 1769534220605,
      userAnswer: '30Ω ±5%',
    },
    {
      question: {
        id: 'fi_q4',
        bands: ['brown', 'red', 'black', 'brown', 'brown'],
        order: 4,
        points: 10,
        options: ['120Ω ±1%', '12Ω ±1%', '1.2kΩ ±1%', '120kΩ ±1%'],
        answerType: 'fill_in',
        resistorType: 'FIVE_BAND',
        correctAnswer: '120Ω ±1%',
      },
      isCorrect: true,
      timestamp: 1769534229537,
      userAnswer: '120Ω ±1%',
    },
    {
      question: {
        id: 'fi_q5',
        bands: ['orange', 'orange', 'black', 'red', 'brown'],
        order: 5,
        points: 10,
        options: ['33kΩ ±1%', '3.3kΩ ±1%', '330Ω ±1%', '330kΩ ±1%'],
        answerType: 'fill_in',
        resistorType: 'FIVE_BAND',
        correctAnswer: '33kΩ ±1%',
      },
      isCorrect: true,
      timestamp: 1769534239238,
      userAnswer: '33kΩ ±1%',
    },
  ]

  // ================= FIND COURSE =================
  const course = await prisma.course.findFirst({
    where: { name: courseName },
  })

  if (!course) {
    throw new Error(`❌ ไม่พบ course: ${courseName}`)
  }

  // ================= FIND ASSIGNMENT BY TITLE =================
  const assignment = await prisma.courseAssignment.findFirst({
    where: {
      courseId: course.id,
      title: assignmentTitle,
    },
  })

  if (!assignment) {
    throw new Error(`❌ ไม่พบ assignment: ${assignmentTitle}`)
  }

  console.log(`📘 Found assignmentId: ${assignment.id}`)

  // ================= PROCESS STUDENTS =================
  for (const name of studentNames) {
    const user = await prisma.user.findFirst({
      where: {
        name,
        enrollments: {
          some: { courseId: course.id },
        },
      },
    })

    if (!user) {
      console.warn(`⚠️ ไม่พบนักเรียน ${name} ในคอร์ส → ข้าม`)
      continue
    }

    const totalScore = answers.reduce(
      (sum, a) => sum + (a.isCorrect ? a.question.points : 0),
      0
    )

    const percentage = Math.round(
      (totalScore / (answers.length * 10)) * 100
    )

    await prisma.levelAttempt.create({
      data: {
        userId: user.id,
        courseId: course.id,
        assignmentId: assignment.id,
        assignmentType: 'FIXED_QUESTIONS',
        mode: 'QUIZ',

        score: totalScore,
        percentage,
        timeTaken: 120,
        passed: percentage >= 50,

        // ✅ เขียนค่าตรง ๆ ตามที่ขอ
        completedAt: new Date('2026-01-25T17:25:51.291Z'),

        questions: answers,
      },
    })

    console.log(`✅ Created LevelAttempt for ${name}`)
  }

  console.log('🎉 Done seeding FILL-IN answers for 5 students')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })