'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidemenu } from "@/components/Sidemenu";
import { useUserContext } from "@/app/context/user/useUserContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, Clock, Book, Table, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { useQuery } from "@tanstack/react-query";
import { useReserve } from "@/app/hooks/useReserve";
import { formatDate } from "@/lib/formatDate";

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

  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
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
      // change: "+12%",
      icon: Book,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Taxa de Ocupação",
      value: dashboardData?.totalOccupancyRate || 0,
      // change: "+5%",
      icon: Table,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Taxa de Ocupação Confirmada",
      value: dashboardData?.confirmedOccupancyRate || 0,
      // change: "+5%",
      icon: Table,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Clientes Esperados",
      value: dashboardData?.totalPeople || 0,
      // change: "+5%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    }
  ];

  // const upcomingReservations = [
  //   { time: "19:00", name: "Maria Silva", people: 4, table: "Mesa 5", status: "confirmada" },
  //   { time: "19:30", name: "João Santos", people: 2, table: "Mesa 12", status: "confirmada" },
  //   { time: "20:00", name: "Ana Costa", people: 6, table: "Mesa 8", status: "pendente" },
  //   { time: "20:30", name: "Pedro Lima", people: 3, table: "Mesa 3", status: "confirmada" },
  // ];

  return (
    <div className="flex min-h-screen">
      <Sidemenu />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu restaurante para o dia de <strong>hoje</strong></p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-6 justify-between">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:scale-105 transition-transform duration-300 py-3 w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {/* <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change} vs ontem
                  </p> */}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {/* <Card className="py-3">
              <CardHeader>
                <CardTitle>Ocupação por Horário</CardTitle>
                <CardDescription>Taxa de ocupação das mesas por faixa de horário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { time: "18:00 - 19:00", occupancy: 45 },
                  { time: "19:00 - 20:00", occupancy: 85 },
                  { time: "20:00 - 21:00", occupancy: 95 },
                  { time: "21:00 - 22:00", occupancy: 70 },
                  { time: "22:00 - 23:00", occupancy: 30 },
                ].map((slot, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{slot.time}</span>
                      <span className="text-sm text-muted-foreground">{slot.occupancy}%</span>
                    </div>
                    <Progress value={slot.occupancy} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card> */}

            {/* Próximas Reservas */}
            <Card className="py-3 w-full">
              <CardHeader>
                <CardTitle>Próximas Reservas</CardTitle>
                <CardDescription>Reservas para as próximas horas a partir de {new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingReservations?.length === 0 ? (
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
