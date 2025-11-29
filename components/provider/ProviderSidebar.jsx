'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ProviderSidebar({ isOpen = false, onClose }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnreadCount() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      // TODO: Replace with actual provider ID from auth
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
    
    // Optional: Refresh every 30 seconds
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
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      {/* Claude-Style Sidebar */}
      <aside
        className={`
          claude-sidebar
          fixed top-[60px] sm:top-[73px] lg:top-0 left-0 bottom-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300
        `}
      >
        {/* Header with Toggle */}
        <div className="claude-sidebar-header">
          <button 
            onClick={onClose}
            className="claude-toggle-btn"
            aria-label="Close sidebar"
          >
            {/* Two rectangles icon like Claude */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="18" rx="1" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="18" rx="1" strokeWidth="2"/>
            </svg>
          </button>
          
          <Link href="/provider/dashboard" className="claude-brand-text">
            Kursfind AI
          </Link>
        </div>

        {/* Primary Action Button - Neuer Kurs */}
        <Link
          href="/provider/dashboard/courses/new"
          onClick={onClose}
          className="claude-primary-action"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Neuer Kurs</span>
        </Link>

        {/* Navigation Items */}
        <nav className="px-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`claude-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="claude-nav-icon">{item.icon}</span>
                <span className="claude-nav-label">{item.name}</span>
                
                {/* Badge for unread applications */}
                {item.badge > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Back to Website */}
        <div className="claude-user-section">
          <Link 
            href="/"
            onClick={onClose}
            className="claude-nav-item"
          >
            <svg className="claude-nav-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="claude-nav-label">Zurück zur Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
