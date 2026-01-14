/**
 * Script to fix courseId in existing database records
 * This ensures all self-learning records have courseId explicitly set to null
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCourseId() {
  try {
    console.log('Starting to fix courseId for self-learning records...');

    // Fix PracticeSession records
    const practiceSessions = await prisma.practiceSession.findMany({
      where: {
        OR: [
          { courseId: null },
          { courseId: { equals: null } }
        ]
      }
    });

    console.log(`Found ${practiceSessions.length} practice sessions with null courseId`);

    // Update all practice sessions where courseId is null or undefined
    const practiceSessionResult = await prisma.$executeRaw`
      UPDATE "PracticeSession"
      SET "course_id" = NULL
      WHERE "course_id" IS NULL
    `;

    console.log(`Updated ${practiceSessionResult} practice sessions`);

    // Fix LessonProgress records
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        OR: [
          { courseId: null },
          { courseId: { equals: null } }
        ]
      }
    });

    console.log(`Found ${lessonProgress.length} lesson progress records with null courseId`);

    const lessonProgressResult = await prisma.$executeRaw`
      UPDATE "LessonProgress"
      SET "course_id" = NULL
      WHERE "course_id" IS NULL
    `;

    console.log(`Updated ${lessonProgressResult} lesson progress records`);

    // Fix ModuleProgress records
    const moduleProgress = await prisma.moduleProgress.findMany({
      where: {
        OR: [
          { courseId: null },
          { courseId: { equals: null } }
        ]
      }
    });

    console.log(`Found ${moduleProgress.length} module progress records with null courseId`);

    const moduleProgressResult = await prisma.$executeRaw`
      UPDATE "ModuleProgress"
      SET "course_id" = NULL
      WHERE "course_id" IS NULL
    `;

    console.log(`Updated ${moduleProgressResult} module progress records`);

    console.log('✅ All courseId fixes completed!');
  } catch (error) {
    console.error('Error fixing courseId:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixCourseId();
