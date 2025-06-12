import { Calendar, Clock, Users, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Reserva } from "@/app/(restaurant)/reserves/page";
import { Badge } from "./ui/badge";

const ReserveCard = ({ 
  reservation, 
  onStatusChange, 
  getStatusColor, 
  getStatusLabel, 
  formatDate, 
  formatTime,
  className = ""
}: {
  reservation: Reserva;
  onStatusChange: (id: string, mode: 'confirm' | 'cancel') => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
  className?: string;
}) => {
  const clientName = reservation.name;
  const clientEmail = reservation.email || reservation.clientId?.email || '';

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
            {reservation.status.toLowerCase() === "pending" && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onStatusChange(reservation._id, 'cancel')}
                >
                  Recusar
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onStatusChange(reservation._id, 'confirm')}
                >
                  Confirmar
                </Button>
              </>
            )}
            {reservation.status.toLowerCase() === "confirmed" && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusChange(reservation._id, 'cancel')}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReserveCard;
