export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kursfind AI',
    alternateName: 'Kursfind',
    url: 'https://kursfind.de',
    logo: 'https://kursfind.de/landing/kursfind-ai-logo.jpg',
    description: 'KI-gestützte Plattform für Weiterbildungssuche in Deutschland',
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: 'Wasim Sherzad',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'DE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+49-163-044-6980',
      contactType: 'customer service',
      email: 'kontakt@kursfind.de',
      availableLanguage: ['German', 'English'],
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kursfind AI',
    url: 'https://kursfind.de',
    description: 'KI-gestützte Weiterbildungssuche',
    inLanguage: ['de-DE', 'en-US'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kursfind.de/suchen?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQ {
  question: string
  answer: string
}

export function FAQSchema({ faqs }: { faqs: FAQ[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface Course {
  title: string
  description?: string
  provider_name?: string
  provider_website?: string
  price?: number | string
  format?: string
  duration?: string
  start_date?: string
}

export function CourseSchema({ course }: { course: Course }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider_name,
      sameAs: course.provider_website,
    },
    educationalLevel: 'Professional',
    inLanguage: 'de',
    isAccessibleForFree: false,
    offers: {
      '@type': 'Offer',
      price: course.price || '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      category: 'Bildungsgutschein verfügbar',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: course.format || 'online',
      duration: course.duration,
      startDate: course.start_date,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
