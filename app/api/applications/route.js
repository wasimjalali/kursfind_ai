import { createClient } from '@supabase/supabase-js'

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
    const { data: { user } } = await supabase.auth.getUser()
    let studentId = null
    
    if (user) {
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()
      studentId = studentData?.id || null
    }

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
