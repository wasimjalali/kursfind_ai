import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * ADMIN-ONLY PROVIDER CREATION ENDPOINT
 * 
 * This endpoint is now restricted to administrative use only.
 * Provider accounts must be manually created by administrators after verification.
 * 
 * Security: Requires ADMIN_API_KEY for authentication.
 * Self-serve provider signup has been disabled.
 */
export async function POST(request) {
  console.log('📥 Provider profile creation request received');
  
  // ============================================
  // ADMIN AUTHENTICATION CHECK
  // ============================================
  const adminApiKey = request.headers.get('x-admin-api-key');
  const expectedAdminKey = process.env.ADMIN_API_KEY;
  
  if (!expectedAdminKey) {
    console.error('❌ ADMIN_API_KEY not configured in environment');
    return NextResponse.json(
      { 
        error: 'Provider signup is now invite-only. Please apply through our application form.',
        info: 'Self-serve registration has been disabled. Contact support for access.'
      },
      { status: 403 }
    );
  }
  
  if (!adminApiKey || adminApiKey !== expectedAdminKey) {
    console.warn('🚫 Unauthorized provider creation attempt - missing or invalid admin key');
    return NextResponse.json(
      { 
        error: 'Provider signup is now invite-only. Please apply through our application form.',
        info: 'This endpoint is restricted to administrators only.'
      },
      { status: 403 }
    );
  }
  
  console.log('✅ Admin authentication successful');
  
  // Create Supabase client using SERVICE ROLE KEY (bypasses RLS)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Validate that we have actual values (not empty strings)
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    console.error('❌ Missing Supabase URL');
    return NextResponse.json(
      { error: 'Server configuration error: Missing Supabase URL' },
      { status: 500 }
    );
  }

  // Prefer service role key (bypasses RLS), fallback to anon key (requires RLS policy)
  const supabaseKey = supabaseServiceKey || supabaseAnonKey;
  
  if (!supabaseKey || supabaseKey.trim() === '') {
    console.error('❌ Missing Supabase credentials');
    return NextResponse.json(
      { error: 'Server configuration error: Missing Supabase credentials' },
      { status: 500 }
    );
  }

  const usingServiceRole = !!supabaseServiceKey;
  console.log(`🔑 Using ${usingServiceRole ? 'SERVICE ROLE' : 'ANON'} key for provider creation`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  });

  try {
    const body = await request.json();
    console.log('📝 Request body:', { ...body, password: '***' });
    
    const { auth_user_id, email, company_name, contact_name, phone, provider_id } = body;

    // Validate required fields
    if (!auth_user_id) {
      console.error('❌ Missing auth_user_id');
      return NextResponse.json(
        { error: 'Fehlende Benutzer-ID. Bitte versuchen Sie es erneut.' },
        { status: 400 }
      );
    }

    if (!email) {
      console.error('❌ Missing email');
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      );
    }

    if (!company_name || !company_name.trim()) {
      console.error('❌ Missing company_name');
      return NextResponse.json(
        { error: 'Firmenname ist erforderlich' },
        { status: 400 }
      );
    }

    if (!contact_name || !contact_name.trim()) {
      console.error('❌ Missing contact_name');
      return NextResponse.json(
        { error: 'Ansprechpartner ist erforderlich' },
        { status: 400 }
      );
    }

    // Prepare provider data
    const providerData = {
      auth_user_id: auth_user_id.trim(),
      email: email.trim().toLowerCase(),
      company_name: company_name.trim(),
      contact_name: contact_name.trim(),
      phone: phone ? phone.trim() : null,
      provider_id: provider_id ? provider_id.trim() : null,
    };

    console.log('💾 Attempting to insert provider data:', { ...providerData, auth_user_id: providerData.auth_user_id.substring(0, 8) + '...' });

    // Insert provider profile using anon key (respects RLS policies)
    const { data, error } = await supabase
      .from('providers')
      .insert([providerData])
      .select()
      .single();

    if (error) {
      console.error('❌ Provider profile creation error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      console.error('📋 Provider data attempted:', providerData);
      
      // Handle RLS policy violations
      if (error.message?.includes('row-level security') || 
          error.message?.includes('RLS') || 
          error.code === '42501') {
        console.error('🚫 RLS policy violation detected');
        return NextResponse.json(
          { 
            error: 'Berechtigungsfehler: Die Registrierung konnte nicht abgeschlossen werden. Bitte kontaktieren Sie den Support. Technischer Fehler: RLS policy violation.' 
          },
          { status: 403 }
        );
      }
      
      // Handle unique constraint violations
      if (error.code === '23505') {
        console.error('🚫 Unique constraint violation');
        if (error.message?.includes('email')) {
          return NextResponse.json(
            { error: 'Diese E-Mail-Adresse ist bereits registriert' },
            { status: 409 }
          );
        }
        if (error.message?.includes('provider_id')) {
          return NextResponse.json(
            { error: 'Dieser Firmenname ist bereits vergeben. Bitte wählen Sie einen anderen.' },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: 'Diese Daten sind bereits registriert' },
          { status: 409 }
        );
      }
      
      // Handle foreign key violations
      if (error.code === '23503') {
        console.error('🚫 Foreign key violation');
        return NextResponse.json(
          { error: 'Ungültige Benutzer-ID. Bitte melden Sie sich erneut an.' },
          { status: 400 }
        );
      }

      // Handle schema/column errors
      if (error.message?.includes('schema cache') || 
          error.message?.includes('column') || 
          error.message?.includes('does not exist')) {
        console.error('🚫 Schema/column error');
        return NextResponse.json(
          { 
            error: `Datenbankfehler: Die Tabelle oder Spalte existiert möglicherweise nicht. Bitte überprüfen Sie die Datenbankstruktur. Fehler: ${error.message}` 
          },
          { status: 500 }
        );
      }

      // Generic error
      console.error('❌ Generic error:', error);
      return NextResponse.json(
        { 
          error: error.message || 'Fehler beim Erstellen des Provider-Profils. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.' 
        },
        { status: 500 }
      );
    }

    console.log('✅ Provider profile created successfully:', {
      id: data.id,
      email: data.email,
      company_name: data.company_name,
    });

    return NextResponse.json({ 
      success: true, 
      provider: data 
    });

  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Interner Serverfehler. Bitte versuchen Sie es erneut.' 
      },
      { status: 500 }
    );
  }
}
