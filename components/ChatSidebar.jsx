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
      if (authError.name !== 'AuthSessionMissingError') {
        console.error('❌ Auth error:', authError);
      }
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
      if (studentError.code === 'PGRST116') {
        console.warn('⚠️ No student record found for user:', user.id);
      } else {
        console.error('❌ Error fetching student data:', studentError);
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
    if (!student?.id || typeof student.id !== 'number') {
      console.log('⚠️ No valid student ID available for loading conversations');
      return;
    }
    
    try {
      console.log('📥 Loading chat history for student ID:', student.id);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: chatMessages, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('student_id', student.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Error loading conversations:', error);
        return;
      }
      
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

      {/* Claude-Style Sidebar */}
      <aside 
        className={`
          claude-sidebar
          ${isOpen ? '' : 'collapsed'}
          fixed top-0 left-0 bottom-0
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 lg:transition-none
        `}
      >
        {/* Header with Toggle */}
        <div className="claude-sidebar-header">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="claude-toggle-btn"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {/* Two rectangles icon like Claude */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="18" rx="1" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="18" rx="1" strokeWidth="2"/>
            </svg>
          </button>
          
          {isOpen && (
            <Link href="/suchen" className="claude-brand-text">
              Kursfind AI
            </Link>
          )}
        </div>

        {/* Primary Action Button - New Chat */}
        <button
          onClick={() => {
            window.location.href = '/suchen';
          }}
          className="claude-primary-action"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Neue Suche</span>
        </button>

        {/* Navigation Items */}
        <nav className="px-2">
          {getMenuItems().map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`claude-nav-item ${!isOpen ? 'collapsed' : ''}`}
            >
              <span className="claude-nav-icon text-lg">{item.icon}</span>
              <span className="claude-nav-label">{item.label}</span>
              
              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="claude-tooltip">{item.label}</div>
              )}
            </Link>
          ))}
        </nav>

        {/* Chat History Section */}
        {user && student && (
          <div className="claude-recents-section">
            <div className="claude-recents-header">
              Recents {conversations.length > 0 && `(${conversations.length})`}
            </div>
            <div className="space-y-0.5">
              {conversations.length > 0 ? (
                conversations.map((conv, idx) => {
                  const messages = conv.messages || [];
                  const firstUserMessage = messages.find(m => m.role === 'user');
                  const title = firstUserMessage?.content?.substring(0, 50) || `Chat vom ${new Date(conv.created_at).toLocaleDateString('de-DE')}`;
                  
                  return (
                    <div
                      key={conv.id || idx}
                      className="claude-recent-item group"
                    >
                      <Link
                        href={`/suchen?chat=${conv.id}`}
                        onClick={() => setIsOpen(false)}
                        className="claude-recent-item-text"
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
                              } else {
                                alert('Fehler beim Löschen des Chats');
                              }
                            } catch (error) {
                              console.error('❌ Error deleting chat:', error);
                              alert('Fehler beim Löschen des Chats');
                            }
                          }
                        }}
                        className="claude-recent-item-menu p-1.5 hover:bg-red-900/30 rounded text-red-400"
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
                  <div className="text-gray-500 text-2xl mb-2">💬</div>
                  <div className="text-xs text-gray-500">Noch keine Chats</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="claude-user-section mt-auto">
          {user && student ? (
            <Link
              href="/student/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="claude-user-profile"
            >
              <div className="claude-user-avatar">
                {student.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="claude-user-info">
                <div className="claude-user-name">
                  {student.first_name} {student.last_name}
                </div>
                <div className="claude-user-plan">
                  {student.email}
                </div>
              </div>
              {/* Chevron icon */}
              {isOpen && (
                <svg className="w-4 h-4 text-gray-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </Link>
          ) : (
            <Link
              href="/student/login"
              onClick={() => setIsOpen(false)}
              className="claude-nav-item"
            >
              <svg className="claude-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="claude-nav-label">Anmelden</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
