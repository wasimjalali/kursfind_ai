-- Fix RLS Policy for Provider Signup
-- The current policy blocks inserts because auth.uid() may be NULL during signup
-- This adds a policy that allows inserts when auth_user_id exists in auth.users

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert own provider profile" ON providers;

-- Create a more permissive insert policy that allows signup
-- This checks if the auth_user_id exists in auth.users (which it should after signup)
CREATE POLICY "Users can insert own provider profile"
  ON providers
  FOR INSERT
  WITH CHECK (
    -- Allow if current user matches auth_user_id
    auth.uid() = auth_user_id
    OR
    -- Allow if auth_user_id exists in auth.users (for signup flow)
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = providers.auth_user_id
    )
  );

-- Alternative: If the above doesn't work, we can use a function-based approach
-- But first, let's try the simpler solution above

-- Note: The service role key should bypass RLS entirely, but if it's not set
-- in Vercel environment variables, the API will use anon key which respects RLS.
-- Make sure SUPABASE_SERVICE_ROLE_KEY is set in Vercel!

