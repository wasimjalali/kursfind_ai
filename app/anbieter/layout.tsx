import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Für Bildungsanbieter - Qualifizierte Teilnehmer gewinnen',
  description: 'Gewinnen Sie qualifizierte Kursteilnehmer ohne Werbekosten. Zahlen Sie nur 1% pro Lead. Keine Erfolgsprovision. 43% günstiger als Wettbewerber.',
  alternates: {
    canonical: 'https://kursfind.de/anbieter',
    languages: {
      'de-DE': 'https://kursfind.de/anbieter',
      'en-US': 'https://kursfind.de/en/providers',
    },
  },
  openGraph: {
    title: 'Für Bildungsanbieter | Kursfind AI',
    description: 'Qualifizierte Teilnehmer ohne Werbekosten. 1% pro Lead, keine Erfolgsprovision.',
    url: 'https://kursfind.de/anbieter',
  },
}

export default function AnbieterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
