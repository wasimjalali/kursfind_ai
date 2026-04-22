import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kursfind AI - Finde deine Weiterbildung in Minuten',
  description: 'KI-gestützte Suche für AZAV-zertifizierte Weiterbildungen in Deutschland. Finde Kurse mit Bildungsgutschein, AVGS oder Selbstzahlung. Kostenlos und in Minuten.',
  alternates: {
    canonical: 'https://kursfind.de/de',
    languages: {
      'de-DE': 'https://kursfind.de/de',
      'en-US': 'https://kursfind.de/en',
    },
  },
  openGraph: {
    locale: 'de_DE',
    title: 'Kursfind AI - Finde deine Weiterbildung in Minuten',
    description: 'KI-gestützte Suche für AZAV-zertifizierte Weiterbildungen. Finde deinen perfekten Kurs mit Bildungsgutschein.',
    url: 'https://kursfind.de/de',
  },
};

export default function GermanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
