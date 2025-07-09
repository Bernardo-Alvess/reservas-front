import { Reserva, useReserve } from "@/app/hooks/useReserve";
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Calendar, Check, Clock, Mail, Users, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { formatTime } from "@/lib/formatDate";
import { AlertDialogHeader, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface ClientReserveCardProps {
  reservation: Reserva
}

export const ClientReserveCard = ({ reservation }: ClientReserveCardProps) => {

  const { confirmOrCancelReserve } = useReserve();
  const queryClient = useQueryClient();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmada": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "cancelada": return "bg-red-100 text-red-800";
      case "concluída": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };  

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmada": return "Confirmada";
      case "pendente": return "Pendente";
      case "cancelada": return "Cancelada";
      case "concluída": return "Concluída";
      default: return status;
    }
  };

  const handleConfirmOrCancelReserve = async (id: string, restaurantName: string, mode: 'confirm' | 'cancel') => {
    try {
      await confirmOrCancelReserve(id, 'client', mode);
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success(`Reserva no ${restaurantName} ${mode === 'cancel' ? 'cancelada' : 'confirmada'} com sucesso`);
    } catch (error) {
      console.log(error)
      toast.error(`Erro ao ${mode === 'cancel' ? 'cancelar' : 'confirmar'} reserva`);
    }
  };

  const canCancelReservation = (reservation: Reserva) => {
    return reservation.status.toLowerCase() === "pendente" || reservation.status.toLowerCase() === "confirmada";
  };

  const canConfirmReservation = (reservation: Reserva) => {
    return reservation.status.toLowerCase() === "pendente" && !reservation.clientConfirmed;
  };

  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-48 md:h-auto h-full">
          <img
            src={reservation.restaurantId.profileImage.url}
            alt={reservation.restaurantId.name}
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
              {!reservation.restaurantConfirmed && reservation.status.toLowerCase() !== "cancelada" && (
                <Badge variant="outline" className="text-xs">
                  Aguardando confirmação do restaurante
                </Badge>
              )}
              {reservation.restaurantConfirmed && reservation.status.toLowerCase() === "confirmada" && (
                <Badge variant="outline" className="text-xs text-green-600">
                  Confirmada pelo restaurante
                </Badge>
              )}
              {!reservation.clientConfirmed && reservation.status.toLowerCase() === "pendente" && (
                <Badge variant="outline" className="text-xs text-yellow-600">
                  Aguardando sua confirmação
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
              {reservation.tableId && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Mesa:</span>
                  <span>{reservation.tableNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {canConfirmReservation(reservation) && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleConfirmOrCancelReserve(reservation._id, reservation.restaurantId.name, 'confirm')}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar Reserva
              </Button>
            )}
            
            {canCancelReservation(reservation) && (
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
                      Tem certeza que deseja cancelar sua reserva no {reservation.restaurantId.name}? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Manter Reserva</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleConfirmOrCancelReserve(reservation._id, reservation.restaurantId.name, 'cancel')}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sim, Cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Additional Info */}
          {reservation.canceledBy && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Cancelado pelo {reservation.canceledBy === "restaurant" ? "restaurante" : reservation.canceledBy === "user" ? "cliente" : "sistema pois passou da tolerância de 30 minutos"}
                  {reservation.canceledAt && (
                    <span className="ml-2">
                      em {format(new Date(reservation.canceledAt), "dd/MM/yyyy 'às' HH:mm")}
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}