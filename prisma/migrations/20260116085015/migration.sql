-- AlterTable: Add assignment_id and assignment_type to LevelAttempt
-- Note: These columns may already exist in some databases, but this migration ensures they are present

-- Add assignment_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'LevelAttempt' AND column_name = 'assignment_id'
    ) THEN
        ALTER TABLE "LevelAttempt" ADD COLUMN "assignment_id" TEXT;
    END IF;
END $$;

-- Add assignment_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'LevelAttempt' AND column_name = 'assignment_type'
    ) THEN
        ALTER TABLE "LevelAttempt" ADD COLUMN "assignment_type" TEXT;
    END IF;
END $$;

-- Create index for assignment_id if it doesn't exist
CREATE INDEX IF NOT EXISTS "LevelAttempt_assignment_id_idx" ON "LevelAttempt"("assignment_id");

-- Make level_id nullable if it's not already (for assignments without levels)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'LevelAttempt' 
        AND column_name = 'level_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE "LevelAttempt" ALTER COLUMN "level_id" DROP NOT NULL;
    END IF;
END $$;
