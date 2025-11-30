/**
 * GET /api/notifications
 * 
 * Fetches notifications for the current authenticated user (student or provider).
 * 
 * Query params:
 * - role: 'student' | 'provider' (required)
 * - onlyUnread: 'true' | 'false' (optional, default: false)
 * - limit: number (optional, default: 50)
 * - offset: number (optional, default: 0)
 */

import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const onlyUnread = searchParams.get('onlyUnread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    
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
    
    // Build query
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('role', role)
    
    // Filter by user ID based on role
    if (role === 'student') {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('provider_id', userId)
    }
    
    // Filter by read status if requested
    if (onlyUnread) {
      query = query.eq('is_read', false)
    }
    
    // Order and paginate
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    const { data: notifications, error: queryError } = await query
    
    if (queryError) {
      console.error('Error fetching notifications:', queryError)
      return Response.json(
        { success: false, error: 'Fehler beim Laden der Benachrichtigungen' },
        { status: 500 }
      )
    }
    
    // Transform to camelCase for frontend
    const transformedNotifications = notifications.map(n => ({
      id: n.id,
      type: n.type,
      category: n.category,
      title: n.title,
      message: n.message,
      link: n.link,
      isRead: n.is_read,
      createdAt: n.created_at
    }))
    
    return Response.json({
      success: true,
      notifications: transformedNotifications
    })
    
  } catch (error) {
    console.error('Error in GET /api/notifications:', error)
    return Response.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
