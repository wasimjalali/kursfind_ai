import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KI-Kurssuche - Weiterbildung finden',
  description: 'Finde die perfekte Weiterbildung mit unserer KI. Beschreibe einfach, was du lernen möchtest, und erhalte personalisierte Kursempfehlungen.',
  alternates: {
    canonical: 'https://kursfind.de/suchen',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SuchenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
