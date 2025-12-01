'use client';

import { useState, useEffect } from 'react';
import { usePWA } from './PWAProvider';

// Icons
const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

/**
 * Install Banner Component
 * Shows when the app is installable but not yet installed
 */
export function InstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setIsDismissed(true);
      }
    }
  }, []);

  // Don't show if not installable, already installed, or dismissed
  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsLoading(true);
    const success = await promptInstall();
    setIsLoading(false);
    
    if (!success) {
      // User declined, dismiss for a while
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', new Date().toISOString());
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Gradient accent */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 to-emerald-500" />
        
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">
                App installieren
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Schneller Zugriff auf Kursfind AI direkt von deinem Startbildschirm
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <DownloadIcon className="w-4 h-4" />
                  {isLoading ? 'Installiere...' : 'Installieren'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  aria-label="Schließen"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Update Banner Component
 * Shows when a new version is available
 */
export function UpdateBanner() {
  const { updateAvailable, applyUpdate } = usePWA();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl shadow-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Neue Version verfügbar</p>
            <p className="text-xs text-white/80 mt-0.5">
              Klicke zum Aktualisieren
            </p>
          </div>
          <button
            onClick={applyUpdate}
            className="px-4 py-2 bg-white text-cyan-600 text-sm font-medium rounded-lg hover:bg-white/90 transition-all"
          >
            Aktualisieren
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Offline Indicator
 * Shows a small indicator when offline
 */
export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-full shadow-lg">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Offline
      </div>
    </div>
  );
}

export default InstallBanner;
