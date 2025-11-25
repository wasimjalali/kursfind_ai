import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ChatHistoryClient from './ChatHistoryClient';

export default async function ChatHistoryPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get student profile - require authentication
  let student = null;
  let chatHistory = [];
  
  if (user) {
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    student = studentData;
    
    // SECURITY: Only fetch chat history if student.id (int8) exists and is valid
    // students table: id (int8, PK) | auth_user_id (uuid)
    // chat_history table: student_id (int8, FK → students.id)
    // NOTE: Database stores ONE ROW PER MESSAGE, grouped by conversation_id
    if (student?.id && typeof student.id === 'number') {
      // Get chat history from last 30 days - MUST filter by student.id (int8)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: chatMessages, error: historyError } = await supabase
        .from('chat_history')
        .select('*')
        .eq('student_id', student.id) // CRITICAL: Filter by students.id (int8) - ensures students only see their own chats
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });
      
      if (historyError) {
        console.error('Error loading chat history:', historyError);
        chatHistory = [];
      } else if (chatMessages && chatMessages.length > 0) {
        // Group messages by conversation_id
        const conversationsMap = new Map();
        
        chatMessages.forEach(msg => {
          const convId = msg.conversation_id;
          if (!conversationsMap.has(convId)) {
            conversationsMap.set(convId, {
              id: convId,
              conversation_id: convId,
              title: msg.conversation_title || 'Neue Konversation',
              created_at: msg.created_at,
              messages: []
            });
          }
          conversationsMap.get(convId).messages.push({
            role: msg.role,
            content: msg.content
          });
        });
        
        // Convert map to array and sort by most recent
        chatHistory = Array.from(conversationsMap.values())
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else {
        chatHistory = [];
      }
    } else {
      console.warn('⚠️ Invalid or missing student ID, cannot load chat history');
      chatHistory = [];
    }
  }

  // Require authentication
  if (!user || !student) {
    redirect('/student/login');
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Chat-Verlauf 💬
          </h1>
          <p className="text-gray-600 mt-2">
            Ihre Konversationen mit dem KI-Kursberater
          </p>
        </div>
        <Link
          href="/suchen"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
        >
          + Neue Suche
        </Link>
      </div>

      <ChatHistoryClient initialChatHistory={chatHistory} student={student} />
    </div>
  );
}
