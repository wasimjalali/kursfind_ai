'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ProviderSidebar({ isOpen = false, onClose, setIsOpen }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleToggle = () => {
    if (setIsOpen) {
      setIsOpen(!isOpen);
    } else if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    async function fetchUnreadCount() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      const PROVIDER_ID = 1;
      
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', PROVIDER_ID)
        .eq('provider_viewed', false);
      
      if (!error && count !== null) {
        setUnreadCount(count);
      }
    }
    
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/provider/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Bewerbungen',
      href: '/provider/dashboard/applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: unreadCount,
    },
    {
      name: 'Meine Kurse',
      href: '/provider/dashboard/courses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: 'Analytics',
      href: '/provider/dashboard/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Profil',
      href: '/provider/dashboard/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleToggle}
        />
      )}

      {/* Sidebar - Always visible on desktop */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50
          bg-white border-r border-gray-200
          flex flex-col shadow-lg
          transition-all duration-200 ease-in-out
          ${isOpen ? 'w-[260px]' : 'w-[60px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header: Toggle button + Logo */}
        <div className={`flex items-center ${isOpen ? 'justify-between px-3' : 'justify-center'} py-3 border-b border-gray-100`}>
          {/* Toggle Button - Window icon */}
          <button 
            onClick={handleToggle}
            className="p-2.5 hover:bg-cyan-50 rounded-lg transition-colors text-gray-500 hover:text-cyan-600 relative group"
            aria-label={isOpen ? "Sidebar schließen" : "Sidebar öffnen"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="18" rx="1"/>
              <rect x="14" y="3" width="7" height="18" rx="1"/>
            </svg>
            {/* Tooltip */}
            {!isOpen && (
              <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Sidebar öffnen
              </span>
            )}
          </button>
          
          {/* Logo - visible when open */}
          {isOpen && (
            <Link href="/provider/dashboard" className="flex items-center gap-2">
              <Image 
                src="/Assets/kursfind-ai-logo.jpg" 
                alt="Kursfind AI" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-gray-900">Kursfind AI</span>
            </Link>
          )}
        </div>

        {/* Neuer Kurs Button - With + icon */}
        <div className="p-2">
          <Link
            href="/provider/dashboard/courses/new"
            className={`
              w-full flex items-center ${isOpen ? 'justify-start gap-3 px-4' : 'justify-center'} py-3
              bg-gradient-to-r from-cyan-500 to-emerald-500 text-white
              rounded-lg font-medium shadow-md
              hover:shadow-lg hover:scale-[1.02] transition-all
              relative group
            `}
          >
            {/* Plus icon */}
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {isOpen && <span>Neuer Kurs</span>}
            {/* Tooltip when collapsed */}
            {!isOpen && (
              <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Neuer Kurs
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} py-2.5 rounded-lg
                  transition-all relative group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="font-medium text-sm">{item.name}</span>}
                
                {/* Badge for unread */}
                {item.badge > 0 && (
                  <span className={`
                    ${isOpen ? 'ml-auto' : 'absolute -top-1 -right-1'}
                    inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full
                  `}>
                    {item.badge}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Back to Website */}
        <div className="border-t border-gray-200 p-2">
          <Link 
            href="/"
            className={`
              flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} py-2.5 rounded-lg
              text-gray-600 hover:bg-cyan-50 hover:text-cyan-600
              transition-all relative group
            `}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {isOpen && <span className="font-medium text-sm">Zurück zur Website</span>}
            {/* Tooltip when collapsed */}
            {!isOpen && (
              <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Zurück zur Website
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
