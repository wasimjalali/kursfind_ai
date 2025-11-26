-- ============================================
-- Activate Provider Courses
-- ============================================
-- Run this in Supabase SQL Editor to set your courses to active
-- ============================================

-- Check current status of your courses
SELECT id, title, provider_id, is_active, status
FROM courses
WHERE provider_id = 'wasim-academy-ug';

-- ============================================
-- Option 1: Activate ALL courses for your provider
-- ============================================
UPDATE courses
SET 
  is_active = true,
  status = 'active',
  updated_at = NOW()
WHERE provider_id = 'wasim-academy-ug';

-- ============================================
-- Option 2: Activate specific courses by ID
-- ============================================
-- UPDATE courses
-- SET 
--   is_active = true,
--   status = 'active',
--   updated_at = NOW()
-- WHERE id IN (1, 2);  -- Replace with your course IDs

-- ============================================
-- Verify the changes
-- ============================================
SELECT id, title, provider_id, is_active, status
FROM courses
WHERE provider_id = 'wasim-academy-ug';

-- Expected result:
-- All courses should now show is_active = true and status = 'active'

