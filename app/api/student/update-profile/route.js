import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

/**
 * PUT /api/student/update-profile
 * 
 * Updates student profile information (name, phone)
 * Requires authentication
 */
export async function PUT(request) {
  try {
    // Use server client that properly handles auth from cookies/headers
    const supabase = await createClient();
    
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

