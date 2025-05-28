'use client';

import Link from 'next/link';
import { useUser } from '../hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { useLogin } from '../hooks/useLogin';

export default function Header() {
  const { getUserLogged } = useUser();
  const { logout } = useLogin('client');

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUserLogged
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Título */}
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          ReservasApp
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/home" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          {user && (
            <Link href="/my-reserves" className="hover:text-blue-600 transition-colors">
              Minhas Reservas
            </Link>
          )}
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
            Painel Admin
          </Link>
          <p>
            |
          </p>
          {!user ? (
            <>
              <Link href="/login" className="hover:text-blue-600 transition-colors">
                Entrar
              </Link>
              <Link href="/login-restaurant" className="hover:text-blue-600 transition-colors">
              Entrar como Restaurante
            </Link>
            </>
          ) : (
            <button className="hover:text-blue-600 transition-colors" onClick={logout}>
              Sair
            </button>
          )}
    
        </nav>
      </div> 
    </header>
  );
}
