import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ACCESS_COOKIE_NAME = 'kursfind_access'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessCookie = cookieStore.get(ACCESS_COOKIE_NAME)
    
    return NextResponse.json({ 
      hasAccess: !!accessCookie?.value 
    })

  } catch (error) {
    console.error('Access check error:', error)
    return NextResponse.json({ hasAccess: false })
  }
}
