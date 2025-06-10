'use client';

// import Link from 'next/link';
// import { useQuery } from '@tanstack/react-query';
// import { useLogin } from '../hooks/useLogin';
// import { useUserContext } from '../context/user/useUserContext';

// export default function Header() {
//   const { user } = useUserContext();
//   const { logout } = useLogin('client');

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//         <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
//           ReservasApp
//         </Link>

//         <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
//           <Link href="/home" className="hover:text-blue-600 transition-colors">
//             Home
//           </Link>
//           {user && (
//             <Link href="/my-reserves" className="hover:text-blue-600 transition-colors">
//               Minhas Reservas
//             </Link>
//           )}
//           <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
//             Painel Admin
//           </Link>
//           <p>
//             |
//           </p>
//           {!user ? (
//             <>
//               <Link href="/login" className="hover:text-blue-600 transition-colors">
//                 Entrar
//               </Link>
//             </>
//           ) : (
//             <button className="hover:text-blue-600 transition-colors" onClick={logout}>
//               Sair
//             </button>
//           )}
    
//         </nav>
//       </div> 
//     </header>
//   );
// }


import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Settings, Calendar } from "lucide-react";
import { useUserContext } from "../context/user/useUserContext";
import { useLogin } from "../hooks/useLogin";

const Navigation = () => {
  const { user } = useUserContext();
  const { logout } = useLogin('client');

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              ReservaFácil
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
              <Link href="/my-reservations">
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Minhas Reservas
              </Button>
            </Link>
            <span>|</span>
            </>
            )}
            {user && user?.type !== 'user' && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Área Administrativa
              </Button>
            </Link>
            )}
            {user ? (
              <Button variant="outline" size="sm" onClick={logout}>
                <User className="w-4 h-4 mr-2" />
                Sair
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </Link>
            )}
            {/* {!location.pathname.startsWith('/admin') ? (
              <>
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Área Administrativa
                  </Button>
                </Link>
                <Button size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </>
            ) : (
              <Link href="/">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Área do Cliente
                </Button>
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;