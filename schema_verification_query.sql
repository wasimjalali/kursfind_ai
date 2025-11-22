-- Comprehensive schema report for selected tables in public schema
-- Run this in Supabase SQL Editor to get complete schema information

WITH target_tables AS (
  SELECT unnest(ARRAY[
    'courses','applications','saved_courses','provider_faqs',
    'course_views','course_clicks','chat_history','students'
  ]) AS table_name
),

-- columns
cols AS (
  SELECT
    c.table_name,
    c.ordinal_position,
    c.column_name,
    c.data_type,
    c.udt_name,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    pgd.description AS column_comment
  FROM information_schema.columns c
  LEFT JOIN pg_catalog.pg_statio_all_tables st ON st.relname = c.table_name
  LEFT JOIN pg_catalog.pg_description pgd ON pgd.objoid = st.relid AND pgd.objsubid = c.ordinal_position
  JOIN target_tables t ON t.table_name = c.table_name
  WHERE c.table_schema = 'public'
),

-- table constraints (primary key, unique, check)
tbl_constraints AS (
  SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    pgd.description AS constraint_comment,
    cc.check_clause
  FROM information_schema.table_constraints tc
  LEFT JOIN pg_catalog.pg_constraint pc ON pc.conname = tc.constraint_name
  LEFT JOIN pg_catalog.pg_description pgd ON pgd.objoid = pc.oid
  LEFT JOIN information_schema.check_constraints cc ON cc.constraint_name = tc.constraint_name AND cc.constraint_schema = tc.constraint_schema
  WHERE tc.table_schema = 'public'
    AND tc.table_name IN (SELECT table_name FROM target_tables)
),

-- foreign keys
fkeys AS (
  SELECT
    tc.table_name AS source_table,
    kcu.column_name AS source_column,
    ccu.table_name AS foreign_table,
    ccu.column_name AS foreign_column,
    rc.update_rule AS on_update,
    rc.delete_rule AS on_delete,
    tc.constraint_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
  JOIN information_schema.referential_constraints rc
    ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
  JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN (SELECT table_name FROM target_tables)
),

-- indexes (uses pg_catalog to get index definitions)
indexes AS (
  SELECT
    t.relname AS table_name,
    i.relname AS index_name,
    ix.indisunique AS is_unique,
    ix.indisprimary AS is_primary,
    pg_get_indexdef(ix.indexrelid) AS index_definition
  FROM pg_catalog.pg_class t
  JOIN pg_catalog.pg_index ix ON t.oid = ix.indrelid
  JOIN pg_catalog.pg_class i ON i.oid = ix.indexrelid
  WHERE t.relkind = 'r'
    AND t.relnamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = 'public')
    AND t.relname IN (SELECT table_name FROM target_tables)
)

-- final combined output: columns, constraints, fkeys, indexes
SELECT
  'columns' AS section,
  c.table_name,
  c.ordinal_position::text AS ord,
  c.column_name,
  c.data_type,
  COALESCE(c.udt_name, '') AS udt_name,
  COALESCE(c.character_maximum_length::text, '') AS char_max_len,
  c.is_nullable,
  COALESCE(c.column_default, '') AS column_default,
  COALESCE(c.column_comment,'') AS comment
FROM cols c
ORDER BY c.table_name, c.ordinal_position

UNION ALL

SELECT
  'constraints' AS section,
  tc.table_name,
  '' AS ord,
  tc.constraint_name,
  tc.constraint_type,
  '' AS udt_name,
  '' AS char_max_len,
  '' AS is_nullable,
  COALESCE(tc.check_clause, '') AS column_default,
  COALESCE(tc.constraint_comment, '') AS comment
FROM tbl_constraints tc
ORDER BY 2,3

UNION ALL

SELECT
  'foreign_keys' AS section,
  f.source_table,
  '' AS ord,
  f.constraint_name || ': ' || f.source_column || ' -> ' || f.foreign_table || '(' || f.foreign_column || ')' AS column_name,
  f.on_update || '/' || f.on_delete AS data_type,
  '' AS udt_name,
  '' AS char_max_len,
  '' AS is_nullable,
  '' AS column_default,
  '' AS comment
FROM fkeys f
ORDER BY 2

UNION ALL

SELECT
  'indexes' AS section,
  ix.table_name,
  '' AS ord,
  ix.index_name,
  CASE WHEN ix.is_primary THEN 'PRIMARY' WHEN ix.is_unique THEN 'UNIQUE' ELSE 'INDEX' END AS data_type,
  '' AS udt_name,
  '' AS char_max_len,
  '' AS is_nullable,
  ix.index_definition AS column_default,
  '' AS comment
FROM indexes ix
ORDER BY 2;

