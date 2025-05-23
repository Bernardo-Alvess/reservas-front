'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Título */}
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          ReservasApp
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/restaurants" className="hover:text-blue-600 transition-colors">
            Restaurantes
          </Link>
          <Link href="/my-reserves" className="hover:text-blue-600 transition-colors">
            Minhas Reservas
          </Link>
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
            Painel Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
