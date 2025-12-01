-- ============================================
-- Add Reminder Tracking Columns to Applications Table
-- ============================================
-- These columns track whether reminder emails have been sent
-- to prevent sending duplicate reminders.

-- Add columns for provider reminder tracking
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS provider_reminder_1_sent BOOLEAN DEFAULT FALSE;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS provider_reminder_2_sent BOOLEAN DEFAULT FALSE;

-- Add columns for student reminder tracking
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS student_reminder_1_sent BOOLEAN DEFAULT FALSE;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS student_reminder_2_sent BOOLEAN DEFAULT FALSE;

-- Add index for efficient reminder queries
CREATE INDEX IF NOT EXISTS idx_applications_status_reminders 
ON applications (status, applied_at) 
WHERE status = 'new';

-- ============================================
-- Verification
-- ============================================
-- Run this to verify columns were added:
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'applications'
  AND column_name LIKE '%reminder%';
