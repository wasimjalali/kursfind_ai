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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      if (authError.name !== 'AuthSessionMissingError') {
        console.error('❌ Auth error:', authError);
      }
      return;
    }
    
    if (!user) return;
    
    setUser(user);

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    
    if (!studentError && studentData) {
      setStudent(studentData);
    }
  };

  const loadConversations = async () => {
    if (!student?.id || typeof student.id !== 'number') return;
    
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: chatMessages, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('student_id', student.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
      
      if (error) return;
      
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
      
      const conversationsArray = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 50);
      
      setConversations(conversationsArray);
    } catch (error) {
      console.error('❌ Exception loading conversations:', error);
    }
  };

  const getMenuItems = () => {
    const items = [
      { icon: '🔍', label: 'Alle Kurse', href: '/courses' },
    ];
    
    if (!user) {
      items.push({ icon: '✨', label: 'Konto Erstellen', href: '/student/signup' });
    }
    
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

      {/* Brand Sidebar - Light theme with Cyan/Emerald */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-50
          bg-white border-r border-gray-200
          flex flex-col
          transition-all duration-200 ease-in-out
          shadow-lg
          ${isOpen ? 'w-[260px]' : 'w-[60px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[64px]">
          {/* Logo - visible when open */}
          {isOpen && (
            <Link href="/suchen" className="flex items-center gap-2">
              <Image 
                src="/Assets/kursfind-ai-logo.jpg" 
                alt="Kursfind AI" 
                width={36} 
                height={36}
                className="rounded-lg"
              />
              <span className="font-bold text-gray-900">Kursfind AI</span>
            </Link>
          )}
          
          {/* Toggle Button - Right side when open, centered when collapsed */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 hover:bg-cyan-50 rounded-lg transition-colors text-gray-600 hover:text-cyan-600 ${!isOpen ? 'mx-auto' : ''}`}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="18" rx="1"/>
              <rect x="14" y="3" width="7" height="18" rx="1"/>
            </svg>
          </button>
        </div>

        {/* Primary Action Button - New Chat */}
        <Link
          href="/suchen"
          onClick={() => window.location.href = '/suchen'}
          className={`
            flex items-center justify-center gap-2 mx-3 my-4 py-2.5 px-4
            bg-gradient-to-r from-cyan-500 to-emerald-500 text-white
            rounded-lg font-medium shadow-md
            hover:shadow-lg hover:scale-[1.02] transition-all
            ${!isOpen ? 'px-2' : ''}
          `}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {isOpen && <span>Neue Suche</span>}
        </Link>

        {/* Navigation Items */}
        <nav className="px-2 space-y-1">
          {getMenuItems().map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-gray-600 hover:bg-cyan-50 hover:text-cyan-600
                transition-all relative group
                ${!isOpen ? 'justify-center' : ''}
              `}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="font-medium">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="
                  absolute left-full ml-2 px-3 py-1.5
                  bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm rounded-md
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all whitespace-nowrap z-50 shadow-lg
                ">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Chat History Section */}
        {user && student && isOpen && (
          <div className="flex-1 overflow-y-auto mt-4 border-t border-gray-100">
            <div className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recents {conversations.length > 0 && `(${conversations.length})`}
            </div>
            <div className="space-y-0.5 px-2">
              {conversations.length > 0 ? (
                conversations.map((conv, idx) => {
                  const messages = conv.messages || [];
                  const firstUserMessage = messages.find(m => m.role === 'user');
                  const title = firstUserMessage?.content?.substring(0, 40) || `Chat vom ${new Date(conv.created_at).toLocaleDateString('de-DE')}`;
                  
                  return (
                    <div
                      key={conv.id || idx}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 group"
                    >
                      <Link
                        href={`/suchen?chat=${conv.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-sm text-gray-600 truncate hover:text-cyan-600"
                      >
                        {title}
                      </Link>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const conversationIdToDelete = conv.conversation_id || conv.id;
                          if (confirm('Möchten Sie diesen Chat wirklich löschen?')) {
                            try {
                              const response = await fetch('/api/student/delete-chat', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ conversation_id: conversationIdToDelete })
                              });
                              if (response.ok) {
                                setConversations(prev => prev.filter(c => 
                                  (c.conversation_id || c.id) !== conversationIdToDelete
                                ));
                                window.dispatchEvent(new CustomEvent('chatHistoryUpdated'));
                              }
                            } catch (error) {
                              console.error('❌ Error deleting chat:', error);
                            }
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-500 transition-all"
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
                <div className="px-4 py-6 text-center">
                  <div className="text-gray-400 text-2xl mb-2">💬</div>
                  <div className="text-xs text-gray-400">Noch keine Chats</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="mt-auto border-t border-gray-200 p-3">
          {user && student ? (
            <Link
              href="/student/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 p-2 rounded-lg
                hover:bg-gray-50 transition-all
                ${!isOpen ? 'justify-center' : ''}
              `}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {student.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {student.first_name} {student.last_name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {student.email}
                  </div>
                </div>
              )}
            </Link>
          ) : (
            <Link
              href="/student/login"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-gray-600 hover:bg-cyan-50 hover:text-cyan-600
                transition-all
                ${!isOpen ? 'justify-center' : ''}
              `}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {isOpen && <span className="font-medium">Anmelden</span>}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
