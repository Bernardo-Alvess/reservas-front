'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'funcionario';
  senha: string;
}

interface Props {
  aberta: boolean;
  usuario: Usuario | null;
  aoFechar: () => void;
  aoExcluir: (id: string) => void;
}

export default function VerUsuarioModal({ aberta, usuario, aoFechar, aoExcluir }: Props) {
  if (!usuario) return null;

  return (
    <Dialog open={aberta} onOpenChange={aoFechar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Tipo:</strong> {usuario.tipo}</p>
          <p><strong>Senha:</strong> {usuario.senha}</p>
        </div>
        <DialogFooter className="flex justify-end pt-4">
          <Button variant="destructive" onClick={() => aoExcluir(usuario.id)}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
