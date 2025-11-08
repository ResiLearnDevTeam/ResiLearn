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
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PracticePreset_user_id_idx" ON "PracticePreset"("user_id");

-- CreateIndex
CREATE INDEX "PracticeSession_user_id_idx" ON "PracticeSession"("user_id");

-- CreateIndex
CREATE INDEX "PracticeSession_preset_id_idx" ON "PracticeSession"("preset_id");

-- AddForeignKey
ALTER TABLE "PracticePreset" ADD CONSTRAINT "PracticePreset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "PracticePreset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
