import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const protectedRoutes = ['/mypost', '/settings']

export async function middleware(req) {
  const token = await getToken({ req })
  
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(
        new URL(
          `/`,
          req.url
        )
      );
  
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/mypost', '/settings', '/newpost'],
}