import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alle Weiterbildungen & Kurse',
  description: 'Durchsuche alle AZAV-zertifizierten Weiterbildungen und Kurse in Deutschland. Filter nach Bereich, Dauer, Standort und Förderung.',
  alternates: {
    canonical: 'https://kursfind.de/kurse',
  },
}

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
