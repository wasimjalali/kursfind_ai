# Schema Verification Request

## Request for Agent

Please **output the raw SQL queries** that I can run locally in Supabase SQL Editor to view:
1. Column definitions for all tables
2. Foreign key relationships
3. Indexes
4. Constraints

This will allow me to verify that all table schemas match the codebase expectations.

## Tables to Verify

Please provide SQL queries for these tables:

1. **courses** - Critical (need to verify provider_id type)
2. **applications** - Need to verify relationships
3. **saved_courses** - Need to verify relationships  
4. **provider_faqs** - Need to verify provider_id type
5. **course_views** - Need to verify foreign key to providers.id
6. **course_clicks** - Need to verify foreign key to providers.id
7. **chat_history** - Need to understand schema
8. **students** - Need to verify (should be independent)

## What I Need

### Option 1: Comprehensive Query (Preferred)
A single SQL query that shows:
- All table names
- All column names, types, and constraints for each table
- All foreign key relationships
- All indexes

### Option 2: Individual Table Queries
Separate SQL queries for each table showing:
- Column definitions (name, type, nullable, default)
- Foreign keys (if any)
- Indexes
- Constraints

## Example Query Format

Something like this would be perfect:

```sql
-- Get all table schemas
SELECT 
  t.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  ...
FROM information_schema.tables t
JOIN information_schema.columns c ON ...
WHERE t.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;
```

And:

```sql
-- Get all foreign keys
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
```

## Why This Is Needed

I need to verify:
1. ✅ `courses.provider_id` is TEXT (not numeric) - CRITICAL
2. ✅ `provider_faqs.provider_id` is TEXT (not numeric)
3. ✅ `course_views.provider_id` → `providers.id` foreign key exists
4. ✅ `course_clicks.provider_id` → `providers.id` foreign key exists
5. ✅ All other relationships match codebase expectations

Thank you!

