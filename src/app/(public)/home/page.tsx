'use client';

import { useRestaurant } from '../../hooks/useRestaurant';
import { useQuery } from '@tanstack/react-query';
import RestaurantList from '@/app/components/RestaurantList';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { getRestaurants } = useRestaurant();

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  });

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Descubra Restaurantes Incríveis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre os melhores lugares para sua próxima experiência gastronômica e faça sua reserva online com praticidade.
          </p>
        </div>

        {/* Filtros (placeholder para futura implementação) */}
        <div className="flex justify-center mb-10">
          <Input
            placeholder="Buscar restaurantes por nome, tipo ou localização..."
            className="w-full max-w-md bg-white"
          />
        </div>

        {/* Lista ou carregando */}
        {!isLoading ? (
          <RestaurantList restaurants={data || []} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
