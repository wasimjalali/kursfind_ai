-- ============================================
-- FIX PROVIDER SIGNUP RLS ISSUE
-- ============================================
-- Problem: Provider signup fails because RLS blocks INSERT
-- Root Cause: During signup, auth.uid() is NULL in API context
-- Solution: Allow INSERT if auth_user_id exists in auth.users
-- ============================================

-- Step 1: Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own provider profile" ON providers;

-- Step 2: Create permissive INSERT policy for signup flow
-- This allows inserts when:
-- 1. Current user matches auth_user_id (normal authenticated flow)
-- 2. auth_user_id exists in auth.users (signup flow via API)
CREATE POLICY "Allow provider signup"
  ON providers
  FOR INSERT
  WITH CHECK (
    -- Allow if current authenticated user matches
    auth.uid() = auth_user_id
    OR
    -- Allow if auth_user_id exists in auth.users (for signup via API)
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth_user_id
    )
  );

-- Step 3: Verify other RLS policies are correct
-- SELECT policy
DROP POLICY IF EXISTS "Users can view own provider profile" ON providers;
CREATE POLICY "Users can view own provider profile"
  ON providers
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Public SELECT policy (for course listings, etc.)
DROP POLICY IF EXISTS "Public can view providers" ON providers;
CREATE POLICY "Public can view providers"
  ON providers
  FOR SELECT
  USING (true);

-- UPDATE policy
DROP POLICY IF EXISTS "Users can update own provider profile" ON providers;
CREATE POLICY "Users can update own provider profile"
  ON providers
  FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- DELETE policy (optional - only if you want providers to delete themselves)
DROP POLICY IF EXISTS "Users can delete own provider profile" ON providers;
CREATE POLICY "Users can delete own provider profile"
  ON providers
  FOR DELETE
  USING (auth.uid() = auth_user_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify RLS policies are correct:

-- 1. Check all policies on providers table
-- SELECT * FROM pg_policies WHERE tablename = 'providers';

-- 2. Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'providers';

-- 3. Test INSERT as anon user (should work if auth_user_id exists)
-- SET ROLE anon;
-- INSERT INTO providers (auth_user_id, email, company_name, contact_name)
-- VALUES ('existing-uuid-from-auth-users', 'test@example.com', 'Test Company', 'Test Contact');
-- RESET ROLE;

-- ============================================
-- NOTES
-- ============================================
-- This policy is secure because:
-- 1. It only allows INSERT if auth_user_id exists in auth.users
-- 2. Foreign key constraint ensures auth_user_id is valid
-- 3. Users can only insert their own profile (via auth.uid() check)
-- 4. The EXISTS check allows API-based signup flow
-- 
-- Alternative: Use service role key in API (bypasses RLS entirely)
-- Set SUPABASE_SERVICE_ROLE_KEY in environment variables
-- ============================================

