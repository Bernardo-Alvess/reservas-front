'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidemenu } from "@/components/Sidemenu";
import { useUserContext } from "@/app/context/user/useUserContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Clock, Book, Table, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { useQuery } from "@tanstack/react-query";
import { useReserve } from "@/app/hooks/useReserve";
import { formatDate } from "@/lib/formatDate";
import { StatCard } from "@/components/StatCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// interface Stats {
//   reservasHoje: number;
//   ocupacao: number;
//   mediaAvaliacoes: number;
//   proximasReservas: Array<{
//     id: string;
//     cliente: string;
//     data: string;
//     horario: string;
//     pessoas: number;
//     status: string;
//   }>;
// }

export default function DashboardLayout() {
  const router = useRouter();
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<string>();

  const { user } = useUserContext();

  const { getDashboardData } = useRestaurant();
  const { getUpcomingReservations } = useReserve();

  const { data: dashboardData, isLoading: isLoadingDashboard, isError: isErrorDashboard } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: getDashboardData,
  });

  const { data: upcomingReservations, isLoading: isLoadingUpcomingReservations } = useQuery({
    queryKey: ['upcomingReservations'],
    queryFn: getUpcomingReservations,
  });

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const id = localStorage.getItem('restauranteSelecionado');
      if (user.type === 'company') {
        const restaurantes = user.restaurant || [];
        if(id && restaurantes.some(r => r._id === id)) {
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
  }, [user, restauranteSelecionado, router]);
  
  
  if(!user) return null
  
  const stats = [
    {
      title: "Reservas Hoje",
      value: dashboardData?.totalReservations || 0,
      description: "Reservas hoje",
      icon: <Book className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Taxa de Ocupação",
      value: dashboardData?.totalOccupancyRate || 0,
      description: "Taxa de ocupação",
      icon: <Table className="w-5 h-5 text-green-600" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Taxa de Ocupação Confirmada",
      value: dashboardData?.confirmedOccupancyRate || 0,
      description: "Taxa de ocupação confirmada",
      icon: <Table className="w-5 h-5 text-green-600" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Clientes Esperados",
      value: dashboardData?.totalPeople || 0,
      description: "Clientes esperados",
      icon: <Users className="w-5 h-5 text-purple-600" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidemenu />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu restaurante para o dia de <strong>hoje</strong></p>
          </div>

          <div className="flex justify-between gap-6">
            {stats.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  icon={stat.icon}
                  isLoading={isLoadingDashboard}
                  isError={isErrorDashboard}
                />
            ))}
          </div>

          <div className="flex flex-col gap-6">
          
            {/* Próximas Reservas */}
            <Card className="py-3 w-full">
              <CardHeader>
                <CardTitle>Próximas Reservas</CardTitle>
                <CardDescription>Reservas para as próximas horas a partir de {new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {
                    isLoadingUpcomingReservations ? (
                      <LoadingSpinner 
                        text="Carregando próximas reservas..." 
                        size="sm"
                        className="h-20"
                      />
                    ) : (
                      upcomingReservations?.length === 0 ? (
                        <p className="text-muted-foreground">Nenhuma reserva nas próximas horas</p>
                      ) : (
                        upcomingReservations?.map((reservation: any, index: any) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{reservation.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {reservation.amountOfPeople} pessoas • {reservation.tableId.tableNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatDate(reservation.startTime)}</p>
                          <Badge 
                            variant="outline"
                            className={`text-xs ${reservation.status === "Confirmada" ? "bg-green-500" : "bg-yellow-500"}`}
                          >
                            {reservation.status}
                          </Badge>
                        </div>
                          </div>
                        ))
                      )
                    )
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
