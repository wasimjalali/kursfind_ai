# Step-by-Step: Enable Leaked Password Protection

## 📍 Location
**Supabase Dashboard → Authentication → Settings → Password**

---

## 🚀 Step-by-Step Instructions

### Step 1: Navigate to Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in to your account
3. Select your project: **kursfind** (or your project name)

### Step 2: Open Authentication Settings
1. In the left sidebar, click **"Authentication"**
2. Click **"Settings"** (or look for a settings/gear icon)
3. Click on the **"Password"** tab (or section)

### Step 3: Enable Leaked Password Protection
1. Look for the section titled **"Password Security"** or **"Password Protection"**
2. Find the option: **"Check passwords against HaveIBeenPwned database"**
3. **Toggle it ON** (switch should turn blue/green when enabled)

### Step 4: Save Changes
1. Click **"Save"** or **"Update"** button (usually at the bottom of the page)
2. Wait for confirmation message: "Settings updated successfully"

---

## ✅ What This Does

**Leaked Password Protection:**
- Checks user passwords against the [HaveIBeenPwned](https://haveibeenpwned.com/) database
- Prevents users from using passwords that have been compromised in data breaches
- Enhances security by blocking weak/compromised passwords
- Works automatically during user signup and password changes

---

## 📸 What to Look For

**The setting should look like:**

```
┌─────────────────────────────────────────────────┐
│ Password Security                                 │
├─────────────────────────────────────────────────┤
│ ☑ Check passwords against HaveIBeenPwned        │
│   database                                       │
│                                                  │
│   This prevents users from using passwords      │
│   that have been compromised in data breaches.   │
│                                                  │
│   [Save] [Cancel]                                │
└─────────────────────────────────────────────────┘
```

**Or it might be a toggle switch:**

```
Check passwords against HaveIBeenPwned database
[  OFF  ] ← Click to turn ON
```

---

## ⚙️ Additional Password Settings (Optional)

While you're there, you might see these settings:

### Password Requirements (Optional - Already Set)
- **Minimum password length:** Usually 6-8 characters (your app requires 6)
- **Require uppercase:** Optional
- **Require lowercase:** Optional
- **Require numbers:** Optional
- **Require special characters:** Optional

**Recommendation:** Leave these as they are unless you want to strengthen requirements.

### Password Reset (Optional - Review)
- **Password reset email template:** Usually already configured
- **Password reset URL:** Should point to your app's reset page

**Recommendation:** Review but don't change unless needed.

---

## 🔍 If You Can't Find It

**Alternative locations to check:**

1. **Authentication → Policies → Password**
2. **Project Settings → Authentication → Password**
3. **Settings → Auth → Password Security**

**If still not found:**
- The feature might be in a different section
- It might be called "Password Breach Detection" or "Compromised Password Check"
- Check the Supabase documentation for your specific version

---

## ✅ Verification

**After enabling:**

1. **Check the Linter:**
   - Go to: **Database → Linter**
   - The "Leaked Password Protection Disabled" warning should disappear

2. **Test it (optional):**
   - Try signing up with a known compromised password (like "password123")
   - You should see an error message about the password being compromised

---

## 📝 Summary

**What to do:**
1. ✅ Go to: **Authentication → Settings → Password**
2. ✅ Find: **"Check passwords against HaveIBeenPwned database"**
3. ✅ Toggle: **ON**
4. ✅ Click: **Save**

**That's it!** The warning will disappear from the Linter once enabled.

---

## 🎯 Expected Result

After enabling:
- ✅ Warning disappears from Database → Linter
- ✅ Users can't use compromised passwords
- ✅ Better security for your application
- ✅ All security warnings resolved (except citext, which is safe to ignore)

