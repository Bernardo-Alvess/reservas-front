'use client'

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUserContext } from "../app/context/user/useUserContext";
import { useEffect } from "react";
import { useRestaurantContext } from "../app/context/selectedRestaurant/selectedRestaurantContext";

export function Sidemenu() {
  const pathname = usePathname();
  const { user } = useUserContext();
  const { selectedRestaurant } = useRestaurantContext();


  const menuItems = {
    company: [
      { label: "Selecionar Restaurante", path: "/restaurants" },
      { label: "Dashboard", path: "/dashboard" },
      { label: "Mesas", path: "/tables" },
      { label: "Reservas", path: "/reserves" },
      { label: "Usuários", path: "/users" },
      { label: "Info Restaurante", path: "/info" },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Mesas", path: "/tables" },
      { label: "Reservas", path: "/reserves" },
      { label: "Usuários", path: "/users" },
      { label: "Info Restaurante", path: "/info" },
    ],
    worker: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Mesas", path: "/tables" },
      { label: "Reservas", path: "/reserves" },
    ],
  };

  useEffect(() => {
    if(!user) {
      console.log("Não tem usuário")
      return
    }
  }, [user])

  if(!user) return null

  return (
    <aside className="w-64 bg-zinc-800 text-white px-4 py-6">
      <nav className="space-y-2">
        {!selectedRestaurant && user.type === 'company' ? (
          <Link
            href={`/restaurants`}
            className="block rounded px-3 py-2 transition-colors hover:bg-zinc-700"
          >
            Selecionar Restaurante
          </Link>
        ) : (
           menuItems[user.type as keyof typeof menuItems].map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "block rounded px-3 py-2 transition-colors hover:bg-zinc-700",
              pathname === item.path && "bg-zinc-700"
            )}
          >
            {item.label}
          </Link>
        ))
        )}
       
      </nav>
    </aside>
  );
}

export default Sidemenu;