-- Create chat_history table if it doesn't exist
-- This table stores chat conversations for students

CREATE TABLE IF NOT EXISTS chat_history (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_history_student_id ON chat_history(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Students can view their own chat history" ON chat_history;
DROP POLICY IF EXISTS "Students can insert their own chat history" ON chat_history;
DROP POLICY IF EXISTS "Students can update their own chat history" ON chat_history;

-- Create RLS policies
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

-- Test: Insert a sample chat history (replace 14 with actual student_id)
-- INSERT INTO chat_history (student_id, title, messages, created_at)
-- VALUES (
--   14,
--   'Test Chat',
--   '[{"role": "user", "content": "Ich suche einen Python Kurs"}, {"role": "assistant", "content": "Ich habe mehrere Python-Kurse gefunden..."}]'::jsonb,
--   NOW()
-- );

-- Verify the table was created
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'chat_history'
ORDER BY ordinal_position;

