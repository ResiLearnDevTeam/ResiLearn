import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { formatSessionName } from '../lib/practiceSessionUtils';
import type { PracticeSessionSettings } from '../types/practiceSession';
import { colorCodes, formatResistance } from '../lib/resistorUtils';

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
 * Generate question history for a practice session with detailed metadata
 */
function generateQuestionHistory(
  totalQuestions: number,
  correctAnswers: number,
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  answerType: string,
  questionType?: string,
  difficulty?: string,
  colorReadingMode?: string,
  bandIndex?: number | null,
  createWeakness?: {
    position?: 'position1' | 'position2' | 'position3' | 'multiplier' | 'tolerance';
    colorConfusion?: { correct: string; wrong: string };
  }
): any[] {
  const questions: any[] = [];
  const incorrectAnswers = totalQuestions - correctAnswers;
  const is5Band = resistorType === 'FIVE_BAND';
  
  // Common resistor values for variety
  const commonValues = [
    { bands: ['brown', 'black', 'red', 'gold'], value: 1000, tolerance: '±5%' },
    { bands: ['brown', 'black', 'orange', 'gold'], value: 10000, tolerance: '±5%' },
    { bands: ['red', 'red', 'red', 'gold'], value: 2200, tolerance: '±5%' },
    { bands: ['yellow', 'violet', 'orange', 'gold'], value: 47000, tolerance: '±5%' },
    { bands: ['brown', 'black', 'yellow', 'gold'], value: 100000, tolerance: '±5%' },
    { bands: ['orange', 'orange', 'orange', 'gold'], value: 33000, tolerance: '±5%' },
    { bands: ['green', 'blue', 'brown', 'gold'], value: 560, tolerance: '±5%' },
    { bands: ['violet', 'green', 'black', 'gold'], value: 75, tolerance: '±5%' },
  ];
  
  const fiveBandValues = [
    { bands: ['brown', 'black', 'black', 'red', 'brown'], value: 10000, tolerance: '±1%' },
    { bands: ['red', 'orange', 'violet', 'black', 'brown'], value: 237, tolerance: '±1%' },
    { bands: ['brown', 'black', 'black', 'orange', 'brown'], value: 100000, tolerance: '±1%' },
    { bands: ['brown', 'black', 'brown', 'red', 'brown'], value: 10100, tolerance: '±1%' },
    { bands: ['red', 'red', 'black', 'brown', 'brown'], value: 220, tolerance: '±1%' },
  ];
  
  const values = resistorType === 'FOUR_BAND' ? commonValues : fiveBandValues;
  
  // Color confusion patterns
  const colorConfusionMap: { [key: string]: string[] } = {
    'brown': ['red', 'orange'],
    'red': ['brown', 'orange'],
    'orange': ['red', 'yellow'],
    'yellow': ['orange', 'green'],
    'green': ['blue', 'yellow'],
    'blue': ['green', 'violet'],
    'violet': ['blue', 'gray'],
  };
  
  for (let i = 0; i < totalQuestions; i++) {
    const isCorrect = i < correctAnswers;
    const valueSet = values[Math.floor(Math.random() * values.length)];
    const correctAnswer = formatResistance(valueSet.value, valueSet.tolerance);
    const correctBands = [...valueSet.bands];
    let userBands = [...valueSet.bands];
    let userAnswer = correctAnswer;
    
    // Generate digit positions
    const digitPositions: any = {};
    if (is5Band) {
      digitPositions.position1 = { correct: correctBands[0], user: correctBands[0] };
      digitPositions.position2 = { correct: correctBands[1], user: correctBands[1] };
      digitPositions.position3 = { correct: correctBands[2], user: correctBands[2] };
      digitPositions.multiplier = { correct: correctBands[3], user: correctBands[3] };
      digitPositions.tolerance = { correct: correctBands[4], user: correctBands[4] };
    } else {
      digitPositions.position1 = { correct: correctBands[0], user: correctBands[0] };
      digitPositions.position2 = { correct: correctBands[1], user: correctBands[1] };
      digitPositions.multiplier = { correct: correctBands[2], user: correctBands[2] };
      digitPositions.tolerance = { correct: correctBands[3], user: correctBands[3] };
    }
    
    // Generate wrong answer if incorrect
    if (!isCorrect) {
      if (createWeakness?.position) {
        // Create specific position error
        const pos = createWeakness.position;
        if (pos === 'position1') {
          const wrongColor = colorConfusionMap[correctBands[0]]?.[0] || 'red';
          userBands[0] = wrongColor;
          digitPositions.position1.user = wrongColor;
        } else if (pos === 'position2') {
          const wrongColor = colorConfusionMap[correctBands[1]]?.[0] || 'brown';
          userBands[1] = wrongColor;
          digitPositions.position2.user = wrongColor;
        } else if (pos === 'position3' && is5Band) {
          const wrongColor = colorConfusionMap[correctBands[2]]?.[0] || 'black';
          userBands[2] = wrongColor;
          digitPositions.position3.user = wrongColor;
        } else if (pos === 'multiplier') {
          const multiplierIndex = is5Band ? 3 : 2;
          const wrongMultiplier = correctBands[multiplierIndex] === 'red' ? 'orange' : 
                                 correctBands[multiplierIndex] === 'orange' ? 'yellow' : 'red';
          userBands[multiplierIndex] = wrongMultiplier;
          digitPositions.multiplier.user = wrongMultiplier;
        } else if (pos === 'tolerance') {
          const toleranceIndex = is5Band ? 4 : 3;
          const wrongTolerance = correctBands[toleranceIndex] === 'gold' ? 'silver' : 'gold';
          userBands[toleranceIndex] = wrongTolerance;
          digitPositions.tolerance.user = wrongTolerance;
        }
      } else if (createWeakness?.colorConfusion) {
        // Create color confusion error
        const { correct, wrong } = createWeakness.colorConfusion;
        const bandIndex = correctBands.indexOf(correct);
        if (bandIndex >= 0) {
          userBands[bandIndex] = wrong;
          if (bandIndex === 0) digitPositions.position1.user = wrong;
          else if (bandIndex === 1) digitPositions.position2.user = wrong;
          else if (bandIndex === 2 && is5Band) digitPositions.position3.user = wrong;
          else if (bandIndex === (is5Band ? 3 : 2)) digitPositions.multiplier.user = wrong;
          else if (bandIndex === (is5Band ? 4 : 3)) digitPositions.tolerance.user = wrong;
        }
      } else {
        // Random error
        const wrongValue = valueSet.value * (1 + (Math.random() - 0.5) * 0.3);
        userAnswer = formatResistance(wrongValue, valueSet.tolerance);
        // Randomly change one band
        const randomBandIndex = Math.floor(Math.random() * correctBands.length);
        const wrongColor = colorConfusionMap[correctBands[randomBandIndex]]?.[0] || 'red';
        userBands[randomBandIndex] = wrongColor;
        if (randomBandIndex === 0) digitPositions.position1.user = wrongColor;
        else if (randomBandIndex === 1) digitPositions.position2.user = wrongColor;
        else if (randomBandIndex === 2 && is5Band) digitPositions.position3.user = wrongColor;
        else if (randomBandIndex === (is5Band ? 3 : 2)) digitPositions.multiplier.user = wrongColor;
        else if (randomBandIndex === (is5Band ? 4 : 3)) digitPositions.tolerance.user = wrongColor;
      }
      
      // For color_selection mode, userAnswer should be the bands
      if (answerType === 'color_selection') {
        userAnswer = userBands.join(',');
      }
    }
    
    // Determine question type
    const finalQuestionType = questionType || 
      (colorReadingMode === 'color_to_value' ? 'color_to_value' :
       colorReadingMode === 'value_to_color_full' ? 'value_to_color_full' :
       colorReadingMode === 'value_to_color_band_by_band' ? 'value_to_color_band_by_band' :
       'normal');
    
    questions.push({
      questionNumber: i + 1,
      bands: correctBands,
      correctAnswer,
      userAnswer,
      isCorrect,
      explanation: isCorrect ? 'ถูกต้อง!' : `คำตอบที่ถูกต้องคือ ${correctAnswer}`,
      timeSpent: Math.floor(Math.random() * 30) + 10,
      // Metadata
      questionType: finalQuestionType,
      resistorType,
      answerType,
      difficulty,
      colorReadingMode,
      bandIndex: bandIndex !== null && bandIndex !== undefined ? bandIndex : null,
      digitPositions,
      correctBands,
      userBands: answerType === 'color_selection' ? userBands : undefined,
      resistorValue: valueSet.value,
      correctTolerance: valueSet.tolerance,
      userTolerance: !isCorrect && digitPositions.tolerance ? digitPositions.tolerance.user : valueSet.tolerance,
    });
  }
  
  return questions;
}

/**
 * Generate level attempt questions
 */
function generateLevelAttemptQuestions(
  questionCount: number,
  accuracy: number,
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  levelNumber: number
): any[] {
  const questions: any[] = [];
  const correctCount = Math.round((accuracy / 100) * questionCount);
  
  const commonValues = [
    { bands: ['brown', 'black', 'red', 'gold'], value: 1000, tolerance: '±5%' },
    { bands: ['red', 'red', 'red', 'gold'], value: 2200, tolerance: '±5%' },
    { bands: ['orange', 'orange', 'orange', 'gold'], value: 33000, tolerance: '±5%' },
    { bands: ['yellow', 'violet', 'orange', 'gold'], value: 47000, tolerance: '±5%' },
    { bands: ['brown', 'black', 'yellow', 'gold'], value: 100000, tolerance: '±5%' },
  ];
  
  const fiveBandValues = [
    { bands: ['brown', 'black', 'black', 'red', 'brown'], value: 10000, tolerance: '±1%' },
    { bands: ['red', 'orange', 'violet', 'black', 'brown'], value: 237, tolerance: '±1%' },
    { bands: ['brown', 'black', 'black', 'orange', 'brown'], value: 100000, tolerance: '±1%' },
    { bands: ['brown', 'black', 'brown', 'red', 'brown'], value: 10100, tolerance: '±1%' },
  ];
  
  const values = resistorType === 'FOUR_BAND' ? commonValues : fiveBandValues;
  
  for (let i = 0; i < questionCount; i++) {
    const isCorrect = i < correctCount;
    const valueSet = values[Math.floor(Math.random() * values.length)];
    const correctAnswer = formatResistance(valueSet.value, valueSet.tolerance);
    
    let userAnswer = correctAnswer;
    if (!isCorrect) {
      const wrongValue = valueSet.value * (1 + (Math.random() - 0.5) * 0.3);
      userAnswer = formatResistance(wrongValue, valueSet.tolerance);
    }
    
    questions.push({
      bands: valueSet.bands,
      correctAnswer,
      userAnswer,
      isCorrect,
    });
  }
  
  return questions;
}

/**
 * Create user "กฤตนัย" with comprehensive self-learning data
 */
async function main() {
  console.log('🌱 Starting seed for user กฤตนัย...');

  // 1. Create user account
  console.log('📝 Creating user account...');
  const hashedPassword = await bcrypt.hash('12345678', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'krittanai@resilearn.com' },
    update: {
      name: 'กฤตนัย',
      password: hashedPassword,
      role: 'STUDENT',
      currentLevel: 3,
      levelsUnlocked: [1, 2, 3],
    },
    create: {
      email: 'krittanai@resilearn.com',
      name: 'กฤตนัย',
      password: hashedPassword,
      role: 'STUDENT',
      currentLevel: 3,
      levelsUnlocked: [1, 2, 3],
    },
  });

  console.log(`✅ User created: ${user.email} (ID: ${user.id})`);

  // 2. Get all modules
  const modules = await prisma.module.findMany({
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  if (modules.length < 3) {
    console.error('❌ Need at least 3 modules! Please run module seeds first.');
    process.exit(1);
  }

  const module1 = modules[0]; // The Color Code System
  const module2 = modules[1]; // ระบบ 4 แถบสี
  const module3 = modules[2]; // ระบบ 5 แถบสี

  // 3. Delete existing progress for this user
  console.log('🧹 Cleaning existing data...');
  await prisma.lessonProgress.deleteMany({ where: { userId: user.id } });
  await prisma.moduleProgress.deleteMany({ where: { userId: user.id } });
  await prisma.levelAttempt.deleteMany({ where: { userId: user.id, courseId: null } });
  await prisma.practiceSession.deleteMany({ where: { userId: user.id, courseId: null } });
  await prisma.practicePreset.deleteMany({ where: { userId: user.id } });

  // 4. Create Lesson Progress
  console.log('📚 Creating lesson progress...');
  
  // Module 1: All lessons completed
  for (const lesson of module1.lessons) {
    await prisma.lessonProgress.create({
      data: {
        userId: user.id,
        lessonId: lesson.id,
        courseId: null,
        completed: true,
        completedAt: getRandomDateInRange(50),
      } as any,
    });
    console.log(`  ✅ Completed: ${lesson.title}`);
  }

  // Module 2: All lessons completed (3 lessons)
  for (const lesson of module2.lessons) {
    await prisma.lessonProgress.create({
      data: {
        userId: user.id,
        lessonId: lesson.id,
        courseId: null,
        completed: true,
        completedAt: getRandomDateInRange(40),
      } as any,
    });
    console.log(`  ✅ Completed: ${lesson.title}`);
  }

  // Module 3: First lesson completed, second in progress
  if (module3.lessons.length > 0) {
    // Lesson 3.1: completed
    await prisma.lessonProgress.create({
      data: {
        userId: user.id,
        lessonId: module3.lessons[0].id,
        courseId: null,
        completed: true,
        completedAt: getRandomDateInRange(20),
      } as any,
    });
    console.log(`  ✅ Completed: ${module3.lessons[0].title}`);

    // Lesson 3.2: in progress (not completed)
    if (module3.lessons.length > 1) {
      await prisma.lessonProgress.create({
        data: {
          userId: user.id,
          lessonId: module3.lessons[1].id,
          courseId: null,
          completed: false,
          completedAt: null,
        } as any,
      });
      console.log(`  ⏳ In Progress: ${module3.lessons[1].title}`);
    }
  }

  // 5. Create Module Progress
  console.log('📊 Creating module progress...');
  
  // Module 1: 100% completed
  const module1Progress = (module1.lessons.filter((_, i) => i < module1.lessons.length).length / module1.lessons.length) * 100;
  await prisma.moduleProgress.create({
    data: {
      userId: user.id,
      moduleId: module1.id,
      courseId: null,
      progress: 100,
      completed: true,
    } as any,
  });
  console.log(`  ✅ Module 1: 100%`);

  // Module 2: 80% (assuming 3/4 or similar)
  const module2Completed = module2.lessons.length;
  const module2Progress = (module2Completed / module2.lessons.length) * 100;
  await prisma.moduleProgress.create({
    data: {
      userId: user.id,
      moduleId: module2.id,
      courseId: null,
      progress: Math.round(module2Progress),
      completed: false,
    } as any,
  });
  console.log(`  ✅ Module 2: ${Math.round(module2Progress)}%`);

  // Module 3: 40% (1/3 lessons completed)
  const module3Completed = 1;
  const module3Progress = (module3Completed / module3.lessons.length) * 100;
  await prisma.moduleProgress.create({
    data: {
      userId: user.id,
      moduleId: module3.id,
      courseId: null,
      progress: Math.round(module3Progress),
      completed: false,
    } as any,
  });
  console.log(`  ✅ Module 3: ${Math.round(module3Progress)}%`);

  // 6. Get levels
  console.log('🎯 Creating level attempts...');
  const levels = await prisma.level.findMany({
    where: { number: { in: [1, 2, 3] } },
    orderBy: { number: 'asc' },
  });

  if (levels.length < 3) {
    console.warn('⚠️  Warning: Not all levels found. Creating attempts for available levels.');
  }

  // Level 1: 3 attempts (improving)
  const level1 = levels.find(l => l.number === 1);
  if (level1) {
    const attempts1 = [
      { accuracy: 60, passed: false, daysAgo: 45 },
      { accuracy: 75, passed: false, daysAgo: 40 },
      { accuracy: 85, passed: true, daysAgo: 35 },
    ];

    for (const attempt of attempts1) {
      const questions = generateLevelAttemptQuestions(
        level1.questionCount,
        attempt.accuracy,
        level1.type,
        level1.number
      );
      const timeTaken = Math.floor(Math.random() * 300) + 180; // 3-8 minutes
      
      await prisma.levelAttempt.create({
        data: {
          userId: user.id,
          levelId: level1.id,
          courseId: null,
          mode: 'QUIZ',
          score: Math.round((attempt.accuracy / 100) * level1.questionCount),
          percentage: attempt.accuracy,
          timeTaken,
          passed: attempt.passed,
          questions,
          completedAt: getRandomDateInRange(attempt.daysAgo),
        } as any,
      });
    }
    console.log(`  ✅ Level 1: 3 attempts`);
  }

  // Level 2: 2 attempts
  const level2 = levels.find(l => l.number === 2);
  if (level2) {
    const attempts2 = [
      { accuracy: 70, passed: false, daysAgo: 30 },
      { accuracy: 90, passed: true, daysAgo: 25 },
    ];

    for (const attempt of attempts2) {
      const questions = generateLevelAttemptQuestions(
        level2.questionCount,
        attempt.accuracy,
        level2.type,
        level2.number
      );
      const timeTaken = Math.floor(Math.random() * 300) + 180;
      
      await prisma.levelAttempt.create({
        data: {
          userId: user.id,
          levelId: level2.id,
          courseId: null,
          mode: 'QUIZ',
          score: Math.round((attempt.accuracy / 100) * level2.questionCount),
          percentage: attempt.accuracy,
          timeTaken,
          passed: attempt.passed,
          questions,
          completedAt: getRandomDateInRange(attempt.daysAgo),
        } as any,
      });
    }
    console.log(`  ✅ Level 2: 2 attempts`);
  }

  // Level 3: 1 attempt
  const level3 = levels.find(l => l.number === 3);
  if (level3) {
    const questions = generateLevelAttemptQuestions(
      level3.questionCount,
      80,
      level3.type,
      level3.number
    );
    const timeTaken = Math.floor(Math.random() * 300) + 180;
    
    await prisma.levelAttempt.create({
      data: {
        userId: user.id,
        levelId: level3.id,
        courseId: null,
        mode: 'QUIZ',
        score: Math.round((80 / 100) * level3.questionCount),
        percentage: 80,
        timeTaken,
        passed: true,
        questions,
        completedAt: getRandomDateInRange(15),
      } as any,
    });
    console.log(`  ✅ Level 3: 1 attempt`);
  }

  // 7. Create Practice Sessions
  console.log('🎯 Creating practice sessions...');
  const sessions: any[] = [];

  // 7.1 Quick Practice - FOUR_BAND + multiple_choice (8 sessions, including weakness)
  const quickFourBandMultipleChoice = [
    { accuracy: 30, totalQuestions: 12, avgTimePerQ: 7.5, daysAgo: 58, weakness: { position: 'position1' as const } }, // Weakness
    { accuracy: 28, totalQuestions: 10, avgTimePerQ: 7.0, daysAgo: 55, weakness: { position: 'multiplier' as const } }, // Weakness
    { accuracy: 32, totalQuestions: 15, avgTimePerQ: 6.5, daysAgo: 52, weakness: { position: 'position1' as const } }, // Weakness
    { accuracy: 55, totalQuestions: 10, avgTimePerQ: 6.0, daysAgo: 48 },
    { accuracy: 60, totalQuestions: 12, avgTimePerQ: 5.5, daysAgo: 42 },
    { accuracy: 65, totalQuestions: 15, avgTimePerQ: 5.0, daysAgo: 36 },
    { accuracy: 70, totalQuestions: 15, avgTimePerQ: 4.5, daysAgo: 30 },
    { accuracy: 75, totalQuestions: 18, avgTimePerQ: 4.0, daysAgo: 24 },
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
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(
        config.totalQuestions, 
        correctAnswers, 
        'FOUR_BAND', 
        'multiple_choice',
        'normal',
        undefined,
        undefined,
        undefined,
        config.weakness
      ),
      startedAt,
      completedAt,
    });
  }

  // 7.2 Quick Practice - FOUR_BAND + fill_in (4-5 sessions)
  const quickFourBandFillIn = [
    { accuracy: 65, totalQuestions: 10, avgTimePerQ: 5.5, daysAgo: 46 },
    { accuracy: 70, totalQuestions: 12, avgTimePerQ: 5.0, daysAgo: 40 },
    { accuracy: 72, totalQuestions: 15, avgTimePerQ: 4.8, daysAgo: 34 },
    { accuracy: 75, totalQuestions: 15, avgTimePerQ: 4.5, daysAgo: 26 },
    { accuracy: 78, totalQuestions: 18, avgTimePerQ: 4.2, daysAgo: 20 },
  ];

  for (const config of quickFourBandFillIn) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FOUR_BAND',
      answerType: 'fill_in',
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FOUR_BAND', 'fill_in', 'normal'),
      startedAt,
      completedAt,
    });
  }

  // 7.3 Quick Practice - FIVE_BAND + multiple_choice (5 sessions)
  const quickFiveBandMultipleChoice = [
    { accuracy: 48, totalQuestions: 10, avgTimePerQ: 6.5, daysAgo: 50 },
    { accuracy: 52, totalQuestions: 12, avgTimePerQ: 6.0, daysAgo: 44 },
    { accuracy: 58, totalQuestions: 15, avgTimePerQ: 5.5, daysAgo: 38 },
    { accuracy: 65, totalQuestions: 15, avgTimePerQ: 5.0, daysAgo: 32 },
    { accuracy: 70, totalQuestions: 18, avgTimePerQ: 4.5, daysAgo: 26 },
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
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FIVE_BAND', 'multiple_choice', 'normal'),
      startedAt,
      completedAt,
    });
  }

  // 7.4 Custom Practice - FOUR_BAND + multiple_choice Easy (2 sessions)
  const customFourBandEasyMultipleChoice = [
    { accuracy: 72, totalQuestions: 12, avgTimePerQ: 4.5, daysAgo: 42 },
    { accuracy: 78, totalQuestions: 15, avgTimePerQ: 4.0, daysAgo: 28 },
  ];

  for (const config of customFourBandEasyMultipleChoice) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FOUR_BAND',
      answerType: 'multiple_choice',
      difficulty: 'easy',
      optionCount: 4,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FOUR_BAND', 'multiple_choice', 'normal', 'easy'),
      startedAt,
      completedAt,
    });
  }

  // 7.5 Custom Practice - FOUR_BAND + multiple_choice Medium (2 sessions)
  const customFourBandMediumMultipleChoice = [
    { accuracy: 68, totalQuestions: 15, avgTimePerQ: 4.8, daysAgo: 38 },
    { accuracy: 70, totalQuestions: 18, avgTimePerQ: 4.5, daysAgo: 32 },
  ];

  for (const config of customFourBandMediumMultipleChoice) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FOUR_BAND',
      answerType: 'multiple_choice',
      difficulty: 'medium',
      optionCount: 4,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FOUR_BAND', 'multiple_choice', 'normal', 'medium'),
      startedAt,
      completedAt,
    });
  }

  // 7.6 Custom Practice - FOUR_BAND + multiple_choice Hard (1-2 sessions)
  const customFourBandHardMultipleChoice = [
    { accuracy: 62, totalQuestions: 20, avgTimePerQ: 5.0, daysAgo: 30 },
    { accuracy: 68, totalQuestions: 20, avgTimePerQ: 4.5, daysAgo: 16 },
  ];

  for (const config of customFourBandHardMultipleChoice) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FOUR_BAND',
      answerType: 'multiple_choice',
      difficulty: 'hard',
      optionCount: 4,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FOUR_BAND', 'multiple_choice', 'normal', 'hard'),
      startedAt,
      completedAt,
    });
  }

  // 7.7 Custom Practice - FOUR_BAND + fill_in Medium (2 sessions)
  const customFourBandMediumFillIn = [
    { accuracy: 70, totalQuestions: 15, avgTimePerQ: 5.0, daysAgo: 36 },
    { accuracy: 74, totalQuestions: 18, avgTimePerQ: 4.8, daysAgo: 24 },
  ];

  for (const config of customFourBandMediumFillIn) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FOUR_BAND',
      answerType: 'fill_in',
      difficulty: 'medium',
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FOUR_BAND', 'fill_in', 'normal', 'medium'),
      startedAt,
      completedAt,
    });
  }

  // 7.8 Custom Practice - FOUR_BAND + color_selection Easy (1 session)
  const customFourBandEasyColorSelection = [
    { accuracy: 75, totalQuestions: 12, avgTimePerQ: 4.5, daysAgo: 26 },
  ];

  for (const config of customFourBandEasyColorSelection) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FOUR_BAND',
      answerType: 'color_selection',
      difficulty: 'easy',
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FOUR_BAND', 'color_selection', 'normal', 'easy'),
      startedAt,
      completedAt,
    });
  }

  // 7.9 Custom Practice - FIVE_BAND + fill_in Medium (2-3 sessions)
  const customFiveBandMediumFillIn = [
    { accuracy: 65, totalQuestions: 12, avgTimePerQ: 5.5, daysAgo: 40 },
    { accuracy: 70, totalQuestions: 15, avgTimePerQ: 5.0, daysAgo: 28 },
    { accuracy: 72, totalQuestions: 18, avgTimePerQ: 4.8, daysAgo: 14 },
  ];

  for (const config of customFiveBandMediumFillIn) {
    const settings: PracticeSessionSettings = {
      resistorType: 'FIVE_BAND',
      answerType: 'fill_in',
      difficulty: 'medium',
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(config.totalQuestions, correctAnswers, 'FIVE_BAND', 'fill_in', 'normal', 'medium'),
      startedAt,
      completedAt,
    });
  }

  // 7.10 Color Reading - value_to_color_band_by_band (Band 0, 1, 2, 3) - 4 sessions
  const colorReadingBandByBand = [
    { 
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'value_to_color_band_by_band' as const,
      answerType: 'color_selection' as const,
      bandIndex: 0,
      accuracy: 65, totalQuestions: 10, avgTimePerQ: 5.0, daysAgo: 38,
    },
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'value_to_color_band_by_band' as const,
      answerType: 'color_selection' as const,
      bandIndex: 1,
      accuracy: 68, totalQuestions: 12, avgTimePerQ: 4.8, daysAgo: 32,
    },
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'value_to_color_band_by_band' as const,
      answerType: 'color_selection' as const,
      bandIndex: 2,
      accuracy: 70, totalQuestions: 12, avgTimePerQ: 4.5, daysAgo: 26,
    },
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'value_to_color_band_by_band' as const,
      answerType: 'color_selection' as const,
      bandIndex: 3,
      accuracy: 72, totalQuestions: 10, avgTimePerQ: 4.2, daysAgo: 20,
    },
  ];

  for (const config of colorReadingBandByBand) {
    const settings: PracticeSessionSettings = {
      practiceMode: config.practiceMode,
      resistorType: config.resistorType,
      answerType: config.answerType,
      colorReadingMode: config.colorReadingMode,
      bandIndex: config.bandIndex,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(
        config.totalQuestions, 
        correctAnswers, 
        config.resistorType, 
        config.answerType,
        'value_to_color_band_by_band',
        undefined,
        config.colorReadingMode,
        config.bandIndex
      ),
      startedAt,
      completedAt,
    });
  }

  // 7.11 Color Reading - value_to_color_full (2 sessions)
  const colorReadingValueToColorFull = [
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'value_to_color_full' as const,
      answerType: 'color_selection' as const,
      accuracy: 55, totalQuestions: 15, avgTimePerQ: 5.5, daysAgo: 34,
    },
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'value_to_color_full' as const,
      answerType: 'color_selection' as const,
      accuracy: 60, totalQuestions: 15, avgTimePerQ: 5.0, daysAgo: 18,
    },
  ];

  for (const config of colorReadingValueToColorFull) {
    const settings: PracticeSessionSettings = {
      practiceMode: config.practiceMode,
      resistorType: config.resistorType,
      answerType: config.answerType,
      colorReadingMode: config.colorReadingMode,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(
        config.totalQuestions, 
        correctAnswers, 
        config.resistorType, 
        config.answerType,
        'value_to_color_full',
        undefined,
        config.colorReadingMode
      ),
      startedAt,
      completedAt,
    });
  }

  // 7.12 Color Reading - color_to_value (2 sessions)
  const colorReadingColorToValue = [
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'color_to_value' as const,
      answerType: 'fill_in' as const,
      accuracy: 72, totalQuestions: 12, avgTimePerQ: 4.5, daysAgo: 30,
    },
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'color_to_value' as const,
      answerType: 'multiple_choice' as const,
      accuracy: 75, totalQuestions: 15, avgTimePerQ: 4.2, daysAgo: 22,
    },
  ];

  for (const config of colorReadingColorToValue) {
    const settings: PracticeSessionSettings = {
      practiceMode: config.practiceMode,
      resistorType: config.resistorType,
      answerType: config.answerType,
      colorReadingMode: config.colorReadingMode,
      optionCount: config.answerType === 'multiple_choice' ? 4 : undefined,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(
        config.totalQuestions, 
        correctAnswers, 
        config.resistorType, 
        config.answerType,
        'color_to_value',
        undefined,
        config.colorReadingMode
      ),
      startedAt,
      completedAt,
    });
  }

  // 7.13 Color Reading - mixed (1 session)
  const colorReadingMixed = [
    {
      practiceMode: 'color_reading' as const,
      resistorType: 'FOUR_BAND' as const,
      colorReadingMode: 'mixed' as const,
      answerType: 'multiple_choice' as const,
      accuracy: 70, totalQuestions: 15, avgTimePerQ: 4.5, daysAgo: 14,
    },
  ];

  for (const config of colorReadingMixed) {
    const settings: PracticeSessionSettings = {
      practiceMode: config.practiceMode,
      resistorType: config.resistorType,
      answerType: config.answerType,
      colorReadingMode: config.colorReadingMode,
      optionCount: 4,
      totalQuestions: config.totalQuestions,
      hasTimeLimit: false,
    };

    const correctAnswers = Math.round((config.accuracy / 100) * config.totalQuestions);
    const totalTime = config.avgTimePerQ * config.totalQuestions;
    const startedAt = getRandomDateInRange(config.daysAgo);
    const completedAt = new Date(startedAt.getTime() + totalTime * 1000);

    sessions.push({
      userId: user.id,
      courseId: null,
      presetId: null,
      presetName: formatSessionName(null, settings),
      totalQuestions: config.totalQuestions,
      correctAnswers,
      incorrectAnswers: config.totalQuestions - correctAnswers,
      accuracy: config.accuracy,
      averageTime: config.avgTimePerQ,
      totalTime,
      settings,
      questions: generateQuestionHistory(
        config.totalQuestions, 
        correctAnswers, 
        config.resistorType, 
        config.answerType,
        'mixed',
        undefined,
        config.colorReadingMode
      ),
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

  // 8. Create Practice Presets
  console.log('⚙️  Creating practice presets...');
  
  const preset1 = await prisma.practicePreset.create({
    data: {
      userId: user.id,
      name: 'ฝึก 4 แถบ - ง่าย',
      description: 'ฝึกอ่านค่าตัวต้านทาน 4 แถบแบบง่าย',
      resistorType: 'FOUR_BAND',
      optionCount: 4,
      totalQuestions: 15,
      hasTimeLimit: false,
    },
  });
  console.log(`  ✅ Preset 1: ${preset1.name}`);

  const preset2 = await prisma.practicePreset.create({
    data: {
      userId: user.id,
      name: 'ฝึก 5 แถบ - ปานกลาง',
      description: 'ฝึกอ่านค่าตัวต้านทาน 5 แถบแบบปานกลาง',
      resistorType: 'FIVE_BAND',
      optionCount: 4,
      totalQuestions: 18,
      hasTimeLimit: false,
    },
  });
  console.log(`  ✅ Preset 2: ${preset2.name}`);

  const preset3 = await prisma.practicePreset.create({
    data: {
      userId: user.id,
      name: 'ฝึก Color Reading',
      description: 'ฝึกอ่านสีจากค่าความต้านทาน',
      resistorType: 'FOUR_BAND',
      optionCount: 4,
      totalQuestions: 12,
      hasTimeLimit: false,
    },
  });
  console.log(`  ✅ Preset 3: ${preset3.name}`);

  // Summary
  console.log('\n📊 User กฤตนัย Summary:');
  console.log(`  Email: krittanai@resilearn.com`);
  console.log(`  Password: 12345678`);
  console.log(`  Current Level: 3`);
  console.log(`  Levels Unlocked: [1, 2, 3]`);
  console.log(`  Module 1 Progress: 100%`);
  console.log(`  Module 2 Progress: ${Math.round(module2Progress)}%`);
  console.log(`  Module 3 Progress: ${Math.round(module3Progress)}%`);
  console.log(`  Practice Sessions: ${sessions.length}`);
  console.log(`  Average Accuracy: ${Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)}%`);
  console.log(`  Practice Presets: 3`);
  
  console.log('\n✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding user กฤตนัย:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
