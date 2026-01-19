'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MarketingLayoutEN from '@/components/marketing/MarketingLayoutEN';
import Cal, { getCalApi } from '@calcom/embed-react';

const Icons = {
  Mail: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Brain: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  CheckCircle: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Award: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Shield: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Phone: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  MessageCircle: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Sparkles: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  ArrowRight: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  X: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// Contact Form Modal Component
function ContactFormModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Get in Touch</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <Icons.X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Form Content */}
        <div className="p-6">
          <style dangerouslySetInnerHTML={{__html: `
            .sp-force-hide { display: none;}
            .sp-form[sp-id="250261"] { 
              display: block; 
              background: #ffffff; 
              padding: 0; 
              width: 100%; 
              max-width: 100%; 
              border-radius: 0; 
              border: none;
              font-family: 'Inter', Arial, sans-serif;
              box-shadow: none;
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
              color: #111827;
            }
            .sp-form[sp-id="250261"] .sp-form-control::placeholder {
              color: #9ca3af;
              opacity: 1;
            }
            .sp-form[sp-id="250261"] .sp-form-control:focus { 
              outline: none;
              border-color: #06b6d4;
              background: #ffffff;
              box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
            }
            .sp-form[sp-id="250261"] .sp-field { 
              margin-bottom: 16px;
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
            <div id="sp-form-250261" sp-id="250261" sp-hash="049bdecf7b05af2e7af45d9a6d440eb9ec5713e6b51fb5138e6f02acedef72c9" sp-lang="en" className="sp-form sp-form-regular sp-form-embed" sp-show-options="%7B%22satellite%22%3Afalse%2C%22maDomain%22%3A%22login.sendpulse.com%22%2C%22formsDomain%22%3A%22forms.sendpulse.com%22%2C%22condition%22%3A%22onEnter%22%2C%22scrollTo%22%3A25%2C%22delay%22%3A10%2C%22repeat%22%3A3%2C%22background%22%3A%22rgba(0%2C%200%2C%200%2C%200.5)%22%2C%22position%22%3A%22bottom-right%22%2C%22animation%22%3A%22%22%2C%22hideOnMobile%22%3Afalse%2C%22submitRedirectUrl%22%3A%22%22%2C%22urlFilter%22%3Afalse%2C%22urlFilterConditions%22%3A%5B%7B%22force%22%3A%22hide%22%2C%22clause%22%3A%22contains%22%2C%22token%22%3A%22%22%7D%5D%2C%22analytics%22%3A%7B%22ga%22%3A%7B%22eventLabel%22%3A%22Subscription_form_Kursfind_Agent_Pilot%22%2C%22send%22%3Atrue%7D%7D%2C%22utmEnable%22%3Atrue%7D">
              <div className="sp-form-fields-wrapper">
                <div className="sp-message"><div></div></div>
                <form noValidate className="sp-element-container">
                  <div className="sp-field" sp-id="sp-1a9f9009-e677-4ab4-8ce2-ac75cb0decfd">
                    <label className="sp-control-label"><span>Email</span><strong>*</strong></label>
                    <input type="email" sp-type="email" name="sform[email]" className="sp-form-control" placeholder="your@email.com" sp-tips="%7B%22required%22%3A%22Required%20field%22%2C%22wrong%22%3A%22Invalid%20email%22%7D" autoComplete="on" required />
                  </div>
                  <div className="sp-field" sp-id="sp-69b8268e-c891-4aa8-bd5e-2d9b1922d917">
                    <label className="sp-control-label"><span>Company/Education Provider</span><strong>*</strong></label>
                    <input type="text" sp-type="input" name="sform[Q29tcGFueQ==]" className="sp-form-control" placeholder="Your Company" sp-tips="%7B%22required%22%3A%22Required%20field%22%7D" autoComplete="on" required />
                  </div>
                  <div className="sp-field" sp-id="sp-65002bd9-e5d8-43b7-81f4-30c4fede3bcf">
                    <label className="sp-control-label"><span>Contact Person</span><strong>*</strong></label>
                    <input type="text" sp-type="input" name="sform[TmFtZQ==]" className="sp-form-control" placeholder="Your Name" sp-tips="%7B%22required%22%3A%22Required%20field%22%7D" autoComplete="on" required />
                  </div>
                  <div className="sp-field" sp-id="sp-4ef7b084-54bd-4364-8691-df3986c74687">
                    <label className="sp-control-label"><span>Phone Number</span></label>
                    <input type="tel" sp-type="phone" name="sform[phone]" className="sp-form-control" placeholder="1234567890" sp-tips="%7B%22wrong%22%3A%22Invalid%20phone%20number%22%7D" autoComplete="on" />
                  </div>
                  <div className="sp-field" sp-id="sp-ea34a063-01b3-4448-840f-9255b909e88a">
                    <div className="sp-checkbox-option">
                      <label>
                        <input type="checkbox" sp-type="checkbox" name="sform[Z2RwckNvbmZpcm0=]" value="yes" sp-tips="%7B%22required%22%3A%22Required%20field%22%7D" required />
                        <span>I agree to receive information from Kursfind AI <strong>*</strong></span>
                      </label>
                    </div>
                  </div>
                  <div className="sp-field" sp-id="sp-801145bc-7b16-4e6f-85ae-165960c67bc5">
                    <div className="sp-checkbox-option">
                      <label>
                        <input type="checkbox" sp-type="checkbox" name="sform[Z2RwclRlcm1z]" value="yes" sp-tips="%7B%22required%22%3A%22Required%20field%22%7D" required />
                        <span>Consent to data collection and storage (GDPR) <strong>*</strong></span>
                      </label>
                    </div>
                  </div>
                  <div className="sp-field sp-button-container" sp-id="sp-db82d3ee-8cf8-4b64-a887-baac2635d735">
                    <button id="sp-db82d3ee-8cf8-4b64-a887-baac2635d735" className="sp-button">Become a Pilot Partner</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <script type="text/javascript" async src="//web.webformscr.com/apps/fc3/build/default-handler.js?1758181175060"></script>
        </div>
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

export default function AgentPageEN() {
  const [showForm, setShowForm] = useState(false);

  return (
    <MarketingLayoutEN>
      {/* Contact Form Modal */}
      <ContactFormModal isOpen={showForm} onClose={() => setShowForm(false)} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold rounded-full shadow-lg">
                  For Education Providers
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                The AI Course Advisor for{' '}
                <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  Your Website
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Instantly answers questions about your specific courses, checks funding eligibility (BGS/AVGS), and delivers qualified leads – 24/7 via chat.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  href="#booking"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <Icons.Sparkles className="w-5 h-5" />
                  Book Free Consultation
                </Link>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-all cursor-pointer"
                >
                  <Icons.Mail className="w-4 h-4" />
                  Get in Touch
                </button>
              </div>
            </div>

            {/* Right: Visual (Chat Widget Mockup) */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Chat Widget Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Icons.Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Kursfind Agent</h3>
                      <p className="text-xs opacity-90">Online • Responds instantly</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 bg-gray-50 min-h-[300px] md:min-h-[400px]">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                      <p className="text-sm">Do you have a Python course with education voucher?</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                      <p className="text-sm text-gray-900 mb-2">
                        <strong>Yes!</strong> We have an AZAV-certified Python Fullstack Bootcamp.
                      </p>
                      <ul className="text-xs text-gray-700 space-y-1 ml-4 list-disc">
                        <li>Duration: 6 months</li>
                        <li>100% education voucher eligible</li>
                        <li>Start: Every month</li>
                      </ul>
                      <p className="text-xs text-gray-600 mt-2">
                        Do you already have an education voucher from the employment agency?
                      </p>
                    </div>
                  </div>

                  {/* User Response */}
                  <div className="flex justify-end">
                    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                      <p className="text-sm">Yes, I do!</p>
                    </div>
                  </div>

                  {/* AI Qualification */}
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                      <p className="text-sm text-gray-900 font-semibold mb-1">Perfectly qualified!</p>
                      <p className="text-xs text-gray-700">
                        I'll forward your inquiry to our team. You'll receive all details via email within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm outline-none text-gray-400"
                      disabled
                    />
                    <button className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-2">
                <p className="text-xs font-semibold text-gray-900">Powered by Kursfind</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              More Than Just a{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Chatbot
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your personal AI assistant that knows your courses and generates qualified leads.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                <Icons.Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Knows Your Courses
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The AI learns your course content and answers specific questions about content, duration, and requirements precisely.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                <Icons.CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Checks Eligibility
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Playfully clarifies in chat whether a voucher (BGS/AVGS) exists and if the prospect meets the criteria.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                <Icons.Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Qualified Handoff
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Receive complete datasets of interested, eligible participants directly in your inbox.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <span>Book Free Consultation</span>
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-6 text-center">
              <div className="flex items-center gap-2">
                <Icons.Shield className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-medium text-gray-700">A Kursfind Product</span>
              </div>
              <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Icons.Award className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Servers in Germany</span>
              </div>
              <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Icons.CheckCircle className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-medium text-gray-700">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Cal.com Booking */}
      <section id="booking" className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Kursfind Agent for Your Website</h2>
          <p className="text-xl mb-12 text-gray-700">
            Become a pilot partner and get the AI course advisor for your website for free. Limited spots available.
          </p>

          {/* Cal.com Booking Section */}
          <div className="max-w-7xl mx-auto px-4">
            {/* Cal.com Calendar - Full Width */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Free Consultation Call</h3>
              <p className="text-sm text-gray-700 text-center mb-4">Book a 15-minute consultation call</p>
              <div className="w-full min-h-[600px]">
                <CalendarEmbed />
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="max-w-2xl mx-auto">
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
                      <a href="mailto:wasim@kursfind.com" className="text-cyan-600 hover:text-cyan-700 transition text-sm break-all">wasim@kursfind.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                    <Icons.Phone className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="font-semibold mb-1 text-gray-900 text-sm">Phone</p>
                      <a href="tel:+4915223334725" className="text-emerald-600 hover:text-emerald-700 transition text-sm">+49 1522 333 4725</a>
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
            </div>
          </div>

          {/* Alternative CTA */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Or leave your contact details and we'll get back to you:</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
            >
              <Icons.Mail className="w-5 h-5" />
              Get in Touch
            </button>
          </div>
        </div>
      </section>
    </MarketingLayoutEN>
  );
}
