import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/courses/track
 * 
 * Tracks course views and clicks for analytics.
 * 
 * @param {Request} request - Contains courseId and action ('view' | 'click')
 * @returns {Response} JSON response with success status
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { courseId, action } = body

    // Validate required fields
    if (!courseId || !action) {
      return Response.json(
        { success: false, error: 'Missing courseId or action' },
        { status: 400 }
      )
    }

    // Validate action type
    if (!['view', 'click'].includes(action)) {
      return Response.json(
        { success: false, error: 'Invalid action. Must be "view" or "click"' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Call appropriate database function
    if (action === 'view') {
      const { error } = await supabase.rpc('increment_course_views', {
        course_id_input: parseInt(courseId)
      })

      if (error) {
        console.error('Error incrementing views:', error)
        return Response.json(
          { success: false, error: 'Failed to track view' },
          { status: 500 }
        )
      }
    } else if (action === 'click') {
      const { error } = await supabase.rpc('increment_course_clicks', {
        course_id_input: parseInt(courseId)
      })

      if (error) {
        console.error('Error incrementing clicks:', error)
        return Response.json(
          { success: false, error: 'Failed to track click' },
          { status: 500 }
        )
      }
    }

    // Success response
    return Response.json(
      { success: true, action, courseId },
      { status: 200 }
    )

  } catch (error) {
    console.error('Course tracking error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

