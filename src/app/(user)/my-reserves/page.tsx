'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Loader2 } from "lucide-react";
import { useReserve } from "@/app/hooks/useReserve";
import { useQuery } from "@tanstack/react-query";
import { ClientReserveCard } from "@/components/ClientReserveCard";
import { PaginationComponent } from "@/components/Pagination";

const MyReservations = () => {
  const { getReservesForUser } = useReserve();
  const [filter, setFilter] = useState<"all" | "Pendente" | "Confirmada" | "Cancelada">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const getQueryOptions = () => {
    return {
      orderDirection: 'DESC' as const,
      orderColumn: 'createdAt',
      page: currentPage,
      limit: pageSize,
      status: filter !== "all" ? filter : undefined,
    };
  };

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ["reservations", filter, currentPage],
    queryFn: () => getReservesForUser(getQueryOptions()),
  });

  const reservations = reservationsData?.data || [];
  const pagination = reservationsData?.meta || { 
    totalItems: 0, 
    limit: pageSize, 
    totalPages: 1, 
    currentPage: 1, 
    hasPreviousPage: false, 
    hasNextPage: false 
  };

  console.log(reservationsData);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Carregando suas reservas...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Minhas Reservas</h1>
            <p className="text-muted-foreground">
              Gerencie suas reservas e acompanhe o status
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Todas" },
              { key: "Pendente", label: "Pendentes" },
              { key: "Confirmada", label: "Confirmadas" },
              { key: "Cancelada", label: "Canceladas" }
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(filterOption.key as any)}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>

          {reservations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
                <p className="text-muted-foreground">
                  {filter === "all" 
                    ? "Você ainda não fez nenhuma reserva."
                    : `Você não tem reservas com status "${filter}".`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {reservations.map((reservation: any) => (
                  <ClientReserveCard key={reservation._id} reservation={reservation} />
                ))}
              </div>
              
              <PaginationComponent 
                pagination={pagination} 
                currentPage={currentPage} 
                handlePageChange={handlePageChange} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReservations;