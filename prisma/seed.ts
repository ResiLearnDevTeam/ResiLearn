import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load .env.local (with override to ensure it takes precedence)
import { config } from 'dotenv';
config({ path: '.env.local', override: true });

// Verify DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

const db = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function main() {
  console.log('🌱 Seeding database...');

  // Create 7 levels
  const levels = [
    {
      number: 1,
      name: 'Basic Colors',
      description: 'Introduction to resistor colors and basic color recognition',
      difficulty: 1,
      questionCount: 10,
      timeLimit: 10,
      passScore: 80,
      requiresLevel: null,
      type: 'FOUR_BAND' as const,
    },
    {
      number: 2,
      name: '4-Band Basics',
      description: 'Understanding 4-band structure and simple calculations',
      difficulty: 2,
      questionCount: 10,
      timeLimit: 15,
      passScore: 80,
      requiresLevel: 1,
      type: 'FOUR_BAND' as const,
    },
    {
      number: 3,
      name: '4-Band Practice',
      description: 'Common values and random combinations practice',
      difficulty: 3,
      questionCount: 10,
      timeLimit: 20,
      passScore: 80,
      requiresLevel: 2,
      type: 'FOUR_BAND' as const,
    },
    {
      number: 4,
      name: '5-Band Basics',
      description: 'Understanding 5-band structure and calculations',
      difficulty: 3,
      questionCount: 10,
      timeLimit: 15,
      passScore: 80,
      requiresLevel: 3,
      type: 'FIVE_BAND' as const,
    },
    {
      number: 5,
      name: '5-Band Practice',
      description: 'Common values and random combinations for 5-band',
      difficulty: 4,
      questionCount: 10,
      timeLimit: 20,
      passScore: 80,
      requiresLevel: 4,
      type: 'FIVE_BAND' as const,
    },
    {
      number: 6,
      name: 'Mixed Practice',
      description: 'Random 4-band or 5-band with harder combinations',
      difficulty: 4,
      questionCount: 10,
      timeLimit: 25,
      passScore: 80,
      requiresLevel: 5,
      type: 'FOUR_BAND' as const, // Can be either, handled in logic
    },
    {
      number: 7,
      name: 'Expert Mode',
      description: 'All possible combinations with time pressure',
      difficulty: 5,
      questionCount: 10,
      timeLimit: 30,
      passScore: 80,
      requiresLevel: 6,
      type: 'FOUR_BAND' as const, // Can be either, handled in logic
    },
  ];

  for (const level of levels) {
    await db.level.upsert({
      where: { number: level.number },
      update: level,
      create: level,
    });
    console.log(`✅ Level ${level.number}: ${level.name}`);
  }

  // Create test user (1@1.com / password: 1@1.com)
  const hashedPassword = await bcrypt.hash('1@1.com', 10);
  await db.user.upsert({
    where: { email: '1@1.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: '1@1.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'STUDENT',
      currentLevel: 1,
      levelsUnlocked: [1],
    },
  });
  console.log('✅ Test User: 1@1.com / password: 1@1.com');

  // Create Course Outline Modules and Lessons
  const courseIntro = await db.module.upsert({
    where: { id: 'course-intro' },
    update: {},
    create: {
      id: 'course-intro',
      title: 'Course Introduction',
      description: 'Introduction to the Resistor Learning Course',
      order: 0,
      isIntro: true,
    },
  });

  const introLessons = [
    { title: 'Course Introduction', order: 0 },
    { title: 'First Time in this Course', order: 1 },
    { title: 'Student Resources', order: 2 },
    { title: 'Download Resistor Template', order: 3 },
  ];

  for (const lesson of introLessons) {
    const existing = await db.lesson.findFirst({
      where: {
        moduleId: courseIntro.id,
        order: lesson.order,
      },
    });

    if (existing) {
      await db.lesson.update({
        where: { id: existing.id },
        data: { title: lesson.title },
      });
    } else {
      await db.lesson.create({
        data: {
          moduleId: courseIntro.id,
          title: lesson.title,
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${lesson.title}`,
          order: lesson.order,
        },
      });
    }
  }
  console.log('✅ Course Introduction Module');

  const module1 = await db.module.upsert({
    where: { id: 'module-1' },
    update: {},
    create: {
      id: 'module-1',
      title: 'Module 1: Understanding Resistors',
      description: 'Learn the basics of resistors',
      order: 1,
      isIntro: false,
    },
  });

  const module1Lessons = [
    { title: 'What is a Resistor?', order: 0 },
    { title: 'Resistor Types and Materials', order: 1 },
    { title: 'Resistor Color Codes', order: 2 },
    { title: 'Reading Color Bands', order: 3 },
  ];

  for (const lesson of module1Lessons) {
    const existing = await db.lesson.findFirst({
      where: {
        moduleId: module1.id,
        order: lesson.order,
      },
    });

    if (existing) {
      await db.lesson.update({
        where: { id: existing.id },
        data: { title: lesson.title },
      });
    } else {
      await db.lesson.create({
        data: {
          moduleId: module1.id,
          title: lesson.title,
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${lesson.title}`,
          order: lesson.order,
        },
      });
    }
  }
  console.log('✅ Module 1: Understanding Resistors');

  const module2 = await db.module.upsert({
    where: { id: 'module-2' },
    update: {},
    create: {
      id: 'module-2',
      title: 'Module 2: Color Code System',
      description: 'Master the color code system',
      order: 2,
      isIntro: false,
    },
  });

  const module2Lessons = [
    { title: '4-Band Resistors', order: 0 },
    { title: '5-Band Resistors', order: 1 },
    { title: '6-Band Resistors', order: 2 },
    { title: 'Tolerance and Temperature Coefficient', order: 3 },
  ];

  for (const lesson of module2Lessons) {
    const existing = await db.lesson.findFirst({
      where: {
        moduleId: module2.id,
        order: lesson.order,
      },
    });

    if (existing) {
      await db.lesson.update({
        where: { id: existing.id },
        data: { title: lesson.title },
      });
    } else {
      await db.lesson.create({
        data: {
          moduleId: module2.id,
          title: lesson.title,
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${lesson.title}`,
          order: lesson.order,
        },
      });
    }
  }
  console.log('✅ Module 2: Color Code System');

  const module3 = await db.module.upsert({
    where: { id: 'module-3' },
    update: {},
    create: {
      id: 'module-3',
      title: 'Module 3: Practical Applications',
      description: 'Apply your knowledge in real-world scenarios',
      order: 3,
      isIntro: false,
    },
  });

  const module3Lessons = [
    { title: 'Series and Parallel Circuits', order: 0 },
    { title: 'Ohm\'s Law Applications', order: 1 },
    { title: 'Power Rating', order: 2 },
    { title: 'Real-World Examples', order: 3 },
  ];

  for (const lesson of module3Lessons) {
    const existing = await db.lesson.findFirst({
      where: {
        moduleId: module3.id,
        order: lesson.order,
      },
    });

    if (existing) {
      await db.lesson.update({
        where: { id: existing.id },
        data: { title: lesson.title },
      });
    } else {
      await db.lesson.create({
        data: {
          moduleId: module3.id,
          title: lesson.title,
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${lesson.title}`,
          order: lesson.order,
        },
      });
    }
  }
  console.log('✅ Module 3: Practical Applications');

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

