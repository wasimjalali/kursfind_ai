# Providers Table Schema - Correct Specifications

## Answer to Agent's Questions:

### 1. Primary Key Decision:
**KEEP the existing numeric `id` (bigint) as PRIMARY KEY** and make `provider_id` UNIQUE TEXT.

**Reason:** The codebase uses `providers.id` (numeric) as foreign keys in other tables:
- `course_views.provider_id` → `providers.id`
- `course_clicks.provider_id` → `providers.id`

If we make `provider_id` the primary key, we'd need to update all foreign key references, which is risky.

### 2. Migration Strategy:
**Choose Option B** - Create `providers_new` table first, migrate data, then rename.

This is safer and allows verification before switching.

### 3. Correct Column Names & Types:

**CRITICAL CORRECTIONS to Agent's Proposal:**

| Agent Proposed | ❌ WRONG | ✅ CORRECT (from codebase) |
|----------------|----------|---------------------------|
| `dashboard_user_id` | ❌ | `auth_user_id` (UUID NOT NULL UNIQUE) |
| `contact_person` | ❌ | `contact_name` (TEXT NOT NULL) |
| `website_url` | ❌ | `website` (TEXT NULL) |
| `short_description` + `full_description` | ❌ | `description` (TEXT NULL - single field) |
| `address` | ❌ | `street` (TEXT NULL) |

## Final Correct Schema:

```sql
id: bigint PRIMARY KEY (keep existing)
auth_user_id: uuid NOT NULL UNIQUE (references auth.users)
provider_id: text UNIQUE (NOT primary key)
email: text NOT NULL
company_name: text NOT NULL
contact_name: text NOT NULL  ← NOT "contact_person"
phone: text NULL
website: text NULL  ← NOT "website_url"
description: text NULL  ← Single field, NOT short_description/full_description
street: text NULL  ← NOT "address"
city: text NULL
postal_code: text NULL
logo_url: text NULL
created_at: timestamptz DEFAULT now()
updated_at: timestamptz DEFAULT now()
```

## Why These Column Names Matter:

The codebase uses these exact names in:
- `app/api/provider/create-profile/route.js` - expects `auth_user_id`, `company_name`, `contact_name`
- `components/provider/ProfileForm.jsx` - updates `contact_name`, `website`, `description`, `street`
- All queries use `.eq('auth_user_id', user.id)` - must be `auth_user_id` not `dashboard_user_id`

## Migration Steps:

1. Create `providers_new` with correct schema
2. Migrate compatible data from old table
3. Verify new table works with signup form
4. Rename: `providers` → `providers_old_backup`, `providers_new` → `providers`

## Constraints:

- `auth_user_id`: UUID NOT NULL UNIQUE (foreign key to auth.users)
- `provider_id`: TEXT UNIQUE (for slug-based lookups)
- `email`: TEXT NOT NULL
- `company_name`: TEXT NOT NULL
- `contact_name`: TEXT NOT NULL
- All other fields: TEXT NULL (optional)

