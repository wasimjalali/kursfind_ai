import Link from 'next/link';
import Image from 'next/image';
import MarketingLayout from '@/components/marketing/MarketingLayout';

export const metadata = {
  title: 'Kursfind Agent – KI-Studienberater für Ihre Webseite',
  description: 'Der AI Course Advisor für Bildungsanbieter. Automatische Beratung, Förderfähigkeitsprüfung und qualifizierte Leads – 24/7 im Chat.',
};

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
};

export default function AgentPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 overflow-hidden">
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
                  Für Bildungsanbieter
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Der KI-Studienberater für{' '}
                <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  Ihre Webseite
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Beantwortet Fragen zu Ihren Kursen automatisch, prüft Förderfähigkeit (BGS/AVGS) und liefert qualifizierte Leads – 24/7 im Chat.
              </p>

              <p className="text-base md:text-lg text-gray-600 italic">
                <strong>English:</strong> The AI Course Advisor for Your Website. Instantly answers questions about your specific courses, checks funding eligibility, and delivers qualified leads – 24/7 via chat.
              </p>

              <div className="pt-4">
                <a
                  href="mailto:wasim@kursfind.de?subject=Interesse%20an%20Kursfind%20Agent%20Pilot&body=Hallo,%0D%0A%0D%0AIch%20interessiere%20mich%20für%20den%20Kursfind%20Agent%20als%20Pilot-Partner.%0D%0A%0D%0AUnternehmen:%20%0D%0AWebsite:%20%0D%0AAnsprechpartner:%20%0D%0A%0D%0AViele%20Grüße"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Icons.Mail className="w-5 h-5" />
                  Pilot-Partner werden
                </a>
                <p className="text-sm text-gray-600 mt-3">
                  → <strong>wasim@kursfind.de</strong> | Kostenlos für erste Partner
                </p>
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
                      <p className="text-xs opacity-90">Online • Antwortet sofort</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 bg-gray-50 min-h-[300px] md:min-h-[400px]">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                      <p className="text-sm">Haben Sie einen Python Kurs mit Bildungsgutschein?</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                      <p className="text-sm text-gray-900 mb-2">
                        <strong>Ja! 👨‍💻</strong> Wir haben einen AZAV-zertifizierten Python Fullstack Bootcamp.
                      </p>
                      <ul className="text-xs text-gray-700 space-y-1 ml-4 list-disc">
                        <li>Dauer: 6 Monate</li>
                        <li>100% Bildungsgutschein-fähig</li>
                        <li>Start: Jeden Monat</li>
                      </ul>
                      <p className="text-xs text-gray-600 mt-2">
                        Haben Sie bereits einen Bildungsgutschein vom Arbeitsamt?
                      </p>
                    </div>
                  </div>

                  {/* User Response */}
                  <div className="flex justify-end">
                    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                      <p className="text-sm">Ja, habe ich!</p>
                    </div>
                  </div>

                  {/* AI Qualification */}
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                      <p className="text-sm text-gray-900 font-semibold mb-1">✅ Perfekt qualifiziert!</p>
                      <p className="text-xs text-gray-700">
                        Ich leite Ihre Anfrage an unser Team weiter. Sie erhalten binnen 24h alle Details per E-Mail.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <input
                      type="text"
                      placeholder="Nachricht schreiben..."
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
              Mehr als nur ein{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Chatbot
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              More than just a chatbot
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                <Icons.Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Kennt Ihre Kurse
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Die KI lernt Ihre Kursinhalte und beantwortet spezifische Fragen zu Inhalten, Dauer und Voraussetzungen präzise.
              </p>
              <p className="text-sm text-gray-600 italic mt-3">
                Knows your courses: AI learns your course content and answers specific questions about content, duration, and requirements precisely.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                <Icons.CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Prüft Förderfähigkeit
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Klärt spielerisch im Chat, ob ein Bildungsgutschein oder AVGS vorliegt und ob der Interessent die Kriterien erfüllt.
              </p>
              <p className="text-sm text-gray-600 italic mt-3">
                Checks Eligibility: Playfully clarifies in chat whether a voucher (BGS/AVGS) exists and if the prospect meets the criteria.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                <Icons.Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Qualifizierte Übergabe
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Sie erhalten fertige Datensätze von interessierten, förderfähigen Teilnehmern direkt in Ihr Email-Postfach.
              </p>
              <p className="text-sm text-gray-600 italic mt-3">
                Qualified Handoff: Receive complete datasets of interested, eligible participants directly in your inbox.
              </p>
            </div>
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
                <span className="text-sm font-medium text-gray-700">Ein Produkt von Kursfind</span>
              </div>
              <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Icons.Award className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Serverstandort Deutschland</span>
              </div>
              <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Icons.CheckCircle className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-medium text-gray-700">DSGVO-Konform</span>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Bereit für mehr qualifizierte Leads?</p>
              <a
                href="mailto:wasim@kursfind.de?subject=Kursfind%20Agent%20Demo%20anfragen"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Icons.Mail className="w-5 h-5" />
                Jetzt Pilot-Partner werden
              </a>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
