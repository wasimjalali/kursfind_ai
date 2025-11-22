-- Complete Setup for Providers Table
-- Run this after table swap is complete
-- This sets up indexes, RLS policies, triggers, and validates foreign keys

-- ============================================
-- 1. INDEXES (for performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_providers_auth_user_id ON providers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_providers_provider_id ON providers(provider_id);
CREATE INDEX IF NOT EXISTS idx_providers_email ON providers(email);

-- ============================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own provider profile
DROP POLICY IF EXISTS "Users can view own provider profile" ON providers;
CREATE POLICY "Users can view own provider profile"
  ON providers
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Policy: Users can insert their own provider profile
DROP POLICY IF EXISTS "Users can insert own provider profile" ON providers;
CREATE POLICY "Users can insert own provider profile"
  ON providers
  FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Policy: Users can update their own provider profile
DROP POLICY IF EXISTS "Users can update own provider profile" ON providers;
CREATE POLICY "Users can update own provider profile"
  ON providers
  FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Policy: Public can view providers (for course listings)
DROP POLICY IF EXISTS "Public can view providers" ON providers;
CREATE POLICY "Public can view providers"
  ON providers
  FOR SELECT
  USING (true);

-- ============================================
-- 3. TRIGGER for updated_at (automatic timestamp)
-- ============================================
-- Create function (if not exists) with security fix
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

-- Create trigger
DROP TRIGGER IF EXISTS update_providers_updated_at ON providers;
CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. PERMISSIONS
-- ============================================
GRANT USAGE ON SEQUENCE providers_id_seq TO authenticated;
GRANT ALL ON providers TO authenticated;

-- ============================================
-- 5. VALIDATE EXISTING FOREIGN KEYS
-- ============================================
-- These foreign keys should still work since we kept providers.id as primary key
-- course_views.provider_id → providers.id
-- course_clicks.provider_id → providers.id
-- 
-- To validate, run:
-- SELECT conname, conrelid::regclass, confrelid::regclass 
-- FROM pg_constraint 
-- WHERE confrelid = 'providers'::regclass;
--
-- You should see:
-- - fk_course_views_provider → course_views → providers
-- - fk_course_clicks_provider → course_clicks → providers

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly:

-- Check indexes
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'providers' 
-- AND indexname LIKE 'idx_providers%';

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'providers';

-- Check triggers
-- SELECT trigger_name, event_manipulation, event_object_table, action_statement 
-- FROM information_schema.triggers 
-- WHERE event_object_table = 'providers';

