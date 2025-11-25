# 📋 Course Page Data Format Guide

## 🔍 What Was Fixed

I've fixed the course page to handle:
1. ✅ **Curriculum display issues**
2. ✅ **Benefits section not showing**
3. ✅ **Provider logo not displaying**
4. ✅ **Provider name not showing**

---

## 🗄️ Expected Database Format

### 1. **Curriculum** (JSONB Column)

**Column:** `courses.curriculum`  
**Type:** JSONB  
**Format:**

```json
{
  "modules": [
    {
      "title": "Module 1: Introduction to UX Design",
      "duration": "2 Wochen",
      "topics": [
        "User Research Basics",
        "Design Thinking Process",
        "Wireframing Fundamentals"
      ]
    },
    {
      "title": "Module 2: Advanced UI Design",
      "duration": "3 Wochen",
      "topics": [
        "Visual Design Principles",
        "Typography and Color Theory",
        "Responsive Design"
      ]
    }
  ]
}
```

**SQL Example:**
```sql
UPDATE courses 
SET curriculum = '{
  "modules": [
    {
      "title": "Module 1: Python Basics",
      "duration": "2 Wochen",
      "topics": ["Variables", "Functions", "Loops"]
    }
  ]
}'::jsonb
WHERE id = YOUR_COURSE_ID;
```

---

### 2. **Benefits** (TEXT Column)

**Column:** `courses.benefits`  
**Type:** TEXT  
**Format:** Comma-separated string

**Supported Values:**
- `Inklusiver Laptop` - Shows large featured benefit with laptop image
- `Jobcoaching` - Shows coaching icon and description
- `Job Garantie` - Shows guarantee icon and description

**Example:**
```sql
UPDATE courses 
SET benefits = 'Inklusiver Laptop, Jobcoaching, Job Garantie'
WHERE id = YOUR_COURSE_ID;
```

**Or just one:**
```sql
UPDATE courses 
SET benefits = 'Inklusiver Laptop'
WHERE id = YOUR_COURSE_ID;
```

---

### 3. **Provider Logo** (TEXT Column)

**Column:** `providers.logo_url`  
**Type:** TEXT  
**Format:** Full URL to image

**Example:**
```sql
UPDATE providers 
SET logo_url = 'https://your-domain.com/logos/provider-logo.png'
WHERE provider_id = 'your-provider-id';
```

**Requirements:**
- Must be a valid, publicly accessible URL
- Supported formats: PNG, JPG, WebP, SVG
- Recommended size: 200x200px to 400x400px
- Will be displayed at 96x96px (mobile) or 128x128px (desktop)

**Fallback:**
- If logo URL is empty or fails to load, shows provider initials in a colored circle

---

### 4. **Provider Name**

**Column:** `providers.company_name`  
**Type:** TEXT  
**Format:** Plain text

**Example:**
```sql
UPDATE providers 
SET company_name = 'Bildungszentrum Köln'
WHERE provider_id = 'your-provider-id';
```

---

## 🐛 Debugging Steps

### Step 1: Check Your Database

Open Supabase SQL Editor and run:

```sql
-- Check your course data
SELECT 
  id,
  title,
  provider_id,
  curriculum,
  benefits
FROM courses
WHERE id = YOUR_COURSE_ID;

-- Check your provider data
SELECT 
  provider_id,
  company_name,
  logo_url
FROM providers
WHERE provider_id = 'YOUR_PROVIDER_ID';
```

### Step 2: Check Browser Console

1. Open the course page in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for debug logs starting with `=== CoursePageClient Debug ===`

You should see:
```
=== CoursePageClient Debug ===
Course: { id: 1, title: "...", curriculum: {...}, benefits: "..." }
Provider: { company_name: "...", logo_url: "..." }
Provider FAQs: [...]
---
Benefits: "Inklusiver Laptop, Jobcoaching"
Curriculum: { modules: [...] }
Provider Name: "Bildungszentrum Köln"
Provider Logo URL: "https://..."
==============================
```

### Step 3: Common Issues & Fixes

#### ❌ **Curriculum Not Showing**

**Problem:** `curriculum` is NULL or empty

**Fix:**
```sql
UPDATE courses 
SET curriculum = '{
  "modules": [
    {
      "title": "Module 1",
      "duration": "2 Wochen",
      "topics": ["Topic 1", "Topic 2"]
    }
  ]
}'::jsonb
WHERE id = YOUR_COURSE_ID;
```

#### ❌ **Benefits Not Showing**

**Problem:** `benefits` is NULL or empty

**Fix:**
```sql
UPDATE courses 
SET benefits = 'Inklusiver Laptop, Jobcoaching, Job Garantie'
WHERE id = YOUR_COURSE_ID;
```

#### ❌ **Provider Logo Not Showing**

**Problem 1:** `logo_url` is NULL or empty

**Fix:**
```sql
UPDATE providers 
SET logo_url = 'https://your-image-url.com/logo.png'
WHERE provider_id = 'your-provider-id';
```

**Problem 2:** Logo URL is broken (404 error)

**Check:** Open the logo URL in browser - does it load?

**Fix:** Upload logo to Supabase Storage or use a valid public URL

**Problem 3:** CORS error

**Fix:** Make sure the image URL is publicly accessible and doesn't block cross-origin requests

#### ❌ **Provider Name Not Showing**

**Problem:** `company_name` is NULL or empty

**Fix:**
```sql
UPDATE providers 
SET company_name = 'Your Company Name'
WHERE provider_id = 'your-provider-id';
```

---

## 📊 Quick Test Data

Want to test quickly? Run this SQL:

```sql
-- Update a test course with all data
UPDATE courses 
SET 
  curriculum = '{
    "modules": [
      {
        "title": "Module 1: Grundlagen",
        "duration": "2 Wochen",
        "topics": ["Einführung", "Basics", "Übungen"]
      },
      {
        "title": "Module 2: Fortgeschritten",
        "duration": "3 Wochen",
        "topics": ["Advanced Topics", "Projekte", "Praxis"]
      }
    ]
  }'::jsonb,
  benefits = 'Inklusiver Laptop, Jobcoaching, Job Garantie'
WHERE id = 1;  -- Replace with your course ID

-- Update provider with logo
UPDATE providers 
SET 
  company_name = 'Test Bildungszentrum',
  logo_url = 'https://via.placeholder.com/200x200.png?text=Logo'
WHERE provider_id = 'test-provider';  -- Replace with your provider_id
```

---

## 🎯 What the Code Now Does

### Curriculum Section
```javascript
// Now handles:
- course.curriculum.modules (standard format)
- course.curriculum as object (flexible)
- Empty/null curriculum (hides section)
```

### Benefits Section
```javascript
// Now handles:
- Comma-separated string: "Inklusiver Laptop, Jobcoaching"
- Empty string (hides section)
- Null/undefined (hides section)
```

### Provider Logo
```javascript
// Now handles:
- Valid logo URL (displays image)
- Empty/null URL (shows initials fallback)
- Failed image load (shows "Logo nicht verfügbar")
- Proper sizing and centering
```

### Provider Name
```javascript
// Checks in order:
1. provider.company_name
2. provider.name
3. course.provider (fallback)
```

---

## ✅ Verification Checklist

After updating your database:

- [ ] Curriculum section appears with expandable modules
- [ ] Benefits section shows with icons and descriptions
- [ ] Provider logo displays correctly (or shows initials)
- [ ] Provider name shows in hero section
- [ ] Provider name shows in "Über den Anbieter" section
- [ ] No console errors in browser

---

## 🆘 Still Not Working?

1. **Check browser console** for error messages
2. **Verify database values** are not NULL
3. **Test logo URL** in a new browser tab
4. **Check provider_id** matches between courses and providers tables

**Need Help?**
- Check the console logs (they're very detailed now)
- Verify your SQL queries returned data
- Make sure `provider_id` in courses table matches `provider_id` in providers table

---

**Last Updated:** November 25, 2024  
**Status:** ✅ All fixes applied and committed

