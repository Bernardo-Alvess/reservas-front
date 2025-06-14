'use client';

import { useState,  } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Calendar, Search, Users, Loader2 } from 'lucide-react';
import Sidemenu from '@/app/components/Sidemenu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Reserva, useReserve } from '@/app/hooks/useReserve';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReserveCard from '@/components/ReserveCard';
import { PaginationComponent } from '@/components/Pagination';

const Reservas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDraft, setSearchTermDraft] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("hoje");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const { getReservesForRestaurant, getReserveStatsForRestaurant } = useReserve();
  const queryClient = useQueryClient();

  const getQueryOptions = () => {
    const baseOptions = {
      orderDirection: 'DESC' as const,
      orderColumn: 'createdAt',
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
    };

    switch (activeTab) {
      case 'hoje':
        return { 
          ...baseOptions,
          today: true,
          status: statusFilter !== "all" ? (statusFilter as 'Pendente' | 'Cancelada' | 'Confirmada') : undefined 
        };
      case 'todas':
        return { 
          ...baseOptions, 
          status: statusFilter !== "all" ? (statusFilter as 'Pendente' | 'Cancelada' | 'Confirmada') : undefined 
        };
      default:
        return baseOptions;
    }
  };

  const { data: reservesData, isLoading, error } = useQuery({
    queryKey: ['reserves', activeTab, statusFilter, searchTerm, currentPage],
    queryFn: () => getReservesForRestaurant(getQueryOptions()),
  });

  const reserves: Reserva[] = reservesData?.data || [];
  const pagination = reservesData?.meta || { currentPage: 1, totalPages: 1, total: 0, hasNextPage: false, hasPreviousPage: false };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['reserves-stats'],
    queryFn: () => getReserveStatsForRestaurant()
  });


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
              {isLoadingStats ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hoje</p>
                    <p className="text-2xl font-bold">{statsData?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            )}

            </Card>
            
            <Card>
              {isLoadingStats ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Confirmadas</p>
                    <p className="text-2xl font-bold">{statsData?.confirmed || 0}</p>
                  </div>
                </div>
              </CardContent>
              )}
            </Card>
            
            <Card>
              {isLoadingStats ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold">{statsData?.pending || 0}</p>
                  </div>
                </div>
              </CardContent>
              )}
            </Card>
            
            <Card>
              {isLoadingStats ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pessoas Hoje</p>
                    <p className="text-2xl font-bold">{statsData?.totalPeople || 0}</p>
                  </div>
                </div>
              </CardContent>
              )}
            </Card>
          </div>

          {/* Busca e Filtros */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nome do cliente..."
                value={searchTermDraft}
                onChange={(e) => setSearchTermDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchChange(searchTermDraft);
                  }
                }}
                className="pl-10"
              />
            </div>
              <select 
                value={statusFilter} 
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">Todos os Status</option>
                <option value="Pendente">Pendentes</option>
                <option value="Confirmada">Confirmadas</option>
                <option value="Cancelada">Canceladas</option>
              </select>
          </div>

          {/* Tabs de Reservas */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex justify-between w-full">
              <TabsTrigger value="hoje">Hoje</TabsTrigger>
              <TabsTrigger value="todas">Todas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hoje" className="space-y-4">
              {reserves.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhuma reserva encontrada para hoje.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {reserves.map((reservation) => (
                    <ReserveCard 
                      key={reservation._id} 
                      reservation={reservation} 
                    />
                  ))}
                  <PaginationComponent 
                    pagination={pagination} 
                    currentPage={currentPage} 
                    handlePageChange={handlePageChange} 
                  />
                </>
              )}
            </TabsContent>
            
            <TabsContent value="todas" className="space-y-4">
              {reserves.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhuma reserva encontrada.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {reserves.map((reservation) => (
                    <ReserveCard 
                      key={reservation._id} 
                      reservation={reservation} 
                    />
                  ))}
                  <PaginationComponent 
                    pagination={pagination} 
                    currentPage={currentPage} 
                    handlePageChange={handlePageChange} 
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reservas;