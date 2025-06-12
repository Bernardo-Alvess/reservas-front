'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Phone, Mail, X, Navigation, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useReserve } from "@/app/hooks/useReserve";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatTime } from "@/lib/formatDate";

const MyReservations = () => {
  const { getReservesForUser, confirmOrCancelReserve } = useReserve();
  const [filter, setFilter] = useState<"todas" | "pendente" | "confirmada" | "cancelada">("todas");

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => getReservesForUser(),
  });

  console.log(reservations)


  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "cancelada": return "bg-red-100 text-red-800";
      case "concluída": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmada": return "Confirmada";
      case "pendente": return "Pendente";
      case "cancelada": return "Cancelada";
      case "concluída": return "Concluída";
      default: return status;
    }
  };

  const handleConfirmOrCancelReserve = (id: string, restaurantName: string, mode: 'confirm' | 'cancel') => {
    confirmOrCancelReserve(id, 'client', mode);
    toast.success(`Reserva no ${restaurantName} ${mode === 'cancel' ? 'cancelada' : 'confirmada'} com sucesso`);
  };

  const canCancelReservation = (reservation: any) => {
    return reservation.status === "pendente" || reservation.status === "confirmada";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Minhas Reservas</h1>
            <p className="text-muted-foreground">
              Gerencie suas reservas e acompanhe o status
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "todas", label: "Todas" },
              { key: "pendente", label: "Pendentes" },
              { key: "confirmada", label: "Confirmadas" },
              { key: "cancelada", label: "Canceladas" }
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.key as any)}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>

          {reservations?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
                <p className="text-muted-foreground">
                  {filter === "todas" 
                    ? "Você ainda não fez nenhuma reserva."
                    : `Você não tem reservas com status "${filter}".`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reservations?.map((reservation: any) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-48 md:h-auto h-full">
                      <img
                        src={'https://plus.unsplash.com/premium_photo-1679503585289-c02467981894?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                        alt={reservation.restaurantName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {reservation.restaurantId.name}
                          </h3>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(reservation.status)}>
                            {getStatusText(reservation.status)}
                          </Badge>
                          {!reservation.restaurantConfirmed && reservation.status !== "cancelada" && (
                            <Badge variant="outline" className="text-xs">
                              Aguardando confirmação
                            </Badge>
                          )}
                          {reservation.restaurantConfirmed && reservation.status === "confirmada" && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Confirmada pelo restaurante
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Reservation Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {format(new Date(reservation.startTime), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{formatTime(reservation.startTime)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {reservation.amountOfPeople} {reservation.amountOfPeople === 1 ? 'pessoa' : 'pessoas'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{reservation.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        {canCancelReservation(reservation) ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <X className="w-4 h-4 mr-2" />
                                Cancelar Reserva
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja cancelar sua reserva no {reservation.restaurantName}? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Manter Reserva</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleConfirmOrCancelReserve(reservation.id, reservation.restaurantName, 'cancel')}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sim, Cancelar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ): (
                      <Button variant="default" size="sm">
                          <Check className="w-4 h-4 mr-2" />
                          Confirmar Reserva
                        </Button>
                        )}
 
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReservations;