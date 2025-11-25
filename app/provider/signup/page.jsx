'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * PROVIDER SIGNUP - NOW INVITE-ONLY
 * 
 * Provider accounts are now created manually by administrators after verification.
 * This page shows an embedded SendPulse form for provider applications.
 */
export default function ProviderSignup() {
  const [showForm, setShowForm] = useState(false);

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
                  <strong>Bewerbungsformular ausfüllen:</strong> Klicken Sie auf den Button unten und geben Sie Ihre Unternehmensdaten ein.
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
          {!showForm ? (
            <div className="text-center mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                📝 Bewerbungsformular öffnen
              </button>
            </div>
          ) : (
            <>
              {/* Embedded SendPulse Form */}
              <div className="mb-6">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Formular schließen
                  </button>
                </div>
                
                {/* SendPulse Form Container */}
                <div className="sp-form-container">
                  <style dangerouslySetInnerHTML={{__html: `
                    .sp-force-hide { display: none;}
                    .sp-form[sp-id="250261"] { 
                      display: block; 
                      background: #ffffff; 
                      padding: 20px; 
                      width: 100%; 
                      max-width: 100%; 
                      border-radius: 12px; 
                      border: 2px solid #06b6d4;
                      font-family: 'Inter', Arial, sans-serif;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    }
                    .sp-form[sp-id="250261"] input[type="checkbox"] { 
                      display: inline-block; 
                      opacity: 1; 
                      visibility: visible;
                      accent-color: #06b6d4;
                    }
                    .sp-form[sp-id="250261"] .sp-form-fields-wrapper { 
                      margin: 0 auto; 
                      width: 100%;
                    }
                    .sp-form[sp-id="250261"] .sp-form-control { 
                      background: #f9fafb; 
                      border-color: #d1d5db; 
                      border-style: solid; 
                      border-width: 1px; 
                      font-size: 15px; 
                      padding: 10px 12px; 
                      border-radius: 8px; 
                      height: 44px; 
                      width: 100%;
                      transition: all 0.2s;
                    }
                    .sp-form[sp-id="250261"] .sp-form-control:focus { 
                      outline: none;
                      border-color: #06b6d4;
                      background: #ffffff;
                      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
                    }
                    .sp-form[sp-id="250261"] .sp-field { 
                      margin-bottom: 20px;
                    }
                    .sp-form[sp-id="250261"] .sp-field label { 
                      color: #111827; 
                      font-size: 14px; 
                      font-style: normal; 
                      font-weight: 600;
                      display: block;
                      margin-bottom: 6px;
                    }
                    .sp-form[sp-id="250261"] .sp-button { 
                      border-radius: 8px; 
                      background: linear-gradient(to right, #06b6d4, #10b981);
                      color: #ffffff; 
                      width: 100%; 
                      font-weight: 700; 
                      font-size: 16px;
                      font-family: 'Inter', Arial, sans-serif;
                      padding: 14px 24px;
                      border: none;
                      cursor: pointer;
                      transition: all 0.2s;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    }
                    .sp-form[sp-id="250261"] .sp-button:hover { 
                      transform: scale(1.02);
                      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    }
                    .sp-form[sp-id="250261"] .sp-button:active { 
                      transform: scale(0.98);
                    }
                    .sp-form[sp-id="250261"] .sp-button-container { 
                      text-align: center; 
                      width: 100%;
                      margin-top: 8px;
                    }
                    .sp-form[sp-id="250261"] .sp-checkbox-option {
                      display: flex;
                      align-items: start;
                      gap: 8px;
                    }
                    .sp-form[sp-id="250261"] .sp-checkbox-option label {
                      display: flex;
                      align-items: start;
                      gap: 8px;
                      cursor: pointer;
                      font-weight: 400;
                      font-size: 13px;
                      line-height: 1.5;
                    }
                    .sp-form[sp-id="250261"] .sp-checkbox-option input[type="checkbox"] {
                      margin-top: 2px;
                      width: 18px;
                      height: 18px;
                      flex-shrink: 0;
                    }
                  `}} />
                  
                  <div className="sp-form-outer">
                    <div id="sp-form-250261" sp-id="250261" sp-hash="049bdecf7b05af2e7af45d9a6d440eb9ec5713e6b51fb5138e6f02acedef72c9" sp-lang="en" className="sp-form sp-form-regular sp-form-embed" sp-show-options="%7B%22satellite%22%3Afalse%2C%22maDomain%22%3A%22login.sendpulse.com%22%2C%22formsDomain%22%3A%22forms.sendpulse.com%22%2C%22condition%22%3A%22onEnter%22%2C%22scrollTo%22%3A25%2C%22delay%22%3A10%2C%22repeat%22%3A3%2C%22background%22%3A%22rgba(0%2C%200%2C%200%2C%200.5)%22%2C%22position%22%3A%22bottom-right%22%2C%22animation%22%3A%22%22%2C%22hideOnMobile%22%3Afalse%2C%22submitRedirectUrl%22%3A%22%22%2C%22urlFilter%22%3Afalse%2C%22urlFilterConditions%22%3A%5B%7B%22force%22%3A%22hide%22%2C%22clause%22%3A%22contains%22%2C%22token%22%3A%22%22%7D%5D%2C%22analytics%22%3A%7B%22ga%22%3A%7B%22eventLabel%22%3A%22Subscription_form_Kursfind_Provider_Waitlist%22%2C%22send%22%3Atrue%7D%7D%2C%22utmEnable%22%3Atrue%7D">
                      <div className="sp-form-fields-wrapper">
                        <div className="sp-message"><div></div></div>
                        <form noValidate className="sp-element-container">
                          <div className="sp-field" sp-id="sp-1a9f9009-e677-4ab4-8ce2-ac75cb0decfd">
                            <label className="sp-control-label"><span>Email</span><strong>*</strong></label>
                            <input type="email" sp-type="email" name="sform[email]" className="sp-form-control" placeholder="username@gmail.com" sp-tips="%7B%22required%22%3A%22Required%20field%22%2C%22wrong%22%3A%22Wrong%20email%22%7D" autoComplete="on" required />
                          </div>
                          <div className="sp-field" sp-id="sp-69b8268e-c891-4aa8-bd5e-2d9b1922d917">
                            <label className="sp-control-label"><span>Provider/Company Name</span><strong>*</strong></label>
                            <input type="text" sp-type="input" name="sform[Q29tcGFueQ==]" className="sp-form-control" placeholder="Provider/Company Name" sp-tips="%7B%22required%22%3A%22Required%20field%22%7D" autoComplete="on" required />
                          </div>
                          <div className="sp-field" sp-id="sp-65002bd9-e5d8-43b7-81f4-30c4fede3bcf">
                            <label className="sp-control-label"><span>Contact Person Name</span><strong>*</strong></label>
                            <input type="text" sp-type="input" name="sform[TmFtZQ==]" className="sp-form-control" placeholder="Contact Person Name" sp-tips="%7B%22required%22%3A%22Required%20field%22%7D" autoComplete="on" required />
                          </div>
                          <div className="sp-field" sp-id="sp-4ef7b084-54bd-4364-8691-df3986c74687">
                            <label className="sp-control-label"><span>Phone number</span></label>
                            <input type="tel" sp-type="phone" name="sform[phone]" className="sp-form-control" placeholder="1234567890" sp-tips="%7B%22wrong%22%3A%22Wrong%20phone%22%7D" autoComplete="on" />
                          </div>
                          <div className="sp-field" sp-id="sp-ea34a063-01b3-4448-840f-9255b909e88a">
                            <div className="sp-checkbox-option">
                              <label>
                                <input type="checkbox" sp-type="checkbox" name="sform[Z2RwckNvbmZpcm0=]" value="yes" sp-tips="%7B%22required%22%3A%22Required%20field%22%7D" required />
                                <span>Agreement to receive info from Kursfind AI <strong>*</strong></span>
                              </label>
                            </div>
                          </div>
                          <div className="sp-field" sp-id="sp-801145bc-7b16-4e6f-85ae-165960c67bc5">
                            <div className="sp-checkbox-option">
                              <label>
                                <input type="checkbox" sp-type="checkbox" name="sform[Z2RwclRlcm1z]" value="yes" sp-tips="%7B%22required%22%3A%22Required%20field%22%7D" required />
                                <span>Consent to collect and store data (GDPR compliance) <strong>*</strong></span>
                              </label>
                            </div>
                          </div>
                          <div className="sp-field sp-button-container" sp-id="sp-db82d3ee-8cf8-4b64-a887-baac2635d735">
                            <button id="sp-db82d3ee-8cf8-4b64-a887-baac2635d735" className="sp-button">Become our Partner</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <script type="text/javascript" async src="//web.webformscr.com/apps/fc3/build/default-handler.js?1758181175060"></script>
                </div>
              </div>
            </>
          )}

          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-600 text-sm">
              Fragen zum Bewerbungsprozess?<br />
              <a href="mailto:partner@kursfind.de" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                partner@kursfind.de
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
