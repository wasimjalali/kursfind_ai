import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns',
  description: 'Erfahren Sie mehr über Kursfind AI - die KI-gestützte Plattform für Weiterbildungssuche in Deutschland.',
  alternates: {
    canonical: 'https://kursfind.de/ueber-uns',
    languages: {
      'de-DE': 'https://kursfind.de/ueber-uns',
      'en-US': 'https://kursfind.de/en/about',
    },
  },
}

export default function UeberUnsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
