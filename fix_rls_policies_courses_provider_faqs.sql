-- ============================================
-- Fix RLS Policies for courses and provider_faqs
-- ============================================
-- These tables have RLS enabled but no policies
-- This script creates appropriate policies for both tables
-- ============================================

-- ============================================
-- 1. COURSES TABLE POLICIES
-- ============================================

-- Policy: Public can view all courses (for browsing)
CREATE POLICY "Public can view courses"
  ON courses
  FOR SELECT
  USING (true);

-- Policy: Providers can insert their own courses
-- Only authenticated providers can insert courses
CREATE POLICY "Providers can insert own courses"
  ON courses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.auth_user_id = auth.uid()
      AND providers.provider_id = courses.provider_id
    )
  );

-- Policy: Providers can update their own courses
-- Providers can only update courses where provider_id matches their own
CREATE POLICY "Providers can update own courses"
  ON courses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.auth_user_id = auth.uid()
      AND providers.provider_id = courses.provider_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.auth_user_id = auth.uid()
      AND providers.provider_id = courses.provider_id
    )
  );

-- Policy: Providers can delete their own courses
CREATE POLICY "Providers can delete own courses"
  ON courses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.auth_user_id = auth.uid()
      AND providers.provider_id = courses.provider_id
    )
  );

-- ============================================
-- 2. PROVIDER_FAQS TABLE POLICIES
-- ============================================

-- Policy: Public can view all provider FAQs (for course pages)
CREATE POLICY "Public can view provider FAQs"
  ON provider_faqs
  FOR SELECT
  USING (true);

-- Policy: Providers can insert their own FAQs
-- Only authenticated providers can insert FAQs for their provider_id
CREATE POLICY "Providers can insert own FAQs"
  ON provider_faqs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.auth_user_id = auth.uid()
      AND providers.provider_id = provider_faqs.provider_id
    )
  );

-- Policy: Providers can update their own FAQs
-- Providers can only update FAQs where provider_id matches their own
CREATE POLICY "Providers can update own FAQs"
  ON provider_faqs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.auth_user_id = auth.uid()
      AND providers.provider_id = provider_faqs.provider_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.auth_user_id = auth.uid()
      AND providers.provider_id = provider_faqs.provider_id
    )
  );

-- Policy: Providers can delete their own FAQs
CREATE POLICY "Providers can delete own FAQs"
  ON provider_faqs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.auth_user_id = auth.uid()
      AND providers.provider_id = provider_faqs.provider_id
    )
  );

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this script, check Supabase Dashboard → Database → Linter
-- The RLS warnings should be resolved

-- To verify policies were created:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('courses', 'provider_faqs')
-- ORDER BY tablename, policyname;

