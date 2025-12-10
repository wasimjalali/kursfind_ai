'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

// Demo texts for AI animation (German)
const demoTextsDE = [
  'Digital Marketing Kursen in Berlin',
  'Web Development Bootcamps in München',
  'Data Science Weiterbildung in Hamburg',
  'UX Design Kursen in Köln',
];

// Lucide-style SVG Icons as components
const Icons = {
  Sparkles: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  ArrowRight: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Search: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  GraduationCap: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  Building: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Target: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <circle cx="12" cy="12" r="6" strokeWidth={2} />
      <circle cx="12" cy="12" r="2" strokeWidth={2} />
    </svg>
  ),
  Mail: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  ShieldCheck: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Gift: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  Award: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  FileCheck: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Zap: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Globe: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  Lock: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Menu: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Check: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Plus: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Minus: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  ),
};

// FAQ Data
const faqData = [
  {
    question: 'Ist Kursfind AI wirklich kostenlos für Lernende?',
    answer: 'Ja, 100% kostenlos. Wir verdienen Geld, indem wir Bildungsanbieter mit qualifizierten Lernenden verbinden. Du zahlst keinen Cent zum Suchen, Vergleichen oder Bewerben.',
  },
  {
    question: 'Welche Förderoptionen werden unterstützt?',
    answer: 'Alle Kurse auf Kursfind AI sind AZAV-zertifiziert und für Bildungsgutschein (von Arbeitsagentur oder Jobcenter) oder AVGS-Förderung geeignet. Wir helfen dir zu verstehen, welche Förderung für dich gilt.',
  },
  {
    question: 'Wie funktioniert das KI-Matching?',
    answer: 'Unsere KI analysiert deine Karriereziele, deinen Standort, deine Zeitpräferenzen und deinen Förderstatus und findet dann die relevantesten Kurse aus unserer Datenbank mit über 100+ AZAV-zertifizierten Programmen. Es ist wie ein persönlicher Bildungsberater, 24/7 verfügbar.',
  },
  {
    question: 'Kann ich mich bei mehreren Kursen bewerben?',
    answer: 'Absolut! Du kannst Kurse speichern, sie nebeneinander vergleichen und dich bei so vielen bewerben, wie du möchtest. Wir empfehlen, dich bei 3-5 Kursen zu bewerben, um deine Chancen zu erhöhen, den perfekten Kurs zu finden.',
  },
  {
    question: 'Wie lange dauert es, bis ich gematcht werde?',
    answer: 'Sofort! Sobald du unserer KI deine Ziele und Präferenzen mitteilst, siehst du personalisierte Kursempfehlungen in Sekunden. Du kannst deine Suche jederzeit verfeinern oder mit unserer KI chatten für mehr Anleitung.',
  },
];

// FAQ Item Component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-cyan-200 hover:shadow-md transition-all bg-white cursor-pointer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 font-semibold flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg">{question}</span>
        <span className="text-cyan-500 text-2xl transition-transform duration-300">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6 text-gray-600 leading-relaxed bg-gray-50">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  
  // AI Demo Animation State
  const [typedText, setTypedText] = useState('');
  const [aiStep, setAiStep] = useState(0);
  const [progressWidth, setProgressWidth] = useState(25);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // AI Demo Typewriter Animation
  useEffect(() => {
    let typingTimeout;
    let charIndex = 0;
    const currentText = demoTextsDE[aiStep];
    
    const typeNextChar = () => {
      if (charIndex <= currentText.length) {
        setTypedText(currentText.slice(0, charIndex));
        charIndex++;
        typingTimeout = setTimeout(typeNextChar, 80);
      }
    };
    
    // Start typing
    setTypedText('');
    charIndex = 0;
    typeNextChar();
    
    // Update progress bar
    setProgressWidth(((aiStep + 1) / demoTextsDE.length) * 100);
    
    // Move to next step after 4 seconds
    const stepInterval = setTimeout(() => {
      setAiStep((prev) => (prev + 1) % demoTextsDE.length);
    }, 4000);
    
    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(stepInterval);
    };
  }, [aiStep]);

  return (
    <div className="min-h-screen bg-white marketing-page">
      {/* Beta Access Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-2 px-4 text-center text-sm font-medium z-50 relative">
          <span className="inline-flex items-center gap-2">
            🎉 <span className="font-bold">Limited Beta Access</span>
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
            aria-label="Banner schließen"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20 py-2 md:py-3">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Image
                src="/landing/kursfind-ai-logo.jpg"
                alt="Kursfind AI"
                width={48}
                height={48}
                className="h-10 md:h-12 w-auto rounded-xl"
              />
              <span className="ml-3 text-xl md:text-2xl font-bold text-gray-900">Kursfind AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/suchen"
                className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group"
              >
                KI-Suche
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <button
                onClick={() => scrollToSection('for-students')}
                className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group"
              >
                Für Lernende
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <Link href="/anbieter" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group">
                Für Anbieter
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/ueber-uns" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group">
                Über uns
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group"
              >
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <div className="flex items-center space-x-2 text-sm">
                <Link href="/en" className="text-gray-600 hover:text-cyan-600 transition-colors">
                  EN
                </Link>
                <span className="text-gray-400">|</span>
                <span className="font-bold text-cyan-600">DE</span>
              </div>
              <Link
                href="/suchen"
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">KI-Suche testen</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden hover:opacity-80 transition-all"
              aria-label="Menü öffnen"
            >
              <Icons.Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white animate-fadeIn">
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              <Image
                src="/landing/kursfind-ai-logo.jpg"
                alt="Kursfind AI"
                width={40}
                height={40}
                className="h-10 w-auto rounded-xl"
              />
              <span className="ml-3 text-xl font-bold text-gray-900">Kursfind AI</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="transition-transform"
                aria-label="Menü schließen"
              >
                <Icons.X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/suchen" onClick={() => setMobileMenuOpen(false)} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                KI-Suche
              </Link>
              <button onClick={() => scrollToSection('for-students')} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                Für Lernende
              </button>
              <Link href="/anbieter" onClick={() => setMobileMenuOpen(false)} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                Für Anbieter
              </Link>
              <Link href="/ueber-uns" onClick={() => setMobileMenuOpen(false)} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                Über uns
              </Link>
              <button onClick={() => scrollToSection('faq')} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                FAQ
              </button>
              <div className="flex items-center justify-center space-x-2 text-sm mb-4">
                <Link href="/en" className="text-gray-600 hover:text-cyan-600 transition-colors">
                  EN
                </Link>
                <span className="text-gray-400">|</span>
                <span className="font-bold text-cyan-600">DE</span>
              </div>
              <Link
                href="/suchen"
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium text-center hover:shadow-lg transition-all"
              >
                KI-Suche testen
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home" className="bg-gradient-to-b from-white via-cyan-50/30 to-gray-50 pt-16 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div>
                <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-medium mb-4 border border-cyan-200">
                  <Icons.Sparkles className="w-4 h-4" />
                  <span>Kostenlos • Keine Anmeldung nötig</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Finde deine Weiterbildung
                  <br />
                  in Minuten —
                  <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                    {' '}mit KI-Power
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                  Intelligente KI findet sofort den passenden AZAV-zertifizierten Kurs mit Bildungsgutschein oder AVGS-Förderung. Finde die perfekte Weiterbildung für deine Karriereziele, deinen Standort und deinen Förderstatus – komplett kostenlos.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/suchen"
                    className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    <span className="relative z-10">Jetzt KI-Suche starten</span>
                    <Icons.ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>

                  <Link
                    href="/anbieter"
                    className="w-full md:w-auto bg-white text-gray-800 px-8 py-4 rounded-lg font-medium hover:shadow-xl transition-all flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-cyan-500"
                  >
                    <span>Für Anbieter</span>
                    <Icons.Building className="w-5 h-5" />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-8 mt-8">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Icons.GraduationCap className="w-5 h-5 text-cyan-500" />
                    <span className="font-medium">100+ Kurse</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Icons.Building className="w-5 h-5 text-cyan-500" />
                    <span className="font-medium">Geprüfte Anbieter</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Icons.CheckCircle className="w-5 h-5 text-cyan-500" />
                    <span className="font-medium">100% kostenlos für Lernende</span>
                  </div>
                </div>
              </div>

              {/* Right: AI Demo Card */}
              <div className="relative">
                <div className="text-center mb-4">
                  <span className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                    Live-Vorschau der KI-Suche
                  </span>
                </div>
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <Icons.Sparkles className="w-6 h-6 text-cyan-500 animate-pulse" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-gray-700 mb-6 min-h-[60px]">
                    Suche nach <span className="font-semibold text-cyan-600">{typedText}</span>
                    <span className="animate-pulse">|</span>
                  </div>
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`bg-gray-50 rounded-lg p-4 border border-gray-100 transition-all duration-300 cursor-pointer hover:border-cyan-200 ${
                          aiStep >= i ? 'opacity-100' : 'opacity-40'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-2 h-2 rounded-full transition-colors ${aiStep >= i ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4"></div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded w-1/2 ml-4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Student Demo Video Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-cyan-50 to-emerald-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-white text-cyan-600 px-4 py-2 rounded-full font-medium mb-4 border border-cyan-200">
                <Icons.Target className="w-4 h-4" />
                <span>Demo-Video • 2 Minuten</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                So findet Kursfind AI deine perfekte Weiterbildung
              </h2>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                Sieh dir in 2 Minuten an, wie unsere KI dir hilft, den idealen AZAV-zertifizierten Kurs mit Bildungsgutschein zu finden – Schritt für Schritt erklärt.
              </p>
            </div>
            
            {/* Video Embed */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  src="https://www.youtube.com/embed/FmxlY9IjF9s?autoplay=1&mute=1"
                  title="KursFind AI Demo Student"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link
                href="/suchen"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-medium hover:shadow-xl transition-all"
              >
                <span>Jetzt KI-Suche testen</span>
                <Icons.ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-cyan-600 font-medium mb-2">So funktioniert&apos;s</div>
              <h2 className="text-4xl md:text-5xl font-bold">Drei einfache Schritte zu deinem perfekten Kurs</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  num: '1',
                  icon: Icons.Target,
                  title: '1. Beschreibe deine Ziele',
                  desc: 'Erzähle unserer KI von deinen Karrierezielen, deinem Wunschort und ob du Bildungsgutschein oder AVGS-Förderung hast. Dauert nur 30 Sekunden.',
                },
                {
                  num: '2',
                  icon: Icons.Sparkles,
                  title: '2. Erhalte sofortige Empfehlungen',
                  desc: 'Unsere KI analysiert über 100+ AZAV-zertifizierte Kurse und empfiehlt dir sofort die besten Matches für deine Situation, Ziele und Förderberechtigung.',
                },
                {
                  num: '3',
                  icon: Icons.Mail,
                  title: '3. Bewirb dich direkt',
                  desc: 'Prüfe Kursdetails, Anbieter-Bewertungen und Starttermine. Bewirb dich direkt über unsere Plattform oder kontaktiere Anbieter mit einem Klick. Keine versteckten Kosten. Nie.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:border-cyan-400 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 h-full"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg group-hover:shadow-cyan-500/50 transition-shadow duration-300">
                    {step.num}
                  </div>
                  <step.icon className="w-10 h-10 text-cyan-500 mb-4 transition-transform group-hover:scale-110" />
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Your Dashboard Preview Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-medium mb-4 border border-cyan-200">
                <Icons.Target className="w-4 h-4" />
                <span>Dein persönliches Dashboard</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Alles an einem Ort verwalten
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Verfolge deine Bewerbungen, speichere Kurse für später und erhalte personalisierte Empfehlungen. Dein Dashboard zeigt dir immer den aktuellen Stand.
              </p>
            </div>
            
            {/* Large Screenshot */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 mb-10">
              <Image
                src="/screenshots/Student-dashboard-main-page.png"
                alt="Dein Lernenden-Dashboard"
                width={1200}
                height={700}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Features List + CTA */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <ul className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3">
                {[
                  'Gespeicherte Kurse',
                  'Bewerbungsstatus',
                  'KI-Empfehlungen',
                  'Chat-Verlauf',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icons.Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/suchen"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-medium hover:shadow-xl transition-all group"
              >
                <span>Jetzt KI-Suche starten</span>
                <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Learner Benefits Section */}
        <section id="for-students" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Warum Lernende Kursfind AI vertrauen</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: Icons.ShieldCheck,
                  title: 'AZAV-zertifizierte Kurse',
                  desc: 'Alle Kurse erfüllen strenge deutsche Bildungsstandards und qualifizieren für Bildungsgutschein oder AVGS-Förderung.',
                  highlight: true,
                },
                {
                  icon: Icons.Gift,
                  title: 'Null Kosten für dich — Anbieter zahlen uns, du suchst und bewirbst dich komplett kostenlos',
                  desc: 'Suchen, matchen und bewerben ohne einen Cent zu zahlen. Keine versteckten Kosten. Nie.',
                },
                {
                  icon: Icons.Award,
                  title: 'Lerne mit Sicherheit — Jeder Anbieter ist AZAV-zertifiziert und staatlich geprüft',
                  desc: 'Finde geprüfte Bootcamps mit Bildungsgutschein oder AVGS-Förderung. Nur vertrauenswürdige Qualitätsanbieter.',
                },
                {
                  icon: Icons.Sparkles,
                  title: 'Spare Stunden an Recherche — KI findet deinen perfekten Kurs in Sekunden',
                  desc: 'Finde Kurse, die wirklich zu deinen Karrierezielen, deinem Standort und deinem Zeitplan passen. Die KI macht die harte Arbeit für dich.',
                },
                {
                  icon: Icons.FileCheck,
                  title: 'Nutze deine Förderung optimal — Finde Kurse, die deinen Bildungsgutschein oder AVGS akzeptieren',
                  desc: 'Prüfe deine Berechtigung ganz einfach. Wir begleiten dich Schritt für Schritt durch den Förderprozess.',
                },
                {
                  icon: Icons.Zap,
                  title: 'Expertenberatung — Erhalte Antworten zu Kursen, Förderung und Karrierewegen',
                  desc: 'KI-Automatisierung bedeutet schnellere Antworten und reibungslosere Dokumentenabwicklung. Starte deinen Kurs früher.',
                },
                {
                  icon: Icons.Globe,
                  title: 'Mehrsprachiger Support — Plattform verfügbar auf Deutsch, Englisch und weiteren Sprachen',
                  desc: 'Suche auf Deutsch, Englisch oder Dari. Sprache sollte keine Barriere für deine Bildung sein.',
                },
                {
                  icon: Icons.Lock,
                  title: 'DSGVO-konform & sicher',
                  desc: 'Deine Daten sind geschützt. Wir teilen deine Informationen nur mit Anbietern, die du ausdrücklich wählst — kein Verkauf, kein Spam.',
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className={`group rounded-2xl p-6 lg:p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 h-full ${
                    benefit.highlight
                      ? 'bg-gradient-to-br from-cyan-50 to-emerald-50 border-cyan-300 hover:border-cyan-400'
                      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-cyan-400'
                  }`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-cyan-500/50 transition-shadow duration-300">
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                  <p className={`leading-relaxed ${benefit.highlight ? 'text-gray-700' : 'text-gray-600'}`}>
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Häufig gestellte Fragen</h2>
            </div>
            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="student-waitlist-section" className="py-20 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'white' }}>Starte jetzt deine Kurssuche</h2>
            <p className="text-xl mb-8" style={{ color: 'white', opacity: 0.9 }}>
              Finde in Minuten den perfekten AZAV-zertifizierten Kurs. KI-gestützt, staatlich gefördert, 100% kostenlos.
            </p>
            <Link
              href="/suchen"
              className="inline-flex items-center space-x-2 bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all"
            >
              <span>Jetzt KI-Suche starten</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-sm" style={{ color: 'white', opacity: 0.8 }}>✨ Wir helfen dir, den perfekten Kurs zu finden</p>
          </div>
        </section>

        {/* Provider Promo Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-cyan-600 font-medium mb-2">Für Bildungsträger</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Erhalte geprüfte, hochwertige Leads für deine Kurse</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Wenn du ein AZAV-zertifizierter Anbieter in Deutschland bist, hilft dir Kursfind AI, ernsthafte Lernende zu erreichen – mit voller Einwilligung und DSGVO-Konformität. Liste unbegrenzt Kurse komplett kostenlos.
            </p>
            <Link
              href="/anbieter"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <span className="relative z-10">Mehr für Anbieter erfahren</span>
              <Icons.ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <div>
              <Link href="/" className="flex items-center mb-4 hover:opacity-80 transition-all">
                <Image
                  src="/landing/kursfind-ai-logo.jpg"
                  alt="Kursfind AI Logo"
                  width={128}
                  height={128}
                  className="h-24 md:h-32 w-auto rounded-xl"
                />
              </Link>
              <p className="text-sm text-white">Finde deine Weiterbildung in Minuten — mit KI-Power.</p>
            </div>
            
            {/* Für Lernende */}
            <div>
              <h4 className="text-white font-semibold mb-4">Für Lernende</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/suchen" className="hover:text-cyan-400 transition-all">
                    KI-Suche starten
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-cyan-400 transition-all">
                    So funktioniert&apos;s
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('demo')} className="hover:text-cyan-400 transition-all">
                    Demo
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('faq')} className="hover:text-cyan-400 transition-all">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Für Anbieter */}
            <div>
              <h4 className="text-white font-semibold mb-4">Für Anbieter</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/anbieter" className="hover:text-cyan-400 transition-all">
                    Übersicht
                  </Link>
                </li>
                <li>
                  <Link href="/anbieter#demo" className="hover:text-cyan-400 transition-all">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/anbieter#pricing" className="hover:text-cyan-400 transition-all">
                    Preise
                  </Link>
                </li>
                <li>
                  <Link href="/anbieter#booking" className="hover:text-cyan-400 transition-all">
                    Termin buchen
                  </Link>
                </li>
                <li>
                  <Link href="/anbieter#faq" className="hover:text-cyan-400 transition-all">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Rechtliches & Kontakt */}
            <div>
              <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/datenschutz" className="hover:text-cyan-400 transition-all">
                    Datenschutzerklärung
                  </Link>
                </li>
                <li>
                  <Link href="/impressum" className="hover:text-cyan-400 transition-all">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/ueber-uns" className="hover:text-cyan-400 transition-all">
                    Über uns
                  </Link>
                </li>
              </ul>
              <h4 className="text-white font-semibold mb-4 mt-8">Kontakt</h4>
              <div className="flex items-center space-x-2 mb-2">
                <Icons.Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:kontakt@kursfind.de" className="text-sm hover:text-cyan-400 transition-all">
                  kontakt@kursfind.de
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:partner@kursfind.de" className="text-sm hover:text-cyan-400 transition-all">
                  partner@kursfind.de
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm opacity-60">
            © 2025 Kursfind AI • Betrieben von Wasim Academy UG (haftungsbeschränkt), Berlin, Deutschland
          </div>
        </div>
      </footer>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
