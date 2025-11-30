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
      .eq('provider_id', provider.provider_id || provider.id.toString())
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

    // Generate slug from title
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Check if slug is unique, if not append number
    let slug = generateSlug(body.title);
    let slugCounter = 1;
    let finalSlug = slug;
    
    while (true) {
      const { data: existingCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', finalSlug)
        .single();
      
      if (!existingCourse) break;
      
      finalSlug = `${slug}-${slugCounter}`;
      slugCounter++;
    }

    // Prepare course data
    // Use provider.provider_id (TEXT slug) not provider.id (numeric)
    // provider_id is automatically set - do NOT allow it in body
    const courseData = {
      provider_id: provider.provider_id || provider.id.toString(), // Auto-set from logged-in provider
      slug: finalSlug,
      title: body.title,
      subtitle: body.subtitle || null,
      description: body.description,
      location: body.location || null,
      format: body.format || 'Online',
      duration: body.duration || null,
      duration_hours: body.duration_hours || null,
      price: body.price || null,
      price_type: body.price_type || 'Einmalzahlung',
      funding_eligible: body.funding_eligible !== undefined ? body.funding_eligible : true,
      // Note: Database column is funding_types (plural), not funding_type
      funding_types: body.funding_types || null,
      benefits: body.benefits || null,
      start_date: body.start_date || null,
      next_start_dates: body.next_start_dates || null,
      image_url: body.image_url || null,
      prerequisites: body.prerequisites || [],
      learning_objectives: body.learning_objectives || [],
      target_audience: body.target_audience || [],
      certificate_type: body.certificate_type || null,
      career_paths: body.career_paths || null,
      curriculum: body.curriculum || null,
      job_placement_rate: body.job_placement_rate || null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      keywords: body.keywords || [],
      badges: body.badges || [],
      infomaterial_url: body.infomaterial_url || null,
      is_active: body.is_active !== undefined ? body.is_active : true,
      is_featured: body.is_featured !== undefined ? body.is_featured : false,
      status: body.status || 'draft',
      views_count: 0,
      clicks_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      .eq('provider_id', provider.provider_id || provider.id.toString())
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
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Titel und Beschreibung sind Pflichtfelder' },
        { status: 400 }
      );
    }

    // Validate location for Präsenz/Hybrid format
    if ((body.format === 'Präsenz' || body.format === 'Hybrid') && !body.location) {
      return NextResponse.json(
        { error: 'Standort ist erforderlich für Präsenz- und Hybrid-Kurse' },
        { status: 400 }
      );
    }

    // Validate funding types if funding is eligible
    if (body.funding_eligible && (!body.funding_types || body.funding_types.length === 0) && !body.funding_type) {
      return NextResponse.json(
        { error: 'Bitte wählen Sie mindestens eine Förderungsart aus, wenn der Kurs förderungsfähig ist' },
        { status: 400 }
      );
    }

    // Prepare update data
    // provider_id is NOT editable - it's set automatically and verified above
    const updateData = {
      title: body.title,
      subtitle: body.subtitle || null,
      description: body.description,
      location: body.location || null,
      format: body.format || existingCourse.format || 'Online',
      duration: body.duration || null,
      duration_hours: body.duration_hours || null,
      price: body.price || null,
      price_type: body.price_type || existingCourse.price_type || 'Einmalzahlung',
      funding_eligible: body.funding_eligible !== undefined ? body.funding_eligible : existingCourse.funding_eligible,
      // Note: Database column is funding_types (plural), not funding_type
      funding_types: body.funding_types || null,
      benefits: body.benefits || null,
      start_date: body.start_date || null,
      next_start_dates: body.next_start_dates || null,
      // Handle image_url: use new value if provided, otherwise keep existing
      image_url: body.image_url !== undefined && body.image_url !== '' ? body.image_url : existingCourse.image_url,
      prerequisites: body.prerequisites || [],
      learning_objectives: body.learning_objectives || [],
      target_audience: body.target_audience || [],
      certificate_type: body.certificate_type || null,
      career_paths: body.career_paths || null,
      curriculum: body.curriculum || null,
      job_placement_rate: body.job_placement_rate || null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      keywords: body.keywords || [],
      badges: body.badges || [],
      infomaterial_url: body.infomaterial_url || null,
      is_active: body.is_active !== undefined ? body.is_active : existingCourse.is_active,
      is_featured: body.is_featured !== undefined ? body.is_featured : existingCourse.is_featured,
      status: body.status || existingCourse.status || 'active',
      updated_at: new Date().toISOString(),
    };

    // Update course
    const { data: course, error: updateError } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId)
      .eq('provider_id', provider.provider_id || provider.id.toString())
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
      .eq('provider_id', provider.provider_id || provider.id.toString())
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
      .eq('provider_id', provider.provider_id || provider.id.toString());

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
