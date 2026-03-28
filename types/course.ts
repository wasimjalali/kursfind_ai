// Type definitions for Course and Provider data structures

export type Provider = {
  provider_id: string
  company_name: string
  logo_url: string | null
  description: string | null
  certifications: string[] | null
  phone: string | null
  email: string | null
  website: string | null
  faq: Record<string, unknown>[] | null
  contact_name: string | null
  city: string | null
  short_description?: string | null
  trustpilot_url?: string | null
  google_reviews_url?: string | null
  // Mapped fields for backward compatibility
  name?: string
  provider_description?: string
}

export type Course = {
  id: number
  slug: string
  title: string
  description: string
  subtitle?: string | null
  short_description?: string | null
  provider_id: string
  location: string
  duration: string
  format?: string | null
  price?: string | null
  start_date?: string | null
  certificate?: string | null
  prerequisites?: string | null
  target_audience?: string | null
  website?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  benefits?: string | null
  learning_objectives?: string[] | null
  career_paths?: Record<string, unknown> | null
  image_url?: string | null
  infomaterial_url?: string | null
  status?: string | null
  created_at?: string | null
  updated_at?: string | null
  // Legacy fields (may be removed)
  provider?: string
}

export type CourseWithProvider = Course & {
  provider: Provider | null
}

export type ProviderFAQ = {
  id: number
  provider_id: string
  question: string
  answer: string
  is_active: boolean
  display_order: number
  created_at?: string | null
  updated_at?: string | null
}

