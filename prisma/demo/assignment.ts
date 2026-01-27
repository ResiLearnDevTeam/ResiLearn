import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Seeding FIXED quiz (5 questions) for multiple courses...')

  const targetCourseIds = [
    'cmkwrt8wo001ht09sdgvfx81i',
    'cmkwrt8ws001jt09se2lqzf41',
    'cmkwrt8wt001lt09scr3c1hux',
    'cmkwrt8wv001nt09ssjr0s2ge',
  ]

  // ================= FIXED QUESTIONS =================
  const questions = [
    {
      id: 'q1',
      order: 1,
      points: 10,
      bands: ['red', 'black', 'black', 'red'],
      resistorType: 'FOUR_BAND',
      answerType: 'multiple_choice',
      options: ['20Ω ±2%', '200Ω ±2%', '2kΩ ±2%', '20kΩ ±2%'],
      correctAnswer: '20Ω ±2%',
    },
    {
      id: 'q2',
      order: 2,
      points: 10,
      bands: ['brown', 'black', 'red', 'gold'],
      resistorType: 'FOUR_BAND',
      answerType: 'multiple_choice',
      options: ['1kΩ ±5%', '10kΩ ±5%', '100Ω ±5%', '1Ω ±5%'],
      correctAnswer: '1kΩ ±5%',
    },
    {
      id: 'q3',
      order: 3,
      points: 10,
      bands: ['yellow', 'violet', 'orange', 'gold'],
      resistorType: 'FOUR_BAND',
      answerType: 'multiple_choice',
      options: ['47kΩ ±5%', '4.7kΩ ±5%', '470Ω ±5%', '470kΩ ±5%'],
      correctAnswer: '47kΩ ±5%',
    },
    {
      id: 'q4',
      order: 4,
      points: 10,
      bands: ['brown', 'red', 'orange', 'black', 'brown'],
      resistorType: 'FIVE_BAND',
      answerType: 'multiple_choice',
      options: ['12kΩ ±1%', '123Ω ±1%', '12.3kΩ ±1%', '123kΩ ±1%'],
      correctAnswer: '12.3kΩ ±1%',
    },
    {
      id: 'q5',
      order: 5,
      points: 10,
      bands: ['green', 'blue', 'black', 'red', 'brown'],
      resistorType: 'FIVE_BAND',
      answerType: 'multiple_choice',
      options: ['56kΩ ±1%', '5.6kΩ ±1%', '560Ω ±1%', '560kΩ ±1%'],
      correctAnswer: '56kΩ ±1%',
    },
  ]

  // ================= INSERT =================
  for (const courseId of targetCourseIds) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      console.warn(`⚠️ ไม่พบ courseId: ${courseId} → ข้าม`)
      continue
    }

    await prisma.courseAssignment.create({
      data: {
        courseId: course.id,

        assignmentType: 'FIXED_QUESTIONS',
        assignmentMode: 'PRACTICE',

        title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (5 ข้อ)',
        description: 'ฝึกอ่านค่าตัวต้านทานจากรหัสแถบสี 4 และ 5 แถบ',
        descriptionFormat: 'PLAIN',

        maxPoints: 50,
        passThreshold: 50,

        showScore: true,
        allowRetake: false,
        hasScore: true,

        order: 0,
        priority: 'NORMAL',

        isPinned: false,
        isDraft: false,
        publishedAt: new Date(),

        questions,
        quizSettingsForFixed: {
          showCorrectAnswer: true,
          shuffleQuestions: false,
        },
      },
    })

    console.log(`✅ Seeded FIXED quiz for course: ${course.name}`)
  }

  console.log('🎉 Done seeding FIXED quizzes')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })