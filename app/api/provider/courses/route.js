import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

// GET - Not used in this implementation but kept for potential future use
export async function GET(request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get provider
    const { data: provider } = await supabase
      .from('providers')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Get all courses for this provider
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('provider_id', provider.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ courses });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new course
export async function POST(request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Bitte melden Sie sich an' },
        { status: 401 }
      );
    }

    // Get provider
    const { data: provider } = await supabase
      .from('providers')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.location) {
      return NextResponse.json(
        { error: 'Titel, Beschreibung und Standort sind Pflichtfelder' },
        { status: 400 }
      );
    }

    // Prepare course data
    const courseData = {
      provider_id: provider.id,
      title: body.title,
      description: body.description,
      location: body.location,
      duration: body.duration || null,
      funding_type: body.funding_type || 'Selbstzahler',
      benefits: body.benefits || null,
      price: body.price || null,
      start_date: body.start_date || null,
      image_url: body.image_url || null,
      is_active: body.is_active !== undefined ? body.is_active : true,
      is_featured: body.is_featured !== undefined ? body.is_featured : false,
      views_count: 0,
      clicks_count: 0,
    };

    // Insert course
    const { data: course, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      course,
      message: 'Kurs erfolgreich erstellt'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/provider/courses:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler beim Erstellen des Kurses' },
      { status: 500 }
    );
  }
}

// PUT - Update existing course
export async function PUT(request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Bitte melden Sie sich an' },
        { status: 401 }
      );
    }

    // Get provider
    const { data: provider } = await supabase
      .from('providers')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Get course ID from URL
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Verify course ownership
    const { data: existingCourse, error: fetchError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('provider_id', provider.id)
      .single();

    if (fetchError || !existingCourse) {
      return NextResponse.json(
        { error: 'Kurs nicht gefunden oder keine Berechtigung' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.location) {
      return NextResponse.json(
        { error: 'Titel, Beschreibung und Standort sind Pflichtfelder' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      title: body.title,
      description: body.description,
      location: body.location,
      duration: body.duration || null,
      funding_type: body.funding_type || 'Selbstzahler',
      benefits: body.benefits || null,
      price: body.price || null,
      start_date: body.start_date || null,
      image_url: body.image_url || existingCourse.image_url,
      is_active: body.is_active !== undefined ? body.is_active : true,
      is_featured: body.is_featured !== undefined ? body.is_featured : false,
      updated_at: new Date().toISOString(),
    };

    // Update course
    const { data: course, error: updateError } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId)
      .eq('provider_id', provider.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating course:', updateError);
      throw updateError;
    }

    return NextResponse.json({ 
      success: true, 
      course,
      message: 'Kurs erfolgreich aktualisiert'
    });

  } catch (error) {
    console.error('Error in PUT /api/provider/courses:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler beim Aktualisieren des Kurses' },
      { status: 500 }
    );
  }
}

// DELETE - Delete course
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Bitte melden Sie sich an' },
        { status: 401 }
      );
    }

    // Get provider
    const { data: provider } = await supabase
      .from('providers')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Get course ID from URL
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Verify course ownership before deleting
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('provider_id', provider.id)
      .single();

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Kurs nicht gefunden oder keine Berechtigung' },
        { status: 404 }
      );
    }

    // Delete course
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
      .eq('provider_id', provider.id);

    if (deleteError) {
      console.error('Error deleting course:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({ 
      success: true,
      message: 'Kurs erfolgreich gelöscht'
    });

  } catch (error) {
    console.error('Error in DELETE /api/provider/courses:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler beim Löschen des Kurses' },
      { status: 500 }
    );
  }
}
