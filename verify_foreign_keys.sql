-- Verification Query: Check All Foreign Keys to Providers Table
-- Run this in Supabase SQL Editor to verify all fixes worked correctly

SELECT 
  tc.table_name AS source_table,
  kcu.column_name AS source_column,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column,
  tc.constraint_name,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name 
  AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc 
  ON rc.constraint_name = tc.constraint_name 
  AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = rc.unique_constraint_name 
  AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND ccu.table_name = 'providers'
ORDER BY tc.table_name, kcu.column_name;

-- Expected Results:
-- ✅ courses.provider_id → providers.provider_id
-- ✅ provider_faqs.provider_id → providers.provider_id
-- ✅ course_views.provider_id → providers.id
-- ✅ course_clicks.provider_id → providers.id

-- If you see any foreign keys pointing to 'providers_old', those need to be fixed!

