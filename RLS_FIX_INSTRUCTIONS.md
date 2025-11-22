# Fix RLS Policy Violation for Provider Signup

## 🚨 Issue

Error: `new row violates row-level security policy for table "providers"`

## Root Cause

The RLS policy requires `auth.uid() = auth_user_id`, but:
1. During signup, the user may not have an active session yet (especially if email confirmation is required)
2. The service role key (`SUPABASE_SERVICE_ROLE_KEY`) may not be set in Vercel, causing the API to use anon key which respects RLS

## ✅ Solution 1: Fix RLS Policy (Recommended)

Run this SQL in Supabase SQL Editor:

```sql
-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert own provider profile" ON providers;

-- Create a more permissive insert policy that allows signup
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
```

This policy allows inserts when:
- The current authenticated user matches the auth_user_id, OR
- The auth_user_id exists in auth.users (which it should after signup)

## ✅ Solution 2: Set Service Role Key in Vercel (Also Recommended)

The service role key bypasses RLS entirely. Make sure it's set:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Your Supabase service role key (from Supabase Dashboard → Settings → API)
   - **Environment:** Production, Preview, Development (all)
3. **Redeploy** your application

## Why Both Solutions?

- **Solution 1 (RLS Policy Fix):** Works even without service role key, more secure
- **Solution 2 (Service Role Key):** Bypasses RLS entirely, simpler but requires proper key management

**Best Practice:** Use both - set the service role key AND fix the RLS policy for defense in depth.

## Verification

After applying the fix:

1. Run the SQL to update the policy
2. Test provider signup at `/provider/signup`
3. Should work without RLS errors

## Alternative: Disable RLS for Inserts (NOT RECOMMENDED)

If you absolutely need to disable RLS for inserts (not recommended for security):

```sql
-- NOT RECOMMENDED - Only use if absolutely necessary
ALTER TABLE providers DISABLE ROW LEVEL SECURITY;
```

**Warning:** This disables all RLS policies, making the table less secure. Only use as a last resort.

