-- ============================================
-- Course View/Click Tracking Functions
-- ============================================
-- Run this in Supabase SQL Editor to enable
-- real-time tracking of course views and clicks
-- ============================================

-- Function: Increment course views
CREATE OR REPLACE FUNCTION increment_course_views(course_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE courses 
  SET views_count = COALESCE(views_count, 0) + 1,
      updated_at = NOW()
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Increment course clicks
CREATE OR REPLACE FUNCTION increment_course_clicks(course_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE courses 
  SET clicks_count = COALESCE(clicks_count, 0) + 1,
      updated_at = NOW()
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated and anon users
GRANT EXECUTE ON FUNCTION increment_course_views(BIGINT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_course_clicks(BIGINT) TO authenticated, anon;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify functions were created:
-- SELECT proname, prosecdef FROM pg_proc WHERE proname LIKE 'increment_course%';

