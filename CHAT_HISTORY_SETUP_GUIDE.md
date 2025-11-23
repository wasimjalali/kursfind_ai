# Chat History Setup Guide

## Problem
Chat history is not showing for logged-in students because the `chat_history` table doesn't exist in the database yet.

## Solution

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar

### Step 2: Run the SQL Script
1. Click **"New Query"**
2. Copy the entire content from `create_chat_history_table.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** (or press Cmd/Ctrl + Enter)

### Step 3: Verify Table Creation
You should see output showing the table columns:
```
column_name  | data_type | is_nullable
-------------|-----------|------------
id           | bigint    | NO
student_id   | bigint    | NO
title        | text      | YES
messages     | jsonb     | NO
created_at   | timestamp | YES
updated_at   | timestamp | YES
```

### Step 4: Test Chat History
1. Go to http://localhost:3000/suchen
2. Make sure you're logged in as a student
3. Send a message in the chat (e.g., "Zeige mir Python Kurse")
4. Wait for the AI response
5. Refresh the page
6. You should now see your chat in the "Chat-Verlauf" section

### Step 5: Verify in Database
Go to Supabase → Table Editor → `chat_history`
You should see your chat saved with:
- `student_id`: 14 (your student ID)
- `title`: First message you sent
- `messages`: JSON array of your conversation
- `created_at`: Timestamp

## Troubleshooting

### If chat history still doesn't save:
1. Check the browser console for errors
2. Check the terminal where `npm run dev` is running for API logs
3. Verify RLS policies are enabled (should be automatic from the script)

### If you see "permission denied" errors:
The RLS policies might be too strict. You can temporarily disable RLS for testing:
```sql
ALTER TABLE chat_history DISABLE ROW LEVEL SECURITY;
```

### If you want to manually test insert:
```sql
INSERT INTO chat_history (student_id, title, messages, created_at)
VALUES (
  14,  -- Replace with your student_id
  'Test Chat',
  '[{"role": "user", "content": "Test message"}]'::jsonb,
  NOW()
);
```

## Expected Behavior After Setup

1. **When you send a message:**
   - API creates/updates a chat_history entry
   - Links it to your student_id (14)
   - Saves all messages in JSONB format

2. **When you refresh the page:**
   - ChatSidebar loads last 30 days of chats
   - Shows them in "Chat-Verlauf" section
   - Each chat is clickable to load the conversation

3. **In Student Dashboard → Chat Verlauf:**
   - Shows all your chat history
   - Filtered by your student_id
   - Only you can see your own chats (RLS enforced)

## Security Notes

- ✅ RLS (Row Level Security) is enabled
- ✅ Each student can only see their own chats
- ✅ `student_id` is linked to `students.id` (not `auth_user_id`)
- ✅ Foreign key constraint ensures data integrity
- ✅ ON DELETE CASCADE removes chats if student is deleted

