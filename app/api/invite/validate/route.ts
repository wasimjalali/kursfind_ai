import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'No code provided' }, 
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Use the validation function
    const { data, error } = await supabase.rpc('validate_invite_code', {
      invite_code: code.toUpperCase().trim()
    })

    if (error) {
      console.error('Invite validation error:', error)
      return NextResponse.json(
        { valid: false, error: 'Validation failed' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ valid: data === true })

  } catch (error) {
    console.error('Invite validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'Server error' }, 
      { status: 500 }
    )
  }
}
