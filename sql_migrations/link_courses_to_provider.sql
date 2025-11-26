-- ============================================
-- Link Existing Courses to Provider Account
-- ============================================
-- This script connects courses that were imported via CSV
-- to the provider account created via the admin script
-- ============================================

-- ============================================
-- STEP 1: Check current state
-- ============================================
-- Run this first to see what needs to be fixed:

-- Check provider account details:
SELECT 
  id as provider_numeric_id,
  provider_id as provider_text_id,
  email,
  company_name,
  auth_user_id
FROM providers
WHERE email = 'info@wasimacademy.org';

-- Expected result:
-- provider_numeric_id: 3 (or similar)
-- provider_text_id: wasim-academy-ug
-- email: info@wasimacademy.org
-- company_name: Wasim Academy UG

-- ============================================
-- STEP 2: Check existing courses
-- ============================================
-- See what courses exist and their current provider_id:

SELECT 
  id,
  title,
  provider_id,
  is_active,
  created_at
FROM courses
WHERE provider_id LIKE '%wasim%' OR provider_id LIKE '%academy%'
ORDER BY id;

-- This will show you what provider_id your courses currently have

-- ============================================
-- STEP 3: Update courses to link to provider
-- ============================================
-- Replace 'OLD_PROVIDER_ID' with the actual provider_id from your courses
-- Replace 'wasim-academy-ug' with the provider_id from Step 1 if different

-- Option A: If your courses have a different provider_id (e.g., 'wasim-academy', 'Wasim Academy UG')
UPDATE courses
SET 
  provider_id = 'wasim-academy-ug',
  updated_at = NOW()
WHERE provider_id IN (
  'wasim-academy',
  'Wasim Academy UG',
  'wasimacademy',
  'wasim_academy'
);

-- Option B: If you want to update ALL courses with 'wasim' in the provider_id
-- UPDATE courses
-- SET 
--   provider_id = 'wasim-academy-ug',
--   updated_at = NOW()
-- WHERE provider_id ILIKE '%wasim%';

-- Option C: If you want to update specific courses by ID
-- UPDATE courses
-- SET 
--   provider_id = 'wasim-academy-ug',
--   updated_at = NOW()
-- WHERE id IN (1, 2);  -- Replace with your actual course IDs

-- ============================================
-- STEP 4: Verify the connection
-- ============================================
-- Check that courses are now linked to the provider:

SELECT 
  c.id,
  c.title,
  c.provider_id,
  p.company_name,
  p.email,
  p.auth_user_id
FROM courses c
LEFT JOIN providers p ON c.provider_id = p.provider_id
WHERE c.provider_id = 'wasim-academy-ug'
ORDER BY c.id;

-- Expected: You should see your courses with the provider details

-- ============================================
-- STEP 5: Test provider dashboard access
-- ============================================
-- This query simulates what the provider dashboard does:

-- Get provider by auth_user_id (this is what happens when you login)
SELECT 
  id,
  provider_id,
  company_name,
  email
FROM providers
WHERE auth_user_id = '3ca747bf-c30e-4287-bca8-52348f59cf02';  -- Replace with your actual auth_user_id from Step 1

-- Then get their courses using the provider_id (TEXT):
SELECT 
  id,
  title,
  subtitle,
  location,
  format,
  is_active,
  view_count,
  created_at
FROM courses
WHERE provider_id = 'wasim-academy-ug'  -- This should match the provider_id from above
ORDER BY created_at DESC;

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If courses still don't show up, check:

-- 1. Are there any courses at all?
SELECT COUNT(*) as total_courses FROM courses;

-- 2. What provider_id values exist in courses?
SELECT DISTINCT provider_id FROM courses;

-- 3. What provider_id values exist in providers?
SELECT provider_id, company_name FROM providers;

-- 4. Are the courses active?
SELECT id, title, is_active, provider_id FROM courses WHERE is_active = true;

-- ============================================
-- NOTES
-- ============================================
-- 
-- The relationship is:
-- 1. You login → Supabase Auth creates session with auth_user_id
-- 2. System looks up providers table: WHERE auth_user_id = [your auth id]
-- 3. Gets provider.provider_id (TEXT, e.g., "wasim-academy-ug")
-- 4. Fetches courses: WHERE courses.provider_id = provider.provider_id
-- 
-- So courses.provider_id MUST match providers.provider_id exactly!
-- 
-- Common mismatches:
-- - "Wasim Academy UG" vs "wasim-academy-ug" (case/format)
-- - "wasim-academy" vs "wasim-academy-ug" (different slug)
-- - Spaces, special characters, etc.
-- 
-- ============================================

