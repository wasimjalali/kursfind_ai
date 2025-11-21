'use client';

import Image from 'next/image';

export default function WelcomeScreen({ onExampleClick }) {
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
        <p className="text-sm text-gray-500 mt-2">
          ✨ Powered by Powerful AI Engine
        </p>
      </div>

      {/* Example Prompts Grid */}
      <div className="w-full max-w-4xl">
        <p className="text-sm text-gray-600 mb-4 text-center">
          Beispiele, um zu starten:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((example, idx) => (
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

      {/* Quick Links */}
      <div className="mt-12 flex gap-4">
        <a
          href="/courses"
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          📚 Alle Kurse durchsuchen
        </a>
        <a
          href="/student/signup"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Kostenloses Konto erstellen →
        </a>
      </div>
    </div>
  );
}
