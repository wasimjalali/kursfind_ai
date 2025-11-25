#!/usr/bin/env node

/**
 * FIX SCRIPT: Create Provider Record for Existing Auth User
 * 
 * Use this when:
 * - Auth user exists in Supabase Auth
 * - But provider record is missing from providers table
 * - Login fails with "Provider not found"
 * 
 * Usage:
 *   node scripts/fix-existing-provider.js
 * 
 * Required Environment Variables:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

const readline = require('readline');

// Check for required environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables!');
  console.error('Required:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nMake sure these are set in your .env.local file');
  process.exit(1);
}

// Initialize Supabase client
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
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fixProvider() {
  console.log('\n🔧 FIX: Create Provider Record for Existing Auth User\n');
  console.log('This script will create a provider record for an existing auth user.\n');

  try {
    // Get the email of the existing auth user
    const email = await question('Provider Email (existing auth user): ');

    if (!email) {
      console.error('❌ Email is required!');
      rl.close();
      return;
    }

    // Step 1: Find the auth user
    console.log('\nStep 1: Looking up auth user...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      rl.close();
      return;
    }

    const authUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!authUser) {
      console.error('❌ No auth user found with email:', email);
      console.error('   The auth user must exist first.');
      rl.close();
      return;
    }

    console.log('✅ Auth user found:', authUser.id);
    console.log('   Email:', authUser.email);
    console.log('   Created:', authUser.created_at);

    // Step 2: Check if provider record already exists
    console.log('\nStep 2: Checking for existing provider record...');
    const { data: existingProvider, error: checkError } = await supabase
      .from('providers')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .maybeSingle();

    if (checkError) {
      console.error('❌ Error checking provider:', checkError.message);
      rl.close();
      return;
    }

    if (existingProvider) {
      console.log('✅ Provider record already exists!');
      console.log('   Provider ID:', existingProvider.id);
      console.log('   Company:', existingProvider.company_name);
      console.log('\n✅ No fix needed - provider can login now.');
      rl.close();
      return;
    }

    console.log('⚠️  No provider record found - will create one.');

    // Step 3: Collect provider information
    console.log('\nStep 3: Collecting provider information...');
    const companyName = await question('Company Name: ');
    const contactName = await question('Contact Person Name: ');
    const phone = await question('Phone (optional): ');

    if (!companyName || !contactName) {
      console.error('❌ Company Name and Contact Name are required!');
      rl.close();
      return;
    }

    const providerId = generateProviderId(companyName);

    console.log('\n📋 Provider Details:');
    console.log(`   Auth User ID: ${authUser.id}`);
    console.log(`   Email: ${email}`);
    console.log(`   Company: ${companyName}`);
    console.log(`   Contact: ${contactName}`);
    console.log(`   Phone: ${phone || 'N/A'}`);
    console.log(`   Provider ID: ${providerId}`);

    const confirm = await question('\n✅ Create this provider record? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Cancelled.');
      rl.close();
      return;
    }

    // Step 4: Create provider record
    console.log('\nStep 4: Creating provider record...');
    const { data: providerData, error: providerError } = await supabase
      .from('providers')
      .insert([{
        auth_user_id: authUser.id,
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
      console.error('❌ Provider record creation failed:', providerError.message);
      console.error('   Error code:', providerError.code);
      console.error('   Details:', providerError.details);
      rl.close();
      return;
    }

    console.log('✅ Provider record created successfully!');
    console.log('   Database ID:', providerData.id);
    console.log('   Provider ID:', providerData.provider_id);

    console.log('\n🎉 SUCCESS!');
    console.log('\nThe provider can now login at:');
    console.log('   http://localhost:3000/provider/login');
    console.log('\nWith credentials:');
    console.log(`   Email: ${email}`);
    console.log('   Password: (their existing password)');

    rl.close();

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error);
    rl.close();
  }
}

// Run the fix
fixProvider();

