import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kursfind AI – Finde deinen perfekten AZAV-Kurs mit KI",
  description: "KI-gestützte Kurssuche für geförderte Weiterbildung in Deutschland. Finde AZAV-zertifizierte Kurse mit Bildungsgutschein oder AVGS. 100% kostenlos für Lernende.",
  openGraph: {
    title: "Kursfind AI – Finde deinen perfekten AZAV-Kurs",
    description: "Intelligente KI findet den perfekten AZAV-zertifizierten Kurs mit Bildungsgutschein oder AVGS.",
    type: "website",
    images: ["/landing/kursfind-ai-logo.jpg"],
  },
  icons: {
    icon: "/landing/kursfind-ai-logo.jpg",
    shortcut: "/landing/kursfind-ai-logo.jpg",
    apple: "/landing/kursfind-ai-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
