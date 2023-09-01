import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  /* const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log("Data", user)

  // if user is signed in and the current path is / redirect the user to /account
  if (user) {
    return NextResponse.redirect(new URL('/components/dashboard', req.url))
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user) {
    return NextResponse.redirect(new URL('/', req.url)) 
  }*/
  return res
}