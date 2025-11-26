-- ============================================
-- Fix is_active Column Type
-- ============================================
-- The is_active column might be stored as TEXT ('true'/'false')
-- instead of BOOLEAN (true/false). This migration fixes that.
-- ============================================

-- Step 1: Check current column type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name = 'is_active';

-- Step 2: Check current values
SELECT id, title, is_active, pg_typeof(is_active) as type
FROM courses
LIMIT 5;

-- ============================================
-- Option A: If column is TEXT, convert to BOOLEAN
-- ============================================

-- First, add a temporary column
ALTER TABLE courses ADD COLUMN is_active_bool BOOLEAN;

-- Copy values (converting text to boolean)
UPDATE courses 
SET is_active_bool = CASE 
  WHEN is_active::text = 'true' THEN true
  WHEN is_active::text = 'false' THEN false
  WHEN is_active IS NULL THEN true
  ELSE true
END;

-- Drop old column and rename new one
ALTER TABLE courses DROP COLUMN is_active;
ALTER TABLE courses RENAME COLUMN is_active_bool TO is_active;

-- Set default value
ALTER TABLE courses ALTER COLUMN is_active SET DEFAULT true;

-- ============================================
-- Verification
-- ============================================
SELECT id, title, is_active, pg_typeof(is_active) as type
FROM courses
LIMIT 5;

-- Expected: is_active should now be BOOLEAN type with true/false values

