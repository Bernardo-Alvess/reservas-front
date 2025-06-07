'use client';

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'funcionario';
  senha: string;
}

interface Props {
  aberta: boolean;
  aoFechar: () => void;
  aoSalvar: (usuario: Usuario) => void;
  usuarioInicial: Usuario | null;
}

export default function UsuarioModal({ aberta, aoFechar, aoSalvar, usuarioInicial }: Props) {
  const [usuario, setUsuario] = useState<Usuario>({
    id: '',
    nome: '',
    email: '',
    tipo: 'funcionario',
    senha: '',
  });

  useEffect(() => {
    if (usuarioInicial) setUsuario(usuarioInicial);
    else setUsuario({ id: '', nome: '', email: '', tipo: 'funcionario', senha: '' });
  }, [usuarioInicial]);

  const handleChange = (campo: keyof Usuario, valor: string) => {
    setUsuario(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <Dialog open={aberta} onOpenChange={aoFechar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{usuarioInicial ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={usuario.nome} onChange={e => handleChange('nome', e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={usuario.email} onChange={e => handleChange('email', e.target.value)} />
          </div>
          <div>
            <Label>Senha</Label>
            <Input type="password" value={usuario.senha} onChange={e => handleChange('senha', e.target.value)} />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={usuario.tipo} onValueChange={(value: 'admin' | 'funcionario') => handleChange('tipo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="funcionario">Funcionário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={() => aoSalvar(usuario)}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
