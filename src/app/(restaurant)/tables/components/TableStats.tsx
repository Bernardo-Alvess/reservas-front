'use client'

import { Table } from "lucide-react";
import { useTables } from "@/app/hooks/useTables";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import { useEffect, useState } from "react";

export const TableStats = () => {
  const { getTableStats } = useTables()
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  useEffect(() => {
    const restaurantId = localStorage.getItem('restauranteSelecionado');
    setSelectedRestaurant(restaurantId);
  }, []);

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['table-stats', selectedRestaurant],
    queryFn: getTableStats,
    enabled: !!selectedRestaurant,
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Sem nenhuma reserva"
        value={stats?.availableTables}
        description="mesas livres agora"
        icon={<div className="h-4 w-4 rounded-full bg-green-500" />}
        isLoading={isLoading}
        isError={isError}
      />
      
      <StatCard
        title="Mesas bloqueadas"
        value={stats?.blockedTables}
        description="mesas bloqueadas"
        icon={<div className="h-4 w-4 rounded-full bg-red-500" />}
        isLoading={isLoading}
        isError={isError}
      />
      
      <StatCard
        title="Mesas reservadas"
        value={stats?.tablesWithReservations}
        description="mesas reservadas"
        icon={<div className="h-4 w-4 rounded-full bg-yellow-500" />}
        isLoading={isLoading}
        isError={isError}
      />
      
      <StatCard
        title="Total de mesas"
        value={stats?.totalTables}
        description="total de mesas"
        icon={<Table className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};