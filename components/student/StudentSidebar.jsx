'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function StudentSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: '🏠',
    },
    {
      name: 'KI-Kurssuche',
      href: '/suchen',
      icon: '✨',
    },
    {
      name: 'Gespeicherte Kurse',
      href: '/student/dashboard/saved',
      icon: '❤️',
    },
    {
      name: 'Bewerbungen',
      href: '/student/dashboard/applications',
      icon: '📝',
    },
    {
      name: 'Chat-Verlauf',
      href: '/student/dashboard/chat',
      icon: '💬',
    },
    {
      name: 'Kurse suchen',
      href: '/courses',
      icon: '🔍',
    },
    {
      name: 'Profil',
      href: '/student/dashboard/profile',
      icon: '⚙️',
      desktopOnly: true, // Only show on desktop
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

      {/* Sidebar - Overlay on both mobile and desktop */}
      <aside
        className={`
          fixed
          top-14 bottom-0 left-0 z-40
          w-[80vw] max-w-[280px] lg:w-[280px]
          bg-white h-[calc(100vh-3.5rem)]
          border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          overflow-y-auto
          shadow-xl
        `}
      >
        <div className="flex flex-col h-full">
          {/* Close X button - mobile only, at top */}
          <div className="p-3 border-b border-gray-200 lg:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Logo with Close Button - Desktop only */}
          <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200">
            {/* Logo - Left side */}
            <Link href="/suchen" className="flex items-center space-x-2">
              <img
                src="/Assets/new-logo-kursfind.png"
                alt="Kursfind AI"
                className="w-12 h-12 rounded-xl"
              />
              <div>
                <h1 className="text-base font-bold text-black">
                  Kursfind AI
                </h1>
                <p className="text-xs text-gray-600">Student Portal</p>
              </div>
            </Link>
            
            {/* Close X button - Right side */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              // Hide desktop-only items on mobile
              if (item.desktopOnly) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      hidden lg:flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg font-semibold scale-105'
                          : 'text-gray-700 hover:bg-white/50 hover:translate-x-1 hover:shadow-sm'
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-base lg:text-lg font-medium">{item.name}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg font-semibold scale-105'
                        : 'text-gray-700 hover:bg-white/50 hover:translate-x-1 hover:shadow-sm'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-base lg:text-lg font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section - Mobile: Settings, Desktop: Footer */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            {/* Mobile: Settings Link */}
            <Link
              href="/student/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className={`
                flex lg:hidden items-center space-x-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  pathname === '/student/dashboard/profile'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base lg:text-lg font-medium">Einstellungen</span>
            </Link>

            {/* Desktop: Footer */}
            <div className="hidden lg:block text-xs text-gray-600 text-center">
              © 2025 Kursfind AI
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
