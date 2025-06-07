// 'use client';

// import React from 'react';
// import { useReserve } from '../hooks/useReserve';
// import { useQuery } from '@tanstack/react-query';
// import { Restaurant } from './RestaurantList';

// interface Reservation {
//   _id: string;
//   name: string;
//   startTime: string;
//   time: string;
//   amountOfPeople: number;
//   status: 'Confirmada' | 'Pendente' | 'Cancelada';
//   restaurantId: Restaurant
//   restaurantConfirmed: boolean
//   clientConfirmed: boolean
//   canceledBy: string
// }

// const ReservationList = () => {
//   const { getReservesForUser, confirmOrCancelReserve } = useReserve();

//   const { data: reserves, isLoading, error } = useQuery<Reservation[]>({
//     queryKey: ['reserves'],
//     queryFn: getReservesForUser,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 p-4 rounded-md">
//         <p className="text-red-800">Erro ao carregar as reservas. Tente novamente mais tarde.</p>
//       </div>
//     );
//   }

//   if (!reserves || reserves.length === 0) {
//     return (
//       <div className="p-4 max-w-3xl mx-auto">
//         <h2 className="text-2xl font-bold mb-4">Lista de Reservas</h2>
//         <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
//           Nenhuma reserva encontrada.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-3xl mx-auto space-y-4">
//       <h2 className="text-2xl font-bold mb-4">Lista de Reservas</h2>

//       {reserves.map((reserva) => (
//         <div
//           key={reserva._id}
//           className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
//         >
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold text-gray-800">{reserva.restaurantId.name}</h3>
//             <span
//               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 reserva.status === 'Confirmada'
//                   ? 'bg-green-100 text-green-800'
//                   : reserva.status === 'Pendente'
//                   ? 'bg-yellow-100 text-yellow-800'
//                   : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {reserva.status}
//             </span>
//           </div>

//           <div className='flex justify-between items-center text-black'>
//             <div className='flex gap-4'>
//               <div>
//                 <p>
//                   <span className="font-medium">Data:</span>{' '}
//                   {new Date(reserva.startTime).toLocaleDateString('pt-BR')}
//                 </p>
//                 <p>
//                   <span className="font-medium">Horário:</span> {new Date(reserva.startTime).toLocaleTimeString('pt-BR')}
//                 </p>
//                 <p>
//                   <span className="font-medium">Pessoas:</span> {reserva.amountOfPeople}
//                 </p>
//               </div>
//               <div>
//                 <p>
//                   <span className="font-medium">Status do Restaurante</span> <br/>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     reserva.restaurantConfirmed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {reserva.restaurantConfirmed ? 'Confirmado' : 'Cancelada'}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className='flex gap-2'>
//               {reserva.status === 'Cancelada' ? (
//                 <p>{reserva.canceledBy === 'user' ? 'Reserva cancelada' : 'Reserva cancelada pelo restaurante'}</p>
//               ) : (
//                 <>
//                   <button className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer' onClick={() => confirmOrCancelReserve(reserva._id, 'client', 'confirm')}>
//                     Confirmar
//                   </button>
//                   <button className='bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer' onClick={() => confirmOrCancelReserve(reserva._id, 'client', 'cancel')}>
//                     Cancelar reserva
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ReservationList;
'use client';

import React from 'react';
import { useReserve } from '../hooks/useReserve';
import { useQuery } from '@tanstack/react-query';
import { Restaurant } from './RestaurantList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Reservation {
  _id: string;
  name: string;
  startTime: string;
  time: string;
  amountOfPeople: number;
  status: 'Confirmada' | 'Pendente' | 'Cancelada';
  restaurantId: Restaurant;
  restaurantConfirmed: boolean;
  clientConfirmed: boolean;
  canceledBy: string;
}

export default function ReservationList() {
  const { getReservesForUser, confirmOrCancelReserve } = useReserve();
  const {
    data: reserves,
    isLoading,
    error,
  } = useQuery<Reservation[]>({
    queryKey: ['reserves'],
    queryFn: getReservesForUser,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Erro ao carregar reservas. Tente novamente.</AlertDescription>
      </Alert>
    );
  }

  if (!reserves?.length) {
    return (
      <div className="text-center text-muted-foreground mt-6">
        Nenhuma reserva encontrada.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Minhas Reservas</h2>

      {reserves.map((reserva) => (
        <Card key={reserva._id} className="border rounded-2xl shadow-sm">
          <CardContent className="p-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {reserva.restaurantId.name}
              </h3>
              <Badge
                variant={
                  reserva.status === 'Confirmada'
                    ? 'default'
                    : reserva.status === 'Pendente'
                      ? 'secondary'
                      : 'destructive'
                }
                className="w-fit"
              >
                {reserva.status}
              </Badge>
            </div>

            {/* Informações da reserva */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-foreground">Data:</span>{' '}
                  {new Date(reserva.startTime).toLocaleDateString('pt-BR')}
                </p>
                <p>
                  <span className="font-medium text-foreground">Horário:</span>{' '}
                  {new Date(reserva.startTime).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p>
                  <span className="font-medium text-foreground">Pessoas:</span>{' '}
                  {reserva.amountOfPeople}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  Status do Restaurante:
                </p>
                <Badge
                  variant={
                    reserva.restaurantConfirmed ? 'default' : 'destructive'
                  }
                  className="mt-1 w-fit"
                >
                  {reserva.restaurantConfirmed ? 'Confirmado' : 'Cancelado'}
                </Badge>
              </div>
            </div>

            {/* Ações */}
            {reserva.status === 'Cancelada' ? (
              <p className="text-sm text-muted-foreground italic">
                {reserva.canceledBy === 'user'
                  ? 'Você cancelou esta reserva.'
                  : 'O restaurante cancelou esta reserva.'}
              </p>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    confirmOrCancelReserve(reserva._id, 'client', 'confirm')
                  }
                >
                  Confirmar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    confirmOrCancelReserve(reserva._id, 'client', 'cancel')
                  }
                >
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
