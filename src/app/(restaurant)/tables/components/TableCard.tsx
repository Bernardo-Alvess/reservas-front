'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";
import { Table, useTables } from "@/app/hooks/useTables";
import { NewTableDialog } from "./NewTableDialog";

interface TableCardProps {
  table: any;
  onStatusChange?: (id: number, status: Table["status"]) => void;
}

export const TableCard = ({ table }: TableCardProps) => {
  const { updateTableStatus } = useTables();

  const handleStatusAction = async () => {
    try {
      await updateTableStatus(table._id, !table.isReserved);
    } catch (error) {
      console.error('Erro ao atualizar status da mesa:', error);
    }
  }

  const getActionButtonText = () => {
    if(table.isReserved) {
      return "Desbloquear Mesa"
    } else {
      return "Bloquear Mesa"
    }
  };

  const getActionButtonVariant = () => {
    if(table.isReserved) {
      return "secondary";
    } else {
      return "default";
    }
  };

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md p-2 py-2 max-w-96 w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Mesa {table.tableNumber}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {table.numberOfSeats} lugares
            </CardDescription>
          </div>
          <NewTableDialog editingTable={table} buttonType="icon" />
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
            variant={getActionButtonVariant()} 
            size="sm" 
            className="w-full"
            onClick={handleStatusAction}
          >
            {getActionButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};