/**
 * PATCH /api/notifications/[id]/read
 * 
 * Marks a single notification as read.
 */

import { createClient } from '@/lib/supabase-server'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    
    if (!id) {
      return Response.json(
        { success: false, error: 'Notification ID is required' },
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
    
    // Update the notification (RLS will ensure user can only update their own)
    const { data, error: updateError } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error marking notification as read:', updateError)
      
      // Check if it's a "not found" error
      if (updateError.code === 'PGRST116') {
        return Response.json(
          { success: false, error: 'Benachrichtigung nicht gefunden' },
          { status: 404 }
        )
      }
      
      return Response.json(
        { success: false, error: 'Fehler beim Aktualisieren' },
        { status: 500 }
      )
    }
    
    return Response.json({
      success: true,
      notification: {
        id: data.id,
        isRead: data.is_read
      }
    })
    
  } catch (error) {
    console.error('Error in PATCH /api/notifications/[id]/read:', error)
    return Response.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
