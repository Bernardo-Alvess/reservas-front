'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Reserva {
  id: string;
  cliente: string;
  data: string;
  horario: string;
  pessoas: number;
  status: string;
}

interface ModalProps {
  aberta: boolean;
  reserva: Reserva | null;
  aoFechar: () => void;
  aoConfirmar: (id: string) => void;
  aoNegar: (id: string) => void;
}

export default function VerReservaModal({
  aberta,
  reserva,
  aoFechar,
  aoConfirmar,
  aoNegar,
}: ModalProps) {
  if (!reserva) return null;

  return (
    <Dialog open={aberta} onOpenChange={aoFechar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Reserva</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Cliente:</strong> {reserva.cliente}</p>
          <p><strong>Data:</strong> {reserva.data}</p>
          <p><strong>Horário:</strong> {reserva.horario}</p>
          <p><strong>Pessoas:</strong> {reserva.pessoas}</p>
          <p><strong>Status:</strong> {reserva.status}</p>
        </div>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="destructive" onClick={() => aoNegar(reserva.id)}>Negar</Button>
          <Button onClick={() => aoConfirmar(reserva.id)}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
