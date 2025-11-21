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

  const navItems = [
    {
      section: 'Kurse',
      items: [
        { icon: '🔍', label: 'Alle Kurse', href: '/courses' },
        { icon: '🎯', label: 'Neue Suche', href: '/suchen', newChat: true },
        { icon: '✨', label: 'Konto Erstellen', href: '/student/signup' },
      ]
    },
    {
      section: 'Dashboard',
      items: [
        { icon: '🏠', label: 'Dashboard', href: '/student/dashboard', auth: true },
        { icon: '❤️', label: 'Gespeicherte Kurse', href: '/student/dashboard/saved', auth: true },
        { icon: '📝', label: 'Bewerbungen', href: '/student/dashboard/applications', auth: true },
      ]
    },
    {
      section: 'Einstellungen',
      items: [
        { icon: '⚙️', label: 'Profil', href: '/student/dashboard/profile', auth: true },
      ]
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-gray-50 border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out w-[260px] flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Header with Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/Assets/Kursfind-logo.png" 
                alt="Kursfind AI" 
                width={64} 
                height={64}
                className="rounded-lg"
              />
              <span className="font-bold text-lg text-gray-900">
                Kursfind AI
              </span>
            </Link>
            
            {/* Toggle/Close button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          
          {/* Main Navigation */}
          {navItems.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">
                {section.section}
              </div>
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  // Hide auth-required items if not logged in
                  if (item.auth && !user) return null;
                  
                  // Special handling for "Neue Suche" - render as button
                  if (item.newChat) {
                    return (
                      <button
                        key={itemIdx}
                        onClick={() => {
                          window.location.href = '/';
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 hover:translate-x-1 transition-all duration-200 text-gray-700 hover:text-gray-900"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  }
                  
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 hover:translate-x-1 transition-all duration-200 text-gray-700 hover:text-gray-900"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Chat History Section */}
          {user && (
            <div>
              <div className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">
                Verlauf
              </div>
              <div className="space-y-1">
                {/* Today's conversations */}
                {conversations.today.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-xs text-gray-600">Heute</div>
                    {conversations.today.map((conv, idx) => (
                      <Link
                        key={idx}
                        href={`/chat/${conv.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 hover:translate-x-1 transition-all duration-200 text-sm text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="truncate">{conv.title}</span>
                      </Link>
                    ))}
                  </>
                )}

                {/* Yesterday's conversations */}
                {conversations.yesterday.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-xs text-gray-600 mt-2">Gestern</div>
                    {conversations.yesterday.map((conv, idx) => (
                      <Link
                        key={idx}
                        href={`/chat/${conv.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 hover:translate-x-1 transition-all duration-200 text-sm text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="truncate">{conv.title}</span>
                      </Link>
                    ))}
                  </>
                )}

                {/* Last 7 Days */}
                {conversations.last7Days.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-xs text-gray-600 mt-2">Letzte 7 Tage</div>
                    {conversations.last7Days.slice(0, 5).map((conv, idx) => (
                      <Link
                        key={idx}
                        href={`/chat/${conv.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 hover:translate-x-1 transition-all duration-200 text-sm text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="truncate">{conv.title}</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

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
