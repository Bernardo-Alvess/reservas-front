'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Filter, Mail, Phone, Search, Users, Loader2 } from 'lucide-react';
import Sidemenu from '@/app/components/Sidemenu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useReserve } from '@/app/hooks/useReserve';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ReserveCard from '@/components/ReserveCard';
import { formatDate, formatTime } from '@/lib/formatDate';

export interface Reserva {
  _id: string;
  email: string;
  name: string;
  startTime: string;
  amountOfPeople: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  clientId: {
    email: string;
  };
  table: {
    _id: string;
    number: number;
  };
}

const Reservas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { getReservesForRestaurant, confirmOrCancelReserve } = useReserve();
  const queryClient = useQueryClient();

  const { data: reservesData, isLoading, error } = useQuery({
    queryKey: ['reserves'],
    queryFn: () => getReservesForRestaurant({
      orderDirection: 'DESC',
      orderColumn: 'createdAt',
    })
  });

  const reserves: Reserva[] = reservesData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "pending":
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "canceled":
      case "cancelada":
        return "bg-red-100 text-red-800";
      case "finished":
      case "finalizada":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendente";
      case "cancelled":
      case "canceled":
        return "Cancelada";
      case "finished":
        return "Finalizada";
      default:
        return status;
    }
  };

  const filteredReserves = useMemo(() => {
    let filtered = reserves;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        (r.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.clientId?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [reserves, statusFilter, searchTerm]);

  const todayReserves = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return filteredReserves.filter(r => r.startTime === today);
  }, [filteredReserves]);

  const handleStatusChange = async (reserveId: string, mode: 'confirm' | 'cancel') => {
    try {
      await confirmOrCancelReserve(reserveId, 'restaurant', mode);
      queryClient.invalidateQueries({ queryKey: ['reserves'] });
      toast.success(`Reserva ${mode === 'confirm' ? 'confirmada' : 'cancelada'} com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao ${mode === 'confirm' ? 'confirmar' : 'cancelar'} reserva`);
    }
  };

  const getStatsData = () => {
    const today = todayReserves.length;
    const confirmed = reserves.filter(r => r.status.toLowerCase() === 'confirmed').length;
    const pending = reserves.filter(r => r.status.toLowerCase() === 'pending').length;
    const totalPeople = todayReserves.reduce((acc, r) => acc + r.amountOfPeople, 0);

    return { today, confirmed, pending, totalPeople };
  };

  const stats = getStatsData();


  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidemenu />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Carregando reservas...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidemenu />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-600 font-semibold mb-4">Erro ao carregar reservas</p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['reserves'] })}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidemenu />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gerenciar Reservas</h1>
              <p className="text-muted-foreground">Visualize e gerencie todas as reservas do restaurante</p>
            </div>
            
            <Button size="lg" className="gap-2">
              <Calendar className="w-4 h-4" />
              Nova Reserva (implementar)
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hoje</p>
                    <p className="text-2xl font-bold">{stats.today}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Confirmadas</p>
                    <p className="text-2xl font-bold">{stats.confirmed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pessoas Hoje</p>
                    <p className="text-2xl font-bold">{stats.totalPeople}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Busca e Filtros */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
              <option value="finished">Finalizadas</option>
            </select>
          </div>

          {/* Tabs de Reservas */}
          <Tabs defaultValue="hoje" className="w-full">
            <TabsList className="flex justify-between w-full">
              <TabsTrigger value="hoje">Hoje ({todayReserves.length})</TabsTrigger>
              <TabsTrigger value="todas">Todas ({filteredReserves.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hoje" className="space-y-4">
              {todayReserves.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhuma reserva encontrada para hoje.</p>
                  </CardContent>
                </Card>
              ) : (
                todayReserves.map((reservation) => (
                  <ReserveCard 
                    key={reservation._id} 
                    reservation={reservation} 
                    onStatusChange={handleStatusChange}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    formatDate={formatDate}
                    formatTime={formatTime}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="todas" className="space-y-4">
              {filteredReserves.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhuma reserva encontrada.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredReserves.map((reservation) => (
                  <ReserveCard 
                    key={reservation._id} 
                    reservation={reservation} 
                    onStatusChange={handleStatusChange}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    formatDate={formatDate}
                    formatTime={formatTime}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reservas;