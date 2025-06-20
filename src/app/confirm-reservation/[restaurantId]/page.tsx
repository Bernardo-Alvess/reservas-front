'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { useReserve } from '@/app/hooks/useReserve';
import { CheckCircle, Clock, Users, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface Reservation {
  _id: string;
  name: string;
  email: string;
  startTime: string;
  amountOfPeople: number;
  status: string;
  tableNumber?: number;
  restaurantId: {
    name: string;
  };
}

export default function ConfirmReservationPage() {
  const { restaurantId } = useParams();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<any[]>([]);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const { searchUserNowReservations, checkInReserve } = useReserve();

  const loadReservations = async () => {
    if (!restaurantId) return;
    
    setLoading(true);
    try {
      const result = await searchUserNowReservations(restaurantId as string);
      // Garantir que result seja sempre um array
      const reservationArray = Array.isArray(result) ? result : [result];
      setReservations(reservationArray);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar suas reservas');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [restaurantId]);

  const handleCheckIn = async (id: string) => {
    try {
      setLoading(true);
      await checkInReserve(id);
      setConfirmedId(id);
      toast.success('Reserva confirmada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao confirmar reserva.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Carregando suas reservas...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Confirmar Reserva</CardTitle>
          <CardDescription>
            Suas reservas neste restaurante
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {reservations.length === 0 ? (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Você não possui reservas neste restaurante.
              </p>
              <Button 
                variant="outline" 
                onClick={loadReservations}
                className="w-full"
              >
                Recarregar
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-center text-muted-foreground">
                {reservations.length} {reservations.length === 1 ? 'reserva encontrada' : 'reservas encontradas'}
              </p>
              
              {reservations.map((reservation) => (
                <div
                  key={reservation._id}
                  className="p-4 bg-muted rounded-lg space-y-3 border border-muted-foreground/20"
                >
                  <h3 className="font-semibold text-lg">{reservation.restaurantId.name}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(reservation.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatTime(reservation.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {reservation.amountOfPeople}{' '}
                        {reservation.amountOfPeople === 1 ? 'pessoa' : 'pessoas'}
                      </span>
                    </div>
                    {reservation.tableNumber && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Mesa:</span>
                        <span>{reservation.tableNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`capitalize ${
                        reservation.status === 'confirmada' ? 'text-green-600' :
                        reservation.status === 'pendente' ? 'text-yellow-600' :
                        reservation.status === 'cancelada' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm">
                      <strong>Nome:</strong> {reservation.name}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {reservation.email}
                    </p>
                  </div>

                  {reservation?.checkedIn ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium justify-center py-2">
                      <CheckCircle className="w-5 h-5" /> 
                      <span>Check-in já realizado!</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleCheckIn(reservation._id)}
                      disabled={loading}
                      className="w-full mt-2"
                    >
                      {loading ? 'Realizando check-in...' : 'Realizar Check-in'}
                    </Button>
                  )}
                  {/* {confirmedId === reservation._id ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium justify-center py-2">
                      <CheckCircle className="w-5 h-5" /> 
                      <span>Reserva Confirmada!</span>
                    </div>
                  ) : reservation.status === 'pendente' ? (
                    <Button
                      onClick={() => handleConfirm(reservation._id)}
                      disabled={loading}
                      className="w-full mt-2"
                    >
                      {loading ? 'Confirmando...' : 'Confirmar Reserva'}
                    </Button>
                  ) : reservation.status === 'confirmada' ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium justify-center py-2">
                      <CheckCircle className="w-5 h-5" /> 
                      <span>Já Confirmada</span>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-muted-foreground text-sm">
                      Esta reserva não pode ser confirmada
                    </div>
                  )} */}
                </div>
              ))}

              <Button 
                variant="outline" 
                onClick={loadReservations}
                className="w-full"
              >
                Recarregar Reservas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
