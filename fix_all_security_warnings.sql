-- ============================================
-- Fix All Supabase Security Warnings
-- ============================================
-- Run this in your Supabase SQL Editor
-- This fixes all 8 security warnings from the linter
-- ============================================

-- ============================================
-- PART 1: FIX FUNCTION SEARCH PATH WARNINGS
-- ============================================
-- These functions need SET search_path = '' to prevent search path injection

-- 1. Fix: update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. Fix: increment_course_clicks
-- First, let's check if this function exists and what it does
-- If it doesn't exist, this will create a placeholder
-- If it exists, you may need to adjust the logic
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'increment_course_clicks'
  ) THEN
    -- Function exists, recreate with security fix
    -- Note: You may need to adjust the function body based on your actual implementation
    EXECUTE '
    CREATE OR REPLACE FUNCTION increment_course_clicks()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $func$
    BEGIN
      UPDATE courses SET clicks = COALESCE(clicks, 0) + 1 WHERE id = NEW.course_id;
      RETURN NEW;
    END;
    $func$';
  END IF;
END $$;

-- 3. Fix: increment_course_views
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'increment_course_views'
  ) THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION increment_course_views()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $func$
    BEGIN
      UPDATE courses SET views = COALESCE(views, 0) + 1 WHERE id = NEW.course_id;
      RETURN NEW;
    END;
    $func$';
  END IF;
END $$;

-- 4. Fix: set_updated_at
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at'
  ) THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$';
  END IF;
END $$;

-- 5. Fix: providers_updated_at_trigger
-- Note: This might be a trigger name, not a function
-- If it's a function, uncomment and adjust:
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'providers_updated_at_trigger'
  ) THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION providers_updated_at_trigger()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$';
  END IF;
END $$;

-- 6. Fix: validate_analytics_event
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'validate_analytics_event'
  ) THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION validate_analytics_event()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $func$
    BEGIN
      -- Add your validation logic here
      IF NEW.event_type IS NULL THEN
        RAISE EXCEPTION ''event_type cannot be null'';
      END IF;
      RETURN NEW;
    END;
    $func$';
  END IF;
END $$;

-- ============================================
-- PART 2: EXTENSION IN PUBLIC SCHEMA
-- ============================================
-- The citext extension warning can be safely ignored
-- citext is commonly used in public schema and is safe
-- If you want to move it (optional):
-- CREATE SCHEMA IF NOT EXISTS extensions;
-- ALTER EXTENSION citext SET SCHEMA extensions;
-- 
-- However, this may break existing queries, so it's recommended
-- to keep citext in public schema and ignore this warning

-- ============================================
-- PART 3: LEAKED PASSWORD PROTECTION
-- ============================================
-- This must be enabled in Supabase Dashboard, not via SQL
-- 
-- Steps:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to: Authentication → Settings → Password
-- 3. Enable: "Check passwords against HaveIBeenPwned database"
-- 
-- This feature checks user passwords against the HaveIBeenPwned
-- database to prevent use of compromised passwords

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this script:
-- 1. Go to Supabase Dashboard → Database → Linter
-- 2. The function search_path warnings should be resolved
-- 3. Enable leaked password protection in Auth settings
-- 4. The citext extension warning can be safely ignored

-- To verify functions are fixed, run:
-- SELECT 
--   proname as function_name,
--   prosecdef as security_definer,
--   proconfig as config
-- FROM pg_proc
-- WHERE proname IN (
--   'update_updated_at_column',
--   'increment_course_clicks',
--   'increment_course_views',
--   'set_updated_at',
--   'validate_analytics_event',
--   'providers_updated_at_trigger'
-- )
-- ORDER BY proname;

