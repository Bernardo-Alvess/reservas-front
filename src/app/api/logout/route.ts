import { NextResponse } from 'next/server';

export async function GET() {
  // Pega a URL de origem da requisição
  const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const response = NextResponse.redirect(new URL('/home', origin));

  response.cookies.set({
    name: 'sessionToken',
    value: '',
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production',
    sameSite: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? 'none' : 'lax',
  });

  return response;
}
