-- Create providers table if it doesn't exist
-- Run this in your Supabase SQL Editor

-- First, check if table exists and drop it if needed (CAREFUL - only if you want to recreate)
-- DROP TABLE IF EXISTS providers CASCADE;

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id BIGSERIAL PRIMARY KEY,
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id TEXT UNIQUE,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  description TEXT,
  street TEXT,
  city TEXT,
  postal_code TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on auth_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_providers_auth_user_id ON providers(auth_user_id);

-- Create index on provider_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_providers_provider_id ON providers(provider_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_providers_email ON providers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can view their own provider profile
CREATE POLICY IF NOT EXISTS "Users can view own provider profile"
  ON providers
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Policy: Users can insert their own provider profile
CREATE POLICY IF NOT EXISTS "Users can insert own provider profile"
  ON providers
  FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Policy: Users can update their own provider profile
CREATE POLICY IF NOT EXISTS "Users can update own provider profile"
  ON providers
  FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Policy: Public can view active providers (for course listings)
CREATE POLICY IF NOT EXISTS "Public can view providers"
  ON providers
  FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_providers_updated_at ON providers;
CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SEQUENCE providers_id_seq TO authenticated;
GRANT ALL ON providers TO authenticated;

