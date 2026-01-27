import { PrismaClient } from '@prisma/client'
import { generateQuestion, generateColorToValueQuestion, generateValueToColorQuestion } from '../../lib/questionGenerator'
import { formatResistance, colorCodes } from '../../lib/resistorUtils'

const prisma = new PrismaClient()

// ================= WEAKNESS PATTERNS =================
const classWeaknessMap: { [key: string]: 'position1' | 'position2' | 'multiplier' | 'tolerance' } = {
  'Electrical Basic Sec 1 2569': 'position1',
  'Electrical Basic Sec 2 2569': 'multiplier',
  'Electrical Basic Sec 1/2568': 'tolerance',
  'Electrical Basic Sec 2/2568': 'position2',
}

// Color confusion patterns for each weakness type
const colorConfusion: {
  position1: { [key: string]: string }
  position2: { [key: string]: string }
  multiplier: { [key: string]: string }
  tolerance: { [key: string]: string }
} = {
  position1: { brown: 'red', red: 'orange', orange: 'yellow' },
  position2: { black: 'brown', brown: 'red', red: 'orange' },
  multiplier: { red: 'orange', orange: 'yellow', yellow: 'green' },
  tolerance: { gold: 'silver', silver: 'gold' },
}

// ================= HELPER FUNCTIONS =================

/**
 * Create wrong answer based on weakness pattern
 */
function createWrongAnswer(
  correctBands: string[],
  correctAnswer: string,
  weaknessPattern: 'position1' | 'position2' | 'multiplier' | 'tolerance',
  answerType: string,
  is5Band: boolean
): { userBands: string[]; userAnswer: string } {
  const userBands = [...correctBands]
  let userAnswer = correctAnswer

  if (weaknessPattern === 'position1') {
    const wrongColor = colorConfusion.position1[correctBands[0]] || 'red'
    userBands[0] = wrongColor
  } else if (weaknessPattern === 'position2') {
    const wrongColor = colorConfusion.position2[correctBands[1]] || 'brown'
    userBands[1] = wrongColor
  } else if (weaknessPattern === 'multiplier') {
    const multiplierIndex = is5Band ? 3 : 2
    const wrongColor = colorConfusion.multiplier[correctBands[multiplierIndex]] || 'orange'
    userBands[multiplierIndex] = wrongColor
  } else if (weaknessPattern === 'tolerance') {
    const toleranceIndex = is5Band ? 4 : 3
    const wrongColor = colorConfusion.tolerance[correctBands[toleranceIndex]] || 'silver'
    userBands[toleranceIndex] = wrongColor
  }

  // Recalculate userAnswer based on changed bands
  if (answerType === 'color_selection' || (answerType === 'color_reading' && userBands.length > 0)) {
    userAnswer = userBands.join('-')
  } else {
    // For multiple_choice or fill_in, calculate new value
    const value = is5Band
      ? `${colorCodes.digit[userBands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[userBands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[userBands[2] as keyof typeof colorCodes.digit]}`
      : `${colorCodes.digit[userBands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[userBands[1] as keyof typeof colorCodes.digit]}`
    const multiplier = colorCodes.multiplier[userBands[is5Band ? 3 : 2] as keyof typeof colorCodes.multiplier]
    const tolerance = colorCodes.tolerance[userBands[is5Band ? 4 : 3] as keyof typeof colorCodes.tolerance]
    const resistorValue = parseInt(value) * multiplier
    userAnswer = formatResistance(resistorValue, tolerance)
  }

  return { userBands, userAnswer }
}

/**
 * Generate question history with answers based on weakness pattern
 */
function generateQuestionHistory(
  totalQuestions: number,
  correctAnswers: number,
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  answerType: string,
  weaknessPattern: 'position1' | 'position2' | 'multiplier' | 'tolerance',
  quizSettings: any
): any[] {
  const questions: any[] = []
  const is5Band = resistorType === 'FIVE_BAND'
  const isColorReading = answerType === 'color_reading'
  const colorReadingMode = quizSettings?.colorReadingMode

  for (let i = 0; i < totalQuestions; i++) {
    const isCorrect = i < correctAnswers
    let question: any
    let correctBands: string[] = []
    let correctAnswer = ''
    let userAnswer = ''
    let userBands: string[] = []

    // Generate question based on answer type
    if (isColorReading && colorReadingMode === 'value_to_color_full') {
      const q = generateValueToColorQuestion(resistorType)
      correctBands = q.correctBands || []
      correctAnswer = q.correctAnswer
      question = {
        bands: q.bands || [],
        correctAnswer: q.correctAnswer,
        correctBands: q.correctBands || [],
        options: q.options || [],
        explanation: q.explanation,
        resistorType,
        answerType: 'color_reading',
        colorReadingMode: 'value_to_color_full',
        resistorValue: q.resistorValue,
        tolerance: q.tolerance,
      }
    } else if (isColorReading && colorReadingMode === 'color_to_value') {
      const q = generateColorToValueQuestion(resistorType, quizSettings?.optionCount || 4, quizSettings?.difficulty || 'medium')
      correctBands = q.bands
      correctAnswer = q.correctAnswer
      question = {
        bands: q.bands,
        correctAnswer: q.correctAnswer,
        options: q.options || [],
        explanation: q.explanation,
        resistorType,
        answerType: 'color_reading',
        colorReadingMode: 'color_to_value',
        resistorValue: q.resistorValue,
        tolerance: q.tolerance,
      }
    } else {
      const isReverse = answerType === 'color_selection'
      const q = generateQuestion(resistorType, isReverse, quizSettings?.optionCount || 4, quizSettings?.difficulty || 'medium')
      correctBands = isReverse ? (q.correctBands || []) : q.bands
      correctAnswer = q.correctAnswer
      question = {
        bands: isReverse ? [] : q.bands,
        correctAnswer: q.correctAnswer,
        correctBands: isReverse ? (q.correctBands || []) : q.bands,
        options: q.options || [],
        explanation: q.explanation,
        resistorType,
        answerType,
        resistorValue: q.resistorValue,
        tolerance: q.tolerance,
      }
    }

    // Generate user answer
    if (isCorrect) {
      userAnswer = correctAnswer
      userBands = [...correctBands]
    } else {
      // Apply weakness pattern with some variation (80% use main pattern, 20% use random)
      const useMainPattern = Math.random() < 0.8
      if (useMainPattern) {
        const wrong = createWrongAnswer(correctBands, correctAnswer, weaknessPattern, answerType, is5Band)
        userBands = wrong.userBands
        userAnswer = wrong.userAnswer
      } else {
        // Random error for variation
        const randomBandIndex = Math.floor(Math.random() * correctBands.length)
        const allColors = Object.keys(colorCodes.digit).concat(Object.keys(colorCodes.multiplier), Object.keys(colorCodes.tolerance))
        const wrongColor = allColors[Math.floor(Math.random() * allColors.length)]
        userBands = [...correctBands]
        userBands[randomBandIndex] = wrongColor

        if (answerType === 'color_selection' || answerType === 'color_reading') {
          userAnswer = userBands.join('-')
        } else {
          // Recalculate
          const value = is5Band
            ? `${colorCodes.digit[userBands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[userBands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[userBands[2] as keyof typeof colorCodes.digit]}`
            : `${colorCodes.digit[userBands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[userBands[1] as keyof typeof colorCodes.digit]}`
          const multiplier = colorCodes.multiplier[userBands[is5Band ? 3 : 2] as keyof typeof colorCodes.multiplier]
          const tolerance = colorCodes.tolerance[userBands[is5Band ? 4 : 3] as keyof typeof colorCodes.tolerance]
          const resistorValue = parseInt(value) * multiplier
          userAnswer = formatResistance(resistorValue, tolerance)
        }
      }
    }

    // Determine if answer is correct
    let isCorrectAnswer = false
    if (answerType === 'color_selection' || (answerType === 'color_reading' && colorReadingMode !== 'color_to_value')) {
      isCorrectAnswer = JSON.stringify(userBands) === JSON.stringify(correctBands)
    } else {
      isCorrectAnswer = userAnswer === correctAnswer
    }
    
    // Ensure isCorrectAnswer matches isCorrect flag (for data consistency)
    // If they don't match, adjust userAnswer to match the flag
    if (isCorrect !== isCorrectAnswer) {
      if (isCorrect) {
        // Should be correct but isn't - fix it
        userAnswer = correctAnswer
        userBands = [...correctBands]
        isCorrectAnswer = true
      } else {
        // Should be incorrect but is correct - ensure it's wrong
        // This shouldn't happen often, but if it does, we already have wrong answer
        isCorrectAnswer = false
      }
    }

    questions.push({
      ...question,
      userAnswer,
      userBands: (answerType === 'color_selection' || answerType === 'color_reading') ? userBands : undefined,
      isCorrect: isCorrectAnswer,
    })
  }

  return questions
}

// ================= MAIN FUNCTION =================

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

  let totalAttempts = 0

  // ================= LOOP THROUGH EACH COURSE =================
  for (const course of courses) {
    const weaknessPattern = classWeaknessMap[course.name]
    if (!weaknessPattern) {
      console.log(`⚠️ ไม่พบ weakness pattern สำหรับ ${course.name}, ข้ามไป`)
      continue
    }

    console.log(`\n📚 Processing course: ${course.name} (weakness: ${weaknessPattern})`)

    // ================= GET ENROLLED STUDENTS =================
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: { user: true },
    })

    if (enrollments.length === 0) {
      console.log(`⚠️ ไม่พบนักเรียนใน ${course.name}, ข้ามไป`)
      continue
    }

    console.log(`   👥 Found ${enrollments.length} students`)

    // ================= GET ASSIGNMENTS =================
    const assignments = await prisma.courseAssignment.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
    })

    if (assignments.length === 0) {
      console.log(`⚠️ ไม่พบ assignment ใน ${course.name}, ข้ามไป`)
      continue
    }

    console.log(`   📝 Found ${assignments.length} assignments`)

    // ================= CREATE ATTEMPTS =================
    for (const enrollment of enrollments) {
      for (const assignment of assignments) {
        // Skip if assignment doesn't have quizSettings
        if (!assignment.quizSettings || typeof assignment.quizSettings !== 'object') {
          continue
        }

        const quizSettings = assignment.quizSettings as any
        const totalQuestions = quizSettings.totalQuestions || 10
        const resistorType = quizSettings.resistorType || 'FOUR_BAND'
        const answerType = quizSettings.answerType || 'multiple_choice'

        // Random percentage between 50-90%
        const percentage = Math.random() * 40 + 50
        const correctAnswers = Math.round((percentage / 100) * totalQuestions)
        const score = correctAnswers
        const passed = percentage >= (assignment.passThreshold || 50)

        // Generate questions with answers
        const questions = generateQuestionHistory(
          totalQuestions,
          correctAnswers,
          resistorType,
          answerType,
          weaknessPattern,
          quizSettings
        )

        // Random time taken (300-1800 seconds = 5-30 minutes)
        const timeTaken = Math.floor(Math.random() * 1500) + 300

        // Random completedAt within course date range
        const courseStart = course.startDate
        const courseEnd = course.endDate || new Date()
        const timeRange = courseEnd.getTime() - courseStart.getTime()
        const randomTime = courseStart.getTime() + Math.random() * timeRange
        const completedAt = new Date(randomTime)

        // Create LevelAttempt
        await prisma.levelAttempt.create({
          data: {
            userId: enrollment.userId,
            courseId: course.id,
            assignmentId: assignment.id,
            assignmentType: assignment.assignmentType || 'CUSTOM_QUIZ',
            levelId: assignment.levelId,
            mode: 'QUIZ',
            score,
            percentage: Math.round(percentage * 100) / 100,
            timeTaken,
            passed,
            questions: questions as any,
            completedAt,
          },
        })

        totalAttempts++
      }
    }

    console.log(`   ✅ Created attempts for ${course.name}`)
  }

  console.log(`\n✅ Seed answer completed: ${totalAttempts} attempts created`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
