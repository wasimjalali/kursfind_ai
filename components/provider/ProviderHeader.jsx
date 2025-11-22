'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ProviderHeader({ provider, sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/provider/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 h-[73px] w-full">
      <div className="px-6 py-4 flex items-center justify-between h-full w-full">
        
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/Assets/new-logo-kursfind.png" 
              alt="Kursfind AI" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Kursfind AI
              </div>
              <div className="text-xs text-gray-600">Provider Portal</div>
            </div>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {provider?.contact_name || 'Provider'}
              </div>
              <div className="text-xs text-gray-600">
                {provider?.email}
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              {provider?.contact_name?.[0]?.toUpperCase() || 'P'}
            </div>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                <Link
                  href="/provider/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:translate-x-1 transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Profil bearbeiten
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:translate-x-1 transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Zur Website
                </Link>
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:translate-x-1 transition-all duration-200"
                >
                  Abmelden
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
