/*
  Warnings:

  - You are about to drop the column `current_level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `levels_unlocked` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Course_teacher_id_idx";

-- DropIndex
DROP INDEX "public"."User_email_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "current_level",
DROP COLUMN "levels_unlocked";

-- CreateTable
CREATE TABLE "CourseEnrollment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseEnrollment_course_id_idx" ON "CourseEnrollment"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_user_id_course_id_key" ON "CourseEnrollment"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
