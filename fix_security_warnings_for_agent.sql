-- ============================================
-- Simplified Fix Script for Supabase Agent
-- ============================================
-- This is a simplified version you can give to your Supabase agent
-- It fixes the update_updated_at_column function with all security best practices
-- ============================================

-- Fix: update_updated_at_column (with all security improvements)
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

-- Set function owner to postgres (trusted role)
ALTER FUNCTION update_updated_at_column() OWNER TO postgres;

-- Revoke EXECUTE from PUBLIC for security
REVOKE EXECUTE ON FUNCTION update_updated_at_column() FROM PUBLIC;

-- ============================================
-- For the other 5 functions, you can ask the agent:
-- "Please apply the same security fixes (SET search_path = '', 
--  OWNER TO postgres, REVOKE EXECUTE FROM PUBLIC) to these functions:
--  - increment_course_clicks
--  - increment_course_views
--  - set_updated_at
--  - providers_updated_at_trigger (if it's a function)
--  - validate_analytics_event"
-- ============================================

