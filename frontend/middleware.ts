import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    console.log ("Middleware Function Initiated")
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/get_user", {
            credentials: "include"
        });

        if (!response.ok) {
            const data = await response.json
            console.log("response.ok is false:", data)
            return NextResponse.redirect(new URL('/login', request.url));
        } 

        return NextResponse.next();

    } catch (error) {
        console.log()
    }

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/home', '/upload', '/display']
}