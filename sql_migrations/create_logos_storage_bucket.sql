-- ============================================
-- Create Storage Bucket for Provider Logos
-- ============================================
-- Run this in Supabase SQL Editor OR use the
-- Supabase Dashboard Storage UI to create bucket
-- ============================================

-- Create the 'logos' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the logos bucket
-- Allow authenticated users (providers) to upload logos
CREATE POLICY "Providers can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- Allow public read access to all logos
CREATE POLICY "Public read access to logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

-- Allow authenticated users to update logos
CREATE POLICY "Providers can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logos');

-- Allow authenticated users to delete logos
CREATE POLICY "Providers can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logos');

-- ============================================
-- ALTERNATIVE: Create via Supabase Dashboard
-- ============================================
-- If SQL fails, use Supabase Dashboard:
-- 1. Go to Storage
-- 2. Click "New bucket"
-- 3. Name: "logos"
-- 4. Public: YES
-- 5. Click "Create bucket"
-- 
-- Then add policies:
-- 1. Go to Storage > logos > Policies
-- 2. Add INSERT policy for authenticated users
-- 3. Add SELECT policy for public access
-- 4. Add UPDATE policy for authenticated users
-- 5. Add DELETE policy for authenticated users
-- ============================================

