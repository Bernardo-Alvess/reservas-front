'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye } from 'lucide-react';
import Sidemenu from '@/app/components/Sidemenu';
import UsuarioModal from './userModal';
import VerUsuarioModal from './viewUserModal';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'funcionario';
  senha: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nome: 'João Silva', email: 'joao@email.com', tipo: 'admin', senha: '123' },
    { id: '2', nome: 'Ana Costa', email: 'ana@email.com', tipo: 'funcionario', senha: '456' },
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);

  const handleSalvar = (usuario: Usuario) => {
    setUsuarios(prev => {
      const existe = prev.find(u => u.id === usuario.id);
      if (existe) {
        return prev.map(u => u.id === usuario.id ? usuario : u);
      } else {
        return [...prev, { ...usuario, id: Date.now().toString() }];
      }
    });
    setModalAberto(false);
    setUsuarioSelecionado(null);
  };

  const handleExcluir = (id: string) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
    setModalVisualizarAberto(false);
  };

  return (
    <div className="flex h-screen">
      <Sidemenu type={'admin'} />
      <main className="flex-1 p-6 space-y-6 overflow-auto bg-zinc-100">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Usuários</h1>
          <Button onClick={() => { setModalAberto(true); setUsuarioSelecionado(null); }}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map(usuario => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.tipo}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUsuarioSelecionado(usuario);
                          setModalVisualizarAberto(true);
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

        <UsuarioModal
          aberta={modalAberto}
          aoFechar={() => { setModalAberto(false); setUsuarioSelecionado(null); }}
          aoSalvar={handleSalvar}
          usuarioInicial={usuarioSelecionado}
        />

        <VerUsuarioModal
          aberta={modalVisualizarAberto}
          usuario={usuarioSelecionado}
          aoFechar={() => setModalVisualizarAberto(false)}
          aoExcluir={handleExcluir}
        />
      </main>
    </div>
  );
}
