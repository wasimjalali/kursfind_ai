'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function StudentSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: '🏠',
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
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white
          border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/Assets/Kursfind-logo.png"
                alt="Kursfind AI"
                className="w-16 h-16 rounded-xl"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  Kursfind AI
                </h1>
                <p className="text-xs text-gray-600">Student Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
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
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 text-center">
              © 2025 Kursfind AI
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
