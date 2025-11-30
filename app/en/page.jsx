'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Demo texts for AI animation (English)
const demoTextsEN = [
  'Digital Marketing courses in Berlin',
  'Web Development bootcamps in Munich',
  'Data Science training in Hamburg',
  'UX Design courses in Cologne',
];

// Icons
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
  X: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// FAQ Data
const faqData = [
  {
    question: 'Is Kursfind AI really free for learners?',
    answer: 'Yes, 100% free. We make money by connecting education providers with qualified learners. You pay nothing to search, compare, or apply.',
  },
  {
    question: 'What funding options are supported?',
    answer: 'All courses on Kursfind AI are AZAV-certified and eligible for Bildungsgutschein (from Arbeitsagentur or Jobcenter) or AVGS funding. We help you understand which funding applies to you.',
  },
  {
    question: 'How does the AI matching work?',
    answer: 'Our AI analyzes your career goals, location, time preferences, and funding status, then finds the most relevant courses from our database of 100+ AZAV-certified programs. It\'s like having a personal education advisor, available 24/7.',
  },
  {
    question: 'Can I apply to multiple courses?',
    answer: 'Absolutely! You can save courses, compare them side-by-side, and apply to as many as you like. We recommend applying to 3-5 courses to maximize your chances of finding the perfect fit.',
  },
  {
    question: 'How long does it take to get matched?',
    answer: 'Instantly! As soon as you tell our AI your goals and preferences, you\'ll see personalized course recommendations in seconds. You can refine your search anytime or chat with our AI for more guidance.',
  },
];

// FAQ Item Component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-cyan-200 hover:shadow-md transition-all bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 font-semibold flex justify-between items-center hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg">{question}</span>
        <span className="text-cyan-500 text-2xl transition-transform duration-300">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-6 text-gray-600 leading-relaxed bg-gray-50">{answer}</div>
      </div>
    </div>
  );
}

export default function HomePageEN() {
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
    const currentText = demoTextsEN[aiStep];
    
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
    setProgressWidth(((aiStep + 1) / demoTextsEN.length) * 100);
    
    // Move to next step after 4 seconds
    const stepInterval = setTimeout(() => {
      setAiStep((prev) => (prev + 1) % demoTextsEN.length);
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
            aria-label="Close banner"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24 py-3 md:py-4">
            <Link href="/en" className="flex items-center hover:opacity-90 transition-opacity">
              <Image
                src="/landing/kursfind-ai-logo.jpg"
                alt="Kursfind AI"
                width={64}
                height={64}
                className="h-14 md:h-16 w-auto rounded-xl"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/en" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group">
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <button
                onClick={() => scrollToSection('for-students')}
                className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group"
              >
                For Students
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <Link href="/en/providers" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group">
                For Providers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/en/about" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium relative group">
                About Us
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
                <span className="font-bold text-cyan-600">EN</span>
                <span className="text-gray-400">|</span>
                <Link href="/" className="text-gray-600 hover:text-cyan-600 transition-colors">DE</Link>
              </div>
              <Link
                href="/suchen"
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">Try AI Search</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden hover:opacity-80 transition-all"
              aria-label="Open menu"
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
                width={56}
                height={56}
                className="h-14 w-auto rounded-xl"
              />
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <Icons.X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/en" onClick={() => setMobileMenuOpen(false)} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                Home
              </Link>
              <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                Courses
              </Link>
              <button onClick={() => scrollToSection('for-students')} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                For Students
              </button>
              <Link href="/en/providers" onClick={() => setMobileMenuOpen(false)} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                For Providers
              </Link>
              <Link href="/en/about" onClick={() => setMobileMenuOpen(false)} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                About Us
              </Link>
              <button onClick={() => scrollToSection('faq')} className="text-left text-lg py-2 hover:text-cyan-600 transition-all">
                FAQ
              </button>
              <div className="flex items-center justify-center space-x-2 text-sm mb-4">
                <span className="font-bold text-cyan-600">EN</span>
                <span className="text-gray-400">|</span>
                <Link href="/" className="text-gray-600 hover:text-cyan-600 transition-colors">DE</Link>
              </div>
              <Link
                href="/suchen"
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium text-center hover:shadow-lg transition-all"
              >
                Try AI Search
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
                  <span>AI-Powered Course Matching • 100% Free for Learners</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Find your Weiterbildung
                  <br />
                  in minutes —
                  <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                    {' '}powered by AI
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                  Smart AI instantly matches you with AZAV-certified courses funded by Bildungsgutschein or AVGS. Find the perfect Weiterbildung for your career goals, location, and funding status—completely free.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/suchen"
                    className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    <span className="relative z-10">Try AI Search Now</span>
                    <Icons.ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>

                  <Link
                    href="/courses"
                    className="w-full md:w-auto bg-white text-gray-800 px-8 py-4 rounded-lg font-medium hover:shadow-xl transition-all flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-cyan-500"
                  >
                    <span>Browse All Courses</span>
                    <Icons.Search className="w-5 h-5" />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-8 mt-8">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Icons.GraduationCap className="w-5 h-5 text-cyan-500" />
                    <span className="font-medium">100+ Courses</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Icons.Building className="w-5 h-5 text-cyan-500" />
                    <span className="font-medium">Verified Providers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Icons.CheckCircle className="w-5 h-5 text-cyan-500" />
                    <span className="font-medium">100% Free for Learners</span>
                  </div>
                </div>
              </div>

              {/* Right: AI Demo Card */}
              <div className="relative">
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
                    Searching for <span className="font-semibold text-cyan-600">{typedText}</span>
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

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-cyan-600 font-medium mb-2">How It Works</div>
              <h2 className="text-4xl md:text-5xl font-bold">Three simple steps to your perfect course</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  num: '1',
                  icon: Icons.Target,
                  title: '1. Describe Your Goals',
                  desc: 'Tell our AI about your career aspirations, preferred location, and whether you have Bildungsgutschein or AVGS funding. Takes just 30 seconds.',
                },
                {
                  num: '2',
                  icon: Icons.Sparkles,
                  title: '2. Get Instant Matches',
                  desc: 'Our AI analyzes 100+ AZAV-certified courses and instantly recommends the best matches for your situation, goals, and funding eligibility.',
                },
                {
                  num: '3',
                  icon: Icons.Mail,
                  title: '3. Apply Directly',
                  desc: 'Review course details, provider ratings, and start dates. Apply directly through our platform or contact providers with one click. No hidden fees ever.',
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

        {/* Learner Benefits Section */}
        <section id="for-students" className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Why learners trust Kursfind AI</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: Icons.ShieldCheck,
                  title: 'AZAV-Certified Courses',
                  desc: 'All courses meet strict German education standards and qualify for Bildungsgutschein or AVGS funding.',
                  highlight: true,
                },
                {
                  icon: Icons.Gift,
                  title: 'Zero Cost to You — Providers pay us, you search and apply completely free',
                  desc: 'Search, match, and apply without paying a cent. No hidden fees, ever.',
                },
                {
                  icon: Icons.Award,
                  title: 'Study with Confidence — Every provider is AZAV-certified and government-approved',
                  desc: 'Find verified bootcamps eligible for Bildungsgutschein or AVGS funding. Only trusted, quality providers.',
                },
                {
                  icon: Icons.Sparkles,
                  title: 'Save Hours of Research — AI finds your perfect course in seconds',
                  desc: 'Get matched to courses that actually fit your career goals, location, and schedule. AI does the hard work for you.',
                },
                {
                  icon: Icons.FileCheck,
                  title: 'Maximize Your Funding — Match with courses that accept your Bildungsgutschein or AVGS',
                  desc: 'Check your eligibility easily. We guide you through the funding process step-by-step.',
                },
                {
                  icon: Icons.Zap,
                  title: 'Expert Guidance — Get answers about courses, funding, and career paths',
                  desc: 'AI automation means faster replies and smoother document handling. Start your course sooner.',
                },
                {
                  icon: Icons.Globe,
                  title: 'Multilingual Support — Platform available in German, English, and more languages',
                  desc: 'Search in German, English, or Dari. Language should not be a barrier to your education.',
                },
                {
                  icon: Icons.Lock,
                  title: 'GDPR Compliant & Safe',
                  desc: 'Your data is protected. We only share your information with providers you explicitly choose — no selling, no spam.',
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

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Start your course search now</h2>
            <p className="text-xl mb-8 opacity-90">
              Find the perfect AZAV-certified course in minutes. AI-powered, government-funded, 100% free.
            </p>
            <Link
              href="/suchen"
              className="inline-flex items-center space-x-2 bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all"
            >
              <span>Try AI Search Now</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-sm opacity-80">✨ We&apos;ll help you find the perfect course</p>
          </div>
        </section>

        {/* Provider Promo Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-cyan-600 font-medium mb-2">For Education Providers</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get verified, high-quality leads for your courses</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If you&apos;re an AZAV-certified provider in Germany, Kursfind AI helps you reach serious learners—with full consent and GDPR compliance. List unlimited courses completely free.
            </p>
            <Link
              href="/en/providers"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <span className="relative z-10">Learn More for Providers</span>
              <Icons.ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <Link href="/en" className="flex items-center mb-4 hover:opacity-80 transition-all">
                <Image
                  src="/landing/kursfind-ai-logo.jpg"
                  alt="Kursfind AI Logo"
                  width={128}
                  height={128}
                  className="h-24 md:h-32 w-auto rounded-xl"
                />
              </Link>
              <p className="text-sm text-gray-300">Find your Weiterbildung in minutes — powered by AI.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/en" className="hover:text-cyan-400 transition-all">Home</Link></li>
                <li><Link href="/courses" className="hover:text-cyan-400 transition-all">Browse Courses</Link></li>
                <li><Link href="/en/providers" className="hover:text-cyan-400 transition-all">For Providers</Link></li>
                <li><Link href="/en/about" className="hover:text-cyan-400 transition-all">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/en/privacy" className="hover:text-cyan-400 transition-all">Privacy Policy</Link></li>
                <li><Link href="/en/imprint" className="hover:text-cyan-400 transition-all">Imprint</Link></li>
              </ul>
              <h4 className="text-white font-semibold mb-4 mt-8">Contact</h4>
              <div className="flex items-center space-x-2 mb-2">
                <Icons.Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:kontakt@kursfind.de" className="text-sm hover:text-cyan-400 transition-all">kontakt@kursfind.de</a>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:partner@kursfind.de" className="text-sm hover:text-cyan-400 transition-all">partner@kursfind.de</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm opacity-60">
            © 2025 Kursfind AI • Operated by Wasim Academy UG (haftungsbeschränkt), Berlin, Germany
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
