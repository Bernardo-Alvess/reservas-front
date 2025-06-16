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
import { useForm } from "react-hook-form";
import { CreateUserDto, UserTypeEnum } from "@/app/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

interface AddUserDialogProps {
  onAddUser: (data: CreateUserDto) => Promise<boolean>;
}

export function AddUserDialog({ onAddUser }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserDto>({
    defaultValues: {
      email: '',
      name: '',
      type: UserTypeEnum.WORKER,
      password: '',
    }
  });

  const onSubmit = async (data: CreateUserDto) => {
    console.log(data)
    const success = await onAddUser(data);
    if (success) {
      setOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register('name')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Usuário</Label>
              <Select
                defaultValue={UserTypeEnum.WORKER}
                onValueChange={(value) => register('type').onChange({ target: { value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserTypeEnum.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserTypeEnum.WORKER}>Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Senha é obrigatória' })}
              />
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password.message}</span>
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
