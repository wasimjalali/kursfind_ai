import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const ACCESS_COOKIE_NAME = 'kursfind_access'

// Routes that require invite access
const PROTECTED_ROUTES = [
  '/suchen',
  '/kurse',
  '/student',
]

// Routes that are always public
const PUBLIC_ROUTES = [
  '/',
  '/en',
  '/anbieter',
  '/en/providers',
  '/ueber-uns',
  '/en/about',
  '/impressum',
  '/en/imprint',
  '/datenschutz',
  '/en/privacy',
  '/offline',
  '/access',
  '/en/access',
  '/provider',
  '/api',
  '/_next',
  '/favicon',
  '/logo',
  '/images',
  '/fonts',
]

function isProtectedRoute(pathname) {
  return PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`) || pathname.startsWith(route)
  )
}

function detectLanguage(request) {
  const pathname = request.nextUrl.pathname
  const referer = request.headers.get('referer') || ''
  
  if (pathname.startsWith('/en') || referer.includes('/en')) {
    return 'en'
  }
  
  return 'de'
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Check invite access for protected routes FIRST
  if (isProtectedRoute(pathname)) {
    const accessCookie = request.cookies.get(ACCESS_COOKIE_NAME)
    
    if (!accessCookie?.value) {
      const lang = detectLanguage(request)
      const accessUrl = new URL(lang === 'en' ? '/en/access' : '/access', request.url)
      accessUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(accessUrl)
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // Skip Supabase operations if credentials are missing (during build)
  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - this keeps users logged in
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
