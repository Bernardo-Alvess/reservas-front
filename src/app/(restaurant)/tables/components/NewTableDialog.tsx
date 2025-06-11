'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { TableData } from "../table.schema";
import { useTables } from "@/app/hooks/useTables";
import { FormProvider } from "react-hook-form";

interface NewTableDialogProps {
  editingTable?: any;
  onAddTable?: (table: Omit<TableData, "id">) => void;
  // onEditTable?: (table: TableData, _id: string) => void;
  buttonType?: 'button' | 'icon'
}

export const NewTableDialog = ({ editingTable, buttonType = 'button' }: NewTableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { methods, addEditTable } = useTables();

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = methods;

  const isEditing = !!editingTable;

  useEffect(() => {
    if (editingTable && isOpen) {
      setValue("tableNumber", editingTable.tableNumber?.toString() || "");
      setValue("numberOfSeats", editingTable.numberOfSeats?.toString() || "");
      reset(editingTable);
    } else if (!isEditing && isOpen) {
      reset({
        tableNumber: "",
        numberOfSeats: 0,
      });
    }
  }, [editingTable, isOpen, isEditing, reset, setValue])


  const onSubmit = async (data: TableData) => {
    console.log(data)
    try {
      if (isEditing && editingTable) {
        await addEditTable(data, editingTable._id);
      } else {
        await addEditTable(data);
      }
      
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro no formulário:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {buttonType === 'icon' ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="lg" className="gap-2">
            <span>Nova Mesa</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Mesa' : 'Adicionar Nova Mesa'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações da mesa' : 'Configure uma nova mesa no seu restaurante'}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Número da Mesa</Label>
                <Input 
                  id="tableNumber" 
                  placeholder="Ex: 7"
                  {...register("tableNumber")}
                />
                {errors.tableNumber && (
                  <p className="text-sm text-red-500">{errors.tableNumber.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfSeats">Número de Lugares</Label>
                <Input 
                  id="numberOfSeats" 
                  placeholder="Ex: 2"
                  type="number"
                  {...register("numberOfSeats", { valueAsNumber: true })}
                />
                {errors.numberOfSeats && (
                  <p className="text-sm text-red-500">{errors.numberOfSeats.message}</p>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
            >
              {isEditing ? "Atualizar Mesa" : "Adicionar Mesa"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
