import Link from 'next/link';
import MarketingLayoutEN from '@/components/marketing/MarketingLayoutEN';

export const metadata = {
  title: 'Privacy Policy – Kursfind AI',
  description: 'Privacy Policy (GDPR) for Kursfind AI. Learn how we protect and process your data.',
};

export default function PrivacyPageEN() {
  return (
    <MarketingLayoutEN germanHref="/datenschutz">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-600">GDPR-Compliant Privacy Policy</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Kursfind</strong> is operated by <strong>Wasim Jalali</strong>, Buchenlochstr. 60, 67663 Kaiserslautern, Germany
            <br />
            Owner: Wasim Jalali
            <br />
            Email: <a href="mailto:kontakt@kursfind.de" className="text-cyan-600 hover:text-cyan-700">kontakt@kursfind.de</a>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Information on Data Processing</h2>
          <ul className="space-y-4 text-gray-700">
            <li>
              <strong>Website Visit:</strong> Server logs (IP address, date/time, URL, referrer, user agent) to ensure security and performance pursuant to Art. 6(1)(f) GDPR.
            </li>
            <li>
              <strong>Contact Requests:</strong> Name, email, message – for response based on Art. 6(1)(b) or (f) GDPR.
            </li>
            <li>
              <strong>Newsletter Subscription:</strong> Email – based on your consent pursuant to Art. 6(1)(a) GDPR.
            </li>
            <li>
              <strong>Payments/Registrations:</strong> Billing/contact data – for contract fulfillment pursuant to Art. 6(1)(b) GDPR.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Cookies and Consent</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies for essential functions and, if enabled, for analytics/marketing purposes. You can manage your consent at any time via the cookie banner.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Analytics and Tools</h2>
          <p className="text-gray-700 leading-relaxed">
            If analytics or third-party tools are enabled, data may be processed by these providers according to our instructions (data processing agreements).
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Data Recipients and Processors</h2>
          <p className="text-gray-700 leading-relaxed">
            We may share data with hosting, analytics, and newsletter service providers as processors pursuant to Art. 28 GDPR.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            If providers are located outside the EU/EEA, we rely on adequacy decisions or standard contractual clauses pursuant to Art. 46 GDPR.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We store data only as long as necessary for the stated purposes or as required by law.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have rights to access, rectification, erasure, restriction, objection, data portability, and withdrawal of consent. Complaints may be filed with a supervisory authority.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Contact for Privacy Inquiries</h2>
          <p className="text-gray-700 leading-relaxed">
            Email: <a href="mailto:kontakt@kursfind.de" className="text-cyan-600 hover:text-cyan-700">kontakt@kursfind.de</a>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Supervisory Authority</h2>
          <p className="text-gray-700 leading-relaxed">
            Berlin Commissioner for Data Protection and Freedom of Information
            <br />
            Alt-Moabit 59-61, 10555 Berlin, Germany
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/en" className="text-cyan-600 hover:text-cyan-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayoutEN>
  );
}
