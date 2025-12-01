'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Icons
const WifiOffIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-reload when back online
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsChecking(true);
    
    // Try to fetch a simple resource to check connectivity
    fetch('/api/health', { method: 'HEAD', cache: 'no-store' })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        setIsChecking(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/30 mb-6">
            <WifiOffIcon className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Status indicator */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
          isOnline 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
          {isOnline ? 'Verbindung hergestellt!' : 'Keine Verbindung'}
        </div>

        {/* Main content */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {isOnline ? 'Verbunden!' : 'Du bist offline'}
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {isOnline 
            ? 'Die Verbindung wurde wiederhergestellt. Seite wird neu geladen...'
            : 'Es scheint, als hättest du keine Internetverbindung. Bitte überprüfe deine Verbindung und versuche es erneut.'
          }
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isChecking || isOnline}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshIcon className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Prüfe...' : 'Erneut versuchen'}
          </button>

          <Link
            href="/suchen"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <HomeIcon className="w-5 h-5" />
            Zur Startseite
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Tipps zur Fehlerbehebung</h2>
          <ul className="text-sm text-gray-600 text-left space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">•</span>
              Überprüfe deine WLAN- oder Mobilfunkverbindung
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">•</span>
              Versuche, den Flugmodus ein- und auszuschalten
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">•</span>
              Starte deinen Router oder dein Gerät neu
            </li>
          </ul>
        </div>

        {/* Brand footer */}
        <div className="mt-8 text-sm text-gray-400">
          <span className="font-semibold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Kursfind AI
          </span>
          {' '}– Finde deinen perfekten Kurs
        </div>
      </div>
    </div>
  );
}
