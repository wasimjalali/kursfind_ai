'use client';

import { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import ProviderSidebar from '@/components/provider/ProviderSidebar';
import useProviderLang from '@/lib/useProviderLang';

// Create context for language
export const PortalLanguageContext = createContext({ lang: 'de', setLang: () => {}, labels: {} });

export function usePortalLanguage() {
  return useContext(PortalLanguageContext);
}

export default function ProviderDashboardClient({ provider, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start open on desktop
  const { lang, setLang, labels } = useProviderLang();

  return (
    <PortalLanguageContext.Provider value={{ lang, setLang, labels }}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar with push behavior */}
        <ProviderSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} lang={lang} setLang={setLang} />
        
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
              <Link href="/provider/dashboard">
                <img 
                  src="/Assets/kursfind-ai-logo.jpg" 
                  alt="Kursfind AI"
                  className="w-10 h-10 rounded-lg"
                />
              </Link>
              
              {/* Spacer for symmetry */}
              <div className="w-10"></div>
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
    </PortalLanguageContext.Provider>
  );
}
