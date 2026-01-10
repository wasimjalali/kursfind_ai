import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWAProvider, InstallBanner, UpdateBanner, OfflineIndicator } from "@/components/pwa";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = 'https://kursfind.de';

export const viewport: Viewport = {
  themeColor: "#06b6d4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  
  title: {
    default: 'Kursfind AI - Finde deine Weiterbildung in Minuten',
    template: '%s | Kursfind AI',
  },
  
  description: 'KI-gestützte Suche für AZAV-zertifizierte Weiterbildungen in Deutschland. Finde Kurse mit Bildungsgutschein, AVGS oder Selbstzahlung. Kostenlos und in Minuten.',
  
  keywords: [
    'Weiterbildung',
    'Bildungsgutschein',
    'AZAV',
    'Umschulung',
    'Fortbildung',
    'Kurse',
    'Bildungsanbieter',
    'AVGS',
    'Arbeitsamt',
    'Jobcenter',
    'Weiterbildung finden',
    'IT Weiterbildung',
    'Pflege Weiterbildung',
    'Online Weiterbildung',
  ],
  
  authors: [{ name: 'Kursfind AI', url: baseUrl }],
  creator: 'Wasim Academy UG',
  publisher: 'Wasim Academy UG',
  
  manifest: "/manifest.json",
  
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kursfind AI",
  },
  
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
  
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: 'en_US',
    url: baseUrl,
    siteName: 'Kursfind AI',
    title: 'Kursfind AI - Finde deine Weiterbildung in Minuten',
    description: 'KI-gestützte Suche für AZAV-zertifizierte Weiterbildungen. Finde deinen perfekten Kurs mit Bildungsgutschein.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kursfind AI - KI-gestützte Weiterbildungssuche',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Kursfind AI - Finde deine Weiterbildung in Minuten',
    description: 'KI-gestützte Suche für AZAV-zertifizierte Weiterbildungen in Deutschland.',
    images: ['/og-image.png'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  alternates: {
    canonical: baseUrl,
    languages: {
      'de-DE': baseUrl,
      'en-US': `${baseUrl}/en`,
    },
  },
  
  category: 'education',
  
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Structured Data for SEO */}
        <OrganizationSchema />
        <WebsiteSchema />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="Kursfind AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kursfind AI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#06b6d4" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Apple splash screens for better iOS experience */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PWAProvider>
          {children}
          <InstallBanner />
          <UpdateBanner />
          <OfflineIndicator />
        </PWAProvider>
      </body>
    </html>
  );
}
