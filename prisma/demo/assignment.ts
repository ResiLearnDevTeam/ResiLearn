import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randomResistorType(): 'FOUR_BAND' | 'FIVE_BAND' {
  return Math.random() < 0.5 ? 'FOUR_BAND' : 'FIVE_BAND'
}

function randomAnswerType(): 'multiple_choice' | 'fill_in' | 'color_selection' | 'color_reading' {
  const types = ['multiple_choice', 'fill_in', 'color_selection', 'color_reading']
  return types[Math.floor(Math.random() * types.length)] as 'multiple_choice' | 'fill_in' | 'color_selection' | 'color_reading'
}

function randomDifficulty(): 'easy' | 'medium' | 'hard' {
  const difficulties = ['easy', 'medium', 'hard']
  return difficulties[Math.floor(Math.random() * difficulties.length)] as 'easy' | 'medium' | 'hard'
}

function randomOptionCount(): number {
  const counts = [2, 3, 4]
  return counts[Math.floor(Math.random() * counts.length)]
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

  const courses = [sec1_2569, sec2_2569, sec1_2568, sec2_2568]

  // ================= ASSIGNMENTS =================
  const assignments = [
    {
      title: 'แบบทดสอบที่ 1',
      totalQuestions: 10,
      order: 0,
    },
    {
      title: 'แบบทดสอบที่ 2',
      totalQuestions: 5,
      order: 1,
    },
    {
      title: 'แบบทดสอบที่ 3',
      totalQuestions: 20,
      order: 2,
    },
  ]

  // ================= INSERT =================
  for (const course of courses) {
    for (const assignment of assignments) {
      const quizSettings = {
        resistorType: randomResistorType(),
        answerType: randomAnswerType(),
        difficulty: randomDifficulty(),
        optionCount: randomOptionCount(),
        totalQuestions: assignment.totalQuestions,
        countdownTime: null,
        timeLimit: null,
        showCorrectAnswer: true,
      }

      await prisma.courseAssignment.create({
        data: {
          courseId: course.id,
          assignmentType: 'CUSTOM_QUIZ',
          assignmentMode: 'PRACTICE',
          title: assignment.title,
          description: null,
          descriptionFormat: 'PLAIN',
          instructions: null,
          dueDate: null,
          maxPoints: 100,
          passThreshold: 50,
          showScore: true,
          allowRetake: true,
          hasScore: true,
          order: assignment.order,
          quizSettings: quizSettings,
          levelId: null,
          isPinned: false,
          isDraft: false,
          publishedAt: null,
        },
      })
    }
  }

  console.log('✅ Seed assignment completed (3 assignments per course)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
