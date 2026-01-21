-- AlterTable: Add assignment_mode and settings fields
-- Note: These columns may already exist in some databases, but this migration ensures they are present

-- Add assignment_mode column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'CourseAssignment' AND column_name = 'assignment_mode'
    ) THEN
        ALTER TABLE "CourseAssignment" ADD COLUMN "assignment_mode" TEXT;
    END IF;
END $$;

-- Add show_score column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'CourseAssignment' AND column_name = 'show_score'
    ) THEN
        ALTER TABLE "CourseAssignment" ADD COLUMN "show_score" BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Add allow_retake column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'CourseAssignment' AND column_name = 'allow_retake'
    ) THEN
        ALTER TABLE "CourseAssignment" ADD COLUMN "allow_retake" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Add has_score column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'CourseAssignment' AND column_name = 'has_score'
    ) THEN
        ALTER TABLE "CourseAssignment" ADD COLUMN "has_score" BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;
