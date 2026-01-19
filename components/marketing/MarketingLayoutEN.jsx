'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Icons
const Icons = {
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
  Mail: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

export default function MarketingLayoutEN({ children, ctaHref, ctaLabel }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const resolvedCtaHref = ctaHref ?? '/suchen';
  const resolvedCtaLabel = ctaLabel ?? 'Find Courses Free';

  return (
    <div className="min-h-screen bg-white flex flex-col marketing-layout">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20 py-2 md:py-3">
            <Link href="/en" className="flex items-center hover:opacity-90 transition-opacity cursor-pointer">
              <Image
                src="/landing/kursfind-ai-logo.jpg"
                alt="Kursfind AI"
                width={48}
                height={48}
                className="h-10 md:h-12 w-auto rounded-xl"
              />
              <span className="ml-3 text-xl md:text-2xl font-bold text-gray-900">Kursfind <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">AI</span></span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/suchen" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium cursor-pointer">
                AI Search
              </Link>
              <Link href="/en/providers" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium cursor-pointer">
                For Providers
              </Link>
              <Link href="/en/providers#pricing" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium cursor-pointer">
                Pricing
              </Link>
              <Link href="/en/agent" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium cursor-pointer">
                Kursfind Agent
              </Link>
              <Link href="/en/about" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium cursor-pointer">
                About Us
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-bold text-cyan-600">EN</span>
                <span className="text-gray-400">|</span>
                <Link href="/" className="text-gray-600 hover:text-cyan-600 transition-colors cursor-pointer">
                  DE
                </Link>
              </div>
              <Link
                href={resolvedCtaHref}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-xl transition-all cursor-pointer"
              >
                {resolvedCtaLabel}
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden hover:opacity-80 transition-all cursor-pointer"
              aria-label="Open menu"
            >
              <Icons.Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              <Image
                src="/landing/kursfind-ai-logo.jpg"
                alt="Kursfind AI"
                width={40}
                height={40}
                className="h-10 w-auto rounded-xl"
              />
              <span className="ml-3 text-xl font-bold text-gray-900">Kursfind <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">AI</span></span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="cursor-pointer">
                <Icons.X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/suchen" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600 cursor-pointer">
                AI Search
              </Link>
              <Link href="/en/providers" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600 cursor-pointer">
                For Providers
              </Link>
              <Link href="/en/providers#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600 cursor-pointer">
                Pricing
              </Link>
              <Link href="/en/agent" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600 cursor-pointer">
                Kursfind Agent
              </Link>
              <Link href="/en/about" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600 cursor-pointer">
                About Us
              </Link>
              <div className="flex items-center space-x-2 text-sm py-2">
                <span className="font-bold text-cyan-600">EN</span>
                <span className="text-gray-400">|</span>
                <Link href="/" className="text-gray-600 hover:text-cyan-600 cursor-pointer">DE</Link>
              </div>
              <Link
                href={resolvedCtaHref}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium text-center cursor-pointer"
              >
                {resolvedCtaLabel}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <div>
              <Link href="/en" className="flex items-center mb-4 hover:opacity-80 transition-all cursor-pointer">
                <Image
                  src="/landing/kursfind-ai-logo.jpg"
                  alt="Kursfind AI Logo"
                  width={128}
                  height={128}
                  className="h-24 md:h-32 w-auto rounded-xl"
                />
              </Link>
              <p className="text-sm text-white">Find your training in minutes — powered by AI.</p>
            </div>
            
            {/* For Learners */}
            <div>
              <h4 className="text-white font-semibold mb-4">For Learners</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/suchen" className="hover:text-cyan-400 transition-all cursor-pointer">AI Search</Link></li>
                <li><Link href="/en#demo" className="hover:text-cyan-400 transition-all cursor-pointer">How It Works</Link></li>
                <li><Link href="/en#faq" className="hover:text-cyan-400 transition-all cursor-pointer">FAQ</Link></li>
              </ul>
            </div>
            
            {/* For Providers */}
            <div>
              <h4 className="text-white font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/en/providers#pricing" className="hover:text-cyan-400 transition-all cursor-pointer">Pricing</Link></li>
                <li><Link href="/en/providers#demo" className="hover:text-cyan-400 transition-all cursor-pointer">Demo</Link></li>
                <li><Link href="/en/providers#booking" className="hover:text-cyan-400 transition-all cursor-pointer">Free Consultation Call</Link></li>
                <li><Link href="/en/providers#faq" className="hover:text-cyan-400 transition-all cursor-pointer">FAQ</Link></li>
              </ul>
            </div>
            
            {/* Legal & Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/en/privacy" className="hover:text-cyan-400 transition-all cursor-pointer">Privacy Policy</Link></li>
                <li><Link href="/en/imprint" className="hover:text-cyan-400 transition-all cursor-pointer">Imprint</Link></li>
                <li><Link href="/en/about" className="hover:text-cyan-400 transition-all cursor-pointer">About Us</Link></li>
              </ul>
              <h4 className="text-white font-semibold mb-4 mt-8">Contact</h4>
              <div className="flex items-center space-x-2 mb-2">
                <Icons.Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:kontakt@kursfind.de" className="text-sm hover:text-cyan-400 cursor-pointer">kontakt@kursfind.de</a>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:partner@kursfind.de" className="text-sm hover:text-cyan-400 cursor-pointer">partner@kursfind.de</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm opacity-60">
            © 2026 Kursfind • Operated by Wasim Jalali, Kaiserslautern, Germany
          </div>
        </div>
      </footer>
    </div>
  );
}
