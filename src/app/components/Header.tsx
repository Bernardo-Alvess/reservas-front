'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useLogin } from '../hooks/useLogin';
import { useUserContext } from '../context/user/useUserContext';

export default function Header() {
  const { user } = useUserContext();
  const { logout } = useLogin('client');

  // const { data: user } = useQuery({
  //   queryKey: ['user'],
  //   queryFn: getUserLogged
  // });

  // if(!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          ReservasApp
        </Link>

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
