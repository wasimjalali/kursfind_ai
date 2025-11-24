# Provider Signup RLS Fix - Implementation Guide

## 🔍 Problem Identified

**Error:** Provider registration fails with RLS (Row Level Security) policy violation

**Root Cause:**
- The `providers` table has RLS enabled with a restrictive INSERT policy
- During signup, the API uses the **anon key** without authenticated context
- The RLS policy requires `auth.uid() = auth_user_id`, but `auth.uid()` is NULL in the API context
- Result: INSERT is blocked by RLS

## ✅ Solution: Two-Part Fix

### Part 1: Update RLS Policy (Database)

**File:** `fix_provider_signup_rls.sql`

**What it does:**
- Replaces the restrictive INSERT policy with a permissive one
- Allows INSERT if `auth_user_id` exists in `auth.users` table
- Still secure: foreign key constraint ensures `auth_user_id` is valid

**How to apply:**
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `fix_provider_signup_rls.sql`
3. Click "Run"
4. Verify: Check that the policy "Allow provider signup" exists

### Part 2: Update API Route (Code)

**File:** `app/api/provider/create-profile/route.js`

**What changed:**
- Now tries to use `SUPABASE_SERVICE_ROLE_KEY` first (bypasses RLS entirely)
- Falls back to `SUPABASE_ANON_KEY` if service key not available
- Logs which key is being used for debugging

**Environment Variable Required:**
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to add:**
- **Local:** `.env.local` file
- **Vercel:** Project Settings → Environment Variables
- **Other hosting:** Add to your platform's environment config

**How to get the service role key:**
1. Open Supabase Dashboard
2. Go to Settings → API
3. Copy the "service_role" key (⚠️ Keep this secret! Never expose in frontend)

## 🧪 Testing Steps

### 1. Apply the SQL Fix
```sql
-- Run in Supabase SQL Editor
-- (Contents of fix_provider_signup_rls.sql)
```

### 2. Verify RLS Policies
```sql
-- Check all policies on providers table
SELECT * FROM pg_policies WHERE tablename = 'providers';

-- Expected policies:
-- - "Allow provider signup" (INSERT)
-- - "Users can view own provider profile" (SELECT)
-- - "Public can view providers" (SELECT)
-- - "Users can update own provider profile" (UPDATE)
```

### 3. Test Provider Signup

**Option A: With Service Role Key (Recommended)**
1. Add `SUPABASE_SERVICE_ROLE_KEY` to environment variables
2. Restart your dev server or redeploy
3. Try signing up a new provider
4. Check logs: Should see "🔑 Using SERVICE ROLE key"
5. ✅ Signup should succeed

**Option B: With Anon Key + RLS Policy**
1. Don't set service role key (or remove it temporarily)
2. Ensure SQL fix is applied
3. Try signing up a new provider
4. Check logs: Should see "🔑 Using ANON key"
5. ✅ Signup should succeed (if RLS policy is correct)

### 4. Monitor Logs

**Frontend (Browser Console):**
```
🚀 Starting provider signup...
✅ Auth signup successful
📝 Creating provider profile...
📡 API Response: { status: 200, ok: true }
✅ Provider profile created
✅ Signup complete! Redirecting...
```

**Backend (API Logs):**
```
📥 Provider profile creation request received
🔑 Using SERVICE ROLE key for provider creation
📝 Request body: { auth_user_id: '...', email: '...', ... }
💾 Attempting to insert provider data
✅ Provider profile created successfully
```

**If Error Occurs:**
```
❌ Provider profile creation error: { code: '42501', message: 'new row violates row-level security policy' }
→ RLS policy not applied correctly
→ Run the SQL fix again
```

## 🔒 Security Notes

### Why This Is Secure

**Service Role Key Approach:**
- ✅ Bypasses RLS entirely (admin-level access)
- ✅ Only used in server-side API routes (never exposed to frontend)
- ✅ Validates all input before inserting
- ✅ Foreign key constraint ensures `auth_user_id` is valid

**RLS Policy Approach:**
- ✅ Checks if `auth_user_id` exists in `auth.users` (via foreign key)
- ✅ Only allows INSERT if user was successfully created by Supabase Auth
- ✅ Cannot insert arbitrary user IDs (foreign key constraint)
- ✅ Users can only insert their own profile

### What We Did NOT Do
- ❌ Did NOT disable RLS entirely
- ❌ Did NOT allow unrestricted INSERTs
- ❌ Did NOT expose service role key to frontend
- ❌ Did NOT weaken other security policies

## 📊 Verification Checklist

After applying fixes:

- [ ] SQL script executed successfully in Supabase
- [ ] New RLS policy "Allow provider signup" exists
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added to environment variables (recommended)
- [ ] API route updated and deployed
- [ ] Test signup with new provider email
- [ ] Check browser console for success messages
- [ ] Check API logs for "SERVICE ROLE" or "ANON" key usage
- [ ] Verify provider record created in `providers` table
- [ ] Verify provider can log in after signup
- [ ] Verify provider can access dashboard

## 🚨 Troubleshooting

### Error: "Missing Supabase credentials"
- **Cause:** Environment variables not set
- **Fix:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

### Error: "row-level security policy violation"
- **Cause:** RLS policy not applied or incorrect
- **Fix:** Re-run `fix_provider_signup_rls.sql` in Supabase SQL Editor

### Error: "foreign key violation"
- **Cause:** `auth_user_id` doesn't exist in `auth.users`
- **Fix:** Ensure Supabase Auth signup succeeds before creating provider profile

### Error: "duplicate key value violates unique constraint"
- **Cause:** Email or `provider_id` already exists
- **Fix:** This is expected behavior - user should use a different email

### Signup succeeds but can't log in
- **Cause:** Email confirmation required
- **Fix:** Check email for confirmation link, or disable email confirmation in Supabase Auth settings

## 📁 Files Modified

1. **`fix_provider_signup_rls.sql`** (NEW)
   - Complete RLS policy fix for `providers` table
   - Run in Supabase SQL Editor

2. **`app/api/provider/create-profile/route.js`** (UPDATED)
   - Now uses service role key if available
   - Falls back to anon key with RLS policy
   - Better error handling and logging

3. **`app/provider/signup/page.jsx`** (NO CHANGES)
   - Already has proper error handling
   - Already detects RLS errors and shows user-friendly messages

## 🎯 Recommended Approach

**For Production:**
1. ✅ Apply SQL fix (always needed)
2. ✅ Use service role key in API (most reliable)
3. ✅ Add service key to Vercel environment variables
4. ✅ Test thoroughly before deploying

**For Development:**
1. ✅ Apply SQL fix
2. ⚠️ Can use anon key + RLS policy (for testing)
3. ✅ Add service key to `.env.local` when ready

## 📞 Support

If signup still fails after applying both fixes:
1. Check Supabase logs (Dashboard → Logs → API)
2. Check browser console for detailed error messages
3. Verify `auth.users` table has the user record
4. Verify `providers` table RLS policies are correct
5. Contact support with logs and error messages

