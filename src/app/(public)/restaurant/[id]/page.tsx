'use client'

import React, { useState } from 'react';
import ReservationModal from '../../../components/ReservationModal';
import { useRestaurant } from '@/app/hooks/useRestaurant';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface Restaurant {
  id: string;
  name: string;
  location: string;
  phone: string;
  menu?: string;
}

const RestaurantPage = () => {
  const { id } = useParams()
  console.log(id)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservation, setReservation] = useState({
    startTime: '',
    endTime: '',
    amountOfPeople: 0,
    cpf: '',
    birthDate: '',
  });

  const { getRestaurantById } = useRestaurant()

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id as string),
  })

  const handleReservation = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {isLoading ? (
        <div>
          <h1>Carregando...</h1>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 relative">
          {/* Botão flutuante no canto superior direito */}
        <button
          onClick={handleReservation}
          className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Efetuar Reserva
        </button>

        {/* Conteúdo do restaurante */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
        <p className="text-gray-600 mb-1">
          <strong>Local:</strong> {restaurant.location}
        </p>
        <p className="text-gray-600">
          <strong>Telefone:</strong> {restaurant.phone}
        </p>

        {/* Cardápio */}
        {restaurant.menu && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Cardápio</h2>
            <p className="text-gray-700 whitespace-pre-line">{restaurant.menu}</p>
          </div>
        )}

        {/* Modal de reserva */}
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // reservation={reservation}
          // onInputChange={handleInputChange}
          // onSubmit={handleSubmit}
        />
        </div>
      )}
    </div>
  )
};

export default RestaurantPage; 