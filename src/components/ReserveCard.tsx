import { Calendar, Clock, Users, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Reserva, useReserve } from "@/app/hooks/useReserve";
import { Badge } from "./ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate, formatTime } from "@/lib/formatDate";

interface ReserveCardProps {
  reservation: Reserva;
  className?: string;
}

const ReserveCard = ({ 
  reservation, 
  className = ""
}: ReserveCardProps) => {

  const clientName = reservation.name;
  const clientEmail = reservation.email || reservation.clientId?.email || '';

  const { confirmOrCancelReserve } = useReserve();
  const queryClient = useQueryClient();

  const handleStatusChange = async (reserveId: string, mode: 'confirm' | 'cancel') => {
    await confirmOrCancelReserve(reserveId, 'restaurant', mode);
    queryClient.invalidateQueries({ queryKey: ['reserves'] });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "pending":
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "canceled":
      case "cancelada":
        return "bg-red-100 text-red-800";
      case "finished":
      case "finalizada":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendente";
      case "cancelled":
      case "canceled":
        return "Cancelada";
      case "finished":
        return "Finalizada";
      default:
        return status;
    }
  };

  return (
    <Card className={`hover-lift ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{clientName}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(reservation.startTime)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(reservation.startTime)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {reservation.amountOfPeople} pessoas
              </span>
              {reservation.table && (
                <span>Mesa {reservation.table.number}</span>
              )}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(reservation.status)}>
            {getStatusLabel(reservation.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <div>
      <CardContent className="pt-0">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            {clientEmail && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {clientEmail}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {(reservation.status.toLowerCase() === "pendente" || reservation.status.toLowerCase() === "confirmada") && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange(reservation._id, 'cancel')}
                >
                  Recusar
                </Button>
              </>
            )}
            {(reservation.status.toLowerCase() === "cancelada" && reservation.canceledBy !== "user") && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleStatusChange(reservation._id, 'confirm')}
              >
                Confirmar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      {reservation.canceledBy && (
        <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Cancelado pelo {reservation.canceledBy === "restaurant" ? "restaurante" : "cliente"}</span>
        </div>
        </CardContent>
      )}
      </div>

    </Card>
  );
};

export default ReserveCard;
