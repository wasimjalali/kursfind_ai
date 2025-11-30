/**
 * GET /api/notifications/unread-count
 * 
 * Returns the count of unread notifications for the current user.
 * 
 * Query params:
 * - role: 'student' | 'provider' (required)
 */

import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
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
        { success: false, error: 'Nicht authentifiziert', unreadCount: 0 },
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
        return Response.json({ success: true, unreadCount: 0 })
      }
      userId = student.id
    } else {
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()
      
      if (providerError || !provider) {
        return Response.json({ success: true, unreadCount: 0 })
      }
      userId = provider.id
    }
    
    // Count unread notifications
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('role', role)
      .eq('is_read', false)
    
    if (role === 'student') {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('provider_id', userId)
    }
    
    const { count, error: countError } = await query
    
    if (countError) {
      console.error('Error counting unread notifications:', countError)
      return Response.json(
        { success: false, error: 'Fehler beim Zählen', unreadCount: 0 },
        { status: 500 }
      )
    }
    
    return Response.json({
      success: true,
      unreadCount: count || 0
    })
    
  } catch (error) {
    console.error('Error in GET /api/notifications/unread-count:', error)
    return Response.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten', unreadCount: 0 },
      { status: 500 }
    )
  }
}
