import { createClient } from '@supabase/supabase-js'
import { notifyApplicationSubmitted } from '@/lib/notifications'

/**
 * POST /api/applications
 * 
 * Handles course application submissions and stores them in Supabase.
 * 
 * @param {Request} request - Next.js request object
 * @returns {Response} JSON response with success/error status
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName', 
      'email',
      'phone',
      'courseId',
      'providerId',
      'fundingType',
      'gdprConsent'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { 
            success: false, 
            error: `Pflichtfeld fehlt: ${field}` 
          },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return Response.json(
        { 
          success: false, 
          error: 'Ungültige E-Mail-Adresse' 
        },
        { status: 400 }
      )
    }

    // Validate GDPR consent
    if (body.gdprConsent !== true) {
      return Response.json(
        { 
          success: false, 
          error: 'Datenschutzerklärung muss akzeptiert werden' 
        },
        { status: 400 }
      )
    }


    // Initialize Supabase client with service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get student_id if user is logged in
    // Extract auth token from request header
    const authHeader = request.headers.get('authorization')
    let studentId = null
    
    console.log('Auth header present:', !!authHeader)
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      
      // Create client with user's token
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
      
      const { data: { user }, error: userError } = await userSupabase.auth.getUser()
      console.log('Auth user:', user?.id, 'Error:', userError)
      
      if (user) {
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()
        
        console.log('Student lookup:', { studentData, studentError })
        studentId = studentData?.id || null
      }
    }
    
    console.log('Final student_id:', studentId)

    // Prepare data for database insert (camelCase to snake_case)
    const applicationData = {
      student_id: studentId,
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      course_id: body.courseId,
      provider_id: body.providerId,
      funding_type: body.fundingType,
      message: body.message || null,
      gdpr_consent: body.gdprConsent,
      marketing_consent: body.marketingConsent || false,
      // Auto-populated fields
      status: 'new',
      provider_viewed: false,
      source: 'course_page',
      applied_at: new Date().toISOString()
    }

    // Insert into Supabase
    console.log('Attempting to insert:', applicationData)
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return Response.json(
        { 
          success: false, 
          error: 'Fehler beim Speichern der Bewerbung. Bitte versuchen Sie es später erneut.',
          details: error.message
        },
        { status: 500 }
      )
    }

    // Create notifications for student and provider
    if (data[0]) {
      try {
        // Get course name for notification
        const { data: courseData } = await supabase
          .from('courses')
          .select('title')
          .eq('id', body.courseId)
          .single()
        
        const courseName = courseData?.title || 'Kurs'
        const studentName = `${body.firstName} ${body.lastName}`
        
        // Only create notifications if we have valid IDs
        if (studentId && body.providerId) {
          await notifyApplicationSubmitted({
            studentId,
            providerId: body.providerId,
            courseName,
            applicationId: data[0].id,
            studentName
          })
          console.log('Notifications created for application:', data[0].id)
        } else if (body.providerId) {
          // At minimum, notify the provider even if student is not logged in
          const { createProviderNotification, PROVIDER_NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES } = await import('@/lib/notifications')
          await createProviderNotification({
            providerId: body.providerId,
            type: PROVIDER_NOTIFICATION_TYPES.NEW_APPLICATION,
            category: NOTIFICATION_CATEGORIES.APPLICATIONS,
            title: 'Neue Bewerbung',
            message: `${studentName} hat sich für "${courseName}" beworben.`,
            link: `/provider/dashboard/applications`
          })
          console.log('Provider notification created for application:', data[0].id)
        }
      } catch (notifyError) {
        // Don't fail the application if notification fails
        console.error('Error creating notifications:', notifyError)
      }
    }

    // Success response
    return Response.json(
      { 
        success: true, 
        message: 'Bewerbung erfolgreich eingereicht',
        applicationId: data[0]?.id
      },
      { status: 200 }
    )

  } catch (error) {
    // Catch any unexpected errors
    console.error('Application submission error:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' 
      },
      { status: 500 }
    )
  }
}
