'use client';

import { useState } from 'react';
import StudentSidebar from '@/components/student/StudentSidebar';
import StudentHeader from '@/components/student/StudentHeader';

export default function StudentDashboardClient({ student, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* MOBILE STICKY HEADER - Only visible on mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Hamburger button - left - Toggle sidebar */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo - center - Larger and clickable */}
          <a href="/suchen">
            <img 
              src="/Assets/Kursfind-logo.png" 
              alt="Kursfind AI"
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
          </a>
          
          {/* KI-Kurssuche icon - right (larger, no text) */}
          <a 
            href="/suchen"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="KI-Kurssuche"
          >
            <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </a>
        </div>
      </div>

      {/* DESKTOP STICKY HEADER - Only visible on desktop */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Hamburger button - left */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* KI-Kurssuche icon - right (larger, no text) */}
          <a 
            href="/suchen"
            className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="KI-Kurssuche"
          >
            <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Sidebar */}
      <StudentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content - Add padding-top for headers */}
        <main className="flex-1 overflow-y-auto pt-14">
          {children}
        </main>
      </div>
    </div>
  );
}

