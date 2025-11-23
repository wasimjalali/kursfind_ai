import { createClient } from '@/lib/supabase-server'

export async function DELETE(req) {
  try {
    const body = await req.json()
    const { conversation_id } = body

    if (!conversation_id) {
      return Response.json({ error: 'conversation_id is required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student ID
    const { data: studentData } = await supabase
      .from('students')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (!studentData) {
      return Response.json({ error: 'Student not found' }, { status: 404 })
    }

    // Delete all messages for this conversation
    // SECURITY: Filter by both conversation_id AND student_id to ensure students can only delete their own chats
    const { error: deleteError } = await supabase
      .from('chat_history')
      .delete()
      .eq('conversation_id', conversation_id)
      .eq('student_id', studentData.id)

    if (deleteError) {
      console.error('Error deleting chat:', deleteError)
      return Response.json({ error: 'Failed to delete chat' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete chat error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

