'use client';

import { useState } from 'react';
import Link from 'next/link';
import StudentSidebar from '@/components/student/StudentSidebar';

export default function StudentDashboardClient({ student, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start open on desktop

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar with push behavior */}
      <StudentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Wrapper with Push Behavior */}
      <div className={`
        flex-1 flex flex-col h-screen overflow-hidden
        transition-all duration-200 ease-in-out
        ${sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[60px]'}
      `}>
        
        {/* MOBILE STICKY HEADER - Only visible on mobile */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            {/* Menu button - opens sidebar */}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Logo - center */}
            <Link href="/suchen">
              <img 
                src="/Assets/kursfind-ai-logo.jpg" 
                alt="Kursfind AI"
                className="w-10 h-10 rounded-lg"
              />
            </Link>
            
            {/* KI-Kurssuche icon - right */}
            <Link 
              href="/suchen"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-16 lg:pt-4">
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
