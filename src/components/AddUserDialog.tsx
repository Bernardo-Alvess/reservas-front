'use client'

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { CreateUserDto, UserTypeEnum, useUser } from "@/app/hooks/useUser";

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const { addUser } = useUser();
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateUserDto>({
    defaultValues: {
      email: '',
      name: '',
      type: UserTypeEnum.WORKER,
    }
  });

  const onSubmit = async (data: CreateUserDto) => {
    console.log('Dados do formulário:', data); // Para debug
    const success = await addUser(data);
    if (success) {
      setOpen(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo usuário abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name.message}</span>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email é obrigatório' })}
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email.message}</span>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Usuário</Label>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Tipo de usuário é obrigatório' }}
                render={({ field }) => (
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserTypeEnum.ADMIN}>Administrador</SelectItem>
                      <SelectItem value={UserTypeEnum.WORKER}>Funcionário</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <span className="text-sm text-red-500">{errors.type.message}</span>
              )}
            </div>
          </div> 
          <DialogFooter>
            <Button type="submit">Adicionar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
