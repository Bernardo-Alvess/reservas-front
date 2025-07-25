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
import { CreateRestaurantDto, WorkHoursDto } from "@/types/restaurant";
import { Checkbox } from "@/components/ui/checkbox";
import { reverseMapDay, mapDay } from "@/lib/mapDay";
import { useUserContext } from "@/app/context/user/useUserContext";
import { useRestaurantContext } from "@/app/context/selectedRestaurant/selectedRestaurantContext";

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

// Função para validar formato de hora (hh:mm)
const validateTimeFormat = (value: string) => {
    if (!value) return 'Horário é obrigatório';
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) {
        return 'Formato deve ser hh:mm (ex: 08:30, 18:45)';
    }
    return true;
};

// Função para validar horários de funcionamento
const validateWorkHours = (workHours: WorkHoursDto[]) => {
    if (!workHours || workHours.length === 0) {
        return 'Pelo menos um dia de funcionamento deve ser selecionado';
    }
    
    for (const wh of workHours) {
        const openValidation = validateTimeFormat(wh.open);
        const closeValidation = validateTimeFormat(wh.close);
        
        if (openValidation !== true) return openValidation;
        if (closeValidation !== true) return closeValidation;
    }
    
    return true;
};

// Função para aplicar máscara de telefone
const applyPhoneMask = (value: string): string => {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limitedDigits = digits.substring(0, 11);
  
  // Aplica a máscara baseada na quantidade de dígitos
  if (limitedDigits.length <= 2) {
    return limitedDigits;
  } else if (limitedDigits.length <= 7) {
    return limitedDigits.replace(/(\d{2})(\d+)/, '($1) $2');
  } else {
    return limitedDigits.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  }
};

const CreateRestaurantDialog = ({ open, onOpenChange }: CreateRestaurantDialogProps) => {
  const { createRestaurant } = useRestaurant();
  const { fetchUser, invalidateUserCache } = useUserContext();
  const { setSelectedRestaurant } = useRestaurantContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateRestaurantDto>({
    mode: 'onChange',
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

    // Validar horários de funcionamento
    const workHoursValidation = validateWorkHours(data.workHours);
    if (workHoursValidation !== true) {
        toast.error(workHoursValidation);
        setIsLoading(false);
        return;
    }

    try {
      const createdRestaurant = await createRestaurant(data);
      toast.success("Restaurante criado com sucesso!");
      
      // Invalidar cache do usuário para buscar dados atualizados
      invalidateUserCache();
      
      // Buscar dados atualizados do usuário
      await fetchUser();
      
      // Auto-selecionar o restaurante criado
      if (createdRestaurant && createdRestaurant._id) {
        setSelectedRestaurant(createdRestaurant._id);
        toast.success(`Restaurante "${createdRestaurant.name}" selecionado automaticamente!`);
      }
      
      onOpenChange(false);
      form.reset();
      setSelectedDays([]);
    } catch (error) {
      console.log(error)
      toast.error("Erro ao criar restaurante");
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleDayToggle = async (day: string, checked: boolean) => {
    const dayInEnglish = reverseMapDay(day);
    
    const newSelectedDays = checked
      ? [...selectedDays, dayInEnglish]
      : selectedDays.filter((d) => d !== dayInEnglish);
    setSelectedDays(newSelectedDays);
  
    const currentWorkHours = form.getValues("workHours") || [];
  
    if (checked) {
      form.setValue("workHours", [...currentWorkHours, { day: dayInEnglish, open: "", close: "" }]);
    } else {
      form.setValue("workHours", currentWorkHours.filter((wh) => wh.day !== dayInEnglish));
    }

    // Trigger validation para workHours
    await form.trigger("workHours");
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
                rules={{
                  required: 'Nome é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Nome deve ter no máximo 100 caracteres'
                  }
                }}
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
                rules={{
                  required: 'Telefone é obrigatório',
                  validate: (value) => {
                    const digits = value.replace(/\D/g, '');
                    if (digits.length < 10) {
                      return 'Telefone deve ter pelo menos 10 dígitos';
                    }
                    if (digits.length > 11) {
                      return 'Telefone deve ter no máximo 11 dígitos';
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(11) 99999-9999"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const maskedValue = applyPhoneMask(value);
                          field.onChange(maskedValue);
                        }}
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              rules={{
                required: 'Descrição é obrigatória',
                minLength: {
                  value: 10,
                  message: 'Descrição deve ter pelo menos 10 caracteres'
                },
                maxLength: {
                  value: 500,
                  message: 'Descrição deve ter no máximo 500 caracteres'
                }
              }}
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
                rules={{
                  required: 'Tipo de culinária é obrigatório'
                }}
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
                        <SelectItem value="Mexicana">Mexicana</SelectItem>
                        <SelectItem value="Chinesa">Chinesa</SelectItem>
                        <SelectItem value="Tailandesa">Tailandesa</SelectItem>
                        <SelectItem value="Indiana">Indiana</SelectItem>
                        <SelectItem value="Árabe">Árabe</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxClients"
                rules={{
                  required: 'Capacidade é obrigatória',
                  min: {
                    value: 1,
                    message: 'Capacidade deve ser pelo menos 1'
                  },
                  max: {
                    value: 1000,
                    message: 'Capacidade deve ser no máximo 1000'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade Máxima</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="80" 
                        min="1"
                        max="1000"
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
                rules={{
                  min: {
                    value: 30,
                    message: 'Tempo mínimo é 30 minutos'
                  },
                  max: {
                    value: 480,
                    message: 'Tempo máximo é 480 minutos (8 horas)'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Máximo de Reserva (min)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="120" 
                        min="30"
                        max="480"
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
                  rules={{
                    required: 'Rua é obrigatória',
                    minLength: {
                      value: 5,
                      message: 'Rua deve ter pelo menos 5 caracteres'
                    }
                  }}
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
                  rules={{
                    required: 'Número é obrigatório',
                    pattern: {
                      value: /^[0-9]+[A-Za-z]*$/,
                      message: 'Número inválido'
                    }
                  }}
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
                  rules={{
                    required: 'Bairro é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Bairro deve ter pelo menos 2 caracteres'
                    }
                  }}
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
                  rules={{
                    required: 'Cidade é obrigatória',
                    minLength: {
                      value: 2,
                      message: 'Cidade deve ter pelo menos 2 caracteres'
                    }
                  }}
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
                  rules={{
                    required: 'Estado é obrigatório',
                    pattern: {
                      value: /^[A-Z]{2}$/,
                      message: 'Estado deve ter 2 letras maiúsculas (ex: SP)'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="SP" 
                          maxLength={2}
                          style={{ textTransform: 'uppercase' }}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.zipCode"
                  rules={{
                    required: 'CEP é obrigatório',
                    pattern: {
                      value: /^\d{5}-?\d{3}$/,
                      message: 'CEP inválido. Use: 12345-678'
                    }
                  }}
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
                  rules={{
                    maxLength: {
                      value: 100,
                      message: 'Complemento deve ter no máximo 100 caracteres'
                    }
                  }}
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
                      checked={selectedDays.includes(reverseMapDay(day))}
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
                        <FormLabel>{mapDay(day)}</FormLabel>
                        <FormControl>
                          <Input {...field} value={mapDay(day)} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`workHours.${index}.open`}
                    rules={{
                      required: true,
                      validate: validateTimeFormat
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abertura</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            value={field.value || ""} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`workHours.${index}.close`}
                    rules={{
                      required: true,
                      validate: validateTimeFormat
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fechamento</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            value={field.value || ""} 
                          />
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