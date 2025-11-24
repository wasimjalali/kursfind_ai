# 🔧 REQUIRED: Database Migration for Course Cards in Chat History

## ⚠️ IMPORTANT: Run this SQL in Supabase BEFORE testing

To enable course cards to persist in chat history, you need to add a new column to the `chat_history` table.

---

## 📋 Steps to Run Migration:

### 1. Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### 2. Copy and Paste This SQL:

```sql
-- Add courses column to chat_history table to store course cards with messages
-- This allows course cards to persist when loading chat history

ALTER TABLE chat_history
ADD COLUMN IF NOT EXISTS courses jsonb DEFAULT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN chat_history.courses IS 'Stores array of course objects for assistant messages that include course recommendations';

-- Create index for faster queries on courses
CREATE INDEX IF NOT EXISTS idx_chat_history_courses ON chat_history USING gin(courses);

### 3. Run the Query
- Click "Run" or press Cmd/Ctrl + Enter
- You should see: "Success. No rows returned"

### 4. Verify the Migration
Run this query to verify the column was added:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'chat_history'
AND column_name = 'courses';
```

Expected result:
```
column_name | data_type | is_nullable
------------|-----------|-------------
courses     | jsonb     | YES
```

---

## ✅ What This Enables:

After running this migration:

1. **Course cards are saved** with chat messages
2. **Course cards persist** when you reload the page
3. **Course cards appear** when you load chat history from sidebar
4. **Course cards remain** after browser refresh

---

## 🧪 Test After Migration:

1. Start a new chat
2. Ask: "Show me Python courses"
3. See course cards appear
4. Refresh the page
5. ✅ Course cards should still be there!
6. Click on the chat in sidebar
7. ✅ Course cards should load with the conversation!

---

## 📊 Technical Details:

**Column:** `courses`
**Type:** `jsonb` (JSON binary - efficient storage)
**Nullable:** `YES` (only assistant messages with courses have data)
**Index:** GIN index for fast JSON queries

**Storage:**
- User messages: `courses = NULL`
- Assistant messages without courses: `courses = NULL`
- Assistant messages with courses: `courses = [array of course objects]`

---

## 🔄 Rollback (if needed):

If you need to remove this column:

```sql
DROP INDEX IF EXISTS idx_chat_history_courses;
ALTER TABLE chat_history DROP COLUMN IF EXISTS courses;
```

---

## ✅ Status:

- [ ] Migration SQL file created: `add_courses_to_chat_history.sql`
- [ ] Run SQL in Supabase
- [ ] Verify column exists
- [ ] Test course card persistence
- [ ] Confirm chat history loads with courses

---

**Once you've run this SQL, course cards will persist in chat history!** 🎉

