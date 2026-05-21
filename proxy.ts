import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse }                         from 'next/server'

const isAdmin    = createRouteMatcher(['/admin(.*)'])
const isAccount  = createRouteMatcher(['/account(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as Record<string, string> | undefined)?.role

  if (isAdmin(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in?redirect=/admin', req.url))
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (isAccount(req) && !userId) {
    const redirect = encodeURIComponent(req.nextUrl.pathname)
    return NextResponse.redirect(new URL(`/sign-in?redirect_url=${redirect}`, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
