import { createClient, createAdminClient } from '@/lib/supabase-server'

export async function DELETE(req) {
  try {
    const body = await req.json()
    const { conversation_id } = body

    console.log('🗑️ DELETE request received for conversation:', conversation_id)

    if (!conversation_id) {
      return Response.json({ error: 'conversation_id is required' }, { status: 400 })
    }

    // Use regular client for authentication
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('❌ Auth error:', authError)
      return Response.json({ error: 'Unauthorized', details: authError.message }, { status: 401 })
    }
    
    if (!user) {
      console.error('❌ No user found')
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.email)

    // Get student ID
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (studentError) {
      console.error('❌ Error fetching student:', studentError)
      return Response.json({ error: 'Student not found', details: studentError.message }, { status: 404 })
    }

    if (!studentData) {
      console.error('❌ No student data found for user:', user.id)
      return Response.json({ error: 'Student not found' }, { status: 404 })
    }

    console.log('✅ Student found:', studentData.id)

    // Use admin client for deletion (bypasses RLS)
    const adminClient = await createAdminClient()

    // First, check if the conversation exists and belongs to this student
    const { data: existingMessages, error: checkError } = await adminClient
      .from('chat_history')
      .select('id, student_id')
      .eq('conversation_id', conversation_id)

    if (checkError) {
      console.error('❌ Error checking conversation:', checkError)
      return Response.json({ error: 'Failed to check conversation', details: checkError.message }, { status: 500 })
    }

    if (!existingMessages || existingMessages.length === 0) {
      console.log('⚠️ No messages found for conversation:', conversation_id)
      return Response.json({ success: true, message: 'No messages to delete', deletedCount: 0 })
    }

    // Verify all messages belong to this student (security check)
    const allBelongToStudent = existingMessages.every(msg => msg.student_id === studentData.id)
    if (!allBelongToStudent) {
      console.error('❌ Security violation: Attempted to delete messages from another student')
      return Response.json({ error: 'Unauthorized: Cannot delete messages from another student' }, { status: 403 })
    }

    console.log(`🗑️ Deleting ${existingMessages.length} messages for conversation:`, conversation_id)

    // Delete all messages for this conversation using admin client
    const { error: deleteError, count } = await adminClient
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

