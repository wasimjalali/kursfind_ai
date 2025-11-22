# How to Run Schema Verification Query

## Step 1: Run the Query

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Paste the entire SQL query provided by the agent
4. Click **Run** (or press Cmd/Ctrl + Enter)

## Step 2: What the Results Will Show

The query returns results in 4 sections:

### Section 1: **columns**
Shows all columns for each table with:
- `table_name` - Name of the table
- `column_name` - Name of the column
- `data_type` - Type (text, bigint, uuid, etc.)
- `udt_name` - Underlying database type
- `is_nullable` - YES or NO
- `column_default` - Default value if any

### Section 2: **constraints**
Shows table constraints:
- PRIMARY KEY
- UNIQUE constraints
- CHECK constraints

### Section 3: **foreign_keys**
Shows foreign key relationships:
- Which table/column references which other table/column
- Update/delete rules (CASCADE, RESTRICT, etc.)

### Section 4: **indexes**
Shows all indexes on tables:
- Index names
- Whether they're PRIMARY, UNIQUE, or regular INDEX
- Index definitions

## Step 3: What to Look For

### ✅ CRITICAL CHECKS:

1. **courses.provider_id**
   - Should be: `text` or `character varying`
   - Should NOT be: `bigint` or `integer`
   - This is CRITICAL for the fix we just made

2. **provider_faqs.provider_id**
   - Should be: `text` or `character varying`
   - Should NOT be: `bigint` or `integer`

3. **course_views.provider_id**
   - Should be: `bigint` or `integer` (references providers.id)
   - Foreign key should exist: `course_views.provider_id → providers.id`

4. **course_clicks.provider_id**
   - Should be: `bigint` or `integer` (references providers.id)
   - Foreign key should exist: `course_clicks.provider_id → providers.id`

5. **applications table**
   - Check if it has `provider_id` column
   - Check if it references `courses.id` or `providers.id`
   - Check column types match codebase expectations

6. **saved_courses table**
   - Check relationships to `courses` and `students`
   - Verify column types

## Step 4: Share Results

After running the query, you can:
1. **Copy the results** and paste them here, OR
2. **Export as CSV** and share, OR
3. **Take screenshots** of the results

I'll analyze the results and verify everything matches the codebase!

## Expected Results Format

The results will look something like this:

```
section      | table_name    | column_name    | data_type | is_nullable
-------------|---------------|----------------|-----------|-------------
columns      | courses       | id             | bigint    | NO
columns      | courses       | provider_id    | text      | YES
columns      | courses       | title          | text      | NO
foreign_keys | course_views  | provider_id -> providers(id) | CASCADE/CASCADE
...
```

## Quick Verification Checklist

After you get results, I'll check:

- [ ] `courses.provider_id` is TEXT (not numeric)
- [ ] `provider_faqs.provider_id` is TEXT (not numeric)  
- [ ] `course_views.provider_id` is numeric and has FK to `providers.id`
- [ ] `course_clicks.provider_id` is numeric and has FK to `providers.id`
- [ ] `applications` table structure matches codebase
- [ ] `saved_courses` table structure matches codebase
- [ ] All foreign keys are correctly set up
- [ ] All indexes exist as expected

