import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { formatSessionName } from '../lib/practiceSessionUtils';
import type { PracticeSessionSettings } from '../types/practiceSession';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

/**
 * Generate a random date within the last N days
 */
function getRandomDateInRange(daysAgo: number): Date {
  const now = new Date();
  const daysBack = Math.floor(Math.random() * daysAgo);
  const hoursBack = Math.floor(Math.random() * 24);
  const minutesBack = Math.floor(Math.random() * 60);
  
  const date = new Date(now);
  date.setDate(date.getDate() - daysBack);
  date.setHours(now.getHours() - hoursBack);
  date.setMinutes(now.getMinutes() - minutesBack);
  
  return date;
}

/**
 * Generate question history for a practice session
 */
function generateQuestionHistory(
  totalQuestions: number,
  correctAnswers: number,
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  answerType: string
): any[] {
  const questions: any[] = [];
  const incorrectAnswers = totalQuestions - correctAnswers;
  
  for (let i = 0; i < totalQuestions; i++) {
    const isCorrect = i < correctAnswers;
    const bands = resistorType === 'FOUR_BAND' 
      ? ['brown', 'black', 'red', 'gold']
      : ['brown', 'black', 'black', 'red', 'brown'];
    
    questions.push({
      questionNumber: i + 1,
      bands,
      correctAnswer: '1000 Ω',
      userAnswer: isCorrect ? '1000 Ω' : '2200 Ω',
      isCorrect,
      explanation: isCorrect ? 'ถูกต้อง!' : 'คำตอบที่ถูกต้องคือ 1000 Ω',
      timeSpent: Math.floor(Math.random() * 30) + 10,
    });
  }
  
  return questions;
}

/**
 * Create demo user with comprehensive self-learning data
 */
async function main() {
  console.log('🌱 Starting demo user seed...');

  // 1. Get or create demo user
  console.log('📝 Creating demo user...');
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@resilearn.com' },
    update: {
      name: 'Demo Student',
      password: hashedPassword,
      role: 'STUDENT',
      currentLevel: 1,
      levelsUnlocked: [1],
    },
    create: {
      email: 'demo@resilearn.com',
      name: 'Demo Student',
      password: hashedPassword,
      role: 'STUDENT',
      currentLevel: 1,
      levelsUnlocked: [1],
    },
  });

  console.log(`✅ Demo user created: ${demoUser.email} (ID: ${demoUser.id})`);

  // 2. Get Module 1 and its lessons
  const module1 = await prisma.module.findFirst({
    where: { order: 1 },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!module1) {
    console.error('❌ Module 1 not found! Please run main seed first.');
    process.exit(1);
  }

  const lessons = module1.lessons;
  if (lessons.length < 4) {
    console.error('❌ Module 1 should have at least 4 lessons! Please run main seed first.');
    process.exit(1);
  }

  // 3. Create Lesson Progress (3 completed, 1 in progress)
  console.log('📚 Creating lesson progress...');
  
  // Delete existing progress for demo user (all progress, we'll recreate)
  await prisma.lessonProgress.deleteMany({
    where: {
      userId: demoUser.id,
    },
  });

  const completedLessons = lessons.slice(0, 3);
  const inProgressLesson = lessons[3];

  for (const lesson of completedLessons) {
    try {
      await prisma.lessonProgress.create({
        data: {
          userId: demoUser.id,
          lessonId: lesson.id,
          courseId: null, // Self-learning
          completed: true,
          completedAt: getRandomDateInRange(20),
        } as any, // Type assertion needed for courseId: null
      });
      console.log(`  ✅ Completed: ${lesson.title}`);
    } catch (error: any) {
      // If courseId column doesn't exist (P2022), create without it
      if (error.code === 'P2022' || error.message?.includes('course_id')) {
        const id = `demo_lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await prisma.$executeRaw`
          INSERT INTO "LessonProgress" (id, user_id, lesson_id, completed, completed_at)
          VALUES (${id}, ${demoUser.id}, ${lesson.id}, true, ${getRandomDateInRange(20)})
        `;
        console.log(`  ✅ Completed: ${lesson.title} (without courseId)`);
      } else {
        throw error;
      }
    }
  }

  // In progress lesson (not completed)
  try {
    await prisma.lessonProgress.create({
      data: {
        userId: demoUser.id,
        lessonId: inProgressLesson.id,
        courseId: null, // Self-learning
        completed: false,
        completedAt: null,
      } as any, // Type assertion needed for courseId: null
    });
    console.log(`  ⏳ In Progress: ${inProgressLesson.title}`);
  } catch (error: any) {
    // If courseId column doesn't exist (P2022), create without it
    if (error.code === 'P2022' || error.message?.includes('course_id')) {
      const id = `demo_lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await prisma.$executeRaw`
        INSERT INTO "LessonProgress" (id, user_id, lesson_id, completed, completed_at)
        VALUES (${id}, ${demoUser.id}, ${inProgressLesson.id}, false, NULL)
      `;
      console.log(`  ⏳ In Progress: ${inProgressLesson.title} (without courseId)`);
    } else {
      throw error;
    }
  }

  // 4. Create Module Progress (75%)
  console.log('📊 Creating module progress...');
  
  // Delete existing module progress for demo user
  await prisma.moduleProgress.deleteMany({
    where: {
      userId: demoUser.id,
    },
  });

  try {
    await prisma.moduleProgress.create({
      data: {
        userId: demoUser.id,
        moduleId: module1.id,
        courseId: null, // Self-learning
        progress: 75, // 3/4 lessons = 75%
        completed: false,
      } as any, // Type assertion needed for courseId: null
    });
    console.log(`  ✅ Module progress: 75%`);
  } catch (error: any) {
    // If courseId column doesn't exist (P2022), create without it
    if (error.code === 'P2022' || error.message?.includes('course_id')) {
      const id = `demo_mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await prisma.$executeRaw`
        INSERT INTO "ModuleProgress" (id, user_id, module_id, progress, completed)
        VALUES (${id}, ${demoUser.id}, ${module1.id}, 75, false)
      `;
      console.log(`  ✅ Module progress: 75% (without courseId)`);
    } else {
      throw error;
    }
  }

  // 5. Create Practice Sessions
  console.log('🎯 Creating practice sessions...');
  
  // Delete existing sessions for demo user (self-learning only)
  const existingSessions = await prisma.practiceSession.findMany({
    where: {
      userId: demoUser.id,
    },
  });
  
  const selfLearningSessions = existingSessions.filter((s: any) => s.courseId === null);
  if (selfLearningSessions.length > 0) {
    await prisma.practiceSession.deleteMany({
      where: {
        id: {
          in: selfLearningSessions.map((s: any) => s.id),
        },
      },
    });
  }

  const sessions: any[] = [];

  // 5.1 Quick Practice Sessions - FOUR_BAND + multiple_choice (5 sessions)
  const quickFourBandMultipleChoice = [
    { accuracy: 60, totalQuestions: 10, totalTime: 300 },
    { accuracy: 70, totalQuestions: 15, totalTime: 450 },
    { accuracy: 75, totalQuestions: 20, totalTime: 600 },
    { accuracy: 80, totalQuestions: 15, totalTime: 400 },
    { accuracy: 85, totalQuestions: 20, totalTime: 550 },
  ];

  for (const config of quickFourBandMultipleChoice) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FOUR_BAND',
      answerType: 'multiple_choice',
      optionCount: 4,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const startedAt = getRandomDateInRange(30);
    const completedAt = new Date(startedAt.getTime() + config.totalTime * 1000);

    sessions.push({
      userId: demoUser.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.totalTime / config.totalQuestions,
      totalTime: config.totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FOUR_BAND', 'multiple_choice'),
      startedAt,
      completedAt,
    });
  }

  // 5.2 Quick Practice - FOUR_BAND + fill_in (2 sessions)
  const quickFourBandFillIn = [
    { accuracy: 65, totalQuestions: 10, totalTime: 400 },
    { accuracy: 75, totalQuestions: 15, totalTime: 500 },
  ];

  for (const config of quickFourBandFillIn) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FOUR_BAND',
      answerType: 'fill_in',
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const startedAt = getRandomDateInRange(30);
    const completedAt = new Date(startedAt.getTime() + config.totalTime * 1000);

    sessions.push({
      userId: demoUser.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.totalTime / config.totalQuestions,
      totalTime: config.totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FOUR_BAND', 'fill_in'),
      startedAt,
      completedAt,
    });
  }

  // 5.3 Quick Practice - FIVE_BAND + multiple_choice (3 sessions)
  const quickFiveBandMultipleChoice = [
    { accuracy: 55, totalQuestions: 10, totalTime: 350 },
    { accuracy: 70, totalQuestions: 15, totalTime: 480 },
    { accuracy: 80, totalQuestions: 20, totalTime: 620 },
  ];

  for (const config of quickFiveBandMultipleChoice) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FIVE_BAND',
      answerType: 'multiple_choice',
      optionCount: 4,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const startedAt = getRandomDateInRange(30);
    const completedAt = new Date(startedAt.getTime() + config.totalTime * 1000);

    sessions.push({
      userId: demoUser.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.totalTime / config.totalQuestions,
      totalTime: config.totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FIVE_BAND', 'multiple_choice'),
      startedAt,
      completedAt,
    });
  }

  // 5.4 Custom Practice Sessions
  const customSessions = [
    { resistorType: 'FOUR_BAND' as const, answerType: 'multiple_choice' as const, difficulty: 'easy' as const, accuracy: 70, totalQuestions: 12, totalTime: 360 },
    { resistorType: 'FOUR_BAND' as const, answerType: 'multiple_choice' as const, difficulty: 'easy' as const, accuracy: 75, totalQuestions: 15, totalTime: 450 },
    { resistorType: 'FOUR_BAND' as const, answerType: 'multiple_choice' as const, difficulty: 'medium' as const, accuracy: 65, totalQuestions: 15, totalTime: 480 },
    { resistorType: 'FOUR_BAND' as const, answerType: 'multiple_choice' as const, difficulty: 'medium' as const, accuracy: 80, totalQuestions: 18, totalTime: 540 },
    { resistorType: 'FOUR_BAND' as const, answerType: 'multiple_choice' as const, difficulty: 'hard' as const, accuracy: 60, totalQuestions: 20, totalTime: 600 },
    { resistorType: 'FIVE_BAND' as const, answerType: 'fill_in' as const, difficulty: 'medium' as const, accuracy: 70, totalQuestions: 12, totalTime: 420 },
    { resistorType: 'FOUR_BAND' as const, answerType: 'color_selection' as const, difficulty: 'medium' as const, accuracy: 75, totalQuestions: 10, totalTime: 380 },
  ];

  for (const config of customSessions) {
    const settings: PracticeSessionSettings = {
      resistorType: config.resistorType,
      answerType: config.answerType,
      difficulty: config.difficulty,
      optionCount: config.answerType === 'multiple_choice' ? 4 : undefined,
      totalQuestions: config.totalQuestions,
      countdownTime: null,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const startedAt = getRandomDateInRange(30);
    const completedAt = new Date(startedAt.getTime() + config.totalTime * 1000);

    sessions.push({
      userId: demoUser.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.totalTime / config.totalQuestions,
      totalTime: config.totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, config.resistorType, config.answerType),
      startedAt,
      completedAt,
    });
  }

  // 5.5 Color Reading Sessions
  const colorReadingSessions = [
    { 
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'value_to_color_band_by_band' as const,
      bandIndex: 0,
      accuracy: 80,
      totalQuestions: 10,
      totalTime: 300,
    },
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'color_to_value' as const,
      accuracy: 75,
      totalQuestions: 12,
      totalTime: 360,
    },
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FIVE_BAND' as const,
      colorReadingMode: 'value_to_color_full' as const,
      accuracy: 70,
      totalQuestions: 15,
      totalTime: 450,
    },
  ];

  for (const config of colorReadingSessions) {
    const settings: PracticeSessionSettings = {
      practiceMode: config.practiceMode,
      resistorType: config.resistorType,
      answerType: 'color_reading',
      colorReadingMode: config.colorReadingMode,
      bandIndex: config.bandIndex || null,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const startedAt = getRandomDateInRange(30);
    const completedAt = new Date(startedAt.getTime() + config.totalTime * 1000);

    sessions.push({
      userId: demoUser.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.totalTime / config.totalQuestions,
      totalTime: config.totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, config.resistorType, 'color_reading'),
      startedAt,
      completedAt,
    });
  }

  // Sort sessions by date (oldest first) for better progression
  sessions.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());

  // Create all sessions
  for (const session of sessions) {
    await prisma.practiceSession.create({
      data: session,
    });
  }

  console.log(`  ✅ Created ${sessions.length} practice sessions`);

  // Summary
  console.log('\n📊 Demo User Summary:');
  console.log(`  Email: demo@resilearn.com`);
  console.log(`  Password: demo123`);
  console.log(`  Lessons Completed: 3/4`);
  console.log(`  Module Progress: 75%`);
  console.log(`  Practice Sessions: ${sessions.length}`);
  console.log(`  Average Accuracy: ${Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)}%`);
  
  console.log('\n✅ Demo user seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
