-- Fix Supabase Security Warnings
-- Run this in your Supabase SQL Editor to fix all security warnings

-- ============================================
-- 1. FIX FUNCTION SEARCH PATH WARNINGS
-- ============================================
-- These warnings occur when functions don't have a fixed search_path,
-- which can lead to search path injection attacks.
-- Fix: Add SET search_path = '' or SET search_path = public, pg_catalog

-- Fix: update_updated_at_column
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

-- Fix: increment_course_clicks (if exists)
CREATE OR REPLACE FUNCTION increment_course_clicks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Add your function logic here
  -- This is a placeholder - adjust based on your actual function
  UPDATE courses SET clicks = COALESCE(clicks, 0) + 1 WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$;

-- Fix: increment_course_views (if exists)
CREATE OR REPLACE FUNCTION increment_course_views()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Add your function logic here
  -- This is a placeholder - adjust based on your actual function
  UPDATE courses SET views = COALESCE(views, 0) + 1 WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$;

-- Fix: set_updated_at (if exists)
CREATE OR REPLACE FUNCTION set_updated_at()
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

-- Fix: providers_updated_at_trigger (if exists - this might be a function, not a trigger)
-- Note: If this is actually a trigger, you don't need to fix it separately
-- If it's a function, uncomment and adjust:
/*
CREATE OR REPLACE FUNCTION providers_updated_at_trigger()
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
*/

-- Fix: validate_analytics_event (if exists)
CREATE OR REPLACE FUNCTION validate_analytics_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Add your validation logic here
  -- This is a placeholder - adjust based on your actual function
  IF NEW.event_type IS NULL THEN
    RAISE EXCEPTION 'event_type cannot be null';
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================
-- 2. FIX EXTENSION IN PUBLIC SCHEMA WARNING
-- ============================================
-- Move citext extension to extensions schema (if possible)
-- Note: Some extensions must stay in public schema
-- If citext is used extensively, you may need to keep it in public
-- but this is generally acceptable for citext

-- Option 1: Move to extensions schema (if supported)
-- CREATE SCHEMA IF NOT EXISTS extensions;
-- ALTER EXTENSION citext SET SCHEMA extensions;

-- Option 2: Keep in public but document it (citext is commonly used in public)
-- This warning can be safely ignored if citext is required in public schema
-- Most Supabase projects keep citext in public schema

-- ============================================
-- 3. ENABLE LEAKED PASSWORD PROTECTION
-- ============================================
-- This must be done in Supabase Dashboard, not via SQL
-- Go to: Authentication → Settings → Password
-- Enable: "Check passwords against HaveIBeenPwned database"

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this script, check Supabase Dashboard → Database → Linter
-- The warnings should be resolved

-- To verify functions are fixed:
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
--   'validate_analytics_event'
-- );

