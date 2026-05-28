import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Not logged in → block protected routes, send to login
  if (!user && (path.startsWith('/rider') || path.startsWith('/commercial'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Already logged in → skip login page, go straight to dashboard
  if (user && path === '/') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    const role = profile?.role || 'rider'
    return NextResponse.redirect(
      new URL(role === 'commercial' ? '/commercial' : '/rider', request.url)
    )
  }

  return response
}

export const config = {
  matcher: ['/', '/rider/:path*', '/commercial/:path*'],
}
