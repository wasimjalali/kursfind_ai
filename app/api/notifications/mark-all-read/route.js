/**
 * POST /api/notifications/mark-all-read
 * 
 * Marks all notifications as read for the current user.
 * 
 * Body:
 * - role: 'student' | 'provider' (required)
 */

import { createClient } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { role } = body
    
    // Validate role parameter
    if (!role || !['student', 'provider'].includes(role)) {
      return Response.json(
        { success: false, error: 'Invalid or missing role parameter' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json(
        { success: false, error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }
    
    // Get the user's ID based on role
    let userId = null
    
    if (role === 'student') {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()
      
      if (studentError || !student) {
        return Response.json(
          { success: false, error: 'Student nicht gefunden' },
          { status: 404 }
        )
      }
      userId = student.id
    } else {
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()
      
      if (providerError || !provider) {
        return Response.json(
          { success: false, error: 'Anbieter nicht gefunden' },
          { status: 404 }
        )
      }
      userId = provider.id
    }
    
    // Update all unread notifications for this user
    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('role', role)
      .eq('is_read', false)
    
    if (role === 'student') {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('provider_id', userId)
    }
    
    const { error: updateError } = await query
    
    if (updateError) {
      console.error('Error marking all notifications as read:', updateError)
      return Response.json(
        { success: false, error: 'Fehler beim Aktualisieren' },
        { status: 500 }
      )
    }
    
    return Response.json({
      success: true,
      message: 'Alle Benachrichtigungen als gelesen markiert'
    })
    
  } catch (error) {
    console.error('Error in POST /api/notifications/mark-all-read:', error)
    return Response.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
