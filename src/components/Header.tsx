'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Settings, Calendar } from "lucide-react";
import { useUserContext } from "../app/context/user/useUserContext";
import { useLogin } from "../app/hooks/useLogin";
import { useState } from "react";
import { LoginModal } from "./LoginModal";

const Header = () => {
  const { user } = useUserContext();
  const { logout } = useLogin('client');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
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
              <Link href="/my-reserves">
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Minhas Reservas
              </Button>
            </Link>
            <span>|</span>
            </>
            )}
            {user && user?.type !== 'user' && (
            <Link href="/restaurants">
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
              <Button variant="outline" size="sm" onClick={() => {setLoginModalOpen(true)
              }}>
                <User className="w-4 h-4 mr-2" />
                Entrar
              </Button>
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

<LoginModal 
open={loginModalOpen} 
onOpenChange={setLoginModalOpen} 
/>
</>
  );
};

export default Header;