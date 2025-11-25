-- ============================================
-- Remove provider.faq Column
-- ============================================
-- This migration removes the legacy faq column
-- from the providers table and ensures all FAQs
-- are managed through the provider_faqs table
-- ============================================

-- ============================================
-- STEP 1: Backup existing data (OPTIONAL)
-- ============================================
-- If you want to keep a backup of existing FAQ data,
-- run this first and save the results:

-- SELECT provider_id, company_name, faq 
-- FROM providers 
-- WHERE faq IS NOT NULL AND jsonb_array_length(faq) > 0;

-- ============================================
-- STEP 2: Migrate data to provider_faqs table
-- ============================================
-- This will move any existing FAQs from provider.faq
-- to the provider_faqs table (if not already there)

INSERT INTO provider_faqs (provider_id, question, answer, is_active, display_order)
SELECT 
  p.provider_id,
  COALESCE(faq_item->>'question', faq_item->>'title', 'Question') as question,
  COALESCE(faq_item->>'answer', faq_item->>'content', '') as answer,
  true as is_active,
  row_number() OVER (PARTITION BY p.provider_id ORDER BY ordinality) as display_order
FROM providers p
CROSS JOIN LATERAL jsonb_array_elements(p.faq) WITH ORDINALITY AS faq_item
WHERE p.faq IS NOT NULL 
  AND jsonb_array_length(p.faq) > 0
  -- Only insert if not already exists (avoid duplicates)
  AND NOT EXISTS (
    SELECT 1 FROM provider_faqs pf 
    WHERE pf.provider_id = p.provider_id 
      AND pf.question = COALESCE(faq_item->>'question', faq_item->>'title', 'Question')
  );

-- ============================================
-- STEP 3: Remove the faq column
-- ============================================
-- After confirming data is migrated, drop the column

ALTER TABLE providers DROP COLUMN IF EXISTS faq;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the column was removed:

-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'providers' 
-- ORDER BY ordinal_position;

-- ============================================
-- Check migrated FAQs
-- ============================================
-- Run this to see all FAQs in the provider_faqs table:

-- SELECT 
--   provider_id,
--   question,
--   answer,
--   is_active,
--   display_order
-- FROM provider_faqs
-- ORDER BY provider_id, display_order;

