import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

// UPDATE existing course
export async function PUT(request, { params }) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    // Get provider
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!provider) {
      return NextResponse.json({ error: 'Provider nicht gefunden' }, { status: 404 });
    }

    // Unwrap params (Next.js 15+ async params)
    const { id } = await params;

    // Get course data
    const courseData = await request.json();

    // Update course (RLS ensures only provider's own courses can be updated)
    const { data: course, error: updateError } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .eq('provider_id', provider.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 });
    }

    if (!course) {
      return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json(course);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

// DELETE course
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    // Get provider
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!provider) {
      return NextResponse.json({ error: 'Provider nicht gefunden' }, { status: 404 });
    }

    // Unwrap params (Next.js 15+ async params)
    const { id } = await params;

    // Delete course (RLS ensures only provider's own courses can be deleted)
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .eq('provider_id', provider.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
