'use client';

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { useUser } from "@/app/hooks/useUser";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { Sidemenu } from "@/app/components/Sidemenu";
import { useUserContext } from "@/app/context/user/useUserContext";

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
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<string>();

  const { getUserLogged } = useUser()
  const { getRestaurantById } = useRestaurant()

  const { user, setUser: setUserContext } = useUserContext();


  // useEffect(() => {
  //   const id = localStorage.getItem('restauranteSelecionado');
  //   if (user && user.type === 'company' && id) {
  //     console.log('id vindo do localstorage')
  //     console.log(id)
  //     setRestauranteSelecionado(id);
  //   }
  // }, []);

  useEffect(() => {
    if (!user) return;
    console.log('rodando o useEffect')
    const init = async () => {
      const id = localStorage.getItem('restauranteSelecionado');
      console.log('id vindo do localstorage')
      console.log(id)
      if (user.type === 'company') {
        console.log('user.type === company')
        const restaurantes = user.restaurant || [];
        console.log(restaurantes)
        if(id && restaurantes.some(r => r._id === id)) {
          console.log('id e restaurantes.some(r => r.id === id)')
          setRestauranteSelecionado(id);
          return
        }

        if (restaurantes.length === 1) {
          setRestauranteSelecionado(restaurantes[0]._id);
        } else if (restaurantes.length > 1 && !restauranteSelecionado) {
          router.push('/restaurants');
        }
      } else {
        setRestauranteSelecionado(user.restaurant[0].id);
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

  if(!user) return null


  return (
    <div className="flex h-screen">
      <Sidemenu/>
      <main className="flex-1 bg-zinc-100 p-6 overflow-auto">
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
      </main>
    </div>
  );
}
