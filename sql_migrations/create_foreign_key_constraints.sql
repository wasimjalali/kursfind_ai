-- ============================================
-- Create Foreign Key Constraints
-- ============================================
-- Run this in Supabase SQL Editor to create
-- the foreign key constraints needed for joins
-- ============================================

-- 1. Foreign key from courses.provider_id to providers.provider_id
-- Note: Both columns are TEXT type
ALTER TABLE courses
DROP CONSTRAINT IF EXISTS courses_provider_id_fkey;

ALTER TABLE courses
ADD CONSTRAINT courses_provider_id_fkey
FOREIGN KEY (provider_id)
REFERENCES providers(provider_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- 2. Foreign key from saved_courses.course_id to courses.id
ALTER TABLE saved_courses
DROP CONSTRAINT IF EXISTS saved_courses_course_id_fkey;

ALTER TABLE saved_courses
ADD CONSTRAINT saved_courses_course_id_fkey
FOREIGN KEY (course_id)
REFERENCES courses(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- 3. Foreign key from applications.course_id to courses.id
ALTER TABLE applications
DROP CONSTRAINT IF EXISTS applications_course_id_fkey;

ALTER TABLE applications
ADD CONSTRAINT applications_course_id_fkey
FOREIGN KEY (course_id)
REFERENCES courses(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- 4. Foreign key from applications.provider_id to providers.id
-- Note: applications.provider_id is BIGINT, providers.id is BIGINT
ALTER TABLE applications
DROP CONSTRAINT IF EXISTS applications_provider_id_fkey;

ALTER TABLE applications
ADD CONSTRAINT applications_provider_id_fkey
FOREIGN KEY (provider_id)
REFERENCES providers(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify constraints were created:
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('courses', 'saved_courses', 'applications')
ORDER BY tc.table_name, tc.constraint_name;

