import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kursfind AI - Find Your Training Course in Minutes',
  description: 'AI-powered search for AZAV-certified vocational training in Germany. Find courses with Bildungsgutschein, AVGS, or self-pay. Free and instant.',
  alternates: {
    canonical: 'https://kursfind.de/en',
    languages: {
      'de-DE': 'https://kursfind.de',
      'en-US': 'https://kursfind.de/en',
    },
  },
  openGraph: {
    locale: 'en_US',
    title: 'Kursfind AI - Find Your Training Course in Minutes',
    description: 'AI-powered search for vocational training in Germany.',
    url: 'https://kursfind.de/en',
  },
}

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
