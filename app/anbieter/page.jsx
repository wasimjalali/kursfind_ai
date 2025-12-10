'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MarketingLayout from '@/components/marketing/MarketingLayout';

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
  Clock: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Gift: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  DollarSign: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ShieldCheck: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  BarChart: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Users: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Zap: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  FileCheck: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  GraduationCap: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  Mail: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Check: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Phone: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  MessageCircle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Play: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// FAQ Data for Providers
const providerFaqData = [
  {
    question: 'Was ist der Unterschied zwischen CPL und CPA?',
    answer: 'CPL (Cost Per Lead) bedeutet, Sie zahlen für jeden qualifizierten Lead, unabhängig von der Anmeldung. CPA (Cost Per Acquisition) bedeutet, Sie zahlen nur, wenn ein Student sich tatsächlich anmeldet. CPA ist ideal für Anbieter mit weniger Budget oder unsicheren Conversion-Raten.',
  },
  {
    question: 'Wann erhalte ich meine kostenlosen Early-Adopter-Leads?',
    answer: 'Sofort nach Aktivierung Ihres Accounts! Bei CPL erhalten Sie Ihre ersten 5 Leads kostenlos. Bei CPA ist Ihre erste erfolgreiche Anmeldung kostenlos. Kein Haken, keine versteckten Kosten.',
  },
  {
    question: 'Gibt es eine Vertragslaufzeit?',
    answer: 'Unsere Standard-Laufzeit beträgt 3 Monate. Als Early Adopter sichern Sie sich jedoch Ihre Launch-Preise dauerhaft – auch nach Vertragsende können Sie zu diesen Konditionen verlängern.',
  },
  {
    question: 'Wie werden die Studenten vorqualifiziert?',
    answer: 'Unsere KI-Engine prüft automatisch: Förderberechtigung (Bildungsgutschein/AVGS), Registrierung beim Jobcenter/Arbeitsagentur, Motivation und Passung zum Kurs. Sie erhalten nur Leads mit hoher Conversion-Wahrscheinlichkeit.',
  },
  {
    question: 'Was passiert nach den 6 Monaten Launch-Preis?',
    answer: 'Sie können entweder zu Standard-Preisen weitermachen (+15-20%) oder Ihren Vertrag kündigen. Als Early Adopter haben Sie jedoch die Option, Ihre Launch-Preise zu behalten, wenn Sie uns eine kurze Erfolgsgeschichte zur Verfügung stellen.',
  },
  {
    question: 'Kann ich zwischen CPL und CPA wechseln?',
    answer: 'Ja, jederzeit! Viele Anbieter starten mit CPA (geringes Risiko) und wechseln nach 3-6 Monaten zu CPL, sobald sie ihre Conversion-Rate kennen. Wir beraten Sie gerne.',
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
        <span className="font-semibold text-lg text-gray-900">{question}</span>
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

export default function AnbieterPage() {
  const [pricingModel, setPricingModel] = useState('cpl');

  
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-cyan-50/30 to-gray-50 pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-medium mb-4 border border-cyan-200">
                <Icons.Sparkles className="w-4 h-4" />
                <span>Für AZAV-zertifizierte Bildungsanbieter</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Qualifizierte{' '}
                <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  Kursteilnehmer
                </span>
                <br />
                ohne Werbekosten vorab
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                KI vermittelt Lernende mit Bildungsgutschein direkt zu Ihren Kursen. Sie zahlen nur bei Ergebnis: ab €25 pro Lead oder ab €300 pro Anmeldung.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/provider/signup"
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-10 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <span className="relative z-10">Kostenlos starten</span>
                  <Icons.ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link
                  href="#demo"
                  className="bg-white text-gray-800 px-10 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-xl transition-all border-2 border-gray-200 hover:border-cyan-500"
                >
                  <span>Demo ansehen</span>
                  <Icons.Play className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2 hover:text-cyan-600 transition-colors">
                  <Icons.Gift className="w-4 h-4" />
                  <span>Kostenlos listen</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-cyan-600 transition-colors">
                  <Icons.CheckCircle className="w-4 h-4" />
                  <span>DSGVO-konform</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-cyan-600 transition-colors">
                  <Icons.DollarSign className="w-4 h-4" />
                  <span>Ab €25 pro Lead (CPL)</span>
                </div>
              </div>
            </div>

            {/* Right: Dashboard Screenshot */}
            <div className="relative">
              <div className="text-center mb-4">
                <span className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                  Ihr Anbieter-Dashboard
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <Image
                  src="/screenshots/Provider-dashboard-main-page.png"
                  alt="Kursfind AI Anbieter Dashboard"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-medium mb-4 border border-cyan-200">
              <Icons.Zap className="w-4 h-4" />
              <span>Demo-Video</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              So funktioniert Kursfind AI für Anbieter
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              In 2 Minuten sehen Sie, wie Sie Kurse einstellen, Bewerbungen erhalten und Interessenten verwalten.
            </p>
          </div>
          
          {/* Video Embed */}
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                src="https://www.youtube-nocookie.com/embed/nblywT1nm10?autoplay=1&mute=1"
                title="Kursfind AI Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="/provider/signup"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 hover:shadow-xl transition-all group"
            >
              <span>Jetzt kostenlos starten</span>
              <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Problem → Transformation */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Schluss mit teurer Werbung für leere Kursplätze
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Das alte Modell */}
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Das alte Modell</h3>
              <ul className="space-y-4">
                {[
                  '€300-800 pro Lead durch Google Ads',
                  'KURSNET-Listing bringt kaum Anfragen',
                  'Kaltakquise bei Arbeitsagenturen',
                  '30-40% der Kurse wegen Unterbelegung abgesagt',
                  'Stundenlange Nachqualifizierung von Leads',
                  'Unklarer Gutschein-Status der Interessenten',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-lg">✗</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="font-semibold text-red-800 mb-1">Typische Kosten:</p>
                <p className="text-red-700">€8.000-12.000 Marketing pro Kursstart</p>
                <p className="text-red-700">4-6 Wochen bis zur Anmeldung</p>
              </div>
            </div>

            {/* Right Column - Mit Kursfind AI */}
            <div className="bg-emerald-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Mit Kursfind AI</h3>
              <ul className="space-y-4">
                {[
                  'Ab €25 pro qualifiziertem Lead (CPL)',
                  'Oder ab €300 pro erfolgreicher Anmeldung (CPA)',
                  'KI-Matching bringt passende Lernende zu Ihnen',
                  'Alle Leads haben Gutschein bereits oder beantragen ihn',
                  'Direkte Kontaktaufnahme über Dashboard',
                  'Kein Werbebudget vorab nötig',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold text-lg">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-emerald-100 border border-emerald-300 rounded-xl p-4">
                <p className="font-semibold text-emerald-800 mb-1">Ihr Vorteil:</p>
                <p className="text-emerald-700">60-70% niedrigere Kosten pro Teilnehmer</p>
                <p className="text-emerald-700">2-3 Tage bis zur Anmeldung</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: How It Works - 3 Steps */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              In 3 Schritten zu mehr Kursteilnehmern
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                icon: '📝',
                title: 'Kurse kostenlos eintragen',
                desc: 'Erstellen Sie Ihr Profil und listen Sie unbegrenzt AZAV-Kurse. Kostenlose Einrichtung, keine Jahresgebühren.',
              },
              {
                num: '2',
                icon: '🎯',
                title: 'KI bringt passende Lernende',
                desc: 'Unsere KI matcht Ihre Kurse mit Lernenden basierend auf Zielen, Standort und Förderstatus.',
              },
              {
                num: '3',
                icon: '✅',
                title: 'Annehmen & Kontaktieren',
                desc: 'Prüfen Sie Leads im Dashboard, akzeptieren Sie passende Interessenten und kontaktieren Sie sie direkt.',
              },
            ].map((step, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-cyan-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.num}
                  </div>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/provider/signup"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 hover:shadow-xl transition-all group"
            >
              <span>Jetzt Kurse eintragen</span>
              <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Preview Section - Applications */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-medium mb-4 border border-cyan-200">
              <Icons.Users className="w-4 h-4" />
              <span>Lead-Management</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Alle Bewerbungen auf einen Blick
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sehen Sie eingehende Bewerbungen in Echtzeit, prüfen Sie Bewerberprofile und kontaktieren Sie Interessenten direkt über die Plattform.
            </p>
          </div>
          
          {/* Large Screenshot */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/screenshots/Provider-student-application-received-page.png"
              alt="Bewerbungen Dashboard"
              width={1200}
              height={700}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Platform Preview Section - Analytics */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full font-medium mb-4 border border-purple-200">
              <Icons.BarChart className="w-4 h-4" />
              <span>Analytics & Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Performance in Echtzeit verfolgen
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conversion-Rates, Klicks und ROI auf einen Blick. Optimieren Sie Ihre Kurse basierend auf echten Daten.
            </p>
          </div>
          
          {/* Large Screenshot */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/screenshots/Provider-dashboard-analytics-page.png"
              alt="Analytics Dashboard"
              width={1200}
              height={700}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Section 6: Benefits - 6 Cards with 3D/Cursor Style */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Warum Anbieter Kursfind AI wählen
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Icons.Sparkles,
                title: 'KI-geprüfte Qualitäts-Leads',
                desc: 'Unsere KI bewertet alle Bewerber nach Eignung, Motivation und Förderfähigkeit.',
              },
              {
                icon: Icons.ShieldCheck,
                title: 'Vorqualifizierte Interessenten',
                desc: 'Nur Lernende mit Bildungsgutschein, AVGS oder als Selbstzahler. Kein Zeitverlust.',
              },
              {
                icon: Icons.BarChart,
                title: 'Umfassende Analytics',
                desc: 'Echtzeit-Dashboard mit Conversion-Tracking, Lead-Scores und ROI-Berechnung.',
              },
              {
                icon: Icons.Clock,
                title: 'Zeitersparnis durch Automatisierung',
                desc: 'Keine manuelle Vorsortierung. Bewerbungen direkt im Dashboard mit allen Daten.',
              },
              {
                icon: Icons.Phone,
                title: 'Direkter Kontakt zu Interessenten',
                desc: 'Kontaktieren Sie Leads direkt über die Plattform per Telefon, E-Mail oder Chat.',
              },
              {
                icon: Icons.Zap,
                title: 'Schnelles Onboarding',
                desc: 'Kostenlose Einrichtung und Schulung. In 48 Stunden einsatzbereit.',
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 cursor-pointer overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-cyan-400/50 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-500 group-hover:scale-110">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-16 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Faire Preise für jeden Anbieter
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Zahlen Sie nur für qualifizierte Leads oder erfolgreiche Anmeldungen. Keine Setup-Gebühren, keine versteckten Kosten.
            </p>

            {/* CPL/CPA Toggle */}
            <div className="inline-flex flex-col items-center">
              <div className="bg-gray-100 rounded-full p-1 flex flex-wrap justify-center">
                <button
                  onClick={() => setPricingModel('cpl')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${pricingModel === 'cpl' ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Kosten pro Lead (CPL)
                </button>
                <button
                  onClick={() => setPricingModel('cpa')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${pricingModel === 'cpa' ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Kosten pro Anmeldung (CPA)
                </button>
              </div>
              <p className="mt-4 text-sm md:text-base text-gray-600">
                💡 {pricingModel === 'cpl' ? 'Ideal für etablierte Anbieter mit stabiler Conversion-Rate' : 'Ideal für Anbieter, die nur für erfolgreiche Anmeldungen zahlen möchten'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-16 md:pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Basis Tier */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basis</h3>
                <p className="text-gray-600">Für kleinere Bildungsanbieter</p>
                <p className="text-sm text-cyan-600 font-medium mt-2">Kurswert: €2.000 - €6.000</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{pricingModel === 'cpl' ? '€25' : '€300'}</span>
                  <span className="text-gray-600">/ {pricingModel === 'cpl' ? 'Lead' : 'Anmeldung'}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {['Unbegrenzte Kurseinträge', 'Provider-Dashboard', 'Conversion-Tracking', 'E-Mail-Benachrichtigungen', 'Standard-Support'].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Icons.Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl p-4 mb-6 border border-cyan-100">
                <p className="font-semibold text-gray-900 mb-1">🎁 Launch-Bonus</p>
                <p className="text-sm text-gray-700">{pricingModel === 'cpl' ? '5 kostenlose Leads' : '1 kostenlose Anmeldung'}</p>
              </div>
              <Link
                href="/provider/signup"
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all relative overflow-hidden group block text-center"
              >
                <span className="relative z-10">Jetzt starten</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>

            {/* Professional Tier (Highlighted) */}
            <div className="bg-gradient-to-b from-cyan-50 to-emerald-50 border-2 border-cyan-500 rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                  ⭐ Beliebt bei Anbietern
                </span>
              </div>
              <div className="mb-6 pt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600">Für etablierte Anbieter</p>
                <p className="text-sm text-cyan-600 font-medium mt-2">Kurswert: €6.000 - €11.000</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{pricingModel === 'cpl' ? '€40' : '€450'}</span>
                  <span className="text-gray-600">/ {pricingModel === 'cpl' ? 'Lead' : 'Anmeldung'}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <Icons.Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Alles aus Basis, plus:</span>
                </li>
                {['Prioritäts-Support', 'Erweiterte Analytics', 'Dedizierter Ansprechpartner'].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Icons.Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white rounded-xl p-4 mb-6 border border-cyan-200">
                <p className="font-semibold text-gray-900 mb-1">🎁 Launch-Bonus</p>
                <p className="text-sm text-gray-700">{pricingModel === 'cpl' ? '5 kostenlose Leads' : '1 kostenlose Anmeldung'}</p>
              </div>
              <Link
                href="/provider/signup"
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all relative overflow-hidden group block text-center"
              >
                <span className="relative z-10">Jetzt starten</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-gray-600">Für hochwertige Weiterbildungen</p>
                <p className="text-sm text-cyan-600 font-medium mt-2">Kurswert: €11.000+</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{pricingModel === 'cpl' ? '€60' : '€600'}</span>
                  <span className="text-gray-600">/ {pricingModel === 'cpl' ? 'Lead' : 'Anmeldung'}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <Icons.Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Alles aus Professional, plus:</span>
                </li>
                {['Early Access zu neuen Features', 'Custom Integrationen', 'Quartalsweise Strategy-Calls'].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Icons.Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl p-4 mb-6 border border-cyan-100">
                <p className="font-semibold text-gray-900 mb-1">🎁 Launch-Bonus</p>
                <p className="text-sm text-gray-700">{pricingModel === 'cpl' ? '5 kostenlose Leads' : '1 kostenlose Anmeldung'}</p>
              </div>
              <Link
                href="/provider/signup"
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all relative overflow-hidden group block text-center"
              >
                <span className="relative z-10">Jetzt starten</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-10">
            Alle Preise zzgl. MwSt. • Keine Setup-Gebühren • 3 Monate Mindestlaufzeit • Jederzeit kündbar nach Ablauf
          </p>
        </div>
      </section>

      {/* Section 8: Mini-FAQ */}
      <section id="faq" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Häufige Fragen von Anbietern
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: 'Was ist ein "qualifizierter Lead"?',
                a: 'Ein Lead mit echtem Interesse an Ihrem Kurs, korrekten Kontaktdaten und bestätigtem Bildungsgutschein- oder AVGS-Status (oder Selbstzahler). Unqualifizierte Anfragen werden nicht berechnet.',
              },
              {
                q: 'Wann muss ich zahlen?',
                a: 'Bei CPL: Nach Erhalt des Leads. Bei CPA: Erst nach erfolgreicher Kursanmeldung. Keine Vorauszahlungen.',
              },
              {
                q: 'Was wenn ein Lead nicht zu mir passt?',
                a: 'Sie können Leads ablehnen. Abgelehnte Leads werden nicht berechnet, solange die Ablehnung berechtigt ist (z.B. falscher Standort, falsches Kursthema).',
              },
              {
                q: 'Wie schnell sehe ich Ergebnisse?',
                a: 'Erste Leads typischerweise innerhalb von 1-2 Wochen nach Freischaltung, abhängig von Kursangebot und Nachfrage in Ihrer Region.',
              },
              {
                q: 'Gibt es eine Mindestabnahme?',
                a: 'Nein. Sie zahlen nur für Leads, die Sie tatsächlich erhalten. Keine Mindestabnahme, keine monatlichen Fixkosten.',
              },
              {
                q: 'Was unterscheidet Kursfind AI von KURSNET?',
                a: 'KURSNET ist ein Verzeichnis, in dem Lernende selbst suchen müssen. Kursfind AI ist ein aktives Matching-System: Unsere KI bringt passende Lernende direkt zu Ihren Kursen.',
              },
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Competitive Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Kursfind AI vs. Ihre Alternativen
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">Kriterium</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Google Ads</th>
                  <th className="text-center p-4 font-semibold text-gray-900">KURSNET</th>
                  <th className="text-center p-4 font-semibold text-white bg-gradient-to-r from-cyan-500 to-emerald-500">Kursfind AI</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Kosten pro Lead</td>
                  <td className="p-4 text-center text-gray-600">€300-800</td>
                  <td className="p-4 text-center text-gray-600">Kostenlos*</td>
                  <td className="p-4 text-center font-semibold text-emerald-600 bg-emerald-50">Ab €25</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Lead-Qualität</td>
                  <td className="p-4 text-center text-gray-600">Gemischt</td>
                  <td className="p-4 text-center text-gray-600">Niedrig</td>
                  <td className="p-4 text-center font-semibold text-emerald-600 bg-emerald-50">Vorqualifiziert</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Gutschein-Status</td>
                  <td className="p-4 text-center text-gray-600">Unbekannt</td>
                  <td className="p-4 text-center text-gray-600">Unbekannt</td>
                  <td className="p-4 text-center font-semibold text-emerald-600 bg-emerald-50">Verifiziert</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Zeitaufwand</td>
                  <td className="p-4 text-center text-gray-600">Hoch (Kampagnen)</td>
                  <td className="p-4 text-center text-gray-600">Niedrig</td>
                  <td className="p-4 text-center font-semibold text-emerald-600 bg-emerald-50">Minimal</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Vorabinvestition</td>
                  <td className="p-4 text-center text-gray-600">€5.000+</td>
                  <td className="p-4 text-center text-gray-600">Keine</td>
                  <td className="p-4 text-center font-semibold text-emerald-600 bg-emerald-50">Keine</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-700">Ergebnis-Garantie</td>
                  <td className="p-4 text-center text-gray-600">Nein</td>
                  <td className="p-4 text-center text-gray-600">Nein</td>
                  <td className="p-4 text-center font-semibold text-emerald-600 bg-emerald-50">Lead-Garantie</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            *KURSNET ist kostenlos, bringt aber kaum qualifizierte Anfragen
          </p>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'white' }}>
            Bereit, Ihre Kurse zu füllen?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'white' }}>
            Starten Sie kostenlos und erhalten Sie qualifizierte Leads mit Bildungsgutschein. Keine Vorabkosten, kein Risiko.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/provider/signup"
              className="bg-white text-emerald-600 px-10 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 hover:shadow-2xl transition-all group"
              style={{ height: '56px' }}
            >
              <span>Kostenlos starten</span>
              <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#booking"
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 hover:bg-white/10 transition-all"
              style={{ height: '56px' }}
            >
              <span>Beratungsgespräch</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-white">
            <span className="flex items-center gap-2">
              <Icons.Check className="w-5 h-5" />
              Kostenlose Kurslistung
            </span>
            <span className="flex items-center gap-2">
              <Icons.Check className="w-5 h-5" />
              5 Leads geschenkt
            </span>
            <span className="flex items-center gap-2">
              <Icons.Check className="w-5 h-5" />
              Jederzeit kündbar
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section with Cal.com Booking */}
      <section id="booking" className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Partner von Kursfind AI werden</h2>
          <p className="text-xl mb-12 text-gray-700">
            Verbinde dich mit motivierten Lernenden mit Bildungsgutschein oder AVGS-Förderung. Tritt noch heute unserem Netzwerk geprüfter Bildungsanbieter bei.
          </p>

          {/* Cal.com Booking Section */}
          <div className="max-w-7xl mx-auto px-4">
            {/* Cal.com Calendar - Full Width */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Termin vereinbaren</h3>
              <p className="text-sm text-gray-700 text-center mb-4">Buchen Sie ein 30-minütiges Beratungsgespräch</p>
              <div className="w-full min-h-[600px]">
                <iframe
                  src="https://cal.com/wasim.jalali/30min?embed=true&theme=light"
                  className="w-full h-[600px] border-0 rounded-xl"
                  title="Termin buchen"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Icons.Phone className="w-6 h-6 text-cyan-600" />
                  Kontaktinformation
                </h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                    <Icons.Mail className="w-5 h-5 text-cyan-600 mt-1" />
                    <div>
                      <p className="font-semibold mb-1 text-gray-900 text-sm">E-Mail</p>
                      <a href="mailto:partner@kursfind.de" className="text-cyan-600 hover:text-cyan-700 transition text-sm break-all">partner@kursfind.de</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                    <Icons.Phone className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="font-semibold mb-1 text-gray-900 text-sm">Telefon</p>
                      <a href="tel:+491630446980" className="text-emerald-600 hover:text-emerald-700 transition text-sm">+49 163 044 6980</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                    <Icons.MessageCircle className="w-5 h-5 text-cyan-600 mt-1" />
                    <div>
                      <p className="font-semibold mb-1 text-gray-900 text-sm">WhatsApp</p>
                      <a href="https://wa.me/491630446980" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 transition text-sm">+49 163 044 6980</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Expect Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Icons.Sparkles className="w-6 h-6 text-cyan-600" />
                  Was Sie erwartet
                </h3>
                <ul className="space-y-3 text-left text-gray-700">
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-cyan-50">
                    <Icons.CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-cyan-600" />
                    <span className="text-sm">Kostenlose Kurslistung</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
                    <Icons.CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                    <span className="text-sm">KI-gestützte Kursvermittlung</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-cyan-50">
                    <Icons.CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-cyan-600" />
                    <span className="text-sm">Ab €25/Lead oder €300/Anmeldung</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
                    <Icons.CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                    <span className="text-sm">Einfaches Onboarding</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/provider/signup"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-10 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 hover:shadow-2xl transition-all"
            >
              <span>Jetzt kostenlos registrieren</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
