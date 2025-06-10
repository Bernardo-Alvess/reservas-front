'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { TableData } from "../table.schema";

interface NewTableDialogProps {
  onAddTable: (table: Omit<TableData, "id">) => void;
}

export const NewTableDialog = ({ onAddTable }: NewTableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [seats, setSeats] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (tableNumber && seats && location) {
      onAddTable({
        tableNumber: tableNumber,
        numberOfSeats: seats,
        isReserved: false,
      });
      
      // Reset form
      setTableNumber("");
      setSeats("");
      setLocation("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Mesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Mesa</DialogTitle>
          <DialogDescription>
            Configure uma nova mesa no seu restaurante
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Número da Mesa</Label>
              <Input 
                id="tableNumber" 
                placeholder="Ex: 7"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats">Número de Lugares</Label>
              <Select value={seats} onValueChange={setSeats}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 lugares</SelectItem>
                  <SelectItem value="4">4 lugares</SelectItem>
                  <SelectItem value="6">6 lugares</SelectItem>
                  <SelectItem value="8">8 lugares</SelectItem>
                  <SelectItem value="10">10+ lugares</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a localização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Centro">Centro</SelectItem>
                <SelectItem value="Janela">Próximo à Janela</SelectItem>
                <SelectItem value="Varanda">Varanda</SelectItem>
                <SelectItem value="Sala VIP">Sala VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Adicionar Mesa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
