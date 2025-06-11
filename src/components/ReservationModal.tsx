'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { useReserve } from "@/app/hooks/useReserve";
import { Calendar } from "./ui/calendar";
import { Controller } from "react-hook-form";
import { useUserContext } from "@/app/context/user/useUserContext";

interface ReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: {
    id: string;
    name: string;
    image: string;
  };
}

export const ReservationModal = ({ open, onOpenChange, restaurant }: ReservationModalProps) => {
  const { methods, createReserve } = useReserve();
  const { handleSubmit, control, formState: { errors }, reset } = methods;
  const [date, setDate] = useState<Date>();
  const {user} = useUserContext();

  const timeSlots = [
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
  ];

  const onSubmit = async (data: any) => {
    if (!date) {
      toast.error("Por favor, selecione uma data");
      return;
    }

    if (!data.startTime) {
      toast.error("Por favor, selecione um horário");
      return;
    }

    try {
      const [hours, minutes] = data.startTime.split(':');
      const startDateTime = new Date(date);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const reserveData = {
        restaurantId: restaurant.id,
        startTime: startDateTime.toISOString(),
        amountOfPeople: data.amountOfPeople,
        email: data.email,
      };

      const result = await createReserve(reserveData);
      
      if (result === 'Reserva criada com sucesso') {
        toast.success(result);
        reset();
        setDate(undefined);
        onOpenChange(false);
      } else {
        toast.error(result);
      }
    } catch (error) {
      toast.error("Erro ao criar reserva");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fazer Reserva</DialogTitle>
          <DialogDescription>
            Faça sua reserva no {restaurant.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => setDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Horário</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.startTime && (
                <span className="text-sm text-red-500">{errors.startTime.message as string}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Número de pessoas</Label>
            <Controller
              name="amountOfPeople"
              control={control}
              render={({ field }) => (
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                  <SelectTrigger>
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'pessoa' : 'pessoas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.amountOfPeople && (
              <span className="text-sm text-red-500">{errors.amountOfPeople.message as string}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  value={ user ? user.email : field.value}
                  onChange={field.onChange}
                  placeholder="seu@email.com"
                  disabled={!!user}
                  required
                />
              )}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message as string}</span>
            )}
          </div>

          <Button type="submit" className="w-full">
            Confirmar Reserva
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
