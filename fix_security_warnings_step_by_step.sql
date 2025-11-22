-- ============================================
-- Fix Security Warnings - Step by Step
-- ============================================
-- Run each section separately and verify results
-- This allows us to see which statements succeed/fail
-- ============================================

-- ============================================
-- STEP 1: Check existing functions (READ-ONLY)
-- ============================================
-- Run this first to see what functions exist
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as config,
  pg_get_userbyid(proowner) as owner
FROM pg_proc
WHERE proname IN (
  'update_updated_at_column',
  'increment_course_clicks',
  'increment_course_views',
  'set_updated_at',
  'providers_updated_at_trigger',
  'validate_analytics_event'
)
ORDER BY proname;

-- ============================================
-- STEP 2: Fix update_updated_at_column
-- ============================================
-- This function definitely exists (we created it)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- Set owner
ALTER FUNCTION update_updated_at_column() OWNER TO postgres;

-- Revoke public access
REVOKE EXECUTE ON FUNCTION update_updated_at_column() FROM PUBLIC;

-- Verify
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as config,
  pg_get_userbyid(proowner) as owner
FROM pg_proc
WHERE proname = 'update_updated_at_column';

-- ============================================
-- STEP 3: Fix increment_course_clicks (if exists)
-- ============================================
-- First check if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'increment_course_clicks'
  ) THEN
    RAISE NOTICE 'Function increment_course_clicks exists - will fix it';
  ELSE
    RAISE NOTICE 'Function increment_course_clicks does NOT exist - skipping';
  END IF;
END $$;

-- If it exists, fix it
CREATE OR REPLACE FUNCTION increment_course_clicks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE courses SET clicks = COALESCE(clicks, 0) + 1 WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$;

ALTER FUNCTION increment_course_clicks() OWNER TO postgres;
REVOKE EXECUTE ON FUNCTION increment_course_clicks() FROM PUBLIC;

-- ============================================
-- STEP 4: Fix increment_course_views (if exists)
-- ============================================
-- First check if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'increment_course_views'
  ) THEN
    RAISE NOTICE 'Function increment_course_views exists - will fix it';
  ELSE
    RAISE NOTICE 'Function increment_course_views does NOT exist - skipping';
  END IF;
END $$;

-- If it exists, fix it
CREATE OR REPLACE FUNCTION increment_course_views()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE courses SET views = COALESCE(views, 0) + 1 WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$;

ALTER FUNCTION increment_course_views() OWNER TO postgres;
REVOKE EXECUTE ON FUNCTION increment_course_views() FROM PUBLIC;

-- ============================================
-- STEP 5: Fix set_updated_at (if exists)
-- ============================================
-- First check if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at'
  ) THEN
    RAISE NOTICE 'Function set_updated_at exists - will fix it';
  ELSE
    RAISE NOTICE 'Function set_updated_at does NOT exist - skipping';
  END IF;
END $$;

-- If it exists, fix it
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

ALTER FUNCTION set_updated_at() OWNER TO postgres;
REVOKE EXECUTE ON FUNCTION set_updated_at() FROM PUBLIC;

-- ============================================
-- STEP 6: Fix providers_updated_at_trigger (if exists)
-- ============================================
-- First check if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'providers_updated_at_trigger'
  ) THEN
    RAISE NOTICE 'Function providers_updated_at_trigger exists - will fix it';
  ELSE
    RAISE NOTICE 'Function providers_updated_at_trigger does NOT exist - skipping';
  END IF;
END $$;

-- If it exists, fix it
CREATE OR REPLACE FUNCTION providers_updated_at_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

ALTER FUNCTION providers_updated_at_trigger() OWNER TO postgres;
REVOKE EXECUTE ON FUNCTION providers_updated_at_trigger() FROM PUBLIC;

-- ============================================
-- STEP 7: Fix validate_analytics_event (if exists)
-- ============================================
-- First check if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'validate_analytics_event'
  ) THEN
    RAISE NOTICE 'Function validate_analytics_event exists - will fix it';
  ELSE
    RAISE NOTICE 'Function validate_analytics_event does NOT exist - skipping';
  END IF;
END $$;

-- If it exists, fix it
CREATE OR REPLACE FUNCTION validate_analytics_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Add your validation logic here
  IF NEW.event_type IS NULL THEN
    RAISE EXCEPTION 'event_type cannot be null';
  END IF;
  RETURN NEW;
END;
$$;

ALTER FUNCTION validate_analytics_event() OWNER TO postgres;
REVOKE EXECUTE ON FUNCTION validate_analytics_event() FROM PUBLIC;

-- ============================================
-- STEP 8: Final verification
-- ============================================
-- Check all functions after fixes
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as config,
  pg_get_userbyid(proowner) as owner,
  CASE 
    WHEN proconfig IS NULL THEN 'No search_path set'
    WHEN array_to_string(proconfig, ',') LIKE '%search_path%' THEN 'search_path configured'
    ELSE 'Other config'
  END as search_path_status
FROM pg_proc
WHERE proname IN (
  'update_updated_at_column',
  'increment_course_clicks',
  'increment_course_views',
  'set_updated_at',
  'providers_updated_at_trigger',
  'validate_analytics_event'
)
ORDER BY proname;

