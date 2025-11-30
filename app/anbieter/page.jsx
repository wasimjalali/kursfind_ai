'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold transition-transform">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-6 text-gray-600">{answer}</div>
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
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-medium mb-4 border border-cyan-200">
            <Icons.Clock className="w-4 h-4" />
            <span>Limitierte Beta • Verlängerter Gratis-Zeitraum für Early Adopters</span>
          </div>
          <div className="text-cyan-600 font-medium mb-4">Für AZAV-zertifizierte Anbieter</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Verbinde dich mit{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              motivierten Lernenden
            </span>
            <br />
            mit staatlicher Förderung
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Erreiche hochmotivierte Lernende mit Bildungsgutschein oder AVGS-Förderung. Liste unbegrenzt Kurse komplett kostenlos. Flexible Preismodelle: ab €25 pro Lead (CPL) oder ab €300 pro erfolgreicher Anmeldung (CPA) – du entscheidest!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/provider/signup"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-10 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <span className="relative z-10">Kurse einstellen</span>
              <Icons.ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/provider/login"
              className="bg-white text-gray-800 px-10 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-xl transition-all border-2 border-gray-200 hover:border-cyan-500"
            >
              <span>Anmelden</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-600">
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
      </section>

      {/* Why Providers Choose Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Warum Anbieter Kursfind AI wählen</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Alle Vorteile, die Ihr Bildungsunternehmen braucht, um mehr qualifizierte Studenten zu gewinnen
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Icons.Sparkles, title: 'KI-geprüfte Qualitäts-Leads', desc: 'Unsere Smart-AI-Engine bewertet und filtert alle Bewerber nach Eignung, Motivation und Förderfähigkeit.' },
              { icon: Icons.ShieldCheck, title: 'Vorqualifizierte Studenten', desc: 'Nur Interessenten mit gültigem Bildungsgutschein, AVGS oder Selbstzahler. Keine Zeit- und Ressourcenverschwendung.' },
              { icon: Icons.BarChart, title: 'Umfassende Analytics', desc: 'Echtzeit-Dashboard mit Conversion-Tracking, Lead-Qualität-Scores und ROI-Berechnungen.' },
              { icon: Icons.Clock, title: 'Zeitersparnis durch Automatisierung', desc: 'Keine manuelle Vorsortierung mehr. Bewerbungen gehen direkt in Ihr Dashboard mit allen relevanten Daten.' },
              { icon: Icons.Users, title: 'Direkte Studenten-Kommunikation', desc: 'Kontaktieren Sie Bewerber direkt über die Plattform – Telefon, E-Mail oder Chat.' },
              { icon: Icons.Zap, title: 'Schnelles Onboarding', desc: 'Kostenlose Einrichtung, Datenmigration und persönliche Schulung. In 48 Stunden einsatzbereit.' },
              { icon: Icons.Gift, title: 'Kostenlose Listung', desc: 'Alle AZAV-zertifizierten Anbieter können ihre Kurse kostenlos eintragen. Keine Kosten für Eintrag, keine Jahresgebühren.' },
              { icon: Icons.DollarSign, title: 'Zahle nur für Ergebnisse (CPL/CPA)', desc: 'Wählen Sie zwischen Cost-per-Lead oder Cost-per-Acquisition. Nur zahlen, wenn qualifizierte Leads oder erfolgreiche Anmeldungen generiert werden.' },
              { icon: Icons.FileCheck, title: 'Kurze Vertragslaufzeiten – 3-6 Monate', desc: 'Statt 12+ Monaten wie bei anderen Plattformen. Flexibel testen, anpassen und skalieren – ohne jahrelange Bindung.' },
            ].map((item, i) => (
              <div key={i} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 lg:p-8 border-2 border-gray-200 hover:border-cyan-400 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-3 shadow-lg group-hover:shadow-cyan-500/50 transition-shadow duration-300">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funnel Steps */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Vom Lernenden zum Lead — in vier Schritten</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '1', icon: Icons.GraduationCap, title: 'Lernende nutzen KI-Matching', desc: 'Teilnehmer teilen Ziele, Stadt, Sprache und Gutschein-Status. Unsere KI findet passende Kurse.' },
              { num: '2', icon: Icons.CheckCircle, title: 'KI prüft Qualität', desc: 'KI filtert nach echtem Interesse, korrekter Gutschein-Berechtigung und Anmeldebereitschaft. Nur qualifizierte Lernende kommen weiter.' },
              { num: '3', icon: Icons.Mail, title: 'Du erhältst geprüften Lead', desc: 'Erhalte Name, E-Mail, Telefon, Ziele, Gutschein-Status und ausdrückliche Einwilligung — alles DSGVO-konform und kontaktbereit.' },
              { num: '4', icon: Icons.DollarSign, title: 'Du zahlst nur für Ergebnisse', desc: 'Wähle zwischen CPL (ab €25/Lead) oder CPA (ab €300/Anmeldung). Keine Vorkosten, keine monatlichen Gebühren.' },
            ].map((step, i) => (
              <div key={i} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-cyan-400 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold mb-4 shadow-lg group-hover:shadow-cyan-500/50 transition-shadow duration-300">
                  {step.num}
                </div>
                <step.icon className="text-cyan-500 mb-3 w-8 h-8 transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-16 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-cyan-600 font-semibold mb-2">Transparente Preise</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Faire Konditionen für jeden Anbieter
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
                  Cost Per Lead (CPL)
                </button>
                <button
                  onClick={() => setPricingModel('cpa')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${pricingModel === 'cpa' ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Cost Per Acquisition (CPA)
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
      <section className="pb-16 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Basis Tier */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basis</h3>
                <p className="text-gray-600">Perfekt für kleinere Bildungsanbieter</p>
                <p className="text-sm text-cyan-600 font-medium mt-2">Kurswert: €2.000 - €6.000</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{pricingModel === 'cpl' ? '€25' : '€300'}</span>
                  <span className="text-gray-600">/ {pricingModel === 'cpl' ? 'Lead' : 'Anmeldung'}</span>
                </div>
                <p className="text-sm text-emerald-600 font-medium">Launch-Preis (erste 6 Monate)</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="line-through">Standard: {pricingModel === 'cpl' ? '€30' : '€350'}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl p-4 mb-6 border border-cyan-100">
                <p className="font-semibold text-gray-900 mb-2">🎁 Early Adopter Bonus</p>
                <p className="text-sm text-gray-700">• {pricingModel === 'cpl' ? '5 kostenlose Leads' : '1 kostenlose Anmeldung'}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unbegrenzte Kurseinträge', 'Professionelle Webseite für jeden Kurs', 'Persönliches Provider-Dashboard', 'Conversion-Tracking & Analytics', 'Bewerbungen in Echtzeit empfangen', 'Direkter Kontakt zu Studenten', 'E-Mail-Benachrichtigungen', 'Kostenlose Plattform-Einrichtung', 'Kostenlose Onboarding-Schulung'].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Icons.Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
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
                <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ⭐ Beliebteste Wahl
                </span>
              </div>
              <div className="mb-6 pt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600">Ideal für etablierte Anbieter</p>
                <p className="text-sm text-cyan-600 font-medium mt-2">Kurswert: €6.000 - €11.000</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{pricingModel === 'cpl' ? '€40' : '€600'}</span>
                  <span className="text-gray-600">/ {pricingModel === 'cpl' ? 'Lead' : 'Anmeldung'}</span>
                </div>
                <p className="text-sm text-emerald-600 font-medium">Launch-Preis (erste 6 Monate)</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="line-through">Standard: {pricingModel === 'cpl' ? '€48' : '€700'}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 mb-6 border border-cyan-200">
                <p className="font-semibold text-gray-900 mb-2">🎁 Early Adopter Bonus</p>
                <p className="text-sm text-gray-700">• {pricingModel === 'cpl' ? '5 kostenlose Leads' : '1 kostenlose Anmeldung'}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unbegrenzte Kurseinträge', 'Professionelle Webseite für jeden Kurs', 'Persönliches Provider-Dashboard', 'Conversion-Tracking & Analytics', 'Bewerbungen in Echtzeit empfangen', 'Direkter Kontakt zu Studenten', 'E-Mail-Benachrichtigungen', 'Kostenlose Plattform-Einrichtung', 'Kostenlose Onboarding-Schulung'].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Icons.Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                <li className="flex items-start space-x-3">
                  <Icons.Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 font-medium">Prioritäts-Support</span>
                </li>
              </ul>
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
                  <span className="text-4xl font-bold text-gray-900">{pricingModel === 'cpl' ? '€60' : '€850'}</span>
                  <span className="text-gray-600">/ {pricingModel === 'cpl' ? 'Lead' : 'Anmeldung'}</span>
                </div>
                <p className="text-sm text-emerald-600 font-medium">Launch-Preis (erste 6 Monate)</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="line-through">Standard: {pricingModel === 'cpl' ? '€70' : '€1.000'}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl p-4 mb-6 border border-cyan-100">
                <p className="font-semibold text-gray-900 mb-2">🎁 Early Adopter Bonus</p>
                <p className="text-sm text-gray-700">• {pricingModel === 'cpl' ? '5 kostenlose Leads' : '1 kostenlose Anmeldung'}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unbegrenzte Kurseinträge', 'Professionelle Webseite für jeden Kurs', 'Persönliches Provider-Dashboard', 'Conversion-Tracking & Analytics', 'Bewerbungen in Echtzeit empfangen', 'Direkter Kontakt zu Studenten', 'E-Mail-Benachrichtigungen', 'Kostenlose Plattform-Einrichtung', 'Kostenlose Onboarding-Schulung'].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Icons.Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                <li className="flex items-start space-x-3">
                  <Icons.Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 font-medium">Prioritäts-Support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icons.Zap className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 font-medium">Early Access zu neuen Features</span>
                </li>
              </ul>
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

      {/* CTA Section with Cal.com Booking */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-50 to-emerald-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Partner von Kursfind AI werden</h2>
          <p className="text-xl mb-12 text-gray-700">
            Verbinde dich mit motivierten Lernenden mit Bildungsgutschein oder AVGS-Förderung. Tritt noch heute unserem Netzwerk geprüfter Bildungsanbieter bei.
          </p>

          {/* Cal.com Booking Section */}
          <div className="max-w-7xl mx-auto px-4">
            {/* Cal.com Calendar - Full Width */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Termin vereinbaren</h3>
              <p className="text-sm text-gray-700 text-center mb-4">Buchen Sie ein 30-minütiges Beratungsgespräch</p>
              <div id="cal-booking-container" className="w-full overflow-y-auto max-h-[600px] min-h-[400px]"></div>
            </div>

            {/* Contact Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
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
              <div className="bg-white rounded-2xl shadow-lg p-6">
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

        {/* Cal.com Script */}
        <Script
          id="cal-embed"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function (C, A, L) {
                let p = function (a, ar) { a.q.push(ar); };
                let d = C.document;
                C.Cal = C.Cal || function () {
                  let cal = C.Cal;
                  let ar = arguments;
                  if (!cal.loaded) {
                    cal.ns = {};
                    cal.q = cal.q || [];
                    d.head.appendChild(d.createElement("script")).src = A;
                    cal.loaded = true;
                  }
                  if (ar[0] === L) {
                    const api = function () { p(api, arguments); };
                    const namespace = ar[1];
                    api.q = api.q || [];
                    typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
                    return;
                  }
                  p(cal, ar);
                };
              })(window, "https://app.cal.com/embed/embed.js", "init");
              Cal("init", {origin:"https://cal.com"});
              Cal("inline", {
                elementOrSelector: "#cal-booking-container",
                calLink: "wasim.jalali/30min",
                layout: "month_view",
                config: {
                  theme: "light"
                }
              });
            `,
          }}
        />
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Häufig gestellte Fragen
            </h2>
          </div>
          <div className="space-y-4">
            {providerFaqData.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
