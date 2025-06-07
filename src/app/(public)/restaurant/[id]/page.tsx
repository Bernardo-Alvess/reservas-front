'use client'

import React, { useState } from 'react';
import ReservationModal from '../../../components/ReservationModal';
import { useRestaurant } from '@/app/hooks/useRestaurant';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const dayMap: Record<string, string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

const RestaurantPage = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getRestaurantById } = useRestaurant();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id as string),
  });

  const handleReservation = () => setIsModalOpen(true);

  if (isLoading || !restaurant) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-muted">
        <p className="text-lg text-muted-foreground">Carregando restaurante...</p>
      </div>
    );
  }

  const address = restaurant.address
    ? `${restaurant.address.street}, ${restaurant.address.number} - ${restaurant.address.district}, ${restaurant.address.city} - ${restaurant.address.state}, ${restaurant.address.zipCode}`
    : '';

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative">
        {/* Botão flutuante */}
        <button
          onClick={handleReservation}
          className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Efetuar Reserva
        </button>

        {/* Cabeçalho */}
        <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
        <p className="text-gray-600 mb-1">{restaurant.type}</p>
        <p className="text-gray-600 mb-1">{address}</p>
        <p className="text-gray-600 mb-4"><strong>Telefone:</strong> {restaurant.phone}</p>

        {/* Descrição */}
        {restaurant.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Sobre o restaurante</h2>
            <p className="text-gray-700">{restaurant.description}</p>
          </div>
        )}

        {/* Horários de funcionamento */}
        {restaurant.workHours?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Horários de funcionamento</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
              {restaurant.workHours.map((wh: any) => (
                <div key={wh.day} className="flex justify-between">
                  <span>{dayMap[wh.day]}</span>
                  <span>{wh.open} - {wh.close}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capacidade e tempo máximo */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Informações adicionais</h2>
          <p className="text-gray-700">Capacidade máxima: <strong>{restaurant.maxClients} pessoas</strong></p>
          <p className="text-gray-700">Tempo máximo de reserva: <strong>{restaurant.maxReservationTime} minutos</strong></p>
        </div>

        {/* Cardápio */}
        {restaurant.menu && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Cardápio</h2>
            <p className="text-gray-700 whitespace-pre-line">{restaurant.menu}</p>
          </div>
        )}

        {/* Modal de reserva */}
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
