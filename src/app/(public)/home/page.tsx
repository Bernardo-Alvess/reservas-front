'use client';

import { useRestaurant } from '../../hooks/useRestaurant';
import { useQuery } from '@tanstack/react-query';
import RestaurantList from '@/app/components/RestaurantList';


export default function HomePage() {
  const { getRestaurants } = useRestaurant();

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Descubra Restaurantes Incríveis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre os melhores lugares para sua próxima experiência gastronômica e faça sua reserva online.
          </p>
        </div>

        {/* Filtros - A ser implementado */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <input
              type="text"
              placeholder="Buscar restaurantes..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
            />
          </div>
        </div>

        {/* Lista de Restaurantes */}

        {!isLoading ? (
          <RestaurantList restaurants={data || []} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
} 