-- ============================================
-- Fix Student Account Deletion RLS Policies
-- ============================================
-- Run this in Supabase SQL Editor to enable
-- students to delete their own accounts
-- ============================================

-- Allow students to delete their own profile
CREATE POLICY IF NOT EXISTS "Students can delete own profile"
ON students FOR DELETE
TO authenticated
USING (auth_user_id = auth.uid());

-- Allow students to delete their own saved courses
CREATE POLICY IF NOT EXISTS "Students can delete own saved courses"
ON saved_courses FOR DELETE
TO authenticated
USING (student_id IN (
  SELECT id FROM students WHERE auth_user_id = auth.uid()
));

-- Allow students to delete their own applications
CREATE POLICY IF NOT EXISTS "Students can delete own applications"
ON applications FOR DELETE
TO authenticated
USING (student_id IN (
  SELECT id FROM students WHERE auth_user_id = auth.uid()
));

-- Allow students to delete their own chat history
CREATE POLICY IF NOT EXISTS "Students can delete own chat history"
ON chat_history FOR DELETE
TO authenticated
USING (student_id IN (
  SELECT id FROM students WHERE auth_user_id = auth.uid()
));

-- ============================================
-- Storage: Allow students to manage avatars
-- ============================================

-- Allow students to upload their own avatar
CREATE POLICY IF NOT EXISTS "Students can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = 'student-avatars'
);

-- Allow students to update their own avatar
CREATE POLICY IF NOT EXISTS "Students can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = 'student-avatars'
);

-- Allow students to delete their own avatar
CREATE POLICY IF NOT EXISTS "Students can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = 'student-avatars'
);

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. The service role key bypasses RLS, so the 
--    delete-account API uses it for admin operations
-- 2. These policies allow authenticated students
--    to delete their own data if needed
-- 3. The avatars bucket must exist (created by
--    create_avatars_storage_bucket.sql)
-- ============================================

