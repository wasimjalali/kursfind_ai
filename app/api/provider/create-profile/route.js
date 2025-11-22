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
  // If service role key is available, use it; otherwise use anon key
  const supabaseKey = supabaseServiceKey && supabaseServiceKey.trim() !== '' 
    ? supabaseServiceKey 
    : supabaseAnonKey;
  
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
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Provider data attempted:', providerData);
      console.error('Using service role key:', !!supabaseServiceKey && supabaseServiceKey.trim() !== '');
      
      // Handle RLS policy violations
      if (error.message?.includes('row-level security') || error.message?.includes('RLS') || error.code === '42501') {
        console.error('RLS policy violation detected. Service role key may not be set in Vercel.');
        return NextResponse.json(
          { 
            error: 'Berechtigungsfehler: Die Registrierung konnte nicht abgeschlossen werden. Bitte kontaktieren Sie den Support. Technischer Fehler: RLS policy violation. Stellen Sie sicher, dass SUPABASE_SERVICE_ROLE_KEY in Vercel gesetzt ist.' 
          },
          { status: 403 }
        );
      }
      
      // Handle schema cache errors - try with anon key instead
      if (error.message?.includes('schema cache') || error.message?.includes('column') || error.message?.includes('auth_user_id')) {
        console.log('Schema cache/column error detected, trying with anon key...');
        
        // Retry with anon key
        const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        });
        
        const { data: retryData, error: retryError } = await supabaseAnon
          .from('providers')
          .insert([providerData])
          .select()
          .single();
        
        if (retryError) {
          console.error('Retry with anon key also failed:', retryError);
          
          // If still failing with column error, try alternative column name
          if (retryError.message?.includes('auth_user_id') || retryError.message?.includes('column')) {
            console.log('Trying with alternative column name: user_id');
            const alternativeData = {
              ...providerData,
              user_id: providerData.auth_user_id,
            };
            delete alternativeData.auth_user_id;
            
            const { data: altData, error: altError } = await supabaseAnon
              .from('providers')
              .insert([alternativeData])
              .select()
              .single();
            
            if (altError) {
              console.error('Alternative column name also failed:', altError);
              return NextResponse.json(
                { error: `Datenbankfehler: Die Spalte 'auth_user_id' existiert möglicherweise nicht in der Tabelle 'providers'. Bitte überprüfen Sie die Datenbankstruktur. Fehler: ${altError.message}` },
                { status: 500 }
              );
            }
            
            return NextResponse.json({ success: true, provider: altData });
          }
          
          return NextResponse.json(
            { error: `Datenbankfehler: ${retryError.message}. Bitte kontaktieren Sie den Support.` },
            { status: 500 }
          );
        }
        
        return NextResponse.json({ success: true, provider: retryData });
      }
      
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

