import Link from 'next/link';
import MarketingLayout from '@/components/marketing/MarketingLayout';

export const metadata = {
  title: 'Datenschutzerklärung – Kursfind AI',
  description: 'Datenschutzerklärung (DSGVO) für Kursfind AI. Erfahren Sie, wie wir Ihre Daten schützen und verarbeiten.',
};

export default function DatenschutzPage() {
  return (
    <MarketingLayout>
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Datenschutzerklärung
          </h1>
          <p className="text-gray-600">DSGVO-konforme Datenschutzrichtlinie</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Kursfind</strong> wird betrieben von <strong>Wasim Jalali</strong>, Buchenlochstr. 60, 67663 Kaiserslautern, Deutschland
            <br />
            Inhaber: Wasim Jalali
            <br />
            E-Mail: <a href="mailto:kontakt@kursfind.de" className="text-cyan-600 hover:text-cyan-700">kontakt@kursfind.de</a>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Informationen zur Datenverarbeitung</h2>
          <ul className="space-y-4 text-gray-700">
            <li>
              <strong>Website-Besuch:</strong> Server-Logs (IP-Adresse, Datum/Uhrzeit, URL, Referrer, User Agent) zur Sicherstellung der Sicherheit und Performance gemäß Art. 6 Abs. 1 lit. f DSGVO.
            </li>
            <li>
              <strong>Kontaktanfragen:</strong> Name, E-Mail, Nachricht – zur Beantwortung auf Grundlage von Art. 6 Abs. 1 lit. b oder f DSGVO.
            </li>
            <li>
              <strong>Newsletter-Abonnement:</strong> E-Mail – auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
            </li>
            <li>
              <strong>Zahlungen/Anmeldungen:</strong> Rechnungs-/Kontaktdaten – zur Vertragserfüllung gemäß Art. 6 Abs. 1 lit. b DSGVO.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Cookies und Einwilligung</h2>
          <p className="text-gray-700 leading-relaxed">
            Wir verwenden Cookies für wesentliche Funktionen und, falls aktiviert, für Analyse-/Marketingzwecke. Sie können Ihre Einwilligung jederzeit über das Cookie-Banner verwalten.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Analyse und Tools</h2>
          <p className="text-gray-700 leading-relaxed">
            Falls Analyse- oder Drittanbieter-Tools aktiviert sind, können Daten von diesen Anbietern gemäß unseren Anweisungen verarbeitet werden (Auftragsverarbeitungsverträge).
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Datenempfänger und Auftragsverarbeiter</h2>
          <p className="text-gray-700 leading-relaxed">
            Wir können Daten mit Hosting-, Analyse- und Newsletter-Dienstleistern als Auftragsverarbeiter gemäß Art. 28 DSGVO teilen.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Internationale Datenübermittlungen</h2>
          <p className="text-gray-700 leading-relaxed">
            Wenn Anbieter außerhalb der EU/EWR ansässig sind, stützen wir uns auf Angemessenheitsbeschlüsse oder Standardvertragsklauseln gemäß Art. 46 DSGVO.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Datenspeicherung</h2>
          <p className="text-gray-700 leading-relaxed">
            Wir speichern Daten nur so lange, wie es für die genannten Zwecke erforderlich ist oder gesetzlich vorgeschrieben wird.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Ihre Rechte</h2>
          <p className="text-gray-700 leading-relaxed">
            Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit und Widerruf der Einwilligung. Beschwerden können bei einer Aufsichtsbehörde eingereicht werden.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Kontakt für Datenschutzanfragen</h2>
          <p className="text-gray-700 leading-relaxed">
            E-Mail: <a href="mailto:kontakt@kursfind.de" className="text-cyan-600 hover:text-cyan-700">kontakt@kursfind.de</a>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Aufsichtsbehörde</h2>
          <p className="text-gray-700 leading-relaxed">
            Berliner Beauftragte für Datenschutz und Informationsfreiheit
            <br />
            Alt-Moabit 59-61, 10555 Berlin, Deutschland
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/de" className="text-cyan-600 hover:text-cyan-700 font-medium">
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
