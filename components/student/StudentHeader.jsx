'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentHeader({ student }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = () => {
    if (!student) return 'ST';
    const first = student.first_name?.[0] || '';
    const last = student.last_name?.[0] || '';
    return (first + last).toUpperCase() || 'ST';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/student/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Welcome Message */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Willkommen zurück, {student?.first_name || 'Student'}! 👋
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Verwalten Sie Ihre Weiterbildungsreise
            </p>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                {getInitials()}
              </div>
              
              {/* Name and Email */}
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold text-gray-900">
                  {student?.first_name} {student?.last_name}
                </div>
                <div className="text-xs text-gray-600">{student?.email}</div>
              </div>

              {/* Dropdown Icon */}
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                  <Link
                    href="/student/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="mr-3">⚙️</span>
                    Profileinstellungen
                  </Link>
                  
                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="mr-3">🏠</span>
                    Zur Webseite
                  </Link>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="mr-3">🚪</span>
                    Abmelden
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
