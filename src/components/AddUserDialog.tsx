'use client'

import { useState, useEffect } from "react";
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

interface AddUserDialogProps {
  mode?: 'create' | 'edit';
  user?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: React.ReactNode;
}

export function AddUserDialog({ 
  mode = 'create', 
  user, 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  triggerButton
}: AddUserDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { addUser, updateUser } = useUser();
  
  // Usar open controlado se fornecido, senão usar estado interno
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  
  const { register, handleSubmit, reset, control, formState } = useForm<CreateUserDto>({
    defaultValues: {
      email: '',
      name: '',
      type: UserTypeEnum.WORKER,
    }
  });

  const { errors, isSubmitting } = formState;

  // Preencher formulário quando estiver em modo de edição
  useEffect(() => {
    if (mode === 'edit' && user && open) {
      reset({
        email: user.email,
        name: user.name,
        type: user.type,
      });
    } else if (mode === 'create' && open) {
      reset({
        email: '',
        name: '',
        type: UserTypeEnum.WORKER,
      });
    }
  }, [mode, user, open, reset]);

  const onSubmit = async (data: CreateUserDto) => {
    let success = false;
    
    if (mode === 'edit' && user) {
      success = await updateUser(user._id, data);
    } else {
      success = await addUser(data);
    }
    
    if (success) {
      setOpen(false);
      if (mode === 'create') {
        reset();
      }
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Atualize os dados do usuário abaixo.' 
              : 'Preencha os dados do novo usuário abaixo.'
            }
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
          {mode === 'edit' && (
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? (mode === 'edit' ? 'Atualizando...' : 'Adicionando...') 
              : (mode === 'edit' ? 'Atualizar Usuário' : 'Adicionar Usuário')
            }
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  // Se estiver em modo controlado (edit), renderizar apenas o conteúdo
  if (controlledOpen !== undefined) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  // Se estiver em modo não controlado (create), incluir o trigger
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
