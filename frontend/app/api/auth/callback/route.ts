//route for google API
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/calendar?error=no_code', request.url));
  }

  return NextResponse.redirect(new URL(`/calendar?code=${code}`, request.url));
}