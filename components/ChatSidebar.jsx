'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ChatSidebar({ isOpen, setIsOpen }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [conversations, setConversations] = useState({
    today: [],
    yesterday: [],
    last7Days: [],
    lastMonth: []
  });

  useEffect(() => {
    checkUser();
    loadConversations();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      setStudent(studentData);
    }
  };

  const loadConversations = async () => {
    // Load chat history grouped by date
    // Implementation: Fetch from chat_history table
    // Group by date ranges
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
        { icon: '📝', label: 'Bewerbungen', href: '/student/dashboard/applications' },
        { icon: '⚙️', label: 'Profil', href: '/student/dashboard/profile' }
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

      {/* Sidebar - Overlay on mobile, fixed on desktop */}
      <aside 
        className={`
          fixed lg:relative
          inset-y-0 left-0
          w-[80vw] max-w-[280px] lg:w-[260px]
          bg-gray-50
          h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-40 lg:z-auto
          overflow-y-auto
          border-r border-gray-200
          flex flex-col
        `}
      >
        
        {/* Header with Logo */}
        <div className="p-4 border-b border-gray-200 relative">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/Assets/Kursfind-logo.png" 
              alt="Kursfind AI" 
              width={48} 
              height={48}
              className="rounded-lg"
            />
            <span className="font-bold text-lg text-gray-900">
              Kursfind AI
            </span>
          </Link>
          
          {/* Close X button - mobile only */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-200 rounded-lg transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation - Flat list */}
        <nav className="flex-1 px-4 py-6 space-y-1">
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
                  <span className="text-sm font-medium">{item.label}</span>
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
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

        </nav>

        {/* Chat History - No section header */}
        {user && conversations.today.length > 0 && (
          <div className="px-4 space-y-1">
            {conversations.today.map((conv, idx) => (
              <Link
                key={idx}
                href={`/chat/${conv.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-sm text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="truncate">{conv.title}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Section - User Profile or Login */}
        <div className="p-4 border-t border-gray-200">
          {user && student ? (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                {student.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {student.first_name} {student.last_name}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {student.email}
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/student/login"
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
