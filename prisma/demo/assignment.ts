import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

function randomResistorType(): 'FOUR_BAND' | 'FIVE_BAND' {
  return Math.random() < 0.5 ? 'FOUR_BAND' : 'FIVE_BAND'
}

function randomAnswerType():
  | 'multiple_choice'
  | 'fill_in'
  | 'color_selection'
  | 'color_reading' {
  const types = [
    'multiple_choice',
    'fill_in',
    'color_selection',
    'color_reading',
  ]
  return types[Math.floor(Math.random() * types.length)] as any
}

function randomDifficulty(): 'easy' | 'medium' | 'hard' {
  const difficulties = ['easy', 'medium', 'hard']
  return difficulties[Math.floor(Math.random() * difficulties.length)] as any
}

function randomOptionCount(): number {
  const counts = [2, 3, 4]
  return counts[Math.floor(Math.random() * counts.length)]
}

async function main() {
  // ================= COURSES =================
  const courses = await prisma.course.findMany({
    where: {
      name: {
        in: [
          'Electrical Basic Sec 1 2569',
          'Electrical Basic Sec 2 2569',
          'Electrical Basic Sec 1/2568',
          'Electrical Basic Sec 2/2568',
        ],
      },
    },
    orderBy: { name: 'asc' },
  })

  if (courses.length !== 4) {
    throw new Error('❌ ไม่พบ course ครบทั้ง 4 รายวิชา')
  }

  // ================= LEVEL (AUTO CREATE) =================
  let level = await prisma.level.findFirst({
    orderBy: { number: 'asc' },
  })

  if (!level) {
    console.log('ℹ️ ไม่พบ level → สร้าง Level เริ่มต้นอัตโนมัติ')

    level = await prisma.level.create({
      data: {
        number: 1,
        name: 'พื้นฐานการอ่านค่าตัวต้านทาน',
        description:
          'ระดับพื้นฐานสำหรับการอ่านค่าตัวต้านทานแบบแถบสี 4 และ 5 แถบ',
        difficulty: 1, // ⭐ REQUIRED FIELD
      },
    })
  }

  // ================= ASSIGNMENT TEMPLATE =================
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
    for (const a of assignments) {
      const quizSettings = {
        resistorType: randomResistorType(),
        answerType: randomAnswerType(),
        difficulty: randomDifficulty(),
        optionCount: randomOptionCount(),
        totalQuestions: a.totalQuestions,
        countdownTime: null,
        timeLimit: null,
        showCorrectAnswer: true,
      }

      await prisma.courseAssignment.create({
        data: {
          courseId: course.id,

          assignmentType: 'CUSTOM_QUIZ',
          assignmentMode: 'EXAM',

          // ✅ ผูก level เพื่อกัน UI crash
          levelId: level.id,

          title: a.title,
          description: null,
          descriptionFormat: 'PLAIN',
          instructions: null,
          dueDate: null,

          maxPoints: a.totalQuestions * 10,
          passThreshold: Math.floor(a.totalQuestions * 5),

          showScore: true,
          allowRetake: false,
          hasScore: true,

          order: a.order,

          quizSettings: JSON.parse(JSON.stringify(quizSettings)),
          questions: Prisma.JsonNull,
          quizSettingsForFixed: Prisma.JsonNull,

          priority: 'NORMAL',
          isPinned: false,
          isDraft: false,
          publishedAt: null,
          attachments: Prisma.JsonNull,
        },
      })
    }
  }

  console.log('✅ Seed assignment completed (auto level + UI safe)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
