import { createClient } from '@supabase/supabase-js'
import { notifyApplicationStatusChanged } from '@/lib/notifications'
import { sendStudentApplicationAccepted, sendStudentApplicationRejected } from '@/lib/email'

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
        first_name,
        last_name,
        email,
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
    
    // Send notification and email to student if status changed
    if (body.status && body.status !== previousStatus) {
      const courseName = application.courses?.title || 'Kurs'
      const studentEmail = application.email
      const studentName = `${application.first_name} ${application.last_name}`
      
      // Get provider details for the email
      const { data: providerData } = await supabase
        .from('providers')
        .select('company_name, email, phone')
        .eq('id', provider.id)
        .single()
      
      const providerName = providerData?.company_name || 'Anbieter'
      
      // Send in-app notification if student is logged in
      if (application.student_id) {
        try {
          await notifyApplicationStatusChanged({
            studentId: application.student_id,
            courseName,
            newStatus: body.status,
            applicationId: id
          })
          console.log('In-app notification sent for application:', id)
        } catch (notifyError) {
          console.error('Error sending in-app notification:', notifyError)
        }
      }
      
      // Send email to student based on new status
      if (studentEmail) {
        try {
          if (body.status === 'converted' || body.status === 'accepted') {
            // Status: Accepted/Converted
            await sendStudentApplicationAccepted({
              studentEmail,
              studentName,
              courseName,
              providerName,
              providerEmail: providerData?.email,
              providerPhone: providerData?.phone
            })
            console.log('[Email] Acceptance email sent to:', studentEmail)
          } else if (body.status === 'rejected') {
            // Status: Rejected
            await sendStudentApplicationRejected({
              studentEmail,
              studentName,
              courseName,
              providerName
            })
            console.log('[Email] Rejection email sent to:', studentEmail)
          }
        } catch (emailError) {
          console.error('[Email] Failed to send status email:', emailError)
        }
      }
    }
    
    return Response.json({ success: true, data: updatedApplication })
    
  } catch (error) {
    console.error('Error updating application:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
