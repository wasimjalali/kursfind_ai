'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function WelcomeScreen({ onExampleClick }) {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check auth state
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const examples = [
    {
      icon: '🎓',
      title: 'Webentwicklung Kurs',
      query: 'Ich suche einen Webentwicklung Kurs in Berlin mit Bildungsgutschein'
    },
    {
      icon: '📊',
      title: 'Data Science',
      query: 'Zeige mir Data Science Bootcamps in Hamburg'
    },
    {
      icon: '🎨',
      title: 'UX/UI Design',
      query: 'Ich möchte UX/UI Design lernen, welche Kurse empfiehlst du?'
    },
    {
      icon: '💼',
      title: 'Projektmanagement',
      query: 'Projektmanagement Zertifizierung mit AVGS Förderung'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      
      {/* Logo and Welcome Message */}
      <div className="text-center mb-12">
        <div className="mb-6 flex justify-center">
          <div className="relative w-30 h-30">
            <Image 
              src="/Assets/Kursfind-logo.png" 
              alt="Kursfind AI" 
              fill
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Willkommen bei Kursfind AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Finden Sie Ihre perfekte Weiterbildung in Minuten mit KI-Unterstützung
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          ✨ Powered by Powerful AI Engine
        </p>
        <p className="text-sm text-gray-600 text-center">
          Beispiele, um zu starten:
        </p>
      </div>

      {/* Example Prompts Grid - Show 2 on mobile, all on desktop */}
      <div className="w-full max-w-4xl mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.slice(0, isMobile ? 2 : 4).map((example, idx) => (
            <button
              key={idx}
              onClick={() => onExampleClick(example.query)}
              className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-cyan-400 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{example.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                    {example.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {example.query}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links - Less prominent on mobile */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <a
          href="/courses"
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-600 md:border-2 md:text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center text-sm md:text-base"
        >
          📚 Alle Kurse durchsuchen
        </a>
        {!user && (
        <a
          href="/student/signup"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center"
        >
          Kostenloses Konto erstellen →
        </a>
        )}
      </div>
    </div>
  );
}
