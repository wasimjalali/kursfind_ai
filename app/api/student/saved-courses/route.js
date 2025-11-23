import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Get student profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Studentenprofil nicht gefunden' },
        { status: 404 }
      );
    }

    // Get all saved courses with course details
    const { data: savedCourses, error: savedError } = await supabase
      .from('saved_courses')
      .select(`
        id,
        saved_at,
        notes,
        courses (
          id,
          title,
          slug,
          description,
          category,
          location,
          start_date,
          duration,
          price,
          image_url
        )
      `)
      .eq('student_id', student.id)
      .order('saved_at', { ascending: false });

    if (savedError) {
      console.error('Error fetching saved courses:', savedError);
      return NextResponse.json(
        { error: 'Fehler beim Abrufen der gespeicherten Kurse' },
        { status: 500 }
      );
    }

    return NextResponse.json({ savedCourses });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { courseId, notes } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Kurs-ID erforderlich' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Get student profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Studentenprofil nicht gefunden' },
        { status: 404 }
      );
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_courses')
      .select('id')
      .eq('student_id', student.id)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Kurs bereits gespeichert' },
        { status: 400 }
      );
    }

    // Save the course
    const { data: saved, error: saveError } = await supabase
      .from('saved_courses')
      .insert([{
        student_id: student.id,
        course_id: courseId,
        notes: notes || null,
      }])
      .select()
      .single();

    if (saveError) {
      console.error('Error saving course:', saveError);
      return NextResponse.json(
        { error: 'Fehler beim Speichern des Kurses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      saved,
      message: 'Kurs erfolgreich gespeichert'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Kurs-ID erforderlich' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Get student profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Studentenprofil nicht gefunden' },
        { status: 404 }
      );
    }

    // Delete the saved course
    const { error: deleteError } = await supabase
      .from('saved_courses')
      .delete()
      .eq('student_id', student.id)
      .eq('course_id', courseId);

    if (deleteError) {
      console.error('Error deleting saved course:', deleteError);
      return NextResponse.json(
        { error: 'Fehler beim Entfernen des Kurses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Kurs erfolgreich entfernt'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
