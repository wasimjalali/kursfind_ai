import Image from 'next/image';
import Link from 'next/link';
import MarketingLayout from '@/components/marketing/MarketingLayout';

// Icons
const Icons = {
  Sparkles: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  ShieldCheck: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
  ArrowRight: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
};

export const metadata = {
  title: 'Über uns – Kursfind AI',
  description: 'Erfahre mehr über Kursfind AI und unser Team. Wir revolutionieren, wie Menschen ihre berufliche Weiterbildung finden.',
};

export default function UeberUnsPage() {
  const teamMembers = [
    {
      name: 'Wasim Jalali',
      role: 'Co-Founder & CEO',
      image: '/landing/team/Wasim.png',
      description: 'Visionär mit Leidenschaft für Bildungstechnologie und KI-Innovation. Führt das Team mit klarer Strategie und Fokus auf Impact.',
      color: 'cyan',
    },
    {
      name: 'Ahmad Samim Sherzad',
      role: 'Co-Founder & Finance Department',
      image: '/landing/team/Samim.JPG',
      description: 'Finanzexperte mit strategischem Weitblick. Sorgt für nachhaltige Geschäftsmodelle und solide Partnerschaften.',
      color: 'emerald',
    },
    {
      name: 'Zaiem Jalali',
      role: 'Co-Founder & IT Department',
      image: '/landing/team/Zaiem.JPG',
      description: 'Tech-Architekt und Entwickler. Baut die technische Infrastruktur, die unsere KI-Plattform zum Leben erweckt.',
      color: 'cyan',
    },
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Über Kursfind AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Wir revolutionieren, wie Menschen ihre berufliche Weiterbildung finden
            </p>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Unsere Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Kursfind AI ist eine KI-gestützte Plattform, die Lernende mit AZAV-zertifizierten Weiterbildungsangeboten
                verbindet. Wir machen berufliche Weiterbildung in Deutschland zugänglich, transparent und einfach.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Durch staatlich geförderte Programme wie den Bildungsgutschein und AVGS können tausende Menschen ihre
                Karriere vorantreiben – aber das Finden der richtigen Kurse war immer kompliziert. Unser intelligenter
                Matching-Algorithmus ändert das: In Minuten statt Wochen zum perfekten Kurs.
              </p>

              <h3 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-gray-900">
                Was macht uns besonders?
              </h3>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Icons.Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">KI-Powered Matching</h4>
                  <p className="text-gray-600">
                    Unsere KI analysiert deine Ziele, Erfahrung und Fördermöglichkeiten, um die perfekten Kurse zu finden.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Icons.ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">100% AZAV-Zertifiziert</h4>
                  <p className="text-gray-600">
                    Alle Kurse sind staatlich anerkannt und durch Bildungsgutschein oder AVGS förderbar.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Icons.Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">Für Lernende & Anbieter</h4>
                  <p className="text-gray-600">
                    Wir bringen beide Seiten zusammen – faire Konditionen für Anbieter, kostenlose Kurse für Lernende.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Icons.Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">Blitzschnell & Einfach</h4>
                  <p className="text-gray-600">
                    Von der Suche bis zur Anmeldung in Minuten – ohne komplizierte Formulare oder endlose Recherche.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  Unser Team
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Die Menschen hinter Kursfind AI
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 hover:border-${member.color}-300`}
                >
                  <div className={`aspect-[3/4] bg-gradient-to-br from-${member.color}-100 to-${member.color === 'cyan' ? 'emerald' : 'cyan'}-100 relative overflow-hidden`}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className={`text-${member.color}-600 font-semibold mb-3`}>{member.role}</p>
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Bereit, deinen perfekten Kurs zu finden?</h2>
          <p className="text-xl mb-8 opacity-90">
            Starte jetzt deine KI-gestützte Kurssuche – 100% kostenlos für Lernende.
          </p>
          <Link
            href="/suchen"
            className="inline-flex items-center space-x-2 bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all"
          >
            <span>Kurse kostenlos finden</span>
            <Icons.ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
