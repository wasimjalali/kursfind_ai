-- ============================================
-- Fix Remaining Function Search Path Warnings
-- ============================================
-- These 3 functions still have search_path warnings:
-- 1. increment_course_clicks
-- 2. set_updated_at
-- 3. increment_course_views
-- ============================================

-- ============================================
-- STEP 1: Fix increment_course_clicks
-- ============================================
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

-- Set function owner to postgres (trusted role)
ALTER FUNCTION increment_course_clicks() OWNER TO postgres;

-- Revoke EXECUTE from PUBLIC for security
REVOKE EXECUTE ON FUNCTION increment_course_clicks() FROM PUBLIC;

-- ============================================
-- STEP 2: Fix set_updated_at
-- ============================================
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

-- Set function owner to postgres (trusted role)
ALTER FUNCTION set_updated_at() OWNER TO postgres;

-- Revoke EXECUTE from PUBLIC for security
REVOKE EXECUTE ON FUNCTION set_updated_at() FROM PUBLIC;

-- ============================================
-- STEP 3: Fix increment_course_views
-- ============================================
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

-- Set function owner to postgres (trusted role)
ALTER FUNCTION increment_course_views() OWNER TO postgres;

-- Revoke EXECUTE from PUBLIC for security
REVOKE EXECUTE ON FUNCTION increment_course_views() FROM PUBLIC;

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this script, check Supabase Dashboard → Database → Linter
-- The function search_path warnings should be resolved

-- To verify functions are fixed:
-- SELECT 
--   proname as function_name,
--   prosecdef as security_definer,
--   proconfig as config,
--   pg_get_userbyid(proowner) as owner,
--   CASE 
--     WHEN proconfig IS NULL THEN 'No search_path set'
--     WHEN array_to_string(proconfig, ',') LIKE '%search_path%' THEN 'search_path configured'
--     ELSE 'Other config'
--   END as search_path_status
-- FROM pg_proc
-- WHERE proname IN (
--   'increment_course_clicks',
--   'set_updated_at',
--   'increment_course_views'
-- )
-- ORDER BY proname;

