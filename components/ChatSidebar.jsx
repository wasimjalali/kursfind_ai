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
        { icon: '⚙️', label: 'Profil', href: '/student/dashboard/profile', desktopOnly: true }
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
                src="/Assets/kursfind-new-logo.PNG" 
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
                        <span className="text-base lg:text-lg font-medium">{item.label}</span>
                      </button>
                    );
                  }
            
            // Hide desktop-only items on mobile
            if (item.desktopOnly) {
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all"
                >
                  <span className="w-5 h-5 flex items-center justify-center text-lg">{item.icon}</span>
                  <span className="text-base lg:text-lg font-medium">{item.label}</span>
                </Link>
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

        {/* Chat History - No section header */}
        {user && conversations.today.length > 0 && (
          <div className="px-4 space-y-1">
                    {conversations.today.map((conv, idx) => (
                      <Link
                        key={idx}
                        href={`/chat/${conv.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-base lg:text-lg text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="truncate">{conv.title}</span>
                      </Link>
                    ))}
            </div>
          )}

        {/* Bottom Section - Mobile: Settings, Desktop: User Profile */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          {user && student ? (
            <>
              {/* Mobile: Settings Link */}
              <Link
                href="/student/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex lg:hidden items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-base lg:text-lg font-semibold text-gray-900">Einstellungen</div>
                  <div className="text-sm lg:text-base text-gray-600 truncate">{student.email}</div>
                </div>
              </Link>

              {/* Desktop: User Profile */}
              <div className="hidden lg:flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                {student.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base lg:text-lg font-semibold text-gray-900 truncate">
                  {student.first_name} {student.last_name}
                </div>
                <div className="text-sm lg:text-base text-gray-600 truncate">
                  {student.email}
                </div>
              </div>
            </div>
            </>
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
