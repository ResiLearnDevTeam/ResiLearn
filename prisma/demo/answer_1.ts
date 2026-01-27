import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Seeding ALL fixed answers (Color / Fill-in / MC)...')

  // ================= CONFIG =================
  const courseName = 'Electrical Basic Sec 2 2569'

  const studentNames = [
    'Jarin Worasak',
    'Kawin Rattanor',
    'Kittin Nawarun',
    'Kittiphat Janorin',
    'Kittisak Woranan',
  ]

  // ================= ANSWER SETS =================
  const answerSets = [
    {
      title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (เลือกสี)',
      completedAt: new Date('2026-01-22T17:25:51.291Z'),
      answers: [
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
          isCorrect: false,
          timestamp: 1769531053551,
          userBands: ['brown', 'brown', 'orange', 'gold'],
          userAnswer: '1.2kΩ ±5%',
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
            correctAnswer: '22Ω ±5%',
          },
          isCorrect: false,
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
          isCorrect: false,
          timestamp: 1769531072567,
          userBands: ['blue', 'blue', 'yellow', 'gold'],
          userAnswer: '56kΩ ±5%',
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
          isCorrect: true,
          timestamp: 1769531085549,
          userBands: ['brown', 'black', 'black', 'red', 'brown'],
          userAnswer: '10kΩ ±1%',
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
      ],
    },
    {
      title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (เลือกสี)',
      completedAt: new Date('2026-01-23T17:25:51.291Z'),
      answers: [
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
          isCorrect: false,
          timestamp: 1769531053551,
          userBands: ['brown', 'brown', 'orange', 'gold'],
          userAnswer: '1.2kΩ ±5%',
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
            correctAnswer: '22Ω ±5%',
          },
          isCorrect: false,
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
          isCorrect: false,
          timestamp: 1769531072567,
          userBands: ['blue', 'blue', 'yellow', 'gold'],
          userAnswer: '56kΩ ±5%',
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
          isCorrect: true,
          timestamp: 1769531085549,
          userBands: ['brown', 'black', 'black', 'red', 'brown'],
          userAnswer: '10kΩ ±1%',
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
      ],
    },
    {
      title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (Fill-in)',
      completedAt: new Date('2026-01-24T17:25:51.291Z'),
      answers: [
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
          isCorrect: false,
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
      ],
    },
    {
      title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (Fill-in)',
      completedAt: new Date('2026-01-25T17:25:51.291Z'),
      answers: [
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
          isCorrect: false,
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
      ],
    },
    {
      title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (ตัวเลือก)',
      completedAt: new Date('2026-01-26T17:25:51.291Z'),
      answers: [
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
      ],
    },
    {
      title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (ตัวเลือก)',
      completedAt: new Date('2026-01-27T17:25:51.291Z'),
      answers: [
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
      ],
    },
  ]

  // ================= FIND COURSE =================
  const course = await prisma.course.findFirst({
    where: { name: courseName },
  })
  if (!course) throw new Error(`❌ ไม่พบ course: ${courseName}`)

  // ================= PROCESS =================
  for (const set of answerSets) {
    const assignment = await prisma.courseAssignment.findFirst({
      where: {
        courseId: course.id,
        title: set.title,
      },
    })
    if (!assignment) {
      console.warn(`⚠️ ไม่พบ assignment: ${set.title}`)
      continue
    }

    for (const name of studentNames) {
      const user = await prisma.user.findFirst({
        where: {
          name,
          enrollments: { some: { courseId: course.id } },
        },
      })
      if (!user) continue

      const totalScore = set.answers.reduce(
        (sum, a) => sum + (a.isCorrect ? a.question.points : 0),
        0
      )

      const percentage = Math.round(
        (totalScore / (set.answers.length * 10)) * 100
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
          completedAt: set.completedAt,

          questions: set.answers,
        },
      })
    }

    console.log(`✅ Seeded answers for: ${set.title}`)
  }

  console.log('🎉 Done seeding ALL answers')
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect())