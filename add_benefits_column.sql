-- Add benefits column to courses table
-- This column will store additional benefits like Job Garantie, Jobcoaching, Inklusiver Laptop

ALTER TABLE courses
ADD COLUMN IF NOT EXISTS benefits TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN courses.benefits IS 'Comma-separated list of additional benefits (e.g., "Job Garantie, Jobcoaching, Inklusiver Laptop")';
