import { createClient } from '@supabase/supabase-js'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString()
    }
    
    // If status is being updated
    if (body.status) {
      updateData.status = body.status
      updateData.provider_viewed = true
      updateData.provider_viewed_at = new Date().toISOString()
      
      // If marking as contacted, set last_contacted_at
      if (body.status === 'contacted') {
        updateData.last_contacted_at = new Date().toISOString()
      }
    }
    
    // If explicitly marking as viewed
    if (body.provider_viewed !== undefined) {
      updateData.provider_viewed = body.provider_viewed
      if (body.provider_viewed && !updateData.provider_viewed_at) {
        updateData.provider_viewed_at = new Date().toISOString()
      }
    }
    
    // If adding notes
    if (body.provider_notes !== undefined) {
      updateData.provider_notes = body.provider_notes
    }
    
    // Update in database
    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Update error:', error)
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
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

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      return Response.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      )
    }
    
    // Map fields to match expected format
    const mappedData = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      course_title: data.course_name,
      course_id: data.course_id,
      provider_id: data.provider_id,
      funding_type: data.funding_type,
      status: data.status || 'new',
      provider_viewed: data.provider_viewed || false,
      applied_at: data.submitted_at,
      registration_status: data.registration_status,
      message: data.message,
      preferred_start_date: data.preferred_start_date,
      provider_notes: data.provider_notes,
      provider_viewed_at: data.provider_viewed_at,
      last_contacted_at: data.last_contacted_at,
      updated_at: data.updated_at
    }
    
    return Response.json({ success: true, data: mappedData })
    
  } catch (error) {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
