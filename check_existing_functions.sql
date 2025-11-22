-- ============================================
-- Check All Existing Functions
-- ============================================
-- Run this to see what functions actually exist
-- ============================================

-- Check all functions in public schema
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as config,
  pg_get_userbyid(proowner) as owner,
  CASE 
    WHEN proconfig IS NULL THEN '⚠️ No search_path set'
    WHEN array_to_string(proconfig, ',') LIKE '%search_path%' THEN '✅ search_path configured'
    ELSE 'Other config'
  END as search_path_status
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
ORDER BY proname;

-- Check specifically for the functions mentioned in warnings
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

