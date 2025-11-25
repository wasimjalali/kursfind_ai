'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ChatSidebar({ isOpen, setIsOpen }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (student?.id) {
      loadConversations();
    }
  }, [student?.id]);

  // Listen for chat history updates
  useEffect(() => {
    const handleChatHistoryUpdate = () => {
      console.log('🔄 Chat history updated - reloading conversations');
      if (student?.id) {
        loadConversations();
      }
    };

    window.addEventListener('chatHistoryUpdated', handleChatHistoryUpdate);
    
    return () => {
      window.removeEventListener('chatHistoryUpdated', handleChatHistoryUpdate);
    };
  }, [student?.id]);

  const checkUser = async () => {
    console.log('🔐 Checking user authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }
    
    if (!user) {
      console.log('👤 User: Not logged in (guest mode)');
      return;
    }
    
    console.log('👤 User: Logged in', user.id);
    setUser(user);

    console.log('📋 Fetching student data for auth_user_id:', user.id);
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    
    if (studentError) {
      // PGRST116 = No rows returned (student record doesn't exist)
      if (studentError.code === 'PGRST116') {
        console.warn('⚠️ No student record found for user:', user.id);
        console.warn('   The user may need to complete student signup.');
      } else {
        console.error('❌ Error fetching student data:');
        console.error('   Code:', studentError.code);
        console.error('   Message:', studentError.message);
        console.error('   Details:', studentError.details);
        console.error('   Hint:', studentError.hint);
      }
    } else if (studentData) {
      console.log('✅ Student data loaded:', {
        id: studentData.id,
        email: studentData.email,
        name: `${studentData.first_name} ${studentData.last_name}`
      });
      setStudent(studentData);
    }
  };

  const loadConversations = async () => {
    // SECURITY: Only load conversations if student.id (int8) is available
    if (!student?.id || typeof student.id !== 'number') {
      console.log('⚠️ No valid student ID available for loading conversations');
      console.log('Student object:', student);
      return;
    }
    
    try {
      console.log('📥 Loading chat history for student ID:', student.id, '(type:', typeof student.id, ')');
      
      // Get chat history from last 30 days
      // SECURITY: MUST filter by student.id (int8) to ensure students only see their own chat history
      // students table: id (int8, PK) | auth_user_id (uuid)
      // chat_history table: student_id (int8, FK → students.id)
      // NOTE: Database stores ONE ROW PER MESSAGE, grouped by conversation_id
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      console.log('🔍 Querying chat_history table...');
      console.log('Query params:', {
        student_id: student.id,
        created_at_gte: thirtyDaysAgo.toISOString()
      });
      
      const { data: chatMessages, error, count } = await supabase
        .from('chat_history')
        .select('*', { count: 'exact' })
        .eq('student_id', student.id) // CRITICAL: Filter by students.id (int8) - ensures data isolation per student
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Error loading conversations:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Check if table exists
        if (error.code === '42P01') {
          console.error('🚨 TABLE DOES NOT EXIST! Run create_chat_history_table.sql in Supabase');
        }
        return;
      }
      
      console.log('✅ Query successful!');
      console.log('Total messages:', count);
      console.log('Loaded chat messages:', chatMessages?.length || 0);
      
      // Group messages by conversation_id
      const conversationsMap = new Map();
      
      if (chatMessages && chatMessages.length > 0) {
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
      }
      
      // Convert map to array and sort by most recent
      const conversationsArray = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 50); // Limit to 50 most recent conversations
      
      console.log('Grouped into', conversationsArray.length, 'conversations');
      if (conversationsArray.length > 0) {
        console.log('Sample conversation:', conversationsArray[0]);
      }
      
      setConversations(conversationsArray);
    } catch (error) {
      console.error('❌ Exception loading conversations:', error);
      console.error('Exception details:', error.message, error.stack);
    }
  };

  // Flat menu structure - no sections
  const getMenuItems = () => {
    const items = [
        { icon: '🔍', label: 'Alle Kurse', href: '/courses' },
        { icon: '🎯', label: 'Neue Suche', href: '/suchen', newChat: true },
    ];
    
    // Add "Konto Erstellen" only if not logged in
    if (!user) {
      items.push({ icon: '✨', label: 'Konto Erstellen', href: '/student/signup' });
    }
    
    // Add auth-required items if logged in
    if (user) {
      items.push(
        { icon: '🏠', label: 'Dashboard', href: '/student/dashboard' },
        { icon: '❤️', label: 'Gespeicherte Kurse', href: '/student/dashboard/saved' },
        { icon: '📝', label: 'Bewerbungen', href: '/student/dashboard/applications' }
      );
    }
    
    return items;
  };

  return (
    <>
      {/* Backdrop overlay - mobile only */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Overlay on both mobile and desktop */}
      <aside 
        className={`
          fixed
          top-14 lg:top-0 bottom-0 left-0
          w-[80vw] max-w-[280px] lg:w-[280px]
          bg-gray-50
          lg:h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          z-40
          overflow-y-auto
          border-r border-gray-200
          flex flex-col
          shadow-xl
        `}
      >
        
        {/* Close X button - mobile only, at top */}
        <div className="p-3 border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto p-1.5 hover:bg-gray-200 rounded-lg transition-colors flex"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header with Logo and Close Button - Desktop only */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200">
          {/* Logo - Left side */}
          <Link href="/suchen" className="flex items-center gap-2">
              <Image 
                src="/Assets/kursfind-ai-logo.jpg" 
                alt="Kursfind AI" 
              width={40} 
              height={40}
                className="rounded-lg"
              />
            <span className="font-bold text-base text-black">
                Kursfind AI
              </span>
            </Link>
            
          {/* Close X button - Right side */}
            <button
            onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        {/* Navigation - Flat list */}
        <nav className="px-4 py-6 space-y-1">
          {getMenuItems().map((item, idx) => {
                  // Special handling for "Neue Suche" - render as button
                  if (item.newChat) {
                    return (
                      <button
                  key={idx}
                        onClick={() => {
                    window.location.href = '/suchen';
                    setIsOpen(false);
                        }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all"
                      >
                  <span className="w-5 h-5 flex items-center justify-center text-lg">{item.icon}</span>
                        <span className="text-base lg:text-lg font-medium">{item.label}</span>
                      </button>
                    );
                  }
                  
                  return (
                    <Link
                key={idx}
                      href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all"
                    >
                <span className="w-5 h-5 flex items-center justify-center text-lg">{item.icon}</span>
                      <span className="text-base lg:text-lg font-medium">{item.label}</span>
                    </Link>
                  );
                })}

        </nav>

        {/* Chat History Section - After Bewerbungen */}
        {user && student && (
          <div className="flex-1 overflow-y-auto border-t border-gray-200">
            <div className="px-4 py-3 bg-gray-100 sticky top-0 z-10">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chat-Verlauf {conversations.length > 0 && `(${conversations.length})`}
              </h3>
            </div>
            <div className="px-4 py-2 space-y-1">
              {conversations.length > 0 ? (
                conversations.map((conv, idx) => {
                  const messages = conv.messages || [];
                  const firstUserMessage = messages.find(m => m.role === 'user');
                  const title = firstUserMessage?.content?.substring(0, 50) || `Chat vom ${new Date(conv.created_at).toLocaleDateString('de-DE')}`;
                  
                  return (
                    <div
                      key={conv.id || idx}
                      className="group relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-sm text-gray-700"
                    >
                      <Link
                        href={`/suchen?chat=${conv.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 flex-1 min-w-0"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="truncate">{title}</span>
                      </Link>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm('Möchten Sie diesen Chat wirklich löschen?')) {
                            try {
                              const response = await fetch('/api/student/delete-chat', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ conversation_id: conv.conversation_id })
                              });
                              if (response.ok) {
                                loadConversations(); // Reload conversations
                              } else {
                                alert('Fehler beim Löschen des Chats');
                              }
                            } catch (error) {
                              console.error('Error deleting chat:', error);
                              alert('Fehler beim Löschen des Chats');
                            }
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-500"
                        title="Chat löschen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-center">
                  <div className="text-gray-400 text-2xl mb-2">💬</div>
                  <div className="text-xs text-gray-500">Noch keine Chats</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Section - Profile or Login */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          {user && student ? (
            <Link
              href="/student/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {student.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-gray-900 truncate">
                  {student.first_name} {student.last_name}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {student.email}
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/student/login"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all text-center block"
            >
              Anmelden
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

