/**
 * Script to clear all learning path data from database
 * This includes:
 * - User progress (LessonProgress, ModuleProgress)
 * - Lesson template data (Resources, PracticeLink, QuizQuestions, Sections, Objectives, HeroStats)
 * - Core templates (Lessons, Modules)
 * 
 * WARNING: This will permanently delete all learning path data.
 * Make sure to backup your database before running this script if needed.
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

interface DeletionSummary {
  lessonProgress: number;
  moduleProgress: number;
  lessonResources: number;
  lessonPracticeLinks: number;
  lessonQuizQuestions: number;
  lessonSections: number;
  lessonObjectives: number;
  lessonHeroStats: number;
  lessons: number;
  modules: number;
}

async function clearLearningPath() {
  try {
    console.log('🗑️  Starting to clear learning path data...\n');

    const summary: DeletionSummary = {
      lessonProgress: 0,
      moduleProgress: 0,
      lessonResources: 0,
      lessonPracticeLinks: 0,
      lessonQuizQuestions: 0,
      lessonSections: 0,
      lessonObjectives: 0,
      lessonHeroStats: 0,
      lessons: 0,
      modules: 0,
    };

    // Step 1: Delete User Progress (must be deleted first)
    console.log('📊 Deleting user progress data...');
    const lessonProgressResult = await prisma.lessonProgress.deleteMany({});
    summary.lessonProgress = lessonProgressResult.count;
    console.log(`   ✓ Deleted ${summary.lessonProgress} lesson progress records`);

    const moduleProgressResult = await prisma.moduleProgress.deleteMany({});
    summary.moduleProgress = moduleProgressResult.count;
    console.log(`   ✓ Deleted ${summary.moduleProgress} module progress records\n`);

    // Step 2: Delete Lesson child records (must be deleted before Lessons)
    console.log('📚 Deleting lesson template data...');
    
    const lessonResourceResult = await prisma.lessonResource.deleteMany({});
    summary.lessonResources = lessonResourceResult.count;
    console.log(`   ✓ Deleted ${summary.lessonResources} lesson resources`);

    const lessonPracticeLinkResult = await prisma.lessonPracticeLink.deleteMany({});
    summary.lessonPracticeLinks = lessonPracticeLinkResult.count;
    console.log(`   ✓ Deleted ${summary.lessonPracticeLinks} lesson practice links`);

    const lessonQuizQuestionResult = await prisma.lessonQuizQuestion.deleteMany({});
    summary.lessonQuizQuestions = lessonQuizQuestionResult.count;
    console.log(`   ✓ Deleted ${summary.lessonQuizQuestions} lesson quiz questions`);

    const lessonSectionResult = await prisma.lessonSection.deleteMany({});
    summary.lessonSections = lessonSectionResult.count;
    console.log(`   ✓ Deleted ${summary.lessonSections} lesson sections`);

    const lessonObjectiveResult = await prisma.lessonObjective.deleteMany({});
    summary.lessonObjectives = lessonObjectiveResult.count;
    console.log(`   ✓ Deleted ${summary.lessonObjectives} lesson objectives`);

    const lessonHeroStatResult = await prisma.lessonHeroStat.deleteMany({});
    summary.lessonHeroStats = lessonHeroStatResult.count;
    console.log(`   ✓ Deleted ${summary.lessonHeroStats} lesson hero stats\n`);

    // Step 3: Delete Lessons (must be deleted before Modules due to foreign key)
    console.log('📖 Deleting lessons...');
    const lessonResult = await prisma.lesson.deleteMany({});
    summary.lessons = lessonResult.count;
    console.log(`   ✓ Deleted ${summary.lessons} lessons\n`);

    // Step 4: Delete Modules (last, as it's the parent)
    console.log('📦 Deleting modules...');
    const moduleResult = await prisma.module.deleteMany({});
    summary.modules = moduleResult.count;
    console.log(`   ✓ Deleted ${summary.modules} modules\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Learning path data cleared successfully!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📊 Deletion Summary:');
    console.log(`   User Progress:`);
    console.log(`     - Lesson Progress: ${summary.lessonProgress}`);
    console.log(`     - Module Progress: ${summary.moduleProgress}`);
    console.log(`   Lesson Template Data:`);
    console.log(`     - Resources: ${summary.lessonResources}`);
    console.log(`     - Practice Links: ${summary.lessonPracticeLinks}`);
    console.log(`     - Quiz Questions: ${summary.lessonQuizQuestions}`);
    console.log(`     - Sections: ${summary.lessonSections}`);
    console.log(`     - Objectives: ${summary.lessonObjectives}`);
    console.log(`     - Hero Stats: ${summary.lessonHeroStats}`);
    console.log(`   Core Templates:`);
    console.log(`     - Lessons: ${summary.lessons}`);
    console.log(`     - Modules: ${summary.modules}`);
    console.log('\n💡 You can now create new learning path content!');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Error clearing learning path data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
clearLearningPath()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
