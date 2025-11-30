'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      name: 'Kurse suchen',
      href: '/courses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

  // Tooltip component - using inline style for z-index to escape overflow containers
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

      {/* Sidebar - Always visible on desktop */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50
          bg-white border-r border-gray-200
          flex flex-col shadow-lg overflow-visible
          transition-all duration-200 ease-in-out
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

        {/* KI-Kurssuche Button - Sparkle icon for AI */}
        <div className="p-2 overflow-visible">
          <Link
            href="/suchen"
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
            {isOpen && <span>KI-Kurssuche</span>}
            {/* Tooltip when collapsed */}
            {!isOpen && <Tooltip text="KI-Kurssuche" />}
          </Link>
        </div>

        {/* Navigation Items - overflow-visible to show tooltips */}
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-visible">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center py-2.5 rounded-lg transition-all cursor-pointer relative group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
                  }
                `}
                style={{ 
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  gap: isOpen ? '12px' : '0',
                  paddingLeft: isOpen ? '16px' : '0',
                  paddingRight: isOpen ? '16px' : '0',
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="font-medium text-[15px]">{item.name}</span>}
                
                {/* Tooltip for collapsed state */}
                {!isOpen && <Tooltip text={item.name} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3">
          {isOpen && (
            <div className="text-center text-xs text-gray-400">
              © 2025 Kursfind AI
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
