-- ============================================
-- Create Storage Bucket for Course Images
-- ============================================
-- Run this in Supabase SQL Editor OR use the
-- Supabase Dashboard Storage UI to create bucket
-- ============================================

-- Create the 'courses' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('courses', 'courses', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Providers can upload course images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to course images" ON storage.objects;
DROP POLICY IF EXISTS "Providers can update course images" ON storage.objects;
DROP POLICY IF EXISTS "Providers can delete course images" ON storage.objects;

-- Set up RLS policies for the courses bucket
-- Allow authenticated users (providers) to upload course images
CREATE POLICY "Providers can upload course images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'courses');

-- Allow public read access to all course images
CREATE POLICY "Public read access to course images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'courses');

-- Allow authenticated users to update course images
CREATE POLICY "Providers can update course images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'courses');

-- Allow authenticated users to delete course images
CREATE POLICY "Providers can delete course images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'courses');

-- ============================================
-- ALTERNATIVE: Create via Supabase Dashboard
-- ============================================
-- If SQL fails, use Supabase Dashboard:
-- 1. Go to Storage
-- 2. Click "New bucket"
-- 3. Name: "courses"
-- 4. Public: YES
-- 5. Click "Create bucket"
-- 
-- Then add policies:
-- 1. Go to Storage > courses > Policies
-- 2. Add INSERT policy for authenticated users
-- 3. Add SELECT policy for public access
-- 4. Add UPDATE policy for authenticated users
-- 5. Add DELETE policy for authenticated users
-- ============================================
