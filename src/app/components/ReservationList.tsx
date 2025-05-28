'use client';

import React from 'react';
import { useReserve } from '../hooks/useReserve';
import { useQuery } from '@tanstack/react-query';
import { Restaurant } from './RestaurantList';

interface Reservation {
  _id: string;
  name: string;
  startTime: string;
  time: string;
  amountOfPeople: number;
  status: 'Confirmada' | 'Pendente' | 'Cancelada';
  restaurantId: Restaurant
  restaurantConfirmed: boolean
  clientConfirmed: boolean
  canceledBy: string
}

const ReservationList = () => {
  const { getReservesForUser, confirmOrCancelReserve } = useReserve();

  const { data: reserves, isLoading, error } = useQuery<Reservation[]>({
    queryKey: ['reserves'],
    queryFn: getReservesForUser,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">Erro ao carregar as reservas. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!reserves || reserves.length === 0) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Lista de Reservas</h2>
        <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
          Nenhuma reserva encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Reservas</h2>

      {reserves.map((reserva) => (
        <div
          key={reserva._id}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{reserva.restaurantId.name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                reserva.status === 'Confirmada'
                  ? 'bg-green-100 text-green-800'
                  : reserva.status === 'Pendente'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {reserva.status}
            </span>
          </div>

          <div className='flex justify-between items-center text-black'>
            <div className='flex gap-4'>
              <div>
                <p>
                  <span className="font-medium">Data:</span>{' '}
                  {new Date(reserva.startTime).toLocaleDateString('pt-BR')}
                </p>
                <p>
                  <span className="font-medium">Horário:</span> {new Date(reserva.startTime).toLocaleTimeString('pt-BR')}
                </p>
                <p>
                  <span className="font-medium">Pessoas:</span> {reserva.amountOfPeople}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Status do Restaurante</span> <br/> 
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reserva.restaurantConfirmed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {reserva.restaurantConfirmed ? 'Confirmado' : 'Cancelada'}
                  </span>
                </p>
              </div>
            </div>

            <div className='flex gap-2'>
              {reserva.status === 'Cancelada' ? (
                <p>{reserva.canceledBy === 'user' ? 'Reserva cancelada' : 'Reserva cancelada pelo restaurante'}</p>
              ) : (
                <>
                  <button className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer' onClick={() => confirmOrCancelReserve(reserva._id, 'client', 'confirm')}>
                    Confirmar
                  </button>
                  <button className='bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer' onClick={() => confirmOrCancelReserve(reserva._id, 'client', 'cancel')}>
                    Cancelar reserva
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;
