-- Add courses column to chat_history table to store course cards with messages
-- This allows course cards to persist when loading chat history

ALTER TABLE chat_history
ADD COLUMN IF NOT EXISTS courses jsonb DEFAULT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN chat_history.courses IS 'Stores array of course objects for assistant messages that include course recommendations';

-- Create index for faster queries on courses
CREATE INDEX IF NOT EXISTS idx_chat_history_courses ON chat_history USING gin(courses);

