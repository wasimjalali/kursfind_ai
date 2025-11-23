import { notFound } from 'next/navigation'
import CoursePageClient from './CoursePageClient'
import { createClient } from '@supabase/supabase-js'

async function getCourseData(identifier) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  console.log('Fetching course with identifier:', identifier)
  
  // Try to determine if it's an ID (number) or slug (string)
  const isNumericId = /^\d+$/.test(identifier)
  
  // Query course with JOIN to providers table using Supabase PostgREST syntax
  let query = supabase
    .from('courses')
    .select(`
      *,
      language,
      providers!inner(
        provider_id,
        company_name,
        logo_url,
        description,
        certifications,
        Certification,
        phone,
        email,
        website,
        faq,
        contact_name,
        city,
        short_description,
        trustpilot_url,
        google_reviews_url
      )
    `)
  
  if (isNumericId) {
    console.log('Querying by ID:', identifier)
    query = query.eq('id', parseInt(identifier))
  } else {
    console.log('Querying by slug:', identifier)
    query = query.eq('slug', identifier).eq('status', 'active')
  }
  
  let { data: courseData, error: courseError } = await query.single()

  // If join fails, try fetching course and provider separately as fallback
  if (courseError && (courseError.code === 'PGRST116' || courseError.message?.includes('relation') || courseError.message?.includes('foreign key'))) {
    console.warn('Provider join failed, fetching separately:', courseError.message)
    
    // Fetch course first
    let fallbackQuery = supabase.from('courses').select('*, language')
    if (isNumericId) {
      fallbackQuery = fallbackQuery.eq('id', parseInt(identifier))
    } else {
      fallbackQuery = fallbackQuery.eq('slug', identifier).eq('status', 'active')
    }
    
    const { data: course, error: courseErr } = await fallbackQuery.single()
    
    if (courseErr || !course) {
      console.error('Course fetch error:', courseErr, 'Identifier:', identifier)
      return null
    }
    
    // Fetch provider separately
    const { data: providerData, error: providerErr } = await supabase
      .from('providers')
      .select('*, Certification')
      .eq('provider_id', course.provider_id)
      .single()
    
    if (providerErr) {
      console.warn('Provider fetch error:', providerErr)
    }
    
    // Map provider data to match expected structure
    const provider = providerData ? {
      ...providerData,
      name: providerData.company_name,
      short_description: providerData.short_description || providerData.description,
      provider_description: providerData.description,
      Certification: providerData.Certification
    } : null
    
    // Fetch provider FAQs
    const providerId = provider?.provider_id || course.provider_id
    const { data: faqs, error: faqError } = await supabase
      .from('provider_faqs')
      .select('*')
      .eq('provider_id', providerId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    console.log('FAQs query result (fallback):', { count: faqs?.length, error: faqError })
    
    return {
      course,
      provider,
      providerFaqs: faqs || []
    }
  }

  if (courseError || !courseData) {
    console.error('Course fetch error:', courseError, 'Identifier:', identifier)
    return null
  }

  // Extract course and provider from joined result
  const { providers, ...course } = courseData
  const provider = providers ? {
    ...providers,
    // Map company_name to name for backward compatibility
    name: providers.company_name,
    // Map description to short_description if short_description is not available
    short_description: providers.short_description || providers.description,
    // Map description to provider_description for context
    provider_description: providers.description
  } : null

  console.log('Provider data:', provider)

  // Fetch provider FAQs using provider_id from the joined result
  const providerId = provider?.provider_id || course.provider_id
  const { data: faqs, error: faqError } = await supabase
    .from('provider_faqs')
    .select('*')
    .eq('provider_id', providerId)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  console.log('FAQs query result:', { count: faqs?.length, error: faqError })

  return {
    course,
    provider: provider || null,
    providerFaqs: faqs || []
  }
}

export default async function CoursePage({ params }) {
  const { id } = await params
  const data = await getCourseData(id)  // Can be either ID (number) or slug (string)
  
  if (!data) {
    notFound()
  }

  const { course, provider, providerFaqs } = data

  // Debug: Log the data being passed to client component
  console.log('Course data:', { course, provider, providerFaqs })

  return (
    <CoursePageClient 
      course={course} 
      provider={provider} 
      providerFaqs={providerFaqs} 
    />
  )
}
