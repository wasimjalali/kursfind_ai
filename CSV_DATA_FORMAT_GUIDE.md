# 📊 CSV Data Format Guide

## Overview
This guide shows the correct column names, data types, and formats for creating CSV files to import into Supabase. Follow these formats to ensure your data displays correctly in the frontend.

---

## 🏢 Providers Table

### Required Columns

| Column Name | Data Type | Format | Example | Notes |
|------------|-----------|--------|---------|-------|
| `id` | BIGINT | Auto-generated | `1` | Leave empty for new rows |
| `auth_user_id` | UUID | UUID format | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | Leave empty if creating manually |
| `provider_id` | TEXT | lowercase-with-hyphens | `wasim-academy` | **Unique identifier** |
| `email` | TEXT | valid email | `info@wasimacademy.de` | Provider contact email |
| `company_name` | TEXT | Full company name | `Wasim Academy UG (haftungsbeschränkt)` | Displayed on cards |
| `contact_name` | TEXT | Full name | `Wasim Jalali` | Contact person |
| `phone` | TEXT | International format | `+49 123 456789` | With country code |
| `website` | TEXT | Full URL | `https://www.wasimacademy.de` | Include `https://` |
| `description` | TEXT | Paragraph | `Wasim Academy ist ein...` | Provider bio |
| `street` | TEXT | Street address | `Musterstraße 123` | Physical address |
| `city` | TEXT | City name | `Berlin` | Location |
| `postal_code` | TEXT | Postal code | `10115` | ZIP/postal code |
| `logo_url` | TEXT | **Direct image URL** | `https://i.ibb.co/abc123/logo.png` | ⚠️ Must be direct image link |
| `Certification` | TEXT | Comma-separated | `AZAV, ISO 9001, TÜV` | Certifications (singular!) |
| `year_founded` | INTEGER | Year | `2020` | Founding year |
| `employee_count` | TEXT | Range | `1-10` | Employee range |
| `social_media` | JSONB | JSON object | See below | Social links |
| `trustpilot_url` | TEXT | Full URL | `https://www.trustpilot.com/review/...` | Review link |
| `google_reviews_url` | TEXT | Full URL | `https://g.page/r/...` | Google reviews |
| `created_at` | TIMESTAMP | ISO 8601 | `2024-01-15T10:30:00Z` | Auto-generated |
| `updated_at` | TIMESTAMP | ISO 8601 | `2024-01-15T10:30:00Z` | Auto-generated |

### Social Media Format (JSONB)

```json
{
  "facebook": "https://www.facebook.com/wasimacademy",
  "instagram": "https://www.instagram.com/wasimacademy",
  "linkedin": "https://www.linkedin.com/company/wasim-academy",
  "twitter": "https://twitter.com/wasimacademy",
  "youtube": "https://www.youtube.com/@wasimacademy"
}
```

### ⚠️ Critical Notes for Providers

1. **Logo URL**: Must be a **direct image link** (ends with `.png`, `.jpg`, `.jpeg`, `.webp`)
   - ✅ Good: `https://i.ibb.co/LDvqSkNV/wasim-academy-logo.png`
   - ❌ Bad: `https://ibb.co/abc123` (page link, not image)

2. **Certification**: Column name is **singular** with capital C: `Certification`

3. **provider_id**: Must match the `provider_id` in courses table (TEXT, not BIGINT)

---

## 📚 Courses Table

### Required Columns

| Column Name | Data Type | Format | Example | Notes |
|------------|-----------|--------|---------|-------|
| `id` | BIGINT | Auto-generated | `1` | Leave empty for new rows |
| `course_id` | TEXT | lowercase-with-hyphens | `ai-ecommerce-bootcamp` | Unique identifier |
| `title` | TEXT | Title case | `AI-Powered E-Commerce Bootcamp` | Course name |
| `subtitle` | TEXT | Sentence | `Master Amazon FBA, Excel, and AI tools` | Short description |
| `description` | TEXT | Paragraph | `In diesem Bootcamp lernen Sie...` | Full description |
| `format` | TEXT | Single value | `Online`, `Präsenz`, `Hybrid` | Course format |
| `duration` | TEXT | Human-readable | `12 Wochen`, `3 Monate` | Duration text |
| `duration_hours` | TEXT | Hours format | `480 Stunden` | Total hours |
| `location` | TEXT | City or "Remote" | `Berlin`, `Remote`, `Hamburg` | Location |
| `start_date` | DATE | YYYY-MM-DD | `2024-02-01` | Next start date |
| `next_start_dates` | ARRAY | Array of dates | `{2024-02-01,2024-03-15}` | Upcoming dates |
| `price` | NUMERIC | Number only | `4200` | Price in EUR (no symbols) |
| `price_type` | TEXT | Type | `Einmalzahlung`, `Monatlich` | Payment type |
| `funding_eligible` | BOOLEAN | true/false | `true` | Funding eligible? |
| `funding_types` | ARRAY | Array of strings | `{Bildungsgutschein,AVGS}` | Funding options |
| `prerequisites` | ARRAY | Array of strings | `{Keine Vorkenntnisse}` | Requirements |
| `curriculum` | JSONB | JSON object | See below | Course modules |
| `learning_objectives` | ARRAY | Array of strings | `{Amazon FBA beherrschen,...}` | Learning goals |
| `target_audience` | ARRAY | Array of strings | `{Quereinsteiger,Selbstständige}` | Target groups |
| `career_paths` | JSONB | Array of strings | `["E-Commerce Manager",...]` | Career options |
| `certificate_type` | TEXT | Certificate name | `Kursfind AI Zertifikat` | Certificate |
| `job_placement_rate` | INTEGER | Percentage | `85` | Placement rate (0-100) |
| `provider_id` | TEXT | lowercase-with-hyphens | `wasim-academy` | **Must match providers table** |
| `slug` | TEXT | lowercase-with-hyphens | `ai-ecommerce-bootcamp-berlin` | URL slug |
| `meta_title` | TEXT | SEO title | `AI E-Commerce Bootcamp - Wasim Academy` | SEO |
| `meta_description` | TEXT | SEO description | `Lernen Sie Amazon FBA...` | SEO |
| `keywords` | ARRAY | Array of keywords | `{E-Commerce,Amazon FBA,AI}` | SEO keywords |
| `badges` | ARRAY | Array of badges | `{Bestseller,Neu}` | Display badges |
| `views_count` | INTEGER | Number | `0` | Auto-tracked |
| `clicks_count` | INTEGER | Number | `0` | Auto-tracked |
| `status` | TEXT | Status | `active`, `draft`, `archived` | Course status |
| `is_featured` | BOOLEAN | true/false | `false` | Featured course? |
| `infomaterial_url` | TEXT | Full URL | `https://example.com/brochure.pdf` | Brochure link |
| `image_url` | TEXT | Direct image URL | `https://i.ibb.co/xyz/course.jpg` | Course image |
| `benefits` | TEXT | **Comma-separated** | `Inklusiver Laptop, JobCoaching, Expert-Trainer` | Course benefits |
| `language` | TEXT | Language name | `Deutsch`, `English` | Course language |
| `category` | TEXT | Category name | `E-Commerce`, `Data Science` | Course category |
| `created_at` | TIMESTAMP | ISO 8601 | `2024-01-15T10:30:00Z` | Auto-generated |
| `updated_at` | TIMESTAMP | ISO 8601 | `2024-01-15T10:30:00Z` | Auto-generated |
| `published_at` | TIMESTAMP | ISO 8601 | `2024-01-15T10:30:00Z` | Publication date |

### Curriculum Format (JSONB)

```json
{
  "modules": [
    {
      "title": "Modul 1: Einführung in E-Commerce",
      "duration": "2 Wochen",
      "topics": [
        "Grundlagen des Online-Handels",
        "Marktanalyse und Nischenfindung",
        "Rechtliche Grundlagen"
      ]
    },
    {
      "title": "Modul 2: Amazon FBA Mastery",
      "duration": "3 Wochen",
      "topics": [
        "Amazon Seller Central Setup",
        "Produktrecherche und Sourcing",
        "Listing-Optimierung"
      ]
    }
  ]
}
```

### Career Paths Format (JSONB)

**Simple format (recommended):**
```json
["E-Commerce Manager", "Amazon Account Manager", "Online Marketing Specialist"]
```

**Advanced format (optional):**
```json
{
  "roles": [
    {
      "title": "E-Commerce Manager",
      "salary_min": 45000,
      "salary_max": 65000
    }
  ]
}
```

### Benefits Format (TEXT)

**Format**: Comma-separated list (with spaces after commas)

```
Inklusiver Laptop, JobCoaching, Expert-Trainer, Karrierecoaching, Abschlussprojekt, 3 Monate Nachbetreuung
```

⚠️ **Important**: 
- Use commas with spaces: `, ` (not just `,`)
- No extra spaces at start/end
- Maximum 6 benefits (first 3 shown on cards)

---

## 📋 CSV Template Examples

### Providers CSV Template

```csv
provider_id,email,company_name,contact_name,phone,website,description,street,city,postal_code,logo_url,Certification,year_founded,employee_count,social_media,trustpilot_url,google_reviews_url
wasim-academy,info@wasimacademy.de,Wasim Academy UG (haftungsbeschränkt),Wasim Jalali,+49 123 456789,https://www.wasimacademy.de,"Wasim Academy ist ein führender Anbieter für E-Commerce und digitale Weiterbildung.",Musterstraße 123,Berlin,10115,https://i.ibb.co/LDvqSkNV/wasim-academy-logo.png,"AZAV, ISO 9001",2020,1-10,"{""facebook"":""https://facebook.com/wasimacademy""}",https://www.trustpilot.com/review/wasimacademy,https://g.page/r/wasimacademy
```

### Courses CSV Template

```csv
course_id,title,subtitle,description,format,duration,duration_hours,location,start_date,price,funding_eligible,provider_id,slug,language,category,benefits,curriculum,career_paths
ai-ecommerce-bootcamp,AI-Powered E-Commerce Bootcamp,Master Amazon FBA and AI tools,"In diesem Bootcamp lernen Sie alles über E-Commerce.",Online,12 Wochen,480 Stunden,Remote,2024-02-01,4200,true,wasim-academy,ai-ecommerce-bootcamp,English,E-Commerce,"Inklusiver Laptop, JobCoaching, Expert-Trainer","{""modules"":[{""title"":""Modul 1"",""duration"":""2 Wochen"",""topics"":[""Grundlagen""]}]}","[""E-Commerce Manager"",""Amazon Account Manager""]"
```

---

## ✅ Validation Checklist

Before importing your CSV, verify:

### Providers
- [ ] `provider_id` is unique and lowercase-with-hyphens
- [ ] `logo_url` is a **direct image link** (ends with .png/.jpg/.jpeg/.webp)
- [ ] `Certification` column name has capital C (singular)
- [ ] `email` is valid format
- [ ] `phone` includes country code
- [ ] `social_media` is valid JSON (if used)

### Courses
- [ ] `provider_id` matches an existing provider
- [ ] `benefits` is comma-separated with spaces: `Item1, Item2, Item3`
- [ ] `language` is set (e.g., `Deutsch`, `English`)
- [ ] `curriculum` is valid JSON with `modules` array
- [ ] `career_paths` is JSON array of strings: `["Role1", "Role2"]`
- [ ] `image_url` is direct image link (if used)
- [ ] `price` is number only (no € symbol)
- [ ] `funding_types` is PostgreSQL array: `{Type1,Type2}`

---

## 🔧 Common Issues & Fixes

### Issue: Provider logo not showing
**Fix**: Ensure `logo_url` is direct image link
```
❌ Bad: https://ibb.co/abc123
✅ Good: https://i.ibb.co/LDvqSkNV/logo.png
```

### Issue: Benefits not displaying
**Fix**: Use comma-separated format with spaces
```
❌ Bad: Laptop,Coaching,Trainer
✅ Good: Laptop, Coaching, Trainer
```

### Issue: Curriculum not showing
**Fix**: Ensure valid JSON with `modules` array
```json
{
  "modules": [
    {
      "title": "Module Name",
      "duration": "2 Wochen",
      "topics": ["Topic 1", "Topic 2"]
    }
  ]
}
```

### Issue: Career paths not showing
**Fix**: Use simple array format
```json
["Role 1", "Role 2", "Role 3"]
```

### Issue: Provider name/logo not on course cards
**Fix**: Ensure `provider_id` in courses matches `provider_id` in providers table exactly

### Issue: Provider name not showing in AI chat
**Fix**: Provider data is fetched via JOIN on `provider_id`. Ensure:
- `provider_id` in courses table matches `provider_id` in providers table (TEXT type)
- Provider record exists in providers table
- `company_name` is filled in providers table

---

## 📤 Import Steps

1. **Prepare CSV**: Use templates above
2. **Validate**: Check all formats match this guide
3. **Import to Supabase**: 
   - Go to Table Editor
   - Click "Insert" → "Import data from CSV"
   - Select your CSV file
   - Map columns correctly
4. **Verify**: Check frontend display
5. **Debug**: Use browser console to check for errors

---

## 🆘 Need Help?

If data isn't displaying correctly:

1. Check browser console for errors (F12)
2. Verify column names match exactly (case-sensitive)
3. Ensure JSONB fields are valid JSON
4. Check that `provider_id` matches between tables
5. Verify image URLs are direct links

---

**Last Updated**: November 25, 2024  
**Status**: ✅ Validated with working data

