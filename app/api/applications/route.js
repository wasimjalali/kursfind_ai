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

    // Log incoming data for debugging
    console.log('Received application data:', {
      courseId: body.courseId,
      providerId: body.providerId,
      preferredStartDate: body.preferredStartDate
    })

    // Prepare data for database insert
    // Build message with all extra info (registration status, start date, etc.)
    let fullMessage = ''
    if (body.registrationStatus) {
      fullMessage += `Registriert bei: ${body.registrationStatus}\n`
    }
    if (body.preferredStartDate) {
      fullMessage += `Gewünschter Starttermin: ${body.preferredStartDate}\n`
    }
    if (body.message) {
      fullMessage += `\n${body.message}`
    }
    
    // Only include fields that definitely exist in the applications table
    const applicationData = {
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      course_id: parseInt(body.courseId),
      provider_id: parseInt(body.providerId),
      funding_type: body.fundingType,
      message: fullMessage.trim() || null,
      status: 'new',
      provider_viewed: false,
      applied_at: new Date().toISOString()
    }
    
    // Only add student_id if we have one
    if (studentId) {
      applicationData.student_id = studentId
    }

    // For guests (no studentId): Check if they already applied with same email + course
    // Logged-in users are handled by DB constraint (student_id + course_id)
    if (!studentId) {
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('email', body.email.toLowerCase())
        .eq('course_id', parseInt(body.courseId))
        .is('student_id', null)  // Only check guest applications
        .limit(1)
        .single()
      
      if (existingApplication) {
        console.log('Guest already applied:', body.email, 'for course:', body.courseId)
        return Response.json(
          { 
            success: false, 
            error: 'Sie haben sich bereits für diesen Kurs beworben. Bitte warten Sie, bis der Anbieter sich bei Ihnen meldet. Falls Sie innerhalb von 48 Stunden keine Antwort erhalten, finden Sie die Kontaktdaten des Anbieters auf der Kursseite.',
            code: 'DUPLICATE_GUEST'
          },
          { status: 400 }
        )
      }
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
      console.error('Application data that failed:', JSON.stringify(applicationData, null, 2))
      
      // Provide more specific error message
      let errorMessage = 'Fehler beim Speichern der Bewerbung. Bitte versuchen Sie es später erneut.'
      if (error.code === '23503') {
        errorMessage = 'Ungültige Kurs- oder Anbieter-ID. Bitte laden Sie die Seite neu.'
      } else if (error.code === '23505') {
        errorMessage = 'Sie haben sich bereits für diesen Kurs beworben. Bitte warten Sie, bis der Anbieter sich bei Ihnen meldet. Falls Sie innerhalb von 48 Stunden keine Antwort erhalten, finden Sie die Kontaktdaten des Anbieters auf der Kursseite.'
      }
      
      return Response.json(
        { 
          success: false, 
          error: errorMessage,
          details: error.message,
          code: error.code
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
