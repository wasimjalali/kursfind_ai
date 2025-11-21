import { createClient } from '@supabase/supabase-js'

// GET: Fetch single course by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error fetching course:', error)
      return Response.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }
    
    return Response.json({ success: true, data })
    
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT: Update existing course
export async function PUT(request, { params }) {
  try {
    const { slug } = params
    const body = await request.json()
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Prepare update data
    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    }
    
    // Don't allow updating these protected fields via API
    delete updateData.id
    delete updateData.course_id
    delete updateData.slug
    delete updateData.created_at
    delete updateData.provider_id
    delete updateData.view_count
    delete updateData.application_count
    delete updateData.click_count
    
    // Update in database
    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating course:', error)
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return Response.json({ 
      success: true, 
      message: 'Course updated successfully',
      data 
    })
    
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Soft delete (set status to inactive)
export async function DELETE(request, { params }) {
  try {
    const { slug } = params
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Soft delete - just set status to inactive
    const { data, error } = await supabase
      .from('courses')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single()
    
    if (error) {
      console.error('Error deleting course:', error)
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return Response.json({ 
      success: true, 
      message: 'Course deactivated successfully',
      data 
    })
    
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
