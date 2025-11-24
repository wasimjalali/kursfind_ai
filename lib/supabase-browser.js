import { createBrowserClient } from '@supabase/ssr'

/**
 * CLIENT-SIDE SUPABASE CLIENT
 * Safe to use in Client Components ('use client')
 * Uses browser-based cookie handling
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return createBrowserClient(supabaseUrl, supabaseKey)
}

