-- CORRECT PROVIDERS TABLE SCHEMA
-- This matches the codebase exactly
-- Use Option B (create new table) for safety

-- Step 1: Create new table with correct schema
CREATE TABLE providers_new (
  id BIGSERIAL PRIMARY KEY,  -- Keep numeric ID as primary key (used in foreign keys)
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id TEXT UNIQUE,  -- TEXT unique (NOT primary key - used for lookups)
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,  -- NOT contact_person
  phone TEXT NULL,
  website TEXT NULL,  -- NOT website_url
  description TEXT NULL,  -- Single description field (NOT short_description/full_description)
  street TEXT NULL,
  city TEXT NULL,
  postal_code TEXT NULL,
  logo_url TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes
CREATE INDEX idx_providers_new_auth_user_id ON providers_new(auth_user_id);
CREATE INDEX idx_providers_new_provider_id ON providers_new(provider_id);
CREATE INDEX idx_providers_new_email ON providers_new(email);

-- Step 3: Enable Row Level Security
ALTER TABLE providers_new ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
CREATE POLICY "Users can view own provider profile"
  ON providers_new
  FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own provider profile"
  ON providers_new
  FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own provider profile"
  ON providers_new
  FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Public can view providers"
  ON providers_new
  FOR SELECT
  USING (true);

-- Step 5: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_providers_new_updated_at
  BEFORE UPDATE ON providers_new
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Grant permissions
GRANT USAGE ON SEQUENCE providers_new_id_seq TO authenticated;
GRANT ALL ON providers_new TO authenticated;

-- Step 7: Migrate data from old table (if exists and has compatible columns)
-- Only copy data that matches - adjust column mappings as needed
INSERT INTO providers_new (
  provider_id,
  email,
  company_name,
  contact_name,
  phone,
  website,
  description,
  street,
  city,
  postal_code,
  logo_url,
  created_at,
  updated_at
)
SELECT 
  provider_id::TEXT,  -- Convert numeric to text if needed
  COALESCE(email, ''),
  COALESCE(company_name, 'Unknown Company'),
  COALESCE(contact_person, contact_name, 'Unknown Contact'),  -- Try both old column names
  phone,
  website_url,  -- Map from old column name
  COALESCE(short_description, full_description, description),  -- Combine or use available
  address,  -- Map from old column name if exists
  city,
  postal_code,
  logo_url,
  created_at,
  updated_at
FROM providers
WHERE NOT EXISTS (
  SELECT 1 FROM providers_new WHERE providers_new.provider_id = providers.provider_id::TEXT
)
ON CONFLICT DO NOTHING;

-- Step 8: After verifying data migration, rename tables
-- UNCOMMENT THESE LINES ONLY AFTER VERIFYING THE NEW TABLE IS CORRECT:
-- ALTER TABLE providers RENAME TO providers_old_backup;
-- ALTER TABLE providers_new RENAME TO providers;

-- Step 9: Update foreign key constraints in other tables (if needed)
-- The foreign keys in course_views and course_clicks reference providers.id
-- These should continue to work since we're keeping the numeric id as primary key

