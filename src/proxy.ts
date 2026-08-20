import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isRegisterPage = request.nextUrl.pathname.startsWith('/register')
  
  const isPublicRoute = isLoginPage || isRegisterPage || isAuthRoute || request.nextUrl.pathname.startsWith('/_next')

  // Support both HTTP and HTTPS (Secure) cookie names used by NextAuth v5
  const sessionCookie = request.cookies.get('authjs.session-token') || request.cookies.get('__Secure-authjs.session-token')

  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (sessionCookie && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
