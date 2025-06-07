'use client'

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidemenuProps {
  type: string;
}

export function Sidemenu({ type }: SidemenuProps) {
  const pathname = usePathname();

  const menuItems = {
    company: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Restaurantes", path: "/dashboard/restaurantes" },
      { label: "Usuários", path: "/dashboard/usuarios" },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Mesas", path: "/dashboard/mesas" },
      { label: "Reservas", path: "/dashboard/reservas" },
      { label: "Cardápio", path: "/dashboard/cardapio" },
      { label: "Usuários", path: "/dashboard/usuarios" },
      { label: "Info Restaurante", path: "/dashboard/info" },
    ],
    worker: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Mesas", path: "/dashboard/mesas" },
      { label: "Reservas", path: "/dashboard/reservas" },
      { label: "Cardápio", path: "/dashboard/cardapio" },
    ],
  };

  return (
    <aside className="w-64 bg-zinc-800 text-white px-4 py-6">
      <nav className="space-y-2">
        {menuItems[type as keyof typeof menuItems].map((item) => (
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
        ))}
      </nav>
    </aside>
  );
}

export default Sidemenu;