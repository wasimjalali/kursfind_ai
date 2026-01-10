import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von Kursfind AI - Informationen zum Umgang mit Ihren personenbezogenen Daten.',
  alternates: {
    canonical: 'https://kursfind.de/datenschutz',
    languages: {
      'de-DE': 'https://kursfind.de/datenschutz',
      'en-US': 'https://kursfind.de/en/privacy',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DatenschutzLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
