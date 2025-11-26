# 🔗 Link Existing Courses to Provider Account

## Problem:
- ✅ Provider account exists and can login
- ✅ Courses exist in the database (imported via CSV)
- ❌ Provider dashboard shows no courses
- **Reason**: The `provider_id` values don't match!

---

## 🎯 Quick Fix (3 Steps):

### Step 1: Find Your Provider ID

Go to Supabase → SQL Editor and run:

```sql
SELECT 
  id,
  provider_id,
  company_name,
  email
FROM providers
WHERE email = 'info@wasimacademy.org';
```

**Write down the `provider_id` value** (e.g., `wasim-academy-ug`)

---

### Step 2: Check Your Courses

```sql
SELECT 
  id,
  title,
  provider_id
FROM courses
ORDER BY id;
```

**Write down the `provider_id` values** your courses currently have.

---

### Step 3: Update Courses to Match Provider

Replace the provider_id values in this query with what you found above:

```sql
UPDATE courses
SET 
  provider_id = 'wasim-academy-ug',  -- ← Your provider_id from Step 1
  updated_at = NOW()
WHERE provider_id IN (
  'Wasim Academy UG',      -- ← Old provider_id from your courses
  'wasim-academy',         -- ← Add any other variations here
  'wasimacademy'
);
```

**Or update by specific course IDs:**

```sql
UPDATE courses
SET 
  provider_id = 'wasim-academy-ug',  -- ← Your provider_id from Step 1
  updated_at = NOW()
WHERE id IN (1, 2);  -- ← Your course IDs from Step 2
```

---

### Step 4: Verify It Worked

```sql
SELECT 
  c.id,
  c.title,
  c.provider_id,
  p.company_name
FROM courses c
LEFT JOIN providers p ON c.provider_id = p.provider_id
WHERE c.provider_id = 'wasim-academy-ug';  -- ← Your provider_id
```

You should see your courses with the provider name!

---

## 🧪 Test in Dashboard

1. Refresh your provider dashboard: `http://localhost:3000/provider/dashboard`
2. Go to "Kurse" section
3. You should now see your courses! ✅

---

## 📊 How It Works:

```
Login Flow:
1. You login with email/password
   ↓
2. Supabase Auth: auth_user_id = "3ca747bf-c30e-4287-bca8-52348f59cf02"
   ↓
3. System queries: SELECT * FROM providers WHERE auth_user_id = "3ca747bf..."
   ↓
4. Gets: provider_id = "wasim-academy-ug" (TEXT)
   ↓
5. Fetches courses: SELECT * FROM courses WHERE provider_id = "wasim-academy-ug"
   ↓
6. Shows courses in dashboard ✅
```

**The key:** `courses.provider_id` MUST exactly match `providers.provider_id`

---

## 🔍 Common Issues:

### Issue 1: Case Sensitivity
- ❌ `"Wasim Academy UG"` ≠ `"wasim-academy-ug"`
- ✅ Make them match exactly!

### Issue 2: Different Formats
- ❌ `"wasim-academy"` ≠ `"wasim-academy-ug"`
- ✅ Update courses to use the exact provider_id

### Issue 3: Special Characters
- ❌ `"Wasim Academy UG (haftungsbeschränkt)"` ≠ `"wasim-academy-ug"`
- ✅ Use the slug format (lowercase, hyphens)

---

## 📝 For Future CSV Imports:

When importing courses via CSV, make sure the `provider_id` column matches exactly:

```csv
id,title,provider_id,description,...
1,E-Commerce Bootcamp,wasim-academy-ug,Learn Amazon FBA...
2,Digital Marketing,wasim-academy-ug,Master online marketing...
```

**Important:** Use the TEXT `provider_id` (e.g., `wasim-academy-ug`), NOT the numeric `id` (e.g., `3`)!

---

## 🆘 Still Not Working?

Run these diagnostic queries:

```sql
-- 1. Check if provider exists
SELECT * FROM providers WHERE email = 'info@wasimacademy.org';

-- 2. Check all provider_id values in courses
SELECT DISTINCT provider_id FROM courses;

-- 3. Check all provider_id values in providers
SELECT provider_id, company_name FROM providers;

-- 4. Find mismatches
SELECT 
  c.provider_id as course_provider_id,
  p.provider_id as provider_provider_id,
  COUNT(*) as course_count
FROM courses c
LEFT JOIN providers p ON c.provider_id = p.provider_id
GROUP BY c.provider_id, p.provider_id;
```

---

**Last Updated**: 2024  
**Status**: Ready to use

**Full SQL migration available at**: `sql_migrations/link_courses_to_provider.sql`

