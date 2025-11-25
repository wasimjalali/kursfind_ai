-- ═══════════════════════════════════════════════════════════════
-- FIX CHAT HISTORY RLS POLICIES
-- ═══════════════════════════════════════════════════════════════
-- This migration ensures that students can properly delete their chat history
-- Problem: Chats were not being deleted due to RLS policy restrictions
-- Solution: Add proper DELETE policy for students
-- ═══════════════════════════════════════════════════════════════

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Students can delete their own chat history" ON chat_history;
DROP POLICY IF EXISTS "Students can view their own chat history" ON chat_history;
DROP POLICY IF EXISTS "Students can insert their own chat history" ON chat_history;
DROP POLICY IF EXISTS "Students can update their own chat history" ON chat_history;

-- Enable RLS on chat_history table
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Policy 1: Students can view their own chat history
CREATE POLICY "Students can view their own chat history"
ON chat_history
FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT id FROM students WHERE auth_user_id = auth.uid()
  )
);

-- Policy 2: Students can insert their own chat history
CREATE POLICY "Students can insert their own chat history"
ON chat_history
FOR INSERT
TO authenticated
WITH CHECK (
  student_id IN (
    SELECT id FROM students WHERE auth_user_id = auth.uid()
  )
);

-- Policy 3: Students can update their own chat history
CREATE POLICY "Students can update their own chat history"
ON chat_history
FOR UPDATE
TO authenticated
USING (
  student_id IN (
    SELECT id FROM students WHERE auth_user_id = auth.uid()
  )
)
WITH CHECK (
  student_id IN (
    SELECT id FROM students WHERE auth_user_id = auth.uid()
  )
);

-- Policy 4: Students can delete their own chat history (CRITICAL FIX)
CREATE POLICY "Students can delete their own chat history"
ON chat_history
FOR DELETE
TO authenticated
USING (
  student_id IN (
    SELECT id FROM students WHERE auth_user_id = auth.uid()
  )
);

-- Verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'chat_history'
ORDER BY policyname;

