'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { getStudentLabels } from '@/lib/student-labels';

export default function WelcomeScreen({ onExampleClick, lang = 'de' }) {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const labels = getStudentLabels(lang);

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
      icon: '🛒',
      title: labels.aiSearch.examples.ecommerce.title,
      query: labels.aiSearch.examples.ecommerce.description
    },
    {
      icon: '📱',
      title: labels.aiSearch.examples.digitalMarketing.title,
      query: labels.aiSearch.examples.digitalMarketing.description
    },
    {
      icon: '💻',
      title: labels.aiSearch.examples.itProgramming.title,
      query: labels.aiSearch.examples.itProgramming.description
    },
    {
      icon: '🎨',
      title: labels.aiSearch.examples.webdesign.title,
      query: labels.aiSearch.examples.webdesign.description
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      
      {/* Logo and Welcome Message */}
      <div className="text-center mb-12">
        <div className="mb-6 flex justify-center">
          <div className="relative w-30 h-30">
            <Image 
              src="/Assets/kursfind-ai-logo.jpg" 
              alt="Kursfind AI" 
              fill
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {labels.aiSearch.welcome}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          {labels.aiSearch.subtitle}
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          ✨ {labels.aiSearch.poweredBy}
        </p>
        <p className="text-sm text-gray-600 text-center">
          {labels.aiSearch.examplesTitle}
        </p>
      </div>

      {/* Example Prompts Grid - Show 2 on mobile, all on desktop */}
      <div className="w-full max-w-4xl mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.slice(0, isMobile ? 2 : 4).map((example, idx) => (
            <button
              key={idx}
              onClick={() => onExampleClick(example.query)}
              className="p-5 sm:p-6 bg-white/80 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-cyan-400 transition-all text-left group hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-1 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-2xl shadow-sm">
                  {example.icon}
                </span>
                <div>
                  <div className="font-semibold text-gray-900 mb-1.5 group-hover:text-cyan-600 transition-colors text-base sm:text-lg">
                    {example.title}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {example.query}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links - Centered under examples */}
      <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md justify-center items-stretch sm:items-center">
        <a
          href="/courses"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/90 border border-gray-300 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow-lg hover:border-cyan-400 hover:bg-gray-50 hover:-translate-y-0.5 transition-all text-center text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-1 cursor-pointer"
        >
          <span className="text-lg">📚</span>
          <span>{labels.aiSearch.browseAllCourses}</span>
        </a>
        {!user && (
        <a
          href="/student/signup"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center text-sm md:text-base cursor-pointer"
        >
          {lang === 'de' ? 'Kostenloses Konto erstellen →' : 'Create Free Account →'}
        </a>
        )}
      </div>
    </div>
  );
}
