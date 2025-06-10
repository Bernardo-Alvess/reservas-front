'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Users, MapPin } from "lucide-react";
import { Table, useTables } from "@/app/hooks/useTables";
import { TableData } from "../table.schema";
import { NewTableDialog } from "./NewTableDialog";

interface TableCardProps {
  table: any;
  onStatusChange: (id: number, status: Table["status"]) => void;
}

export const TableCard = ({ table, onStatusChange }: TableCardProps) => {
  const { addEditTable } = useTables();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "disponível":
        return "default";
      case "ocupada":
        return "destructive";
      case "reservada":
        return "secondary";
      case "manutenção":
        return "outline";
      default:
        return "outline";
    }
  };

  // const handleStatusAction = () => {
  //   switch (table.status) {
  //     case "disponível":
  //       onStatusChange(table.id, "ocupada");
  //       break;
  //     case "ocupada":
  //       onStatusChange(table.id, "disponível");
  //       break;
  //     case "manutenção":
  //       onStatusChange(table.id, "disponível");
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const getActionButtonText = () => {
  //   switch (table.status) {
  //     case "disponível":
  //       return "Marcar como Ocupada";
  //     case "ocupada":
  //       return "Liberar Mesa";
  //     case "reservada":
  //       return "Ver Reserva";
  //     case "manutenção":
  //       return "Finalizar Manutenção";
  //     default:
  //       return "Ação";
  //   }
  // };

  // const getActionButtonVariant = () => {
  //   switch (table.status) {
  //     case "disponível":
  //       return "default";
  //     case "ocupada":
  //       return "outline";
  //     case "reservada":
  //       return "secondary";
  //     case "manutenção":
  //       return "outline";
  //     default:
  //       return "outline";
  //   }
  // };

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Mesa {table.tableNumber}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {table.numberOfSeats} lugares
            </CardDescription>
          </div>
          {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button> */}
          <NewTableDialog onAddTable={() => {}} onEditTable={() => addEditTable(table, table._id)} editingTable={table} buttonType="icon" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={getStatusVariant(table.status)}>
            {table.status}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Localização:</span>
          <div className="flex items-center gap-1 text-sm font-medium">
            <MapPin className="h-3 w-3" />
            {table.location}
          </div>
        </div> */}
        
        <Separator />
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {}}
          >
            {'em desenvolvimento'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};