# Schema Results Analysis

## Instructions

Please run each set of queries in Supabase SQL Editor and paste the results below each section.

I'll analyze the results and verify everything matches the codebase expectations.

---

## 1. COURSES TABLE

### Run these queries:

```sql
-- columns for courses
SELECT
  column_name, data_type, udt_name, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'courses'
ORDER BY ordinal_position;

-- foreign keys where courses is source
SELECT
  tc.constraint_name, kcu.column_name AS source_column,
  ccu.table_name AS foreign_table, ccu.column_name AS foreign_column,
  rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.table_schema = 'public' AND tc.table_name = 'courses' AND tc.constraint_type = 'FOREIGN KEY';

-- indexes on courses
SELECT
  indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'courses';

-- table constraints for courses (PK, UNIQUE, CHECK)
SELECT
  constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'courses';
```

### Paste results here:
[PASTE COURSES TABLE RESULTS]

### What I'm checking:
- ✅ `provider_id` column type should be `text` or `character varying` (NOT `bigint`)
- ✅ Primary key on `id` column
- ✅ Foreign keys (if any)
- ✅ Indexes on important columns

---

## 2. APPLICATIONS TABLE

### Run these queries (replace 'courses' with 'applications'):

```sql
-- columns for applications
SELECT
  column_name, data_type, udt_name, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'applications'
ORDER BY ordinal_position;

-- foreign keys where applications is source
SELECT
  tc.constraint_name, kcu.column_name AS source_column,
  ccu.table_name AS foreign_table, ccu.column_name AS foreign_column,
  rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.table_schema = 'public' AND tc.table_name = 'applications' AND tc.constraint_type = 'FOREIGN KEY';

-- indexes on applications
SELECT
  indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'applications';

-- table constraints for applications
SELECT
  constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'applications';
```

### Paste results here:
[PASTE APPLICATIONS TABLE RESULTS]

---

## 3. SAVED_COURSES TABLE

### Run these queries (replace table name):

```sql
-- columns for saved_courses
SELECT
  column_name, data_type, udt_name, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'saved_courses'
ORDER BY ordinal_position;

-- foreign keys where saved_courses is source
SELECT
  tc.constraint_name, kcu.column_name AS source_column,
  ccu.table_name AS foreign_table, ccu.column_name AS foreign_column,
  rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.table_schema = 'public' AND tc.table_name = 'saved_courses' AND tc.constraint_type = 'FOREIGN KEY';

-- indexes on saved_courses
SELECT
  indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'saved_courses';

-- table constraints for saved_courses
SELECT
  constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'saved_courses';
```

### Paste results here:
[PASTE SAVED_COURSES TABLE RESULTS]

---

## 4. PROVIDER_FAQS TABLE

### Run these queries (replace table name):

```sql
-- columns for provider_faqs
SELECT
  column_name, data_type, udt_name, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'provider_faqs'
ORDER BY ordinal_position;

-- foreign keys where provider_faqs is source
SELECT
  tc.constraint_name, kcu.column_name AS source_column,
  ccu.table_name AS foreign_table, ccu.column_name AS foreign_column,
  rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.table_schema = 'public' AND tc.table_name = 'provider_faqs' AND tc.constraint_type = 'FOREIGN KEY';

-- indexes on provider_faqs
SELECT
  indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'provider_faqs';

-- table constraints for provider_faqs
SELECT
  constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'provider_faqs';
```

### Paste results here:
[PASTE PROVIDER_FAQS TABLE RESULTS]

### What I'm checking:
- ✅ `provider_id` column type should be `text` or `character varying` (NOT `bigint`)

---

## 5. COURSE_VIEWS TABLE

### Run these queries (replace table name):

```sql
-- columns for course_views
SELECT
  column_name, data_type, udt_name, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'course_views'
ORDER BY ordinal_position;

-- foreign keys where course_views is source
SELECT
  tc.constraint_name, kcu.column_name AS source_column,
  ccu.table_name AS foreign_table, ccu.column_name AS foreign_column,
  rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.table_schema = 'public' AND tc.table_name = 'course_views' AND tc.constraint_type = 'FOREIGN KEY';

-- indexes on course_views
SELECT
  indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'course_views';

-- table constraints for course_views
SELECT
  constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'course_views';
```

### Paste results here:
[PASTE COURSE_VIEWS TABLE RESULTS]

### What I'm checking:
- ✅ `provider_id` column type should be `bigint` (references `providers.id`)
- ✅ Foreign key exists: `course_views.provider_id → providers.id`

---

## 6. COURSE_CLICKS TABLE

### Run these queries (replace table name):

```sql
-- columns for course_clicks
SELECT
  column_name, data_type, udt_name, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'course_clicks'
ORDER BY ordinal_position;

-- foreign keys where course_clicks is source
SELECT
  tc.constraint_name, kcu.column_name AS source_column,
  ccu.table_name AS foreign_table, ccu.column_name AS foreign_column,
  rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.table_schema = 'public' AND tc.table_name = 'course_clicks' AND tc.constraint_type = 'FOREIGN KEY';

-- indexes on course_clicks
SELECT
  indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'course_clicks';

-- table constraints for course_clicks
SELECT
  constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'course_clicks';
```

### Paste results here:
[PASTE COURSE_CLICKS TABLE RESULTS]

### What I'm checking:
- ✅ `provider_id` column type should be `bigint` (references `providers.id`)
- ✅ Foreign key exists: `course_clicks.provider_id → providers.id`

---

## 7. CHAT_HISTORY TABLE

### Run these queries (replace table name):

```sql
-- columns for chat_history
SELECT
  column_name, data_type, udt_name, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'chat_history'
ORDER BY ordinal_position;

-- foreign keys where chat_history is source
SELECT
  tc.constraint_name, kcu.column_name AS source_column,
  ccu.table_name AS foreign_table, ccu.column_name AS foreign_column,
  rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.table_schema = 'public' AND tc.table_name = 'chat_history' AND tc.constraint_type = 'FOREIGN KEY';

-- indexes on chat_history
SELECT
  indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'chat_history';

-- table constraints for chat_history
SELECT
  constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'chat_history';
```

### Paste results here:
[PASTE CHAT_HISTORY TABLE RESULTS]

---

## 8. STUDENTS TABLE

### Run these queries (replace table name):

```sql
-- columns for students
SELECT
  column_name, data_type, udt_name, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'students'
ORDER BY ordinal_position;

-- foreign keys where students is source
SELECT
  tc.constraint_name, kcu.column_name AS source_column,
  ccu.table_name AS foreign_table, ccu.column_name AS foreign_column,
  rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name AND ccu.constraint_schema = rc.unique_constraint_schema
WHERE tc.table_schema = 'public' AND tc.table_name = 'students' AND tc.constraint_type = 'FOREIGN KEY';

-- indexes on students
SELECT
  indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'students';

-- table constraints for students
SELECT
  constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'students';
```

### Paste results here:
[PASTE STUDENTS TABLE RESULTS]

---

## Analysis Summary

After you paste all results, I'll provide:
- ✅ Verification of all column types
- ✅ Confirmation of foreign key relationships
- ✅ Identification of any issues
- ✅ Recommendations for fixes (if needed)

