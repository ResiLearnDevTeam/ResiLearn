import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ================= COURSE NAMES =================
const courseNames = [
  'Electrical Basic Sec 1 2569',
  'Electrical Basic Sec 2 2569',
  'Electrical Basic Sec 1/2568',
  'Electrical Basic Sec 2/2568',
]

// ================= QUESTION SETS =================
const multipleChoiceQuestions = [
  {
    id: 'mc_q1',
    order: 1,
    points: 10,
    bands: ['red', 'black', 'black', 'red'],
    resistorType: 'FOUR_BAND',
    answerType: 'multiple_choice',
    options: ['20Ω ±2%', '200Ω ±2%', '2kΩ ±2%', '20kΩ ±2%'],
    correctAnswer: '20Ω ±2%',
  },
  {
    id: 'mc_q2',
    order: 2,
    points: 10,
    bands: ['brown', 'black', 'red', 'gold'],
    resistorType: 'FOUR_BAND',
    answerType: 'multiple_choice',
    options: ['1kΩ ±5%', '10kΩ ±5%', '100Ω ±5%', '1Ω ±5%'],
    correctAnswer: '1kΩ ±5%',
  },
  {
    id: 'mc_q3',
    order: 3,
    points: 10,
    bands: ['yellow', 'violet', 'orange', 'gold'],
    resistorType: 'FOUR_BAND',
    answerType: 'multiple_choice',
    options: ['47kΩ ±5%', '4.7kΩ ±5%', '470Ω ±5%', '470kΩ ±5%'],
    correctAnswer: '47kΩ ±5%',
  },
  {
    id: 'mc_q4',
    order: 4,
    points: 10,
    bands: ['brown', 'red', 'orange', 'black', 'brown'],
    resistorType: 'FIVE_BAND',
    answerType: 'multiple_choice',
    options: ['12kΩ ±1%', '123Ω ±1%', '12.3kΩ ±1%', '123kΩ ±1%'],
    correctAnswer: '12.3kΩ ±1%',
  },
  {
    id: 'mc_q5',
    order: 5,
    points: 10,
    bands: ['green', 'blue', 'black', 'red', 'brown'],
    resistorType: 'FIVE_BAND',
    answerType: 'multiple_choice',
    options: ['56kΩ ±1%', '5.6kΩ ±1%', '560Ω ±1%', '560kΩ ±1%'],
    correctAnswer: '56kΩ ±1%',
  },
]

const fillInQuestions = [
  {
    id: 'fi_q1',
    bands: ['brown', 'black', 'red', 'gold'],
    order: 1,
    points: 10,
    options: ['1kΩ ±5%', '10kΩ ±5%', '100Ω ±5%', '1Ω ±5%'],
    answerType: 'fill_in',
    resistorType: 'FOUR_BAND',
    correctAnswer: '1kΩ ±5%',
  },
  {
    id: 'fi_q2',
    bands: ['yellow', 'violet', 'orange', 'gold'],
    order: 2,
    points: 10,
    options: ['47kΩ ±5%', '4.7kΩ ±5%', '470Ω ±5%', '470kΩ ±5%'],
    answerType: 'fill_in',
    resistorType: 'FOUR_BAND',
    correctAnswer: '47kΩ ±5%',
  },
  {
    id: 'fi_q3',
    bands: ['green', 'blue', 'brown', 'gold'],
    order: 3,
    points: 10,
    options: ['560Ω ±5%', '56Ω ±5%', '5.6kΩ ±5%', '560kΩ ±5%'],
    answerType: 'fill_in',
    resistorType: 'FOUR_BAND',
    correctAnswer: '560Ω ±5%',
  },
  {
    id: 'fi_q4',
    bands: ['brown', 'red', 'black', 'brown', 'brown'],
    order: 4,
    points: 10,
    options: ['120Ω ±1%', '12Ω ±1%', '1.2kΩ ±1%', '120kΩ ±1%'],
    answerType: 'fill_in',
    resistorType: 'FIVE_BAND',
    correctAnswer: '120Ω ±1%',
  },
  {
    id: 'fi_q5',
    bands: ['orange', 'orange', 'black', 'red', 'brown'],
    order: 5,
    points: 10,
    options: ['33kΩ ±1%', '3.3kΩ ±1%', '330Ω ±1%', '330kΩ ±1%'],
    answerType: 'fill_in',
    resistorType: 'FIVE_BAND',
    correctAnswer: '33kΩ ±1%',
  },
]

const colorSelectionQuestions = [
  {
    id: 'cs_q1',
    bands: ['brown', 'red', 'orange', 'gold'],
    order: 1,
    points: 10,
    options: ['12kΩ ±5%', '1.2kΩ ±5%', '120kΩ ±5%', '1.2MΩ ±5%'],
    answerType: 'color_selection',
    resistorType: 'FOUR_BAND',
    correctAnswer: '12kΩ ±5%',
  },
  {
    id: 'cs_q2',
    bands: ['red', 'red', 'brown', 'gold'],
    order: 2,
    points: 10,
    options: ['220Ω ±5%', '22Ω ±5%', '2.2kΩ ±5%', '22kΩ ±5%'],
    answerType: 'color_selection',
    resistorType: 'FOUR_BAND',
    correctAnswer: '220Ω ±5%',
  },
  {
    id: 'cs_q3',
    bands: ['green', 'blue', 'yellow', 'gold'],
    order: 3,
    points: 10,
    options: ['56kΩ ±5%', '560kΩ ±5%', '5.6kΩ ±5%', '560Ω ±5%'],
    answerType: 'color_selection',
    resistorType: 'FOUR_BAND',
    correctAnswer: '560kΩ ±5%',
  },
  {
    id: 'cs_q4',
    bands: ['brown', 'black', 'black', 'brown', 'brown'],
    order: 4,
    points: 10,
    options: ['100Ω ±1%', '10Ω ±1%', '1kΩ ±1%', '100kΩ ±1%'],
    answerType: 'color_selection',
    resistorType: 'FIVE_BAND',
    correctAnswer: '100Ω ±1%',
  },
  {
    id: 'cs_q5',
    bands: ['orange', 'white', 'black', 'red', 'brown'],
    order: 5,
    points: 10,
    options: ['39kΩ ±1%', '3.9kΩ ±1%', '390Ω ±1%', '390kΩ ±1%'],
    answerType: 'color_selection',
    resistorType: 'FIVE_BAND',
    correctAnswer: '39kΩ ±1%',
  },
]

// ================= MAIN =================
async function main() {
  console.log('🚀 Seeding 3 FIXED quizzes by course name...')

  for (const name of courseNames) {
    const course = await prisma.course.findFirst({
      where: { name },
    })

    if (!course) {
      console.warn(`⚠️ ไม่พบ course: ${name} → ข้าม`)
      continue
    }

    const baseData = {
      courseId: course.id,
      assignmentType: 'FIXED_QUESTIONS',
      assignmentMode: 'PRACTICE',
      maxPoints: 50,
      passThreshold: 50,
      showScore: true,
      allowRetake: false,
      hasScore: true,
      priority: 'NORMAL',
      isPinned: false,
      isDraft: false,
      publishedAt: new Date(),
      quizSettingsForFixed: {
        showCorrectAnswer: true,
        shuffleQuestions: false,
      },
    }

    await prisma.courseAssignment.create({
      data: {
        ...baseData,
        title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (ตัวเลือก)',
        description: 'เลือกคำตอบที่ถูกต้องจากตัวเลือก',
        descriptionFormat: 'PLAIN',
        order: 0,
        questions: multipleChoiceQuestions,
      },
    })

    await prisma.courseAssignment.create({
      data: {
        ...baseData,
        title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (Fill-in)',
        description: 'กรอกค่าความต้านทานให้ถูกต้อง',
        descriptionFormat: 'PLAIN',
        order: 1,
        questions: fillInQuestions,
      },
    })

    await prisma.courseAssignment.create({
      data: {
        ...baseData,
        title: 'แบบฝึกหัดอ่านค่าตัวต้านทาน (เลือกสี)',
        description: 'เลือกแถบสีให้ตรงกับค่าความต้านทาน',
        descriptionFormat: 'PLAIN',
        order: 2,
        questions: colorSelectionQuestions,
      },
    })

    // เพิ่ม assignment ใหม่ 2 งานสำหรับ Sec 1 และ Sec 2 เท่านั้น
    if (name === 'Electrical Basic Sec 1 2569' || name === 'Electrical Basic Sec 2 2569') {
      // Assignment 1: รวม (ตัวเลือก) + (Fill-in) = 10 คำถาม
      const combinedMC_FI = [
        ...multipleChoiceQuestions,
        ...fillInQuestions.map(q => ({ ...q, order: q.order + 5 }))
      ]

      await prisma.courseAssignment.create({
        data: {
          ...baseData,
          title: 'แบบฝึกหัดรวม (ตัวเลือก + Fill-in)',
          description: 'รวมคำถามแบบตัวเลือกและเติมคำ',
          descriptionFormat: 'PLAIN',
          order: 3,
          maxPoints: 100, // 10 คำถาม × 10 points
          passThreshold: 50,
          questions: combinedMC_FI,
        },
      })

      // Assignment 2: รวม (Fill-in) + (เลือกสี) = 10 คำถาม
      const combinedFI_CS = [
        ...fillInQuestions,
        ...colorSelectionQuestions.map(q => ({ ...q, order: q.order + 5 }))
      ]

      await prisma.courseAssignment.create({
        data: {
          ...baseData,
          title: 'แบบฝึกหัดรวม (Fill-in + เลือกสี)',
          description: 'รวมคำถามแบบเติมคำและเลือกสี',
          descriptionFormat: 'PLAIN',
          order: 4,
          maxPoints: 100, // 10 คำถาม × 10 points
          passThreshold: 50,
          questions: combinedFI_CS,
        },
      })
    }

    console.log(`✅ Seeded ${name === 'Electrical Basic Sec 1 2569' || name === 'Electrical Basic Sec 2 2569' ? '5' : '3'} FIXED quizzes for course: ${course.name}`)
  }

  console.log('🎉 Done seeding all FIXED quizzes')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })