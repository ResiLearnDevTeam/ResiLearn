import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * สุ่ม progress % (60-80% สำหรับส่วนใหญ่, 100% สำหรับบางคน)
 */
function getRandomProgress(): number {
  const isComplete = Math.random() < 0.12 // 12% จะได้ 100%
  if (isComplete) return 100
  return Math.floor(Math.random() * 21) + 60 // 60-80%
}

/**
 * สุ่มวันที่ระหว่าง startDate ถึง endDate
 */
function randomDateBetween(start: Date, end: Date): Date {
  const timeDiff = end.getTime() - start.getTime()
  if (timeDiff <= 0) return start
  const randomTime = Math.random() * timeDiff
  return new Date(start.getTime() + randomTime)
}

async function main() {
  console.log('🚀 เริ่ม seed module progress...')

  // 1. ดึง enrollments
  const enrollments = await prisma.enrollment.findMany({
    include: { course: true },
    orderBy: { enrolledAt: 'asc' },
  })

  if (enrollments.length === 0) {
    console.log('⚠️ ไม่พบ enrollments')
    return
  }

  console.log(`📚 พบ ${enrollments.length} enrollments`)

  // 2. ดึง modules และ lessons
  const modules = await prisma.module.findMany({
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  })

  if (modules.length === 0) {
    console.log('⚠️ ไม่พบ modules')
    return
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  console.log(`📖 พบ ${modules.length} modules, ${totalLessons} lessons ทั้งหมด`)

  if (totalLessons === 0) {
    console.log('⚠️ ไม่พบ lessons')
    return
  }

  // 3. สำหรับแต่ละ enrollment
  let completedCount = 0
  let partialCount = 0

  for (const enrollment of enrollments) {
    const targetProgress = getRandomProgress()
    const targetCompletedLessons = Math.floor((targetProgress / 100) * totalLessons)

    if (targetProgress === 100) {
      completedCount++
    } else {
      partialCount++
    }

    // 4. เลือก lessons ที่ควร completed (ตามลำดับ)
    const lessonsToComplete: typeof modules[0]['lessons'][0][] = []
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (lessonsToComplete.length < targetCompletedLessons) {
          lessonsToComplete.push(lesson)
        }
      }
    }

    // 5. สร้าง LessonProgress records
    for (const lesson of lessonsToComplete) {
      const completedAt = randomDateBetween(enrollment.enrolledAt, new Date())

      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId_courseId: {
            userId: enrollment.userId,
            lessonId: lesson.id,
            courseId: enrollment.courseId,
          },
        },
        create: {
          userId: enrollment.userId,
          lessonId: lesson.id,
          courseId: enrollment.courseId,
          completed: true,
          completedAt,
        },
        update: {
          completed: true,
          completedAt,
        },
      })
    }

    // 6. สร้าง ModuleProgress records
    for (const module of modules) {
      const moduleLessons = lessonsToComplete.filter((l) =>
        module.lessons.some((ml) => ml.id === l.id)
      )
      const moduleProgress =
        module.lessons.length > 0
          ? Math.round((moduleLessons.length / module.lessons.length) * 100)
          : 0
      const moduleCompleted =
        moduleLessons.length === module.lessons.length && module.lessons.length > 0

      await prisma.moduleProgress.upsert({
        where: {
          userId_moduleId_courseId: {
            userId: enrollment.userId,
            moduleId: module.id,
            courseId: enrollment.courseId,
          },
        },
        create: {
          userId: enrollment.userId,
          moduleId: module.id,
          courseId: enrollment.courseId,
          progress: moduleProgress,
          completed: moduleCompleted,
        },
        update: {
          progress: moduleProgress,
          completed: moduleCompleted,
        },
      })
    }

    // 7. อัพเดท enrollment.progress
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress: targetProgress },
    })
  }

  console.log(`✅ Seed module progress completed`)
  console.log(`   - ${completedCount} enrollments ที่ progress 100%`)
  console.log(`   - ${partialCount} enrollments ที่ progress 60-80%`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
