#!/usr/bin/env node

/**
 * ADMIN SCRIPT: Manual Provider Onboarding
 * 
 * This script allows administrators to manually create provider accounts
 * after verification. It creates both the auth user and provider profile.
 * 
 * Usage:
 *   node scripts/admin-create-provider.js
 * 
 * Required Environment Variables:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY (not the anon key!)
 *   - ADMIN_API_KEY (for API authentication)
 * 
 * Security:
 *   - Only run this script in a secure environment
 *   - Never expose service role key in client-side code
 *   - Keep audit logs of all provider creations
 */

const readline = require('readline');

// Check for required environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!ADMIN_API_KEY) {
  console.warn('⚠️  ADMIN_API_KEY not set. The API endpoint will reject requests.');
  console.warn('   Set ADMIN_API_KEY in .env.local to enable API-based creation.');
}

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function generateProviderId(companyName) {
  return companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createProvider() {
  console.log('\n🔐 ADMIN: Manual Provider Onboarding\n');
  console.log('This script will create a new provider account after verification.\n');

  try {
    // Collect provider information
    const email = await question('Provider Email: ');
    const companyName = await question('Company Name: ');
    const contactName = await question('Contact Person Name: ');
    const phone = await question('Phone (optional): ');
    const tempPassword = await question('Temporary Password (min 6 chars): ');

    // Validate inputs
    if (!email || !companyName || !contactName || !tempPassword) {
      console.error('❌ All required fields must be filled!');
      rl.close();
      return;
    }

    if (tempPassword.length < 6) {
      console.error('❌ Password must be at least 6 characters!');
      rl.close();
      return;
    }

    const providerId = generateProviderId(companyName);

    console.log('\n📋 Provider Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Company: ${companyName}`);
    console.log(`   Contact: ${contactName}`);
    console.log(`   Phone: ${phone || 'N/A'}`);
    console.log(`   Provider ID: ${providerId}`);

    const confirm = await question('\n✅ Create this provider account? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Cancelled.');
      rl.close();
      return;
    }

    console.log('\n🚀 Creating provider account...\n');

    // Step 1: Create auth user
    console.log('Step 1: Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: tempPassword,
      email_confirm: true, // Auto-confirm email for admin-created accounts
      user_metadata: {
        role: 'provider',
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        created_by: 'admin',
        created_at: new Date().toISOString()
      }
    });

    if (authError) {
      console.error('❌ Auth user creation failed:', authError.message);
      rl.close();
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Step 2: Create provider profile
    console.log('\nStep 2: Creating provider profile...');
    const { data: providerData, error: providerError } = await supabase
      .from('providers')
      .insert([{
        auth_user_id: authData.user.id,
        email: email.trim().toLowerCase(),
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        phone: phone.trim() || null,
        provider_id: providerId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (providerError) {
      console.error('❌ Provider profile creation failed:', providerError.message);
      console.error('⚠️  Auth user was created but profile failed. Manual cleanup may be needed.');
      console.error('   Auth User ID:', authData.user.id);
      rl.close();
      return;
    }

    console.log('✅ Provider profile created:', providerData.id);

    // Step 3: Send password reset email (optional but recommended)
    console.log('\nStep 3: Sending password reset email...');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/provider/reset-password`
    });

    if (resetError) {
      console.warn('⚠️  Failed to send password reset email:', resetError.message);
      console.warn('   Provider can still log in with temporary password.');
    } else {
      console.log('✅ Password reset email sent');
    }

    console.log('\n✅ SUCCESS! Provider account created.\n');
    console.log('📧 Next Steps:');
    console.log('   1. Notify the provider via email');
    console.log('   2. Provide login URL: /provider/login');
    console.log('   3. Temporary password (if reset email failed):', tempPassword);
    console.log('   4. Recommend they change password on first login\n');

    // Log for audit trail
    console.log('📝 Audit Log Entry:');
    console.log(JSON.stringify({
      action: 'provider_created',
      timestamp: new Date().toISOString(),
      admin: process.env.USER || 'unknown',
      provider_id: providerId,
      auth_user_id: authData.user.id,
      email: email,
      company_name: companyName
    }, null, 2));

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  } finally {
    rl.close();
  }
}

// Run the script
createProvider();

