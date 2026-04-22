import Link from 'next/link';
import MarketingLayoutEN from '@/components/marketing/MarketingLayoutEN';

export const metadata = {
  title: 'Imprint – Kursfind AI',
  description: 'Imprint and legal information for Kursfind AI. Information according to § 5 TMG.',
};

export default function ImprintPageEN() {
  return (
    <MarketingLayoutEN germanHref="/impressum">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Imprint
          </h1>
          <p className="text-gray-600">Information according to § 5 TMG</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                <strong>Kursfind</strong> is operated by <strong>Wasim Jalali</strong>
                <br />
                Buchenlochstr. 60, 67663 Kaiserslautern, Germany
              </p>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Owner</h3>
                <p className="text-gray-700">Wasim Jalali</p>
                <p className="text-sm text-gray-600 mt-2">Sole Proprietor</p>
              </div>

              <div className="mt-8 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-xl p-6 border border-cyan-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:kontakt@kursfind.de" className="text-cyan-600 hover:text-cyan-700">
                      kontakt@kursfind.de
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong>{' '}
                    <a href="tel:+4915223334725" className="text-cyan-600 hover:text-cyan-700">
                      +49 1522 333 4725
                    </a>
                  </p>
                  <p>
                    <strong>WhatsApp:</strong>{' '}
                    <a href="https://wa.me/4951217590037" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700">
                      +49 5121 7590037
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{' '}
                    <a href="https://www.kursfind.de" className="text-cyan-600 hover:text-cyan-700">
                      www.kursfind.de
                    </a>
                  </p>
                </div>
              </div>


              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Responsible for Content according to § 55 Abs. 2 RStV</h3>
                <p className="text-gray-700">
                  Wasim Jalali
                  <br />
                  Buchenlochstr. 60, 67663 Kaiserslautern
                </p>
              </div>

              <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Dispute Resolution</h3>
                <p className="text-gray-700 leading-relaxed">
                  We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                </p>
                <p className="text-gray-700 mt-3">
                  EU Online Dispute Resolution Platform:{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-700 break-all"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link href="/en" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayoutEN>
  );
}
