-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('FOUR_BAND', 'FIVE_BAND');

-- CreateEnum
CREATE TYPE "AttemptMode" AS ENUM ('PRACTICE', 'QUIZ');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "question_count" INTEGER NOT NULL DEFAULT 10,
    "time_limit" INTEGER,
    "pass_score" INTEGER NOT NULL DEFAULT 80,
    "requires_level" INTEGER,
    "type" "QuestionType" NOT NULL DEFAULT 'FOUR_BAND',

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelAttempt" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "course_id" TEXT,
    "mode" "AttemptMode" NOT NULL,
    "score" INTEGER,
    "percentage" DOUBLE PRECISION,
    "time_taken" INTEGER,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passed" BOOLEAN,
    "questions" JSONB NOT NULL,

    CONSTRAINT "LevelAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticePreset" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resistorType" "QuestionType" NOT NULL,
    "option_count" INTEGER NOT NULL,
    "countdown_time" INTEGER,
    "total_questions" INTEGER,
    "has_time_limit" BOOLEAN NOT NULL DEFAULT false,
    "time_limit" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticePreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "preset_id" TEXT,
    "preset_name" TEXT,
    "total_questions" INTEGER NOT NULL,
    "correct_answers" INTEGER NOT NULL,
    "incorrect_answers" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "average_time" DOUBLE PRECISION,
    "total_time" INTEGER NOT NULL,
    "settings" JSONB NOT NULL,
    "questions" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "image" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "course_status" TEXT NOT NULL DEFAULT 'start',
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_resistor_content" BOOLEAN NOT NULL DEFAULT false,
    "google_classroom_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseEnrollment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAssignment" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3),
    "max_points" INTEGER NOT NULL DEFAULT 100,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleClassroomSync" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "classroom_id" TEXT NOT NULL,
    "classroom_name" TEXT NOT NULL,
    "last_sync_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sync_enabled" BOOLEAN NOT NULL DEFAULT true,
    "auto_sync_grades" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GoogleClassroomSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomStudent" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "classroom_id" TEXT NOT NULL,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassroomStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "student_id" TEXT,
    "google_classroom_email" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_user_id_idx" ON "Account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "Account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_token_key" ON "Session"("session_token");

-- CreateIndex
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Level_number_key" ON "Level"("number");

-- CreateIndex
CREATE INDEX "Level_number_idx" ON "Level"("number");

-- CreateIndex
CREATE INDEX "LevelAttempt_user_id_idx" ON "LevelAttempt"("user_id");

-- CreateIndex
CREATE INDEX "LevelAttempt_level_id_idx" ON "LevelAttempt"("level_id");

-- CreateIndex
CREATE INDEX "LevelAttempt_course_id_idx" ON "LevelAttempt"("course_id");

-- CreateIndex
CREATE INDEX "PracticePreset_user_id_idx" ON "PracticePreset"("user_id");

-- CreateIndex
CREATE INDEX "PracticeSession_user_id_idx" ON "PracticeSession"("user_id");

-- CreateIndex
CREATE INDEX "PracticeSession_preset_id_idx" ON "PracticeSession"("preset_id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Course_google_classroom_id_key" ON "Course"("google_classroom_id");

-- CreateIndex
CREATE INDEX "Enrollment_course_id_idx" ON "Enrollment"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_user_id_course_id_key" ON "Enrollment"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "CourseEnrollment_course_id_idx" ON "CourseEnrollment"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_user_id_course_id_key" ON "CourseEnrollment"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "CourseAssignment_course_id_idx" ON "CourseAssignment"("course_id");

-- CreateIndex
CREATE INDEX "CourseAssignment_level_id_idx" ON "CourseAssignment"("level_id");

-- CreateIndex
CREATE INDEX "Announcement_course_id_idx" ON "Announcement"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleClassroomSync_course_id_key" ON "GoogleClassroomSync"("course_id");

-- CreateIndex
CREATE INDEX "GoogleClassroomSync_user_id_idx" ON "GoogleClassroomSync"("user_id");

-- CreateIndex
CREATE INDEX "ClassroomStudent_user_id_idx" ON "ClassroomStudent"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomStudent_user_id_classroom_id_key" ON "ClassroomStudent"("user_id", "classroom_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelAttempt" ADD CONSTRAINT "LevelAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelAttempt" ADD CONSTRAINT "LevelAttempt_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelAttempt" ADD CONSTRAINT "LevelAttempt_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticePreset" ADD CONSTRAINT "PracticePreset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "PracticePreset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAssignment" ADD CONSTRAINT "CourseAssignment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAssignment" ADD CONSTRAINT "CourseAssignment_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleClassroomSync" ADD CONSTRAINT "GoogleClassroomSync_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomStudent" ADD CONSTRAINT "ClassroomStudent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
