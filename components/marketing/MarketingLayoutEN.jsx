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

export default function MarketingLayoutEN({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col marketing-layout">
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
              <Link href="/en" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                Courses
              </Link>
              <Link href="/en/providers" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                For Providers
              </Link>
              <Link href="/en/about" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">
                About Us
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-bold text-cyan-600">EN</span>
                <span className="text-gray-400">|</span>
                <Link href="/" className="text-gray-600 hover:text-cyan-600 transition-colors">
                  DE
                </Link>
              </div>
              <Link
                href="/suchen"
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-xl transition-all"
              >
                Try AI Search
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
        <div className="fixed inset-0 z-50 bg-white">
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
              <Link href="/en" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600">
                Home
              </Link>
              <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600">
                Courses
              </Link>
              <Link href="/en/providers" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600">
                For Providers
              </Link>
              <Link href="/en/about" onClick={() => setMobileMenuOpen(false)} className="text-lg py-2 hover:text-cyan-600">
                About Us
              </Link>
              <div className="flex items-center space-x-2 text-sm py-2">
                <span className="font-bold text-cyan-600">EN</span>
                <span className="text-gray-400">|</span>
                <Link href="/" className="text-gray-600 hover:text-cyan-600">DE</Link>
              </div>
              <Link
                href="/suchen"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium text-center"
              >
                Try AI Search
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
              <p className="text-sm opacity-80">Find your Weiterbildung in minutes — powered by AI.</p>
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
                <a href="mailto:kontakt@kursfind.de" className="text-sm hover:text-cyan-400">kontakt@kursfind.de</a>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:partner@kursfind.de" className="text-sm hover:text-cyan-400">partner@kursfind.de</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm opacity-60">
            © 2025 Kursfind AI • Operated by Wasim Academy UG (haftungsbeschränkt), Berlin, Germany
          </div>
        </div>
      </footer>
    </div>
  );
}
