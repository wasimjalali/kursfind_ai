import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error in getUser:', error)
    return null
  }
}

export async function getSession() {
  const supabase = await createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error fetching session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error in getSession:', error)
    return null
  }
}

// Helper to get current provider
export async function getCurrentProvider() {
  try {
  const supabase = await createClient()
  
  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
      console.log('No authenticated user:', error?.message || 'No user')
    return null
  }
  
  // Get provider record
  const { data: provider, error: providerError } = await supabase
    .from('providers')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()
  
  if (providerError || !provider) {
      console.log('No provider found for user:', user.id, providerError?.message)
    return null
  }
  
  return provider
  } catch (error) {
    console.error('Error in getCurrentProvider:', error)
    return null
  }
}
