-- Fix Foreign Keys After Table Swap
-- Run this in Supabase SQL Editor after verifying the issues

-- ============================================
-- FIX 1: Update courses.provider_id foreign key
-- ============================================
-- Drop old foreign key pointing to providers_old
ALTER TABLE courses 
DROP CONSTRAINT IF EXISTS courses_provider_id_fkey;

-- Create new foreign key pointing to providers table
ALTER TABLE courses
ADD CONSTRAINT courses_provider_id_fkey
FOREIGN KEY (provider_id) 
REFERENCES providers(provider_id) 
ON DELETE CASCADE;

-- ============================================
-- FIX 2: Update provider_faqs.provider_id foreign key
-- ============================================
-- Drop old foreign key pointing to providers_old
ALTER TABLE provider_faqs 
DROP CONSTRAINT IF EXISTS provider_faqs_provider_id_fkey;

-- Create new foreign key pointing to providers table
ALTER TABLE provider_faqs
ADD CONSTRAINT provider_faqs_provider_id_fkey
FOREIGN KEY (provider_id) 
REFERENCES providers(provider_id) 
ON DELETE CASCADE;

-- ============================================
-- FIX 3: Verify/Add course_views.provider_id foreign key
-- ============================================
-- Check if foreign key exists first (this will error if it doesn't exist, which is fine)
-- If it errors, the foreign key doesn't exist and we need to add it
DO $$
BEGIN
  -- Try to add the constraint (will fail silently if it exists)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'course_views_provider_id_fkey'
  ) THEN
    ALTER TABLE course_views
    ADD CONSTRAINT course_views_provider_id_fkey
    FOREIGN KEY (provider_id) 
    REFERENCES providers(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Alternative: If the above doesn't work, use this (will error if constraint exists, but that's okay):
-- ALTER TABLE course_views
-- ADD CONSTRAINT course_views_provider_id_fkey
-- FOREIGN KEY (provider_id) 
-- REFERENCES providers(id) 
-- ON DELETE CASCADE;

-- ============================================
-- FIX 4: Verify/Add course_clicks.provider_id foreign key
-- ============================================
DO $$
BEGIN
  -- Try to add the constraint (will fail silently if it exists)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'course_clicks_provider_id_fkey'
  ) THEN
    ALTER TABLE course_clicks
    ADD CONSTRAINT course_clicks_provider_id_fkey
    FOREIGN KEY (provider_id) 
    REFERENCES providers(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Alternative: If the above doesn't work, use this:
-- ALTER TABLE course_clicks
-- ADD CONSTRAINT course_clicks_provider_id_fkey
-- FOREIGN KEY (provider_id) 
-- REFERENCES providers(id) 
-- ON DELETE CASCADE;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after the fixes to verify:

-- Check all foreign keys pointing to providers
SELECT 
  tc.table_name AS source_table,
  kcu.column_name AS source_column,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column,
  tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name 
  AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc 
  ON rc.constraint_name = tc.constraint_name 
  AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = rc.unique_constraint_name 
  AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND ccu.table_name = 'providers'
ORDER BY tc.table_name, kcu.column_name;

-- Expected results:
-- courses.provider_id → providers.provider_id
-- provider_faqs.provider_id → providers.provider_id
-- course_views.provider_id → providers.id
-- course_clicks.provider_id → providers.id

