// proxy.ts (Next 16's name for middleware)
import { NextResponse } from 'next/server'
import { auth } from '../auth'

// Runs only on the pages listed in `config.matcher`, which are the ones that
// need a session. Every other page is public, including the one a scanned QR
// code opens (/<owner email>/<list name>), so a new page is public unless it
// is added here.
//
// `auth` reads the session the same way the pages do, including the
// __Secure- cookie name Auth.js uses over HTTPS.
export default auth((request) => {
  if (!request.auth) {
    // Redirect unauthenticated users to the sign-in page
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
})

export const config = {
  // `:path*` also matches the bare path, so this covers /create-qr itself.
  matcher: ['/create-qr/:path*'],
}
