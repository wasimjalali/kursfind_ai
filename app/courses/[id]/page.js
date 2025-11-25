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
  
  // Fetch course first (without join to avoid FK issues)
  let query = supabase
    .from('courses')
    .select('*, language')
  
  if (isNumericId) {
    console.log('Querying by ID:', identifier)
    query = query.eq('id', parseInt(identifier))
  } else {
    console.log('Querying by slug:', identifier)
    query = query.eq('slug', identifier).eq('status', 'active')
  }
  
  const { data: course, error: courseError } = await query.single()

  console.log('Course query result:', { 
    hasData: !!course, 
    courseId: course?.id,
    error: courseError
  })

  if (courseError || !course) {
    console.error('Course fetch error:', courseError, 'Identifier:', identifier)
    return null
  }

  // Fetch provider separately (more reliable than JOIN)
  const { data: providerData, error: providerErr } = await supabase
    .from('providers')
    .select('*, Certification')
    .eq('provider_id', course.provider_id)
    .single()
  
  if (providerErr) {
    console.warn('Provider fetch error:', providerErr, 'Course provider_id:', course.provider_id)
  }

  // Map provider data to match expected structure
  const provider = providerData ? {
    ...providerData,
    name: providerData.company_name,
    short_description: providerData.short_description || providerData.description,
    provider_description: providerData.description,
    Certification: providerData.Certification
  } : null

  console.log('Provider data:', { 
    found: !!provider, 
    name: provider?.name,
    provider_id: provider?.provider_id 
  })

  // Fetch provider FAQs
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
