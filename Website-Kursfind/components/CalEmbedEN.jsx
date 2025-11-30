'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

/**
 * Cal.com Booking Component for Provider Consultation (English Version)
 * 
 * USAGE IN NEXT.JS:
 * import CalEmbedEN from '@/components/CalEmbedEN';
 * 
 * <CalEmbedEN />
 * 
 * CONFIGURATION:
 * - Update calLink with your Cal.com username/event
 * - Current: wasim.jalali/30min
 */

export default function CalEmbedEN() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '30min' });
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Partner With Kursfind AI
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Connect with motivated learners who are eligible for Bildungsgutschein or AVGS funding. 
            Join our network of verified education providers today.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: Contact Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-6">
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
            
            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold opacity-90">Email</p>
                <a href="mailto:info@wasimacademy.org" className="hover:opacity-80 transition">
                  info@wasimacademy.org
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold opacity-90">Phone</p>
                <a href="tel:+4915223334725" className="hover:opacity-80 transition">
                  +49 1522 333 4725
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold opacity-90">WhatsApp</p>
                <a href="https://wa.me/4951217590037" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
                  +49 5121 759 0037
                </a>
              </div>
            </div>

            {/* Benefits List */}
            <div className="pt-6 border-t border-white/20">
              <h4 className="font-semibold mb-3">What to Expect:</h4>
              <ul className="space-y-2 opacity-90">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Free Course Listing (6-12 Months)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>AI-Powered Course Matching</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Only €50-€120 per Qualified Lead</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Simple Onboarding Process</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Cal.com Embed */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Schedule a Meeting
            </h3>
            <p className="text-gray-700 text-center mb-6">
              Book a 30-minute consultation call
            </p>
            
            {/* Cal.com Calendar */}
            <div className="rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
              <Cal 
                namespace="30min"
                calLink="wasim.jalali/30min"
                style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                config={{ layout: 'month_view' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
