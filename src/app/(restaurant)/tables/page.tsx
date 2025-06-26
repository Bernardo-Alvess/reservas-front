'use client'

import { useTables } from "@/app/hooks/useTables";
import { Separator } from "@radix-ui/react-select";
import { NewTableDialog } from "./components/NewTableDialog";
import { TableCard } from "./components/TableCard";
import { TableStats } from "./components/TableStats";
import { useQuery } from "@tanstack/react-query";
import Sidemenu from "@/components/Sidemenu";

const TablesPage = () => {
  const { getTables } = useTables();

  const { data: tables = [], isLoading, isError } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
  });


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
          <div className="flex justify-center items-center h-40">
            <p className="text-lg text-muted-foreground">Carregando mesas...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-red-600 font-semibold mb-4">
            Erro ao carregar as mesas. Tente novamente mais tarde.
          </div>
        )}

        {/* Estatísticas */}
        {!isLoading && !isError && (
          <>
            <TableStats/>

            <Separator className="my-6" />

            {/* Grid de Mesas */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Layout das Mesas</h2>
              <div className="flex flex-wrap gap-4">
                {tables.length === 0 ? (
                  <p className="text-muted-foreground">Nenhuma mesa cadastrada.</p>
                ) : (
                  tables.map((table: any) => (
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
      </main>
    </div>
  );
};

export default TablesPage;
