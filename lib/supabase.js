import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only log error in development/runtime, not during build
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseKey)) {
  console.error('Missing Supabase credentials!')
  console.error('URL:', supabaseUrl)
  console.error('Key exists:', !!supabaseKey)
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)
