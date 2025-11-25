'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * PROVIDER SIGNUP - NOW INVITE-ONLY
 * 
 * This page has been converted to an informational page.
 * Provider accounts are now created manually by administrators after verification.
 * 
 * Self-serve signup has been disabled for security and quality control.
 */
export default function ProviderSignupDisabled() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50/30 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/Assets/kursfind-ai-logo.jpg" 
              alt="Kursfind AI" 
              width={80} 
              height={80}
              className="mx-auto rounded-2xl shadow-lg mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Anbieter-Zugang nur auf Einladung
          </h1>
          <p className="text-gray-600 text-lg">
            Provider-Konten werden jetzt manuell verifiziert
          </p>
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-6">
          
          {/* Info Icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-cyan-100 rounded-full">
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Die Kontenerstellung für Anbieter erfolgt jetzt nur noch auf Einladung
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Um die Qualität unserer Plattform zu gewährleisten und unseren Studenten die besten Bildungsangebote zu bieten, 
              haben wir auf einen manuellen Verifizierungsprozess für neue Anbieter umgestellt.
            </p>
          </div>

          {/* How to Apply Section */}
          <div className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              So beantragen Sie Zugang:
            </h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyan-600 text-white rounded-full font-bold text-sm mr-3">1</span>
                <div>
                  <strong>Bewerbungsformular ausfüllen:</strong> Besuchen Sie unser Online-Bewerbungsformular und geben Sie Ihre Unternehmensdaten ein.
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyan-600 text-white rounded-full font-bold text-sm mr-3">2</span>
                <div>
                  <strong>Verifizierung:</strong> Unser Team prüft Ihre Angaben und kontaktiert Sie für weitere Details.
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyan-600 text-white rounded-full font-bold text-sm mr-3">3</span>
                <div>
                  <strong>Kontoerstellung:</strong> Nach erfolgreicher Prüfung erstellen wir Ihr Konto und senden Ihnen einen Link zum Festlegen Ihres Passworts.
                </div>
              </li>
            </ol>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-6">
            <a
              href="https://forms.gle/your-application-form-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              📝 Zum Bewerbungsformular
            </a>
            <p className="text-sm text-gray-500 mt-3">
              Das Formular öffnet sich in einem neuen Tab
            </p>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-600 text-sm">
              Fragen zum Bewerbungsprozess?<br />
              <a href="mailto:providers@kursfind.de" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                providers@kursfind.de
              </a>
            </p>
          </div>
        </div>

        {/* Existing Provider Login */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
          <p className="text-gray-700 mb-3">
            <strong>Bereits ein verifizierter Anbieter?</strong>
          </p>
          <Link 
            href="/provider/login" 
            className="inline-block px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Zur Anmeldung →
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
