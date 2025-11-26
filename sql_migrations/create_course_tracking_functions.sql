-- ============================================
-- Create Course Tracking Functions
-- ============================================
-- These functions increment view_count and click_count
-- for real-time analytics tracking
-- ============================================

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS increment_course_views(bigint);
DROP FUNCTION IF EXISTS increment_course_clicks(bigint);

-- ============================================
-- Function: Increment Course Views
-- ============================================
CREATE OR REPLACE FUNCTION increment_course_views(course_id_input bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE courses
  SET 
    view_count = COALESCE(view_count, 0) + 1,
    updated_at = NOW()
  WHERE id = course_id_input;
END;
$$;

-- ============================================
-- Function: Increment Course Clicks
-- ============================================
CREATE OR REPLACE FUNCTION increment_course_clicks(course_id_input bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE courses
  SET 
    click_count = COALESCE(click_count, 0) + 1,
    updated_at = NOW()
  WHERE id = course_id_input;
END;
$$;

-- ============================================
-- Grant execute permissions to authenticated users
-- ============================================
GRANT EXECUTE ON FUNCTION increment_course_views(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_course_clicks(bigint) TO authenticated;

-- Also grant to anon users (for public course browsing)
GRANT EXECUTE ON FUNCTION increment_course_views(bigint) TO anon;
GRANT EXECUTE ON FUNCTION increment_course_clicks(bigint) TO anon;

-- ============================================
-- Verification
-- ============================================
-- Test the functions (optional)
-- SELECT increment_course_views(1);
-- SELECT increment_course_clicks(1);

-- Check the results
-- SELECT id, title, view_count, click_count FROM courses WHERE id = 1;
