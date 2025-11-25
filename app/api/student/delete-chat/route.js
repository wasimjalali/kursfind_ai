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

    // First, check if the conversation exists
    const { data: existingMessages, error: checkError } = await supabase
      .from('chat_history')
      .select('id')
      .eq('conversation_id', conversation_id)
      .eq('student_id', studentData.id)

    if (checkError) {
      console.error('❌ Error checking conversation:', checkError)
      return Response.json({ error: 'Failed to check conversation' }, { status: 500 })
    }

    if (!existingMessages || existingMessages.length === 0) {
      console.log('⚠️ No messages found for conversation:', conversation_id)
      return Response.json({ success: true, message: 'No messages to delete' })
    }

    console.log(`🗑️ Deleting ${existingMessages.length} messages for conversation:`, conversation_id)

    // Delete all messages for this conversation
    // SECURITY: Filter by both conversation_id AND student_id to ensure students can only delete their own chats
    const { data: deletedData, error: deleteError, count } = await supabase
      .from('chat_history')
      .delete({ count: 'exact' })
      .eq('conversation_id', conversation_id)
      .eq('student_id', studentData.id)

    if (deleteError) {
      console.error('❌ Error deleting chat:', deleteError)
      return Response.json({ error: 'Failed to delete chat', details: deleteError.message }, { status: 500 })
    }

    console.log(`✅ Successfully deleted ${count} messages for conversation:`, conversation_id)
    return Response.json({ success: true, deletedCount: count })
  } catch (error) {
    console.error('Delete chat error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

