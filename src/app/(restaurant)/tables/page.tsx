'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from 'lucide-react';
import TableModal from './tableModal';
import Sidemenu from '@/app/components/Sidemenu';

interface Mesa {
  id: string;
  nome: string;
  capacidade: number;
}

export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([
    { id: '1', nome: 'Mesa 01', capacidade: 4 },
    { id: '2', nome: 'Mesa 02', capacidade: 2 },
  ]);

  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const handleSalvar = (mesa: Mesa) => {
    setMesas(prev => {
      const existe = prev.find(m => m.id === mesa.id);
      if (existe) {
        return prev.map(m => m.id === mesa.id ? mesa : m);
      } else {
        return [...prev, { ...mesa, id: Date.now().toString() }];
      }
    });
    setModalAberto(false);
    setMesaSelecionada(null);
  };

  return (
    <div className="flex h-screen">
      <Sidemenu/>

      <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mesas</h1>
          <Button onClick={() => { setModalAberto(true); setMesaSelecionada(null); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Mesa
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mesas.map((mesa) => (
                  <TableRow key={mesa.id}>
                    <TableCell>{mesa.nome}</TableCell>
                    <TableCell>{mesa.capacidade} pessoas</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => {
                        setMesaSelecionada(mesa);
                        setModalAberto(true);
                      }}>
                        <Pencil className="w-4 h-4 mr-1" /> Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <TableModal
          aberta={modalAberto}
          aoFechar={() => { setModalAberto(false); setMesaSelecionada(null); }}
          aoSalvar={() => {}}
          mesaInicial={mesaSelecionada}
        />
      </main>
    </div>
  );
}
