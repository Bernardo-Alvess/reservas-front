'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "lucide-react";
import { Table as TableType } from "@/app/hooks/useTables";

interface TableStatsProps {
  tables: TableType[];
}

export const TableStats = ({ tables }: TableStatsProps) => {
  const availableTables = tables.filter(t => t.status === "disponível").length;
  const occupiedTables = tables.filter(t => t.status === "ocupada").length;
  const reservedTables = tables.filter(t => t.status === "reservada").length;
  const totalTables = tables.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
          <div className="h-4 w-4 rounded-full bg-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableTables}</div>
          <p className="text-xs text-muted-foreground">mesas livres agora</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
          <div className="h-4 w-4 rounded-full bg-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupiedTables}</div>
          <p className="text-xs text-muted-foreground">mesas em uso</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reservadas</CardTitle>
          <div className="h-4 w-4 rounded-full bg-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reservedTables}</div>
          <p className="text-xs text-muted-foreground">reservas ativas</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Table className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTables}</div>
          <p className="text-xs text-muted-foreground">total de mesas</p>
        </CardContent>
      </Card>
    </div>
  );
};