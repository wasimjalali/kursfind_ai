import Link from 'next/link';
import MarketingLayout from '@/components/marketing/MarketingLayout';

export const metadata = {
  title: 'Impressum – Kursfind AI',
  description: 'Impressum und rechtliche Informationen für Kursfind AI. Angaben gemäß § 5 TMG.',
};

export default function ImpressumPage() {
  return (
    <MarketingLayout>
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Impressum
          </h1>
          <p className="text-gray-600">Angaben gemäß § 5 TMG</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                <strong>Kursfind</strong> wird betrieben von <strong>Wasim Jalali</strong>
                <br />
                Buchenlochstr. 60, 67663 Kaiserslautern, Deutschland
              </p>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Inhaber</h3>
                <p className="text-gray-700">Wasim Jalali</p>
                <p className="text-sm text-gray-600 mt-2">Einzelunternehmer</p>
              </div>

              <div className="mt-8 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-xl p-6 border border-cyan-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Kontakt</h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>E-Mail:</strong>{' '}
                    <a href="mailto:kontakt@kursfind.de" className="text-cyan-600 hover:text-cyan-700">
                      kontakt@kursfind.de
                    </a>
                  </p>
                  <p>
                    <strong>Telefon:</strong>{' '}
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
                <h3 className="text-lg font-bold text-gray-900 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                <p className="text-gray-700">
                  Wasim Jalali
                  <br />
                  Buchenlochstr. 60, 67663 Kaiserslautern
                </p>
              </div>

              <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Streitschlichtung</h3>
                <p className="text-gray-700 leading-relaxed">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
                <p className="text-gray-700 mt-3">
                  EU-Streitschlichtungsplattform:{' '}
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
                <Link href="/de" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  ← Zurück zur Startseite
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
