'use client';

import React, { useEffect } from 'react';
import { useReserve } from '../hooks/useReserve';
import { useQuery } from '@tanstack/react-query';


interface Reservation {
  id: string | number;
  name: string;
  date: string;
  time: string;
  people: number;
  status: 'Confirmada' | 'Pendente' | 'Cancelada';
}

const ReservationList = () => {
  const { getReservesForUser } = useReserve();


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
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lista de Reservas</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Horário</th>
              <th className="px-4 py-2 text-left">Pessoas</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {reserves.map((reserva) => (
              <tr key={reserva.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{reserva.name}</td>
                <td className="px-4 py-2">
                  {new Date(reserva.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-2">{reserva.time}</td>
                <td className="px-4 py-2">{reserva.people}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      reserva.status === 'Confirmada'
                        ? 'bg-green-100 text-green-800'
                        : reserva.status === 'Pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {reserva.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => {/* TODO: Implementar visualização */}}
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationList;
