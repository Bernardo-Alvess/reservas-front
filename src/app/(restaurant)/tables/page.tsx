'use client'

import { useTables } from "@/app/hooks/useTables";
import { Separator } from "@radix-ui/react-select";
import { NewTableDialog } from "./components/NewTableDialog";
import { TableCard } from "./components/TableCard";
import { TableStats } from "./components/TableStats";
import { useQuery } from "@tanstack/react-query";
import Sidemenu from "@/components/Sidemenu";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";

const TablesPage = () => {
  const { getTables } = useTables();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  useEffect(() => {
    const restaurantId = localStorage.getItem('restauranteSelecionado');
    setSelectedRestaurant(restaurantId);
  }, []);

  const { data: tables = [], isLoading, isError } = useQuery({
    queryKey: ['tables', selectedRestaurant],
    queryFn: getTables,
    enabled: !!selectedRestaurant,
  });

  // Verificação adicional de segurança para garantir que tables é sempre um array
  const safeTables = Array.isArray(tables) ? tables : [];

  return (
    <div className="flex min-h-screen">
      <Sidemenu />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Mesas</h1>
            <p className="text-muted-foreground">
              Configure e monitore as mesas do seu restaurante
            </p>
          </div>

          <NewTableDialog />
        </div>

        {/* Loading */}
        {isLoading && (
          <LoadingSpinner 
            text="Carregando mesas..." 
            size="md"
          />
        )}

        {/* Error */}
        {isError && (
          <div className="text-red-600 font-semibold mb-4">
            Erro ao carregar as mesas. Tente novamente mais tarde.
          </div>
        )}

        {/* Estatísticas */}
        {!isLoading && !isError && selectedRestaurant && (
          <>
            <TableStats/>

            <Separator className="my-6" />

            {/* Grid de Mesas */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Layout das Mesas</h2>
              <div className="flex flex-wrap gap-4">
                {safeTables.length === 0 ? (
                  <p className="text-muted-foreground">Nenhuma mesa cadastrada.</p>
                ) : (
                  safeTables.map((table: any) => (
                    <TableCard
                      key={table._id}
                      table={table}
                    />
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {/* Estado quando não há restaurante selecionado */}
        {!selectedRestaurant && !isLoading && (
          <div className="text-muted-foreground text-center mt-8">
            Nenhum restaurante selecionado.
          </div>
        )}
      </main>
    </div>
  );
};

export default TablesPage;
