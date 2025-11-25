-- ============================================
-- Fix Wasim Academy Provider & Course Data
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Fix Provider Logo URL (ImgBB direct image link)
UPDATE providers 
SET logo_url = 'https://i.ibb.co/LDvqSkNV/wasim-academy-logo.png'
WHERE provider_id = 'wasim-academy' OR provider_id = 'Wasim Academy UG';

-- Alternative: If the above doesn't work, use this placeholder
-- UPDATE providers 
-- SET logo_url = 'https://via.placeholder.com/200x200.png?text=Wasim+Academy'
-- WHERE provider_id = 'wasim-academy' OR provider_id = 'Wasim Academy UG';

-- 2. Fix Course 1 (English) - Add proper curriculum JSONB
UPDATE courses 
SET curriculum = '{
  "modules": [
    {
      "title": "Module 0 – Preparation",
      "duration": "12-13 hours",
      "topics": [
        "Introduction to marketplaces & roles (VA/Listing/PPC)",
        "Model overview (FBA/FBM/Dropshipping/Wholesale)",
        "Tech check and readiness quiz"
      ]
    },
    {
      "title": "Module 1 – Amazon FBA & E-Commerce (Week 1)",
      "duration": "1 week",
      "topics": [
        "Account Setup (DE/UK/US)",
        "Compliance and regulations",
        "Seller Basics and dashboard navigation"
      ]
    },
    {
      "title": "Module 1 – Amazon FBA & E-Commerce (Week 2)",
      "duration": "1 week",
      "topics": [
        "Product/Market Research with AI tools",
        "Helium 10, ChatGPT, Gemini, Copilot",
        "Market analysis and competition research"
      ]
    },
    {
      "title": "Module 1 – Amazon FBA & E-Commerce (Week 3)",
      "duration": "1 week",
      "topics": [
        "Sourcing strategies (Arbitrage, Wholesale, Private Label)",
        "Supply Chain Management",
        "Supplier negotiations"
      ]
    },
    {
      "title": "Module 1 – Amazon FBA & E-Commerce (Week 4)",
      "duration": "1 week",
      "topics": [
        "Listing Optimization (SEO, Images, A+)",
        "Variants & Catalog Management",
        "Product photography and copywriting"
      ]
    },
    {
      "title": "Module 1 – Amazon FBA & E-Commerce (Week 5)",
      "duration": "1 week",
      "topics": [
        "Shipping & Logistics (Shipping Plans, Fees)",
        "VAT/Sales Tax compliance",
        "IP Issues and brand protection"
      ]
    },
    {
      "title": "Module 1 – Amazon FBA & E-Commerce (Week 6)",
      "duration": "1 week",
      "topics": [
        "PPC Fundamentals and campaign setup",
        "Social Media Basics for e-commerce",
        "Performance Review and Mini Project"
      ]
    },
    {
      "title": "Module 2 – Excel & Bulk Listing",
      "duration": "1 week (35 teaching units)",
      "topics": [
        "CSV/Flat Files and data cleaning",
        "KPI Dashboards creation",
        "Calculators (Margin/COGS/Break-even)",
        "Bulk Upload & Troubleshooting"
      ]
    },
    {
      "title": "Module 3 – Marketing & Content on Social Media",
      "duration": "1 week (35 teaching units)",
      "topics": [
        "TikTok/Instagram/YouTube Setup",
        "Editorial Calendar planning",
        "Short Video/Text/Hashtags strategy",
        "Community Management",
        "Affiliate Basics (Amazon Associates)"
      ]
    },
    {
      "title": "Module 4 – Career Coaching & Capstone Project",
      "duration": "2 weeks (70 teaching units)",
      "topics": [
        "CV/LinkedIn & Interview Preparation",
        "Portfolio/Work Samples creation",
        "Capstone Project (Planning→Implementation→Presentation)",
        "Mentoring & Action Plan",
        "3 months post-program support"
      ]
    }
  ]
}'::jsonb
WHERE id = 1 OR course_id = 'WA-ECOM-EN-2026';

-- 3. Fix Course 2 (German) - Add proper curriculum JSONB
UPDATE courses 
SET curriculum = '{
  "modules": [
    {
      "title": "Modul 0 – Vorbereitung",
      "duration": "12-13 Stunden",
      "topics": [
        "Einführung Marktplätze & Rollen (VA/Listing/PPC)",
        "Modellüberblick (FBA/FBM/Dropshipping/Großhandel)",
        "Technik-Check und Readiness-Quiz"
      ]
    },
    {
      "title": "Modul 1 – Amazon FBA & E-Commerce (Woche 1)",
      "duration": "1 Woche",
      "topics": [
        "Konto-Setup (DE/UK/US)",
        "Compliance und Vorschriften",
        "Seller-Basics und Dashboard-Navigation"
      ]
    },
    {
      "title": "Modul 1 – Amazon FBA & E-Commerce (Woche 2)",
      "duration": "1 Woche",
      "topics": [
        "Produkt-/Marktrecherche mit KI-Tools",
        "Helium 10, ChatGPT, Gemini, Copilot",
        "Marktanalyse und Wettbewerbsforschung"
      ]
    },
    {
      "title": "Modul 1 – Amazon FBA & E-Commerce (Woche 3)",
      "duration": "1 Woche",
      "topics": [
        "Sourcing-Strategien (Arbitrage, Großhandel, Private Label)",
        "Lieferketten-Management",
        "Lieferantenverhandlungen"
      ]
    },
    {
      "title": "Modul 1 – Amazon FBA & E-Commerce (Woche 4)",
      "duration": "1 Woche",
      "topics": [
        "Listing-Optimierung (SEO, Bilder, A+)",
        "Varianten & Katalogpflege",
        "Produktfotografie und Copywriting"
      ]
    },
    {
      "title": "Modul 1 – Amazon FBA & E-Commerce (Woche 5)",
      "duration": "1 Woche",
      "topics": [
        "Versand & Logistik (Versandpläne, Gebühren)",
        "VAT/Sales-Tax Compliance",
        "IP-Themen und Markenschutz"
      ]
    },
    {
      "title": "Modul 1 – Amazon FBA & E-Commerce (Woche 6)",
      "duration": "1 Woche",
      "topics": [
        "PPC-Grundlagen und Kampagnen-Setup",
        "Social-Media-Basics für E-Commerce",
        "Performance-Review und Mini-Projekt"
      ]
    },
    {
      "title": "Modul 2 – Excel & Bulk-Listing",
      "duration": "1 Woche (35 UE)",
      "topics": [
        "CSV/Flat-Files und Datenbereinigung",
        "KPI-Dashboards erstellen",
        "Kalkulatoren (Marge/COGS/Break-even)",
        "Bulk-Upload & Fehlerbehebung"
      ]
    },
    {
      "title": "Modul 3 – Marketing & Content auf Social Media",
      "duration": "1 Woche (35 UE)",
      "topics": [
        "TikTok/Instagram/YouTube Setup",
        "Redaktionsplan-Planung",
        "Kurzvideo/Text/Hashtags-Strategie",
        "Community-Management",
        "Affiliate-Basics (Amazon Associates)"
      ]
    },
    {
      "title": "Modul 4 – Karrierecoaching & Abschlussprojekt",
      "duration": "2 Wochen (70 UE)",
      "topics": [
        "CV/LinkedIn & Interview-Vorbereitung",
        "Portfolio/Arbeitsproben erstellen",
        "Capstone-Projekt (Planung→Umsetzung→Präsentation)",
        "Mentoring & Aktionsplan",
        "3 Monate Nachbetreuung"
      ]
    }
  ]
}'::jsonb
WHERE id = 2 OR course_id = 'WA-ECOM-DE-2026';

-- 4. Verify the updates
SELECT 
  id,
  course_id,
  title,
  provider_id,
  benefits,
  curriculum,
  language
FROM courses
WHERE provider_id = 'Wasim Academy UG' OR provider_id = 'wasim-academy';

-- 5. Verify provider data
SELECT 
  provider_id,
  company_name,
  logo_url,
  trustpilot_url,
  google_reviews_url,
  social_media
FROM providers
WHERE provider_id = 'Wasim Academy UG' OR provider_id = 'wasim-academy';

-- ============================================
-- If logo still doesn't work, check the URL manually:
-- Open this in browser: https://i.ibb.co/LDvqSkNV/wasim-academy-logo.png
-- If it doesn't work, upload logo to Supabase Storage instead
-- ============================================

