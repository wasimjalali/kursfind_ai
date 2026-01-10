import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Cookie configuration
const ACCESS_COOKIE_NAME = 'kursfind_access'
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'No code provided' }, 
        { status: 400 }
      )
    }

    const cleanCode = code.toUpperCase().trim()
    const supabase = await createClient()
    
    // Validate and increment usage in one call
    const { data, error } = await supabase.rpc('increment_invite_code_use', {
      invite_code: cleanCode
    })

    if (error) {
      console.error('Invite access error:', error)
      return NextResponse.json(
        { success: false, error: 'Validation failed' }, 
        { status: 500 }
      )
    }

    if (data !== true) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired invite code' }, 
        { status: 400 }
      )
    }

    // Set access cookie
    const cookieStore = await cookies()
    cookieStore.set(ACCESS_COOKIE_NAME, cleanCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ACCESS_COOKIE_MAX_AGE,
      path: '/'
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Invite access error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' }, 
      { status: 500 }
    )
  }
}
