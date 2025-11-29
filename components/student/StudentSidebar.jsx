'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudentSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Gespeicherte Kurse',
      href: '/student/dashboard/saved',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      name: 'Bewerbungen',
      href: '/student/dashboard/applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Chat-Verlauf',
      href: '/student/dashboard/chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      name: 'Profil',
      href: '/student/dashboard/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

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
          fixed top-14 lg:top-0 left-0 bottom-0
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 lg:transition-none
          h-[calc(100vh-3.5rem)] lg:h-screen
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

        {/* Primary Action Button - KI-Kurssuche */}
        <Link
          href="/suchen"
          onClick={() => setIsOpen(false)}
          className="claude-primary-action"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>KI-Kurssuche</span>
        </Link>

        {/* Navigation Items */}
        <nav className="px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`claude-nav-item ${isActive ? 'active' : ''} ${!isOpen ? 'collapsed' : ''}`}
              >
                <span className="claude-nav-icon">{item.icon}</span>
                <span className="claude-nav-label">{item.name}</span>
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="claude-tooltip">{item.name}</div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Additional Link - Kurse suchen */}
        <div className="px-2 pb-4">
          <Link
            href="/courses"
            onClick={() => setIsOpen(false)}
            className={`claude-nav-item ${pathname === '/courses' ? 'active' : ''} ${!isOpen ? 'collapsed' : ''}`}
          >
            <svg className="claude-nav-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="claude-nav-label">Kurse suchen</span>
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="claude-tooltip">Kurse suchen</div>
            )}
          </Link>
        </div>

        {/* User Section / Footer */}
        <div className="claude-user-section">
          <div className="text-center">
            <div className="text-xs text-gray-500">
              © 2025 Kursfind AI
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
