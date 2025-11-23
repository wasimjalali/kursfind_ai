# Chat History Debug Guide

## Problem
Chat history is not being saved or shown in the sidebar.

## Steps to Debug

### 1. Check if chat_history table exists in Supabase

Run this SQL query in Supabase SQL Editor:

```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'chat_history';
```

**Expected:** Should return 1 row showing the table exists.

---

### 2. Check chat_history table structure

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'chat_history'
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (bigint or uuid) - Primary key
- `student_id` (bigint) - Foreign key to students.id
- `title` (text)
- `messages` (jsonb or json)
- `created_at` (timestamp)
- `updated_at` (timestamp) - optional

---

### 3. Check if table has any data

```sql
SELECT id, student_id, title, created_at 
FROM chat_history 
ORDER BY created_at DESC 
LIMIT 10;
```

**Expected:** Should show recent chat history entries if any exist.

---

### 4. Check RLS (Row Level Security) policies

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'chat_history';
```

**Expected:** Should have policies allowing:
- INSERT for authenticated users
- SELECT for users where `student_id` matches their student record
- UPDATE for users where `student_id` matches their student record

---

### 5. Test manual insert

```sql
-- First, get a valid student_id
SELECT id, email FROM students LIMIT 1;

-- Then try to insert (replace 14 with actual student_id from above)
INSERT INTO chat_history (student_id, title, messages, created_at)
VALUES (
  14, 
  'Test Chat', 
  '[{"role": "user", "content": "Test message"}]'::jsonb,
  NOW()
);
```

**Expected:** Should insert successfully. If it fails, check the error message.

---

### 6. Check foreign key constraint

```sql
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'chat_history' 
AND tc.constraint_type = 'FOREIGN KEY';
```

**Expected:** Should show:
- `chat_history.student_id` → `students.id`

---

## If table doesn't exist, create it:

```sql
CREATE TABLE IF NOT EXISTS chat_history (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_history_student_id ON chat_history(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can view their own chat history"
  ON chat_history FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own chat history"
  ON chat_history FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own chat history"
  ON chat_history FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM students WHERE auth_user_id = auth.uid()
    )
  );
```

---

## Check browser console logs

When you send a chat message, look for these logs:

- `💾 Attempting to save chat history for student ID: X`
- `✅ Chat history created successfully`
- OR `❌ Error inserting chat history`

When you open the sidebar, look for:

- `📥 Loading chat history for student ID: X`
- `✅ Loaded chat history: X conversations`
- OR `❌ Error loading conversations`

---

## Common Issues

### Issue 1: Table doesn't exist
**Solution:** Run the CREATE TABLE script above

### Issue 2: RLS blocking access
**Solution:** Check and create the RLS policies above

### Issue 3: student_id is NULL
**Solution:** Check that the student record exists and auth_user_id matches

### Issue 4: Column type mismatch
**Solution:** Ensure `student_id` is BIGINT (int8) not UUID

### Issue 5: Messages not in correct format
**Solution:** Ensure messages is JSONB array, not text

