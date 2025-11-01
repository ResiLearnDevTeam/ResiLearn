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

