# Admin Provider Onboarding Guide

## Overview

Provider accounts are now **invite-only** and must be manually created by administrators after verification. This ensures quality control and security for the Kursfind AI platform.

---

## 🔐 Security Model

### Old Flow (Disabled)
- ❌ Public signup page at `/provider/signup`
- ❌ Self-serve account creation
- ❌ Automatic approval

### New Flow (Active)
- ✅ Application form (external/embedded)
- ✅ Manual verification by admin
- ✅ Admin-created accounts only
- ✅ Password setup via email link

---

## 📋 Provider Application Process

### 1. Provider Applies
Interested providers fill out the application form at:
- **Form URL**: `https://forms.gle/your-application-form-link` (update this!)
- **Info Page**: `/provider/signup` (now shows invite-only message)

### 2. Admin Reviews Application
- Check company legitimacy
- Verify contact information
- Assess course quality/relevance
- Approve or reject

### 3. Admin Creates Account
Use one of two methods:

#### Method A: CLI Script (Recommended)
```bash
# Navigate to project root
cd /path/to/kursfind-ai

# Ensure environment variables are set
# Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_API_KEY

# Run the admin script
node scripts/admin-create-provider.js

# Follow the interactive prompts
```

#### Method B: API Endpoint (For Automated Systems)
```bash
curl -X POST https://your-domain.com/api/provider/create-profile \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: YOUR_ADMIN_API_KEY" \
  -d '{
    "auth_user_id": "will-be-created",
    "email": "provider@example.com",
    "company_name": "Example Education GmbH",
    "contact_name": "John Doe",
    "phone": "+49 123 456789",
    "provider_id": "example-education-gmbh"
  }'
```

**Note**: You'll need to create the auth user first via Supabase Admin API, then call this endpoint.

### 4. Notify Provider
Send a welcome email with:
- Login URL: `https://your-domain.com/provider/login`
- Password reset link (auto-sent by script)
- Getting started guide
- Support contact

---

## 🛠️ Setup Instructions

### 1. Environment Variables

Add to `.env.local`:
```bash
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# New variable for admin authentication
ADMIN_API_KEY=generate-a-secure-random-key-here
```

**Generate ADMIN_API_KEY**:
```bash
# On macOS/Linux
openssl rand -hex 32

# Or use any secure random string generator
```

### 2. Update Application Form Link

Edit `/app/provider/signup/page.jsx`:
```jsx
<a
  href="https://forms.gle/YOUR-ACTUAL-FORM-LINK"
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  📝 Zum Bewerbungsformular
</a>
```

### 3. Deploy Changes

```bash
git add -A
git commit -m "feat: Implement invite-only provider onboarding"
git push origin main
```

Ensure environment variables are set in Vercel/production:
- Go to Vercel Dashboard → Settings → Environment Variables
- Add `ADMIN_API_KEY`

---

## 📝 Admin Script Usage

### Prerequisites
```bash
npm install dotenv @supabase/supabase-js
```

### Running the Script
```bash
node scripts/admin-create-provider.js
```

### Interactive Prompts
```
Provider Email: provider@example.com
Company Name: Example Education GmbH
Contact Person Name: John Doe
Phone (optional): +49 123 456789
Temporary Password (min 6 chars): TempPass123!

📋 Provider Details:
   Email: provider@example.com
   Company: Example Education GmbH
   Contact: John Doe
   Phone: +49 123 456789
   Provider ID: example-education-gmbh

✅ Create this provider account? (yes/no): yes
```

### What the Script Does
1. ✅ Creates Supabase auth user
2. ✅ Auto-confirms email (no verification needed)
3. ✅ Creates provider profile in database
4. ✅ Sends password reset email
5. ✅ Logs audit trail

---

## 🔍 Verification Checklist

Before creating a provider account:

- [ ] Company is legitimate (check website, registration)
- [ ] Contact person is verified (email, phone)
- [ ] Courses are relevant to platform
- [ ] Provider agrees to terms of service
- [ ] No duplicate accounts exist
- [ ] Company information is accurate

---

## 🚨 Troubleshooting

### Script Fails: "Missing environment variables"
**Solution**: Ensure `.env.local` has all required variables:
```bash
cat .env.local | grep -E "SUPABASE_URL|SERVICE_ROLE_KEY|ADMIN_API_KEY"
```

### Script Fails: "Auth user created but profile failed"
**Solution**: Manually create provider profile or delete auth user and retry:
```sql
-- In Supabase SQL Editor
DELETE FROM auth.users WHERE id = 'failed-user-id';
```

### Provider Can't Log In
**Possible causes**:
1. Email not confirmed (should be auto-confirmed by script)
2. Wrong password (send password reset)
3. Provider profile not created (check database)

**Solution**:
```bash
# Send password reset
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.auth.resetPasswordForEmail('provider@example.com').then(console.log);
"
```

### API Endpoint Returns 403
**Cause**: Missing or invalid `ADMIN_API_KEY`

**Solution**: 
1. Check header: `x-admin-api-key: YOUR_KEY`
2. Verify key matches environment variable
3. Ensure key is set in production environment

---

## 📊 Audit & Monitoring

### Log Provider Creations
The admin script automatically logs:
```json
{
  "action": "provider_created",
  "timestamp": "2024-11-25T20:30:00.000Z",
  "admin": "admin-username",
  "provider_id": "example-education-gmbh",
  "auth_user_id": "uuid-here",
  "email": "provider@example.com",
  "company_name": "Example Education GmbH"
}
```

### Database Queries
```sql
-- List all providers created today
SELECT * FROM providers 
WHERE created_at::date = CURRENT_DATE 
ORDER BY created_at DESC;

-- Count providers by month
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as provider_count
FROM providers
GROUP BY month
ORDER BY month DESC;
```

---

## 🔄 Reverting to Self-Serve (If Needed)

If you need to re-enable self-serve signup:

1. **Restore signup page**: Revert `/app/provider/signup/page.jsx` from git history
2. **Remove API restriction**: Remove admin key check from `/app/api/provider/create-profile/route.js`
3. **Update login page**: Restore "Jetzt registrieren" link
4. **Deploy changes**

---

## 📧 Email Templates

### Welcome Email Template
```
Subject: Welcome to Kursfind AI - Your Provider Account is Ready

Dear [Contact Name],

Welcome to Kursfind AI! Your provider account has been successfully created.

🔐 Login Details:
- URL: https://kursfind.de/provider/login
- Email: [provider@example.com]
- Password: Please use the password reset link sent separately

📚 Next Steps:
1. Log in to your dashboard
2. Complete your provider profile
3. Add your first course
4. Review our provider guidelines

Need help? Contact us at providers@kursfind.de

Best regards,
Kursfind AI Team
```

---

## 🆘 Support

For questions or issues:
- **Technical**: dev@kursfind.de
- **Provider Relations**: providers@kursfind.de
- **Emergency**: [Admin phone number]

---

## 📚 Related Documentation

- [Provider Dashboard Guide](./PROVIDER_DASHBOARD.md)
- [Course Management Guide](./COURSE_MANAGEMENT.md)
- [API Documentation](./API_DOCS.md)
- [Security Best Practices](./SECURITY.md)

