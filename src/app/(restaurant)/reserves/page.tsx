'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from 'lucide-react';
import Sidemenu from '@/app/components/Sidemenu';
import VerReservaModal from './reserveModal';

interface Reserva {
  id: string;
  cliente: string;
  data: string;
  horario: string;
  pessoas: number;
  status: 'PENDENTE' | 'CONFIRMADA' | 'RECUSADA';
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: '1',
      cliente: 'João Silva',
      data: new Date().toISOString().split('T')[0],
      horario: '19:00',
      pessoas: 2,
      status: 'PENDENTE',
    },
    {
      id: '2',
      cliente: 'Maria Souza',
      data: new Date().toISOString().split('T')[0],
      horario: '20:00',
      pessoas: 4,
      status: 'CONFIRMADA',
    },
  ]);

  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const totalHoje = reservas.filter(r => r.data === new Date().toISOString().split('T')[0]).length;

  const handleConfirmar = (id: string) => {
    setReservas(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'CONFIRMADA' } : r)
    );
    setModalAberto(false);
  };

  const handleNegar = (id: string) => {
    setReservas(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'RECUSADA' } : r)
    );
    setModalAberto(false);
  };

  return (
    <div className="flex h-screen">
      <Sidemenu type={'admin'} />
      <main className="flex-1 p-6 space-y-6 overflow-auto bg-zinc-100">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reservas</h1>
          <span className="text-zinc-600">Total hoje: {totalHoje}</span>
        </div>

        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Pessoas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservas.map(reserva => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.cliente}</TableCell>
                    <TableCell>{reserva.data}</TableCell>
                    <TableCell>{reserva.horario}</TableCell>
                    <TableCell>{reserva.pessoas}</TableCell>
                    <TableCell>{reserva.status}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReservaSelecionada(reserva);
                          setModalAberto(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" /> Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <VerReservaModal
          aberta={modalAberto}
          reserva={reservaSelecionada}
          aoFechar={() => setModalAberto(false)}
          aoConfirmar={handleConfirmar}
          aoNegar={handleNegar}
        />
      </main>
    </div>
  );
}
