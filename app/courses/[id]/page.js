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
  
  // Query by ID or SLUG
  let query = supabase.from('courses').select('*')
  
  if (isNumericId) {
    console.log('Querying by ID:', identifier)
    query = query.eq('id', parseInt(identifier))
  } else {
    console.log('Querying by slug:', identifier)
    query = query.eq('slug', identifier).eq('status', 'active')
  }
  
  const { data: course, error: courseError } = await query.single()

  console.log('Course query result:', { course, error: courseError })

  if (courseError || !course) {
    console.error('Course fetch error:', courseError, 'Identifier:', identifier)
    return null
  }

  // Now fetch provider separately using provider_id
  const { data: provider, error: providerError } = await supabase
    .from('providers')
    .select('*')
    .eq('provider_id', course.provider_id)
    .single()

  console.log('Provider query result:', { provider, error: providerError })

  // Fetch provider FAQs
  const { data: faqs, error: faqError } = await supabase
    .from('provider_faqs')
    .select('*')
    .eq('provider_id', course.provider_id)
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
