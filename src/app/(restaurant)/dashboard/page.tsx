'use client';

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { useUser } from "@/app/hooks/useUser";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { Sidemenu } from "@/app/components/Sidemenu";

interface Stats {
  reservasHoje: number;
  ocupacao: number;
  mediaAvaliacoes: number;
  proximasReservas: Array<{
    id: string;
    cliente: string;
    data: string;
    horario: string;
    pessoas: number;
    status: string;
  }>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<string | null>(null);

  const { getUserLogged } = useUser()
  const { getRestaurantById } = useRestaurant()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUserLogged
  });

  useEffect(() => {
    if (!user) return;

    const init = async () => {
      if (user.type === 'company') {
        const restaurantes = user.restaurantes || [];
        if (restaurantes.length === 1) {
          setRestauranteSelecionado(restaurantes[0].id);
        } else if (restaurantes.length > 1 && !restauranteSelecionado) {
          router.push('/dashboard/restaurantes');
        }
      } else {
        setRestauranteSelecionado(user.restauranteId);
      }
    };

    init();
  }, [user]);

  const stats: Stats = {
    reservasHoje: 0,
    ocupacao: 0,
    mediaAvaliacoes: 0,
    proximasReservas: []
  };

  if (isLoading || !user || (user.type === 'company' && !restauranteSelecionado)) {
    return (
      <div className="flex justify-center items-center h-screen text-zinc-700">
        Carregando informações do usuário...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidemenu type={user.type} />
      <main className="flex-1 bg-zinc-100 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Reservas Hoje</h2>
                <p className="text-3xl font-bold text-blue-600">{stats?.reservasHoje || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Ocupação</h2>
                <p className="text-3xl font-bold text-green-600">{stats?.ocupacao || 0}%</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Avaliações</h2>
                <p className="text-3xl font-bold text-yellow-600">{stats?.mediaAvaliacoes || 0}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mt-6">
              <h2 className="text-lg font-semibold mb-4">Próximas Reservas</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pessoas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats?.proximasReservas?.map((reserva: any) => (
                      <tr key={reserva.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reserva.cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(reserva.data).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reserva.horario}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reserva.pessoas}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {reserva.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
