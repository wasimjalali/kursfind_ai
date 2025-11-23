import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

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
    if (student?.id && typeof student.id === 'number') {
      // Get chat history from last 30 days - MUST filter by student.id (int8)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: history, error: historyError } = await supabase
        .from('chat_history')
        .select('*')
        .eq('student_id', student.id) // CRITICAL: Filter by students.id (int8) - ensures students only see their own chats
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });
      
      if (historyError) {
        console.error('Error loading chat history:', historyError);
        chatHistory = [];
      } else {
        chatHistory = history || [];
      }
    } else {
      console.warn('⚠️ Invalid or missing student ID, cannot load chat history');
      chatHistory = [];
    }
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
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
        >
          + Neue Suche starten
        </Link>
      </div>

      {/* Require authentication */}
      {!user || !student ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Anmeldung erforderlich
          </h3>
          <p className="text-gray-600 mb-6">
            Bitte melden Sie sich an, um Ihren Chat-Verlauf anzuzeigen
          </p>
          <Link
            href="/student/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Jetzt anmelden
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {chatHistory?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Gespeicherte Unterhaltungen</p>
              </div>
            </div>
          </div>

          {/* Chat History List */}
          {chatHistory && chatHistory.length > 0 ? (
        <div className="space-y-4">
          {chatHistory.map((chat) => {
            const messages = chat.messages || [];
            const lastMessage = messages[messages.length - 1];
            
            return (
              <div
                key={chat.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Kurssuche vom {new Date(chat.created_at).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {messages.length} Nachrichten
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/?chat=${chat.id}`}
                    className="px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Fortsetzen →
                  </Link>
                </div>

                {/* Last Message Preview */}
                {lastMessage && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Letzte Nachricht:
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {typeof lastMessage === 'string' ? lastMessage : lastMessage.content || lastMessage.text}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                  <span>
                    Erstellt: {new Date(chat.created_at).toLocaleDateString('de-DE')}
                  </span>
                  {chat.updated_at && (
                    <span>
                      • Zuletzt aktualisiert: {new Date(chat.updated_at).toLocaleDateString('de-DE')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Noch keine Unterhaltungen
          </h3>
          <p className="text-gray-600 mb-6">
            Starten Sie eine KI-gestützte Kurssuche, um passende Weiterbildungen zu finden
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            KI-Kurssuche starten
          </Link>
        </div>
      )}

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-3">
              💡 Über den Chat-Verlauf
            </h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                <span>Ihre Konversationen mit dem KI-Berater werden gespeichert</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                <span>Setzen Sie frühere Suchen fort und verfeinern Sie Ihre Anfragen</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
