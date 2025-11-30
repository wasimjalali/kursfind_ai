import { createClient } from '@supabase/supabase-js'
import { notifyApplicationStatusChanged } from '@/lib/notifications'

/**
 * PUT /api/applications/[id]
 * 
 * Updates an application status (for providers)
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Initialize Supabase with service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    // Verify provider is authenticated
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )
    
    const { data: { user } } = await userSupabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get provider
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()
    
    if (!provider) {
      return Response.json({ error: 'Provider not found' }, { status: 404 })
    }
    
    // Verify application belongs to this provider and get student_id + course info
    const { data: application } = await supabase
      .from('applications')
      .select(`
        provider_id,
        student_id,
        status,
        course_id,
        courses:course_id (title)
      `)
      .eq('id', id)
      .single()
    
    if (!application || application.provider_id !== provider.id) {
      return Response.json({ error: 'Application not found or unauthorized' }, { status: 404 })
    }
    
    const previousStatus = application.status
    
    // Update application
    const updateData = {
      updated_at: new Date().toISOString()
    }
    
    if (body.status) {
      updateData.status = body.status
    }
    
    if (body.provider_viewed !== undefined) {
      updateData.provider_viewed = body.provider_viewed
      if (body.provider_viewed) {
        updateData.provider_viewed_at = new Date().toISOString()
      }
    }
    
    if (body.provider_notes !== undefined) {
      updateData.provider_notes = body.provider_notes
    }
    
    const { data: updatedApplication, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Update error:', error)
      return Response.json({ error: 'Failed to update application' }, { status: 500 })
    }
    
    // Send notification to student if status changed
    if (body.status && body.status !== previousStatus && application.student_id) {
      try {
        const courseName = application.courses?.title || 'Kurs'
        await notifyApplicationStatusChanged({
          studentId: application.student_id,
          courseName,
          newStatus: body.status,
          applicationId: id
        })
        console.log('Status change notification sent for application:', id)
      } catch (notifyError) {
        // Don't fail the update if notification fails
        console.error('Error sending status notification:', notifyError)
      }
    }
    
    return Response.json({ success: true, data: updatedApplication })
    
  } catch (error) {
    console.error('Error updating application:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
