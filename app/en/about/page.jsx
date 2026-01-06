import Image from 'next/image';
import Link from 'next/link';
import MarketingLayoutEN from '@/components/marketing/MarketingLayoutEN';

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
  title: 'About Us – Kursfind AI',
  description: 'Learn more about Kursfind AI and our team. We are revolutionizing how people find their professional development courses.',
};

export default function AboutPageEN() {
  const teamMembers = [
    {
      name: 'Wasim Jalali',
      role: 'Co-Founder & CEO',
      image: '/landing/team/Wasim.png',
      description: 'Visionary with a passion for education technology and AI innovation. Leads the team with clear strategy and focus on impact.',
      color: 'cyan',
    },
    {
      name: 'Ahmad Samim Sherzad',
      role: 'Co-Founder & Finance Department',
      image: '/landing/team/Samim.JPG',
      description: 'Finance expert with strategic foresight. Ensures sustainable business models and solid partnerships.',
      color: 'emerald',
    },
    {
      name: 'Zaiem Jalali',
      role: 'Co-Founder & IT Department',
      image: '/landing/team/Zaiem.JPG',
      description: 'Tech architect and developer. Builds the technical infrastructure that brings our AI platform to life.',
      color: 'cyan',
    },
  ];

  return (
    <MarketingLayoutEN>
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
                About Kursfind AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              We are revolutionizing how people find their professional development courses
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
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Kursfind AI is an AI-powered platform that connects learners with AZAV-certified training programs.
                We make professional development in Germany accessible, transparent, and simple.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Through government-funded programs like Bildungsgutschein and AVGS, thousands of people can advance
                their careers – but finding the right courses has always been complicated. Our intelligent
                matching algorithm changes that: Find the perfect course in minutes instead of weeks.
              </p>

              <h3 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-gray-900">
                What Makes Us Special?
              </h3>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Icons.Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">AI-Powered Matching</h4>
                  <p className="text-gray-600">
                    Our AI analyzes your goals, experience, and funding options to find the perfect courses.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Icons.ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">100% AZAV-Certified</h4>
                  <p className="text-gray-600">
                    All courses are government-approved and eligible for Bildungsgutschein or AVGS funding.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Icons.Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">For Learners & Providers</h4>
                  <p className="text-gray-600">
                    We bring both sides together – fair conditions for providers, free courses for learners.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <Icons.Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast & Simple</h4>
                  <p className="text-gray-600">
                    From search to enrollment in minutes – without complicated forms or endless research.
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
                  Our Team
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                The people behind Kursfind AI
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to find your perfect course?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your AI-powered course search now – 100% free for learners.
          </p>
          <Link
            href="/suchen"
            className="inline-flex items-center space-x-2 bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all"
          >
            <span>Start AI Search Free</span>
            <Icons.ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MarketingLayoutEN>
  );
}
