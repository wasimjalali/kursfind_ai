import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Create Supabase client
  // Use service role key if available (bypasses RLS for initial profile creation)
  // Otherwise use anon key (respects RLS policies)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Validate that we have actual values (not empty strings)
  if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey) || 
      supabaseUrl.trim() === '' || (supabaseServiceKey.trim() === '' && supabaseAnonKey.trim() === '')) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing Supabase credentials' },
      { status: 500 }
    );
  }

  // Prefer service role key for profile creation (bypasses RLS)
  // This is safe because we're creating the profile right after signup
  const supabaseKey = supabaseServiceKey || supabaseAnonKey;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await request.json();
    const { auth_user_id, email, company_name, contact_name, phone, provider_id } = body;

    // Validate required fields
    if (!auth_user_id || !email || !company_name || !contact_name) {
      return NextResponse.json(
        { error: 'Missing required fields: auth_user_id, email, company_name, and contact_name are required' },
        { status: 400 }
      );
    }

    // Prepare provider data
    const providerData = {
      auth_user_id,
      email,
      company_name,
      contact_name,
      phone: phone || null,
      provider_id: provider_id || null,
    };

    // Insert provider profile using anon key (respects RLS policies)
    const { data, error } = await supabase
      .from('providers')
      .insert([providerData])
      .select()
      .single();

    if (error) {
      console.error('Provider profile creation error:', error);
      
      // Handle specific errors
      if (error.code === '23505') {
        // Unique constraint violation
        return NextResponse.json(
          { error: 'Diese E-Mail-Adresse ist bereits registriert' },
          { status: 409 }
        );
      }
      
      if (error.code === '23503') {
        // Foreign key violation
        return NextResponse.json(
          { error: 'Ungültige Benutzer-ID. Bitte melden Sie sich erneut an.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Fehler beim Erstellen des Provider-Profils' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, provider: data });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

