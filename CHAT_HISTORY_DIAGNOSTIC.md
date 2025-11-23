# Chat History Diagnostic & Fix Plan

## Issue
Chat history is not showing in the sidebar for logged-in students.

## Root Causes Identified

### 1. Missing Profile in Menu Items
The profile was removed from `getMenuItems()` but the chat history section expects it.

### 2. Chat History Section Placement
The chat history section (lines 204-238) is rendered AFTER navigation but BEFORE the profile section.

### 3. Possible Database Issues
- `chat_history` table might not exist
- No data in `chat_history` table
- RLS policies might be blocking access
- Foreign key relationship might be incorrect

## Diagnostic Steps

### Step 1: Check if chat_history table exists
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'chat_history';
```

### Step 2: Check table structure
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'chat_history'
ORDER BY ordinal_position;
```

Expected columns:
- `id` (bigint or bigserial) - Primary key
- `student_id` (bigint) - Foreign key to students.id
- `title` (text)
- `messages` (jsonb)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Step 3: Check if data exists
```sql
SELECT id, student_id, title, created_at 
FROM chat_history 
ORDER BY created_at DESC 
LIMIT 10;
```

### Step 4: Check RLS policies
```sql
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'chat_history';
```

### Step 5: Check foreign key
```sql
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'chat_history' 
AND tc.constraint_type = 'FOREIGN KEY';
```

## Fix Implementation

### Fix 1: Create chat_history table if missing
### Fix 2: Add Profile back to menu items with user info
### Fix 3: Ensure chat history section is properly rendered
### Fix 4: Add comprehensive logging
### Fix 5: Test with actual student data

## Testing Checklist
- [ ] Table exists in Supabase
- [ ] Student can log in
- [ ] Student ID is retrieved correctly
- [ ] Chat history query executes without errors
- [ ] Chat history displays in sidebar
- [ ] Each student only sees their own chats

