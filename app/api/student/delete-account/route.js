import { createClient } from '@/lib/supabase-server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * DELETE /api/student/delete-account
 * 
 * Deletes student account and all associated data
 * Requires authentication and confirmation
 */
export async function DELETE(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // First, verify authentication with server client (reads from cookies)
    const supabaseAuth = await createClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert. Bitte melden Sie sich an.' },
        { status: 401 }
      );
    }

    // SECURITY: Use authenticated user's ID, NOT from request body
    const auth_user_id = user.id;

    const body = await request.json();
    const { confirmation } = body;

    // Validate confirmation
    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Bestätigung erforderlich' },
        { status: 400 }
      );
    }

    // Use service role key for admin operations (deleting user)
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);

    // Get student ID first
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('auth_user_id', auth_user_id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student nicht gefunden' },
        { status: 404 }
      );
    }

    // Delete associated data (cascade delete if FK constraints are set)
    // 1. Delete saved courses
    await supabase
      .from('saved_courses')
      .delete()
      .eq('student_id', student.id);

    // 2. Delete applications
    await supabase
      .from('applications')
      .delete()
      .eq('student_id', student.id);

    // 3. Delete chat history
    await supabase
      .from('chat_history')
      .delete()
      .eq('student_id', student.id);

    // 4. Delete student profile
    const { error: deleteStudentError } = await supabase
      .from('students')
      .delete()
      .eq('auth_user_id', auth_user_id);

    if (deleteStudentError) {
      console.error('Error deleting student:', deleteStudentError);
      return NextResponse.json(
        { error: 'Fehler beim Löschen des Profils' },
        { status: 500 }
      );
    }

    // 5. Delete auth user (this will cascade delete everything)
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
      auth_user_id
    );

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError);
      return NextResponse.json(
        { error: 'Fehler beim Löschen des Kontos' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Konto erfolgreich gelöscht'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

