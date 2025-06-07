'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Mesa {
  id: string;
  nome: string;
  capacidade: number;
}

interface TableModalProps {
  aberta: boolean;
  aoFechar: () => void;
  aoSalvar: (mesa: Mesa) => void;
  mesaInicial: Mesa | null;
}

export default function TableModal({
  aberta,
  aoFechar,
  aoSalvar,
  mesaInicial,
}: TableModalProps) {
  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState(1);

  useEffect(() => {
    if (mesaInicial) {
      setNome(mesaInicial.nome);
      setCapacidade(mesaInicial.capacidade);
    } else {
      setNome("");
      setCapacidade(1);
    }
  }, [mesaInicial]);

  const handleSubmit = () => {
    const mesa: Mesa = {
      id: mesaInicial?.id || "",
      nome,
      capacidade,
    };
    aoSalvar(mesa);
  };

  return (
    <Dialog open={aberta} onOpenChange={(open) => !open && aoFechar()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mesaInicial ? "Editar Mesa" : "Nova Mesa"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Mesa</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Mesa 01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacidade">Capacidade</Label>
            <Input
              id="capacidade"
              type="number"
              min={1}
              value={capacidade}
              onChange={(e) => setCapacidade(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>
            {mesaInicial ? "Salvar Alterações" : "Criar Mesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
