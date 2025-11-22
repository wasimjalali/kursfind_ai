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
          
          {/* User avatar - right */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
            {student?.first_name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* DESKTOP: Floating Hamburger Button - Top Left */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="hidden lg:flex fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* DESKTOP: Floating KI-Kurssuche Button - Top Right */}
      <a 
        href="/suchen"
        className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg hover:shadow-xl transition-all font-medium shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span>KI-Kurssuche</span>
      </a>

      {/* Sidebar */}
      <StudentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content - Add padding-top for mobile header only */}
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

