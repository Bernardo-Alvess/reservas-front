'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Loader2 } from "lucide-react";
import { Table as TableType, useTables } from "@/app/hooks/useTables";
import { useQuery } from "@tanstack/react-query";

interface TableStatsProps {
  tables: TableType[];
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  isLoading, 
  isError 
}: {
  title: string;
  value: number | undefined;
  description: string;
  icon: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
}) => (
  <Card className="py-3">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-muted-foreground">...</span>
          </div>
        ) : isError ? (
          <span className="text-red-500">--</span>
        ) : (
          value ?? 0
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export const TableStats = ({ tables }: TableStatsProps) => {
  const { getTableStats } = useTables()

  let { data: stats, isLoading, isError } = useQuery({
    queryKey: ['tableStats'],
    queryFn: getTableStats
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