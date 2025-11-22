# Final Setup Request for Providers Table

## ✅ Tables Swapped Successfully!

Thank you! The table swap is complete. Now we need to set up indexes, RLS policies, and validate foreign keys.

## What We Need:

### 1. **Indexes** (for performance)
Please create these indexes on the `providers` table:

```sql
CREATE INDEX IF NOT EXISTS idx_providers_auth_user_id ON providers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_providers_provider_id ON providers(provider_id);
CREATE INDEX IF NOT EXISTS idx_providers_email ON providers(email);
```

### 2. **RLS Policies** (for security)
Please create these Row Level Security policies:

```sql
-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

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

-- Policy: Public can view providers (for course listings)
CREATE POLICY IF NOT EXISTS "Public can view providers"
  ON providers
  FOR SELECT
  USING (true);
```

### 3. **Trigger for updated_at** (automatic timestamp)
```sql
-- Create function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_providers_updated_at ON providers;
CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. **Foreign Key Validation**

Please **validate** (not recreate) these existing foreign keys - they should still work since we kept `providers.id` as the primary key:

- `course_views.provider_id` → `providers.id` (should still work)
- `course_clicks.provider_id` → `providers.id` (should still work)

**Note:** The `courses.provider_id` field is TEXT and references `providers.provider_id` (not `providers.id`), so it's NOT a foreign key constraint - just a lookup field. This is correct and doesn't need a foreign key.

### 5. **Permissions**
```sql
GRANT USAGE ON SEQUENCE providers_id_seq TO authenticated;
GRANT ALL ON providers TO authenticated;
```

## Summary:

**Please do:**
1. ✅ Add the 3 indexes (auth_user_id, provider_id, email)
2. ✅ Enable RLS and create the 4 policies
3. ✅ Create the updated_at trigger
4. ✅ Validate existing foreign keys (course_views, course_clicks)
5. ✅ Grant permissions

**Skip:**
- ❌ Data migration from providers_old (not needed - new signups will populate correctly)
- ❌ Foreign key for courses.provider_id (it's a TEXT lookup, not a foreign key)

## After Setup:

Once this is complete, the provider signup form at `/provider/signup` should work perfectly! 🎉

Thank you!

