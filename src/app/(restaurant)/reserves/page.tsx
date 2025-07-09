'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Search, Users, FunnelX } from 'lucide-react';
import Sidemenu from '@/components/Sidemenu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Reserva, useReserve } from '@/app/hooks/useReserve';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReserveCard from '@/components/ReserveCard';
import { PaginationComponent } from '@/components/Pagination';
import { StatCard } from '@/components/StatCard';
import { ReservationModal } from '@/components/ReservationModal';
import { useRestaurant } from '@/app/hooks/useRestaurant';
import { useRestaurantContext } from '@/app/context/selectedRestaurant/selectedRestaurantContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Reservas = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermDraft, setSearchTermDraft] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState('hoje');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const pageSize = 10;

    const { getReservesForRestaurant, getReserveStatsForRestaurant } = useReserve();
    const { getRestaurantById } = useRestaurant();
    const queryClient = useQueryClient();

    const { selectedRestaurant } = useRestaurantContext();
    const getQueryOptions = () => {
        const baseOptions = {
            orderDirection: 'ASC' as const,
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
                    status:
                        statusFilter !== 'all'
                            ? (statusFilter as 'Pendente' | 'Cancelada' | 'Confirmada')
                            : undefined,
                };
            case 'todas':
                return {
                    ...baseOptions,
                    status:
                        statusFilter !== 'all'
                            ? (statusFilter as 'Pendente' | 'Cancelada' | 'Confirmada')
                            : undefined,
                    startDate: selectedDate || undefined,
                };
            default:
                return baseOptions;
        }
    };

    const { data: restaurantData, isLoading: isLoadingRestaurant } = useQuery({
        queryKey: ['restaurant'],
        queryFn: () => getRestaurantById(selectedRestaurant || ''),
    });

    const {
        data: reservesData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['reserves', activeTab, statusFilter, searchTerm, currentPage, selectedDate],
        queryFn: () => getReservesForRestaurant(getQueryOptions()),
    });

    const reserves: Reserva[] = reservesData?.data || [];
    const pagination = reservesData?.meta || {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setCurrentPage(1);
        if (value === 'hoje') {
            setSelectedDate('');
        }
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

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setCurrentPage(1);
    };

    const clearDateFilter = () => {
        setSelectedDate('');
        setCurrentPage(1);
    };

    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ['reserves-stats'],
        queryFn: () => getReserveStatsForRestaurant(),
    });

    if (isLoading) {
        return (
            <div className="flex min-h-screen">
                <Sidemenu />
                <main className="flex-1 p-6 overflow-auto">
                    <LoadingSpinner 
                        text="Carregando reservas..." 
                        size="lg"
                        className="h-64"
                    />
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
                            <p className="text-red-600 font-semibold mb-4">
                                Erro ao carregar reservas
                            </p>
                            <Button
                                onClick={() =>
                                    queryClient.invalidateQueries({ queryKey: ['reserves'] })
                                }
                            >
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
                            <h1 className="text-3xl font-bold text-foreground">
                                Gerenciar Reservas
                            </h1>
                            <p className="text-muted-foreground">
                                Visualize e gerencie todas as reservas do restaurante
                            </p>
                        </div>

                        {!isLoadingRestaurant && (
                            <ReservationModal
                                open={isModalOpen}
                                onOpenChange={setIsModalOpen}
                                restaurant={restaurantData}
                                mode="restaurant"
                            />
                        )}
                        
                        <Button
                            size="lg"
                            className="gap-2"
                            onClick={() => setIsModalOpen(true)}
                            disabled={!!isLoadingRestaurant}
                        >
                            <Calendar className="w-4 h-4" />
                            Nova Reserva
                        </Button>
                    </div>

                    {isLoadingStats ? (
                        <LoadingSpinner 
                            text="Carregando estatísticas..." 
                            size="md"
                            className="h-32"
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard
                                title="Hoje"
                                value={statsData.stats?.total || 0}
                                description="reservas hoje"
                                icon={<Calendar className="w-4 h-4 text-blue-600" />}
                                isLoading={isLoadingStats}
                                isError={!statsData && !isLoadingStats}
                            />

                            <StatCard
                                title="Confirmadas"
                                value={statsData.stats?.confirmed || 0}
                                description="reservas confirmadas"
                                icon={<div className="w-3 h-3 bg-green-500 rounded-full" />}
                                isLoading={isLoadingStats}
                                isError={!statsData && !isLoadingStats}
                            />

                            <StatCard
                                title="Pendentes"
                                value={statsData.stats?.pending || 0}
                                description="reservas pendentes"
                                icon={<div className="w-3 h-3 bg-yellow-500 rounded-full" />}
                                isLoading={isLoadingStats}
                                isError={!statsData && !isLoadingStats}
                            />

                            <StatCard
                                title="Total Pessoas Hoje"
                                value={statsData.stats?.totalPeople || 0}
                                description="pessoas esperadas"
                                icon={<Users className="w-4 h-4 text-primary" />}
                                isLoading={isLoadingStats}
                                isError={!statsData && !isLoadingStats}
                            />
                        </div>
                    )}

                    {/* Busca e Filtros */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Buscar por nome do cliente ou nº da mesa..."
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

                        {/* Filtro de Data - Só aparece na aba "Todas" */}
                        {activeTab === 'todas' && (
                            <div className="flex items-center gap-2">
                                <div className="flex justify-between">
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        placeholder="Filtrar por data"
                                    />
                                </div>
                                {selectedDate && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearDateFilter}
                                        className="whitespace-nowrap"
                                    >
                                        <FunnelX className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        )}

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
                                        <p className="text-muted-foreground">
                                            Nenhuma reserva encontrada para hoje.
                                        </p>
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
                                        <p className="text-muted-foreground">
                                            Nenhuma reserva encontrada.
                                        </p>
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
