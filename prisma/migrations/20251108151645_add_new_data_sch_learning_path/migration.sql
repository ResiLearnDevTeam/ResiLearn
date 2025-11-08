-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_intro" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "strapline" TEXT,
    "summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonHeroStat" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LessonHeroStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonObjective" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "icon" TEXT,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LessonObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSection" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,

    CONSTRAINT "LessonSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonQuizQuestion" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "explanation" TEXT,
    "options" JSONB NOT NULL,
    "answer_index" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LessonQuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonPracticeLink" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "href" TEXT NOT NULL,
    "badge" TEXT,
    "highlight" TEXT,

    CONSTRAINT "LessonPracticeLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonResource" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "href" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LessonResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleProgress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Module_order_idx" ON "Module"("order");

-- CreateIndex
CREATE INDEX "Lesson_module_id_idx" ON "Lesson"("module_id");

-- CreateIndex
CREATE INDEX "Lesson_order_idx" ON "Lesson"("order");

-- CreateIndex
CREATE INDEX "LessonHeroStat_lesson_id_idx" ON "LessonHeroStat"("lesson_id");

-- CreateIndex
CREATE INDEX "LessonObjective_lesson_id_idx" ON "LessonObjective"("lesson_id");

-- CreateIndex
CREATE INDEX "LessonSection_lesson_id_idx" ON "LessonSection"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "LessonSection_lesson_id_slug_key" ON "LessonSection"("lesson_id", "slug");

-- CreateIndex
CREATE INDEX "LessonQuizQuestion_lesson_id_idx" ON "LessonQuizQuestion"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "LessonPracticeLink_lesson_id_key" ON "LessonPracticeLink"("lesson_id");

-- CreateIndex
CREATE INDEX "LessonResource_lesson_id_idx" ON "LessonResource"("lesson_id");

-- CreateIndex
CREATE INDEX "LessonProgress_user_id_idx" ON "LessonProgress"("user_id");

-- CreateIndex
CREATE INDEX "LessonProgress_lesson_id_idx" ON "LessonProgress"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_user_id_lesson_id_key" ON "LessonProgress"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "ModuleProgress_user_id_idx" ON "ModuleProgress"("user_id");

-- CreateIndex
CREATE INDEX "ModuleProgress_module_id_idx" ON "ModuleProgress"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleProgress_user_id_module_id_key" ON "ModuleProgress"("user_id", "module_id");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonHeroStat" ADD CONSTRAINT "LessonHeroStat_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonObjective" ADD CONSTRAINT "LessonObjective_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSection" ADD CONSTRAINT "LessonSection_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonQuizQuestion" ADD CONSTRAINT "LessonQuizQuestion_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonPracticeLink" ADD CONSTRAINT "LessonPracticeLink_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonResource" ADD CONSTRAINT "LessonResource_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleProgress" ADD CONSTRAINT "ModuleProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleProgress" ADD CONSTRAINT "ModuleProgress_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
