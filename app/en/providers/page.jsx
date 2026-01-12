'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MarketingLayoutEN from '@/components/marketing/MarketingLayoutEN';
import Cal, { getCalApi } from '@calcom/embed-react';

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
  TrendingDown: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
};

// FAQ Data for Providers
const providerFaqData = [
  {
    question: 'How does the 1% pricing model work?',
    answer: 'You pay 1% of the course value for every qualified lead who applies for your course through Kursfind AI. For an €8,000 course, that\'s €80 per lead. No hidden costs, no success fees.',
  },
  {
    question: 'What is a "qualified lead"?',
    answer: 'A qualified lead is someone actively looking for training, who has visited your course page and submitted a complete application with contact details. You only pay for genuine prospects.',
  },
  {
    question: 'Is there a success fee (CPA)?',
    answer: 'No. Unlike many competitors, we charge NO additional commission on successful enrollment. You only pay the 1% lead fee.',
  },
  {
    question: 'What is the launch offer?',
    answer: 'New partners receive 5 free leads to test. No credit card required, no obligation.',
  },
  {
    question: 'How does Kursfind AI compare to alternatives?',
    answer: 'Competitors often charge 1% lead fee PLUS 15% success commission. That\'s effectively €140 per lead. We charge only €80 (for €8,000 courses) – 43% cheaper.',
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

// Cal.com Calendar Embed Component
function CalendarEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"15min"});
      cal("ui", {"hideEventTypeDetails":true,"layout":"month_view"});
    })();
  }, [])
  
  return (
    <Cal 
      namespace="15min"
      calLink="wasim.jalali/15min"
      style={{width:"100%",height:"100%",overflow:"scroll"}}
      config={{"layout":"month_view"}}
    />
  );
}

export default function ProvidersPageEN() {
  
  return (
    <MarketingLayoutEN ctaHref="/provider/login" ctaLabel="Provider Login">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-cyan-50/30 to-gray-50 pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center">
            {/* Centered Copy */}
            <div className="text-center max-w-4xl">
              <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-medium mb-4 border border-cyan-200">
                <Icons.Sparkles className="w-4 h-4" />
                <span>For AZAV-Certified Education Providers</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Get Qualified{' '}
                <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  Course Participants
                </span>
                <br />
                No Upfront Advertising Costs
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed mx-auto">
                Kursfind AI connects learners eligible for funding or self-pay directly to your courses. Pay only 1% per qualified lead. No success fees. No hidden costs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="#booking"
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-10 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <span className="relative z-10">Free Consultation Call</span>
                  <Icons.ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link
                  href="#demo"
                  className="bg-white text-gray-800 px-10 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-xl transition-all border-2 border-gray-200 hover:border-cyan-500"
                >
                  <span>View Demo</span>
                  <Icons.Play className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2 hover:text-cyan-600 transition-colors">
                  <Icons.Gift className="w-4 h-4" />
                  <span>Free listing</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-cyan-600 transition-colors">
                  <Icons.CheckCircle className="w-4 h-4" />
                  <span>GDPR compliant</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-cyan-600 transition-colors">
                  <Icons.DollarSign className="w-4 h-4" />
                  <span>Only 1% per lead</span>
                </div>
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
              <span>Demo Video</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See How Kursfind AI Works for Providers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              In 2 minutes, see how to list courses, receive applications, and manage interested students.
            </p>
          </div>
          
          {/* Video Embed */}
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                src="https://www.youtube-nocookie.com/embed/nblywT1nm10?rel=0"
                title="Kursfind AI Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="#booking"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 hover:shadow-xl transition-all group"
            >
              <span>Free Consultation Call</span>
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
              Stop Paying for Empty Course Seats
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - The Old Model */}
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Old Method</h3>
              <ul className="space-y-4">
                {[
                  '€120+ per lead through Google Ads',
                  '15% success fee with competitors',
                  '€2,000+ per enrollment',
                  'High upfront costs with no guarantee',
                  'Time-consuming lead qualification',
                  'Complex contracts & minimum terms',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-lg">✗</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - With Kursfind AI */}
            <div className="bg-emerald-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">With Kursfind AI</h3>
              <ul className="space-y-4">
                {[
                  'Only 1% of course value per lead',
                  'No success fee — 0%',
                  '€800 per enrollment (average)',
                  'No upfront costs — pay only for results',
                  'AI-qualified, enrollment-ready leads',
                  'No minimum term — monthly cancellable',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold text-lg">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Result Line */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">The result:</span>{' '}
              <span className="font-bold text-emerald-600">43% cheaper than competitors</span>,{' '}
              <span className="font-bold text-cyan-600">33% cheaper than Google Ads</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: How It Works - 3 Steps */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              3 Steps to More Course Participants
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                icon: '📝',
                title: 'List Courses for Free',
                desc: 'Create your profile and list unlimited AZAV courses. Free setup, no annual fees.',
              },
              {
                num: '2',
                icon: '🎯',
                title: 'AI Brings Matching Learners',
                desc: 'Our AI matches your courses with learners based on goals, location, and funding status.',
              },
              {
                num: '3',
                icon: '✅',
                title: 'Accept & Contact',
                desc: 'Review leads in your dashboard, accept suitable prospects, and contact them directly.',
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
              <span>List Your Courses Now</span>
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
              <span>Lead Management</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              All Applications at a Glance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See incoming applications in real-time, review applicant profiles, and contact prospects directly through the platform.
            </p>
          </div>
          
          {/* Large Screenshot */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/screenshots/Provider-student-application-received-page.png"
              alt="Applications Dashboard"
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
              Track Performance in Real-Time
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conversion rates, clicks, and ROI at a glance. Optimize your courses based on real data.
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
              Why Providers Choose Kursfind AI
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Icons.Sparkles,
                title: 'AI-Verified Quality Leads',
                desc: 'Our AI evaluates all applicants by suitability, motivation, and funding eligibility.',
              },
              {
                icon: Icons.ShieldCheck,
                title: 'Pre-Qualified Prospects',
                desc: 'Only learners eligible for Bildungsgutschein, AVGS, or self-payers. No wasted time.',
              },
              {
                icon: Icons.BarChart,
                title: 'Comprehensive Analytics',
                desc: 'Real-time dashboard with conversion tracking, lead scores, and ROI calculation.',
              },
              {
                icon: Icons.Clock,
                title: 'Time Savings Through Automation',
                desc: 'No manual pre-sorting. Applications directly in your dashboard with all data.',
              },
              {
                icon: Icons.Phone,
                title: 'Direct Contact with Prospects',
                desc: 'Contact leads directly through the platform via phone, email, or chat.',
              },
              {
                icon: Icons.Zap,
                title: 'Fast Onboarding',
                desc: 'Free setup and training. Ready to go in 48 hours.',
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

      {/* Pricing Section - NEW 1% MODEL - Two Column Layout */}
      <section className="py-16 md:py-20 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              1% of course value per qualified lead. No hidden costs.
            </p>
          </div>

          {/* Two Column Pricing Card */}
          <div className="bg-white border-2 border-cyan-500 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 to-emerald-500"></div>
            
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Left Column - Pricing Info */}
              <div className="p-8 md:p-10">
                <div className="text-center md:text-left mb-8">
                  <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-medium mb-6 border border-cyan-200">
                    <Icons.DollarSign className="w-4 h-4" />
                    <span>Per Lead Pricing Model</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">1%</span>
                  </div>
                  <p className="text-xl text-gray-600">per qualified lead</p>
                  <p className="text-gray-500 mt-2">Pay only 1% of course value per qualified application</p>
                </div>

                {/* Benefits - Reduced to 6 */}
                <ul className="space-y-4 mb-8">
                  {[
                    { text: 'No success fees — keep 100% of revenue', bold: true },
                    { text: 'No monthly fees — pay only for results', bold: true },
                    { text: 'No minimum term — monthly cancellable', bold: true },
                    { text: 'Free course listings', bold: false },
                    { text: 'Dashboard & real-time analytics', bold: false },
                    { text: 'Free onboarding & support', bold: false },
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icons.Check className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-gray-700 ${benefit.bold ? 'font-semibold' : 'font-medium'}`}>{benefit.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href="#booking"
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all relative overflow-hidden group block text-center text-lg"
                >
                  <span className="relative z-10">Become a Partner Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>

              {/* Right Column - Examples & Launch Offer */}
              <div className="p-8 md:p-10 bg-gray-50/50">
                {/* Cheaper Badge */}
                <div className="flex justify-center md:justify-start mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-emerald-200">
                    <Icons.TrendingDown className="w-4 h-4" />
                    43% cheaper than competitors
                  </span>
                </div>

                {/* Examples Table */}
                <div className="mb-8">
                  <p className="font-semibold text-gray-900 mb-4 text-lg">Examples</p>
                  <div className="space-y-3">
                    {[
                      { course: '€5,000 course', fee: '€50 per lead' },
                      { course: '€8,000 course', fee: '€80 per lead' },
                      { course: '€10,000 course', fee: '€100 per lead' },
                      { course: '€15,000 course', fee: '€150 per lead' },
                    ].map((example, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-gray-600">{example.course}</span>
                        <span className="font-semibold text-gray-900">→ {example.fee}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Offer Box */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.Gift className="w-5 h-5 text-cyan-600" />
                    <span className="text-lg font-bold text-gray-900">LAUNCH OFFER</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-cyan-600">5 free leads</span> for new partners
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Test us risk-free – no obligation</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            All prices excl. VAT • No setup fees • No minimum term
          </p>
        </div>
      </section>

      {/* Section: Competitive Comparison - Right after Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Kursfind AI vs. Your Alternatives
            </h2>
            <p className="text-lg text-gray-600">
              See the difference — transparent and honest
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">Provider</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Cost per Lead</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Success Fee</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Cost per Enrollment*</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-emerald-50">
                  <td className="p-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 text-lg">✓</span>
                      Kursfind AI
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold text-emerald-600">€80 <span className="font-normal text-gray-500">(1% of €8k)</span></td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <span className="text-emerald-500">✓</span> €0
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <span className="text-emerald-500">✓</span> €800
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-red-50/30">
                  <td className="p-4 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">✗</span>
                      Competitors
                    </div>
                  </td>
                  <td className="p-4 text-center text-gray-600">€80 <span className="text-gray-400">(1%)</span></td>
                  <td className="p-4 text-center text-red-600 font-medium">€1,200 <span className="text-red-400">(15%)</span></td>
                  <td className="p-4 text-center text-red-600 font-semibold">€2,000</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">○</span>
                      Google Ads (Career keywords)
                    </div>
                  </td>
                  <td className="p-4 text-center text-gray-600">€120</td>
                  <td className="p-4 text-center text-gray-600">€0</td>
                  <td className="p-4 text-center text-gray-700 font-medium">€1,200</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            *Based on average course value €8,000 and 10% conversion rate (10 leads = 1 enrollment)
          </p>

          {/* Comparison Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-semibold border border-emerald-200">
              <span className="text-emerald-500">✓</span> 43% cheaper than competitors
            </span>
            <span className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full font-semibold border border-cyan-200">
              <span className="text-cyan-500">✓</span> 33% cheaper than Google Ads
            </span>
            <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold border border-gray-200">
              <span className="text-gray-500">✓</span> No hidden costs
            </span>
          </div>
        </div>
      </section>

      {/* Section 8: Mini-FAQ */}
      <section id="faq" className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions from Providers
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: 'What is a "qualified lead"?',
                a: 'A lead with genuine interest in your course, correct contact details, and eligible for Bildungsgutschein or AVGS (or self-payer). Unqualified inquiries are not charged.',
              },
              {
                q: 'How does the 1% pricing work?',
                a: 'You pay 1% of your course value per qualified lead. Example: €8,000 course = €80 per lead. No success fees, no subscriptions, no hidden costs.',
              },
              {
                q: 'What if a lead doesn\'t fit me?',
                a: 'You can reject leads. Rejected leads are not charged as long as the rejection is justified (e.g., wrong location, wrong course topic).',
              },
              {
                q: 'How quickly will I see results?',
                a: 'First leads typically within 1-2 weeks after activation, depending on course offering and demand in your region.',
              },
              {
                q: 'Is there a minimum purchase?',
                a: 'No. You only pay for leads you actually receive. No minimum purchase, no monthly fixed costs, no minimum contract term.',
              },
              {
                q: 'What makes Kursfind AI different from KURSNET?',
                a: 'KURSNET is a directory where learners have to search themselves. Kursfind AI is an active matching system: Our AI brings matching learners directly to your courses.',
              },
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'white' }}>
            Ready to Fill Your Courses?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'white' }}>
            Start for free and receive qualified leads eligible for education vouchers. No upfront costs, no risk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/provider/signup"
              className="bg-white text-emerald-600 px-10 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 hover:shadow-2xl transition-all group"
              style={{ height: '56px' }}
            >
              <span>Become a Partner</span>
              <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#booking"
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 hover:bg-white/10 transition-all"
              style={{ height: '56px' }}
            >
              <span>Book a Demo</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-white">
            <span className="flex items-center gap-2">
              <Icons.Check className="w-5 h-5" />
              Free course listing
            </span>
            <span className="flex items-center gap-2">
              <Icons.Check className="w-5 h-5" />
              5 free leads
            </span>
            <span className="flex items-center gap-2">
              <Icons.Check className="w-5 h-5" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section with Cal.com Booking */}
      <section id="booking" className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Become a Kursfind AI Partner</h2>
          <p className="text-xl mb-12 text-gray-700">
            Connect with motivated learners eligible for Bildungsgutschein or AVGS funding. Join our network of verified education providers today.
          </p>

          {/* Cal.com Booking Section */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Free Consultation Call</h3>
              <p className="text-sm text-gray-700 text-center mb-4">Book a 15-minute consultation call</p>
              <div className="w-full min-h-[600px]">
                <CalendarEmbed />
              </div>
            </div>

            {/* Contact Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Icons.Phone className="w-6 h-6 text-cyan-600" />
                  Contact Information
                </h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                    <Icons.Mail className="w-5 h-5 text-cyan-600 mt-1" />
                    <div>
                      <p className="font-semibold mb-1 text-gray-900 text-sm">Email</p>
                      <a href="mailto:partner@kursfind.de" className="text-cyan-600 hover:text-cyan-700 transition text-sm break-all">partner@kursfind.de</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                    <Icons.Phone className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="font-semibold mb-1 text-gray-900 text-sm">Phone</p>
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

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Icons.Sparkles className="w-6 h-6 text-cyan-600" />
                  What to Expect
                </h3>
                <ul className="space-y-3 text-left text-gray-700">
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-cyan-50">
                    <Icons.CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-cyan-600" />
                    <span className="text-sm">Free course listing</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
                    <Icons.CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                    <span className="text-sm">AI-powered course matching</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-cyan-50">
                    <Icons.CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-cyan-600" />
                    <span className="text-sm">Only 1% of course value per lead</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
                    <Icons.CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                    <span className="text-sm">Easy onboarding</span>
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
              <span>Register for Free</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayoutEN>
  );
}
