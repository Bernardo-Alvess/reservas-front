import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Pega a URL de origem da requisição
  const origin = request.headers.get('origin') || 'http://localhost:3000';
  const response = NextResponse.redirect(new URL('/home', origin));

  response.cookies.set({
    name: 'sessionToken',
    value: '',
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
