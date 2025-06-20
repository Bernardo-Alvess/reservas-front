'use client'

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useReserve } from "@/app/hooks/useReserve";
import { Calendar } from "./ui/calendar";
import { Controller } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface WorkHour {
  day: string;
  open: string;
  close: string;
}

interface ReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: {
    id: string;
    name: string;
    workHours?: WorkHour[];
  };
}

export const ReservationModal = ({ open, onOpenChange, restaurant }: ReservationModalProps) => {
  const { methods, createReserve } = useReserve();
  const { handleSubmit, control, formState: { errors }, reset } = methods;
  const [date, setDate] = useState<Date>();

  // Mapeamento de dias da semana (0 = Domingo, 1 = Segunda, etc.)
  const dayMap = {
    'SUNDAY': 0,
    'MONDAY': 1,
    'TUESDAY': 2,
    'WEDNESDAY': 3,
    'THURSDAY': 4,
    'FRIDAY': 5,
    'SATURDAY': 6
  };

  // Função para obter os dias em que o restaurante funciona
  const getWorkingDays = useMemo(() => {
    if (!restaurant.workHours) return [];
    return restaurant.workHours.map(wh => dayMap[wh.day.toUpperCase() as keyof typeof dayMap]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant.workHours]);

  // Função para verificar se uma data é válida (restaurante aberto)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;
    
    if (!restaurant.workHours || restaurant.workHours.length === 0) return false;
    
    const dayOfWeek = date.getDay();
    return !getWorkingDays.includes(dayOfWeek);
  };

  const getAvailableTimeSlots = useMemo(() => {
    if (!date || !restaurant.workHours) {
      // Horários padrão se não há data selecionada ou horários de funcionamento
      return ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
    }

    const dayOfWeek = date.getDay();
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const selectedDay = dayNames[dayOfWeek];

    const workHour = restaurant.workHours.find(wh => wh.day.toUpperCase() === selectedDay);

    if (!workHour) return [];

    const timeSlots = [];
    const [openHour, openMinute] = workHour.open.split(':').map(Number);
    let [closeHour, closeMinute] = workHour.close.split(':').map(Number);
    
    if(closeHour + closeMinute == 0 ) {
      closeHour = 24
      closeMinute = 0
    }

    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    const lastReservationTime = closeTime - 60;
    
    for (let time = openTime; time <= lastReservationTime; time += 30) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
    
    return timeSlots;
  }, [date, restaurant.workHours]);

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
        name: data.name,
        notes: data.notes || undefined,
      };

      const result = await createReserve(reserveData);
      
      if (result) {
        reset();
        methods.reset()
        setDate(undefined);
        onOpenChange(false);
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
                    onSelect={setDate}
                    disabled={isDateDisabled}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {date && getAvailableTimeSlots.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Restaurante fechado neste dia
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Horário</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={!date || getAvailableTimeSlots.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={!date ? "Selecione uma data primeiro" : "Selecionar horário"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTimeSlots.map((time) => (
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
              {date && getAvailableTimeSlots.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Horários disponíveis para reserva
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome completo</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Nome completo"
                />
              )}
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name.message as string}</span>
            )}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email para contato:</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="seu@email.com"
                  required
                />
              )}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message as string}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Alguma observação?</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input
                  id="notes"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Aniversário, etc."
                />
              )}
            />
            {errors.notes && (
              <span className="text-sm text-red-500">{errors.notes.message as string}</span>
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
