'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidemenu } from "@/app/components/Sidemenu";
import { useUserContext } from "@/app/context/user/useUserContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, Clock, Book, Table, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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

export default function DashboardLayout() {
  const router = useRouter();
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<string>();

  const { user } = useUserContext();

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
  }, [user, restauranteSelecionado]);
  
  
  if(!user) return null
  
  const stats = [
    {
      title: "Reservas Hoje",
      value: "24",
      change: "+12%",
      icon: Book,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Taxa de Ocupação",
      value: "85%",
      change: "+5%",
      icon: Table,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Novos Clientes",
      value: "8",
      change: "+25%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Receita Estimada",
      value: "R$ 3.240",
      change: "+18%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const upcomingReservations = [
    { time: "19:00", name: "Maria Silva", people: 4, table: "Mesa 5", status: "confirmada" },
    { time: "19:30", name: "João Santos", people: 2, table: "Mesa 12", status: "confirmada" },
    { time: "20:00", name: "Ana Costa", people: 6, table: "Mesa 8", status: "pendente" },
    { time: "20:30", name: "Pedro Lima", people: 3, table: "Mesa 3", status: "confirmada" },
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover-lift">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ocupação por Horário */}
            <Card>
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
            </Card>

            {/* Próximas Reservas */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Reservas</CardTitle>
                <CardDescription>Reservas para as próximas horas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingReservations.map((reservation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{reservation.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {reservation.people} pessoas • {reservation.table}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{reservation.time}</p>
                        <Badge 
                          variant={reservation.status === "confirmada" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {reservation.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
