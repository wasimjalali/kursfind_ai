import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Informationen zu Kursfind AI - Wasim Academy UG.',
  alternates: {
    canonical: 'https://kursfind.de/impressum',
    languages: {
      'de-DE': 'https://kursfind.de/impressum',
      'en-US': 'https://kursfind.de/en/imprint',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ImpressumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
