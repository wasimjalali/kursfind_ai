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
      if (student?.id) loadConversations();
    };
    window.addEventListener('chatHistoryUpdated', handleChatHistoryUpdate);
    return () => window.removeEventListener('chatHistoryUpdated', handleChatHistoryUpdate);
  }, [student?.id]);

  const checkUser = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;
    setUser(user);

    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    
    if (studentData) setStudent(studentData);
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
        .order('created_at', { ascending: false });
      
      if (error) return;
      
      const conversationsMap = new Map();
      if (chatMessages?.length > 0) {
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
          conversationsMap.get(convId).messages.push({ role: msg.role, content: msg.content });
        });
      }
      
      setConversations(Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 50));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const menuItems = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ), 
      label: 'Alle Kurse', 
      href: '/courses' 
    },
  ];
  
  if (!user) {
    menuItems.push({ 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ), 
      label: 'Konto Erstellen', 
      href: '/student/signup' 
    });
  }
  
  if (user) {
    menuItems.push(
      { 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ), 
        label: 'Dashboard', 
        href: '/student/dashboard' 
      },
      { 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ), 
        label: 'Gespeicherte Kurse', 
        href: '/student/dashboard/saved' 
      },
      { 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ), 
        label: 'Bewerbungen', 
        href: '/student/dashboard/applications' 
      }
    );
  }

  // Tooltip component - using fixed positioning to escape overflow containers
  const Tooltip = ({ text }) => (
    <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap shadow-lg"
      style={{ zIndex: 99999 }}
    >
      {text}
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
    </div>
  );

  return (
    <>
      {/* Backdrop overlay - mobile only */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on desktop, toggle controls width */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-50
          bg-white border-r border-gray-200
          flex flex-col
          transition-all duration-200 ease-in-out
          shadow-lg overflow-visible
          ${isOpen ? 'w-[260px]' : 'w-[60px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header: Logo on LEFT, Toggle on RIGHT when open */}
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-3 py-3 border-b border-gray-100 overflow-visible`}>
          {/* Logo + Text - LEFT side when open */}
          {isOpen && (
            <Link href="/suchen" className="flex items-center gap-2 cursor-pointer">
              <Image 
                src="/Assets/kursfind-ai-logo.jpg" 
                alt="Kursfind AI" 
                width={44} 
                height={44}
                className="rounded-lg"
              />
              <span className="font-bold text-gray-900 text-base">Kursfind AI</span>
            </Link>
          )}
          
          {/* Toggle Button - RIGHT side when open, centered when collapsed */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 hover:bg-cyan-50 rounded-lg transition-colors text-gray-500 hover:text-cyan-600 cursor-pointer relative group"
            aria-label={isOpen ? "Sidebar schließen" : "Sidebar öffnen"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="18" rx="1"/>
              <rect x="14" y="3" width="7" height="18" rx="1"/>
            </svg>
            {/* Tooltip - only when collapsed */}
            {!isOpen && <Tooltip text="Sidebar öffnen" />}
          </button>
        </div>

        {/* New Search Button - Sparkle icon for AI */}
        <div className="p-2 overflow-visible">
          <button
            onClick={() => window.location.href = '/suchen'}
            className={`
              w-full flex items-center ${isOpen ? 'justify-start gap-3 px-4' : 'justify-center'} py-3
              bg-gradient-to-r from-cyan-500 to-emerald-500 text-white
              rounded-lg font-medium shadow-md cursor-pointer
              hover:shadow-lg hover:scale-[1.02] transition-all
              relative group
            `}
          >
            {/* Sparkle/AI icon */}
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            {isOpen && <span>Neue Suche</span>}
            {/* Tooltip when collapsed */}
            {!isOpen && <Tooltip text="Neue Suche" />}
          </button>
        </div>

        {/* Navigation Items - overflow-visible to show tooltips */}
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-visible">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center py-2.5 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-all cursor-pointer relative group"
              style={{ 
                justifyContent: isOpen ? 'flex-start' : 'center',
                gap: isOpen ? '12px' : '0',
                paddingLeft: isOpen ? '16px' : '0',
                paddingRight: isOpen ? '16px' : '0',
              }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="font-medium text-[15px]">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {!isOpen && <Tooltip text={item.label} />}
            </Link>
          ))}
        </nav>

        {/* Chat History Section - Only when open */}
        {user && student && isOpen && (
          <div className="border-t border-gray-100 flex-1 overflow-y-auto max-h-[250px]">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Verlauf
            </div>
            <div className="px-2 space-y-0.5">
              {conversations.length > 0 ? (
                conversations.slice(0, 8).map((conv, idx) => {
                  const messages = conv.messages || [];
                  const firstUserMessage = messages.find(m => m.role === 'user');
                  const title = firstUserMessage?.content?.substring(0, 30) || 'Chat';
                  
                  return (
                    <Link
                      key={conv.id || idx}
                      href={`/suchen?chat=${conv.id}`}
                      className="block px-3 py-2 text-[15px] text-gray-600 hover:bg-gray-50 rounded-lg truncate cursor-pointer"
                    >
                      {title}...
                    </Link>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-xs text-gray-400">
                  Noch keine Chats
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-2 overflow-visible">
          {user && student ? (
            <Link
              href="/student/dashboard/profile"
              className="flex items-center py-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer relative group"
              style={{ 
                justifyContent: isOpen ? 'flex-start' : 'center',
                gap: isOpen ? '12px' : '0',
                paddingLeft: isOpen ? '8px' : '0',
                paddingRight: isOpen ? '8px' : '0',
              }}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {student.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-medium text-gray-900 truncate">
                    {student.first_name}
                  </div>
                </div>
              )}
              {/* Tooltip when collapsed */}
              {!isOpen && <Tooltip text="Profil" />}
            </Link>
          ) : (
            <Link
              href="/student/login"
              className="flex items-center py-2.5 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-all cursor-pointer relative group"
              style={{ 
                justifyContent: isOpen ? 'flex-start' : 'center',
                gap: isOpen ? '12px' : '0',
                paddingLeft: isOpen ? '16px' : '0',
                paddingRight: isOpen ? '16px' : '0',
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {isOpen && <span className="font-medium text-[15px]">Anmelden</span>}
              {/* Tooltip when collapsed */}
              {!isOpen && <Tooltip text="Anmelden" />}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
