import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/get_user", {
            credentials: "include"
        });

        if (!response.ok) {
            // User is not logged in & redirect to login page
            return NextResponse.redirect(new URL('/login', request.url));
        } 

        // User is logged in & continue 
        return NextResponse.next();

    } catch (error) {
        console.log()
    }
}
 
export const config = {
  matcher: ['/home/:path*', '/upload', '/display']
}