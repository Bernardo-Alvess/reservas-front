import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Pega a URL de origem da requisição
  const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const response = NextResponse.redirect(new URL('/home', origin));

  response.cookies.set({
    name: 'sessionToken',
    value: '',
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    // domain: aqui você pode definir se necessário, mas tente remover primeiro pra evitar conflito
  });

  return response;
}
