import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(
    '🚀 Seeding fixed answers for 5 students (resolve assignmentId by title)...'
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

  // ================= FIXED ANSWERS =================
  const answers = [
    {
      question: {
        id: 'cs_q1',
        bands: ['brown', 'red', 'orange', 'gold'],
        order: 1,
        points: 10,
        options: ['12kΩ ±5%', '1.2kΩ ±5%', '120kΩ ±5%', '1.2MΩ ±5%'],
        answerType: 'color_selection',
        resistorType: 'FOUR_BAND',
        correctAnswer: '12kΩ ±5%',
      },
      isCorrect: true,
      timestamp: 1769531053551,
      userBands: ['brown', 'red', 'orange', 'gold'],
      userAnswer: '12kΩ ±5%',
    },
    {
      question: {
        id: 'cs_q2',
        bands: ['red', 'red', 'brown', 'gold'],
        order: 2,
        points: 10,
        options: ['220Ω ±5%', '22Ω ±5%', '2.2kΩ ±5%', '22kΩ ±5%'],
        answerType: 'color_selection',
        resistorType: 'FOUR_BAND',
        correctAnswer: '220Ω ±5%',
      },
      isCorrect: true,
      timestamp: 1769531062816,
      userBands: ['red', 'red', 'brown', 'gold'],
      userAnswer: '220Ω ±5%',
    },
    {
      question: {
        id: 'cs_q3',
        bands: ['green', 'blue', 'yellow', 'gold'],
        order: 3,
        points: 10,
        options: ['56kΩ ±5%', '560kΩ ±5%', '5.6kΩ ±5%', '560Ω ±5%'],
        answerType: 'color_selection',
        resistorType: 'FOUR_BAND',
        correctAnswer: '560kΩ ±5%',
      },
      isCorrect: true,
      timestamp: 1769531072567,
      userBands: ['green', 'blue', 'yellow', 'gold'],
      userAnswer: '560kΩ ±5%',
    },
    {
      question: {
        id: 'cs_q4',
        bands: ['brown', 'black', 'black', 'red', 'brown'],
        order: 4,
        points: 10,
        options: ['100Ω ±1%', '10Ω ±1%', '1kΩ ±1%', '100kΩ ±1%'],
        answerType: 'color_selection',
        resistorType: 'FIVE_BAND',
        correctAnswer: '100Ω ±1%',
      },
      isCorrect: false,
      timestamp: 1769531085549,
      userBands: ['brown', 'black', 'black', 'brown', 'brown'],
      userAnswer: '1kΩ ±1%',
    },
    {
      question: {
        id: 'cs_q5',
        bands: ['orange', 'white', 'black', 'red', 'brown'],
        order: 5,
        points: 10,
        options: ['39kΩ ±1%', '3.9kΩ ±1%', '390Ω ±1%', '390kΩ ±1%'],
        answerType: 'color_selection',
        resistorType: 'FIVE_BAND',
        correctAnswer: '39kΩ ±1%',
      },
      isCorrect: true,
      timestamp: 1769531116116,
      userBands: ['orange', 'white', 'black', 'red', 'brown'],
      userAnswer: '39kΩ ±1%',
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
        completedAt: new Date(),

        questions: answers,
      },
    })

    console.log(`✅ Created LevelAttempt for ${name}`)
  }

  console.log('🎉 Done seeding fixed answers for 5 students')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })