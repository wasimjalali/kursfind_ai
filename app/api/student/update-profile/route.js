import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * PUT /api/student/update-profile
 * 
 * Updates student profile information (name, phone)
 * Requires authentication
 */
export async function PUT(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // CRITICAL: Get and verify authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert. Bitte melden Sie sich an.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { first_name, last_name, phone } = body;

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'Vorname und Nachname sind erforderlich' },
        { status: 400 }
      );
    }

    // SECURITY: Use authenticated user's ID, NOT from request body
    const auth_user_id = user.id;

    // Update student profile
    const { data, error } = await supabase
      .from('students')
      .update({
        first_name,
        last_name,
        phone,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', auth_user_id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: error.message || 'Fehler beim Aktualisieren des Profils' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      student: data,
      message: 'Profil erfolgreich aktualisiert' 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

