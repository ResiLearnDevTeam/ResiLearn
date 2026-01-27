import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(
    '🚀 Seeding MULTIPLE-CHOICE answers for 5 students (resolve assignmentId by title)...'
  )

  // ================= CONFIG =================
  const courseName = 'Electrical Basic Sec 2 2569'
  const assignmentTitle = 'แบบฝึกหัดอ่านค่าตัวต้านทาน (ตัวเลือก)'

  const studentNames = [
    'Jarin Worasak',
    'Kawin Rattanor',
    'Kittin Nawarun',
    'Kittiphat Janorin',
    'Kittisak Woranan',
  ]

  // ================= MULTIPLE-CHOICE ANSWERS =================
  const answers = [
    {
      question: {
        id: 'mc_q1',
        bands: ['red', 'black', 'black', 'red'],
        order: 1,
        points: 10,
        options: ['20Ω ±2%', '200Ω ±2%', '2kΩ ±2%', '20kΩ ±2%'],
        answerType: 'multiple_choice',
        resistorType: 'FOUR_BAND',
        correctAnswer: '20Ω ±2%',
      },
      isCorrect: true,
      timestamp: 1769536163797,
      userAnswer: '20Ω ±2%',
    },
    {
      question: {
        id: 'mc_q2',
        bands: ['brown', 'black', 'red', 'gold'],
        order: 2,
        points: 10,
        options: ['1kΩ ±5%', '10kΩ ±5%', '100Ω ±5%', '1Ω ±5%'],
        answerType: 'multiple_choice',
        resistorType: 'FOUR_BAND',
        correctAnswer: '1kΩ ±5%',
      },
      isCorrect: true,
      timestamp: 1769536168910,
      userAnswer: '1kΩ ±5%',
    },
    {
      question: {
        id: 'mc_q3',
        bands: ['yellow', 'violet', 'orange', 'gold'],
        order: 3,
        points: 10,
        options: ['47kΩ ±5%', '4.7kΩ ±5%', '470Ω ±5%', '470kΩ ±5%'],
        answerType: 'multiple_choice',
        resistorType: 'FOUR_BAND',
        correctAnswer: '47kΩ ±5%',
      },
      isCorrect: false,
      timestamp: 1769536172111,
      userAnswer: '470kΩ ±5%',
    },
    {
      question: {
        id: 'mc_q4',
        bands: ['brown', 'red', 'orange', 'black', 'brown'],
        order: 4,
        points: 10,
        options: ['12kΩ ±1%', '123Ω ±1%', '12.3kΩ ±1%', '123kΩ ±1%'],
        answerType: 'multiple_choice',
        resistorType: 'FIVE_BAND',
        correctAnswer: '12.3kΩ ±1%',
      },
      isCorrect: true,
      timestamp: 1769536178677,
      userAnswer: '12.3kΩ ±1%',
    },
    {
      question: {
        id: 'mc_q5',
        bands: ['green', 'blue', 'black', 'red', 'brown'],
        order: 5,
        points: 10,
        options: ['56kΩ ±1%', '5.6kΩ ±1%', '560Ω ±1%', '560kΩ ±1%'],
        answerType: 'multiple_choice',
        resistorType: 'FIVE_BAND',
        correctAnswer: '56kΩ ±1%',
      },
      isCorrect: true,
      timestamp: 1769536184978,
      userAnswer: '56kΩ ±1%',
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

        // ✅ เวลาตามที่กำหนด
        completedAt: new Date('2026-01-27T17:25:51.291Z'),

        questions: answers,
      },
    })

    console.log(`✅ Created LevelAttempt for ${name}`)
  }

  console.log('🎉 Done seeding MULTIPLE-CHOICE answers')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })