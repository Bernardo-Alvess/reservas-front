import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { CreateRestaurantDto } from "@/types/restaurant";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DAYS_OF_WEEK = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

const CreateRestaurantDialog = ({ open, onOpenChange }: CreateRestaurantDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createRestaurant } = useRestaurant();

  const form = useForm<CreateRestaurantDto>({
    defaultValues: {
      name: "",
      phone: "",
      description: "",
      type: "",
      maxClients: 0,
      maxReservationTime: 0,
      address: {
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        zipCode: "",
        complement: ""
      },
      workHours: []
    },
  });

  const onSubmit = async (data: CreateRestaurantDto) => {
    setIsLoading(true);
    try {
      await createRestaurant(data);
      toast.success("Restaurante criado com sucesso!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.log(error)
      toast.error("Erro ao criar restaurante");
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleDayToggle = (day: string, checked: boolean) => {
    const newSelectedDays = checked
      ? [...selectedDays, day]
      : selectedDays.filter((d) => d !== day);
    setSelectedDays(newSelectedDays);
  
    const currentWorkHours = form.getValues("workHours") || [];
  
    if (checked) {
      form.setValue("workHours", [...currentWorkHours, { day, open: "", close: "" }]);
    } else {
      form.setValue("workHours", currentWorkHours.filter((wh) => wh.day !== day));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Restaurante</DialogTitle>
          <DialogDescription>
            Preencha as informações básicas do restaurante. As imagens podem ser adicionadas posteriormente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Restaurante</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Bella Vista" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do restaurante..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Culinária</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Italiana">Italiana</SelectItem>
                        <SelectItem value="Japonesa">Japonesa</SelectItem>
                        <SelectItem value="Brasileira">Brasileira</SelectItem>
                        <SelectItem value="Francesa">Francesa</SelectItem>
                        <SelectItem value="Steakhouse">Steakhouse</SelectItem>
                        <SelectItem value="Vegetariana">Vegetariana</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxClients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade Máxima</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="80" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxReservationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Máximo de Reserva (min)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="120" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua das Flores" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="01234-567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Loja 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Horários de Funcionamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                    />
                    <label
                      htmlFor={day}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day}
                    </label>
                  </div>
                ))}
              </div>

              {selectedDays?.map((day, index) => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`workHours.${index}.day`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{day}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`workHours.${index}.open`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abertura</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`workHours.${index}.close`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fechamento</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Restaurante"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRestaurantDialog;