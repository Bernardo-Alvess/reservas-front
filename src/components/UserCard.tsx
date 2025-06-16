import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, Calendar, UserCheck, UserX } from "lucide-react";

interface UserCardProps {
  user: any;
  onUpdateStatus: (id: number) => void;
  onUpdateRole: (id: number, role: any) => void;
  onDelete: (id: number) => void;
}

export const UserCard = ({ user, onUpdateStatus, onUpdateRole, onDelete }: UserCardProps) => {
  const handleStatusToggle = () => {
    onUpdateStatus(user._id);
    // toast.success(`Usuário ${user.active ? 'desativado' : 'ativado'} com sucesso!`);
  };

  const handleRoleChange = () => {
    const newRole = user.role === "admin" ? "worker" : "admin";
    onUpdateRole(user._id, newRole);
    // toast.success(`Função alterada para ${newRole === "admin" ? "Administrador" : "Funcionário"}`);
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      onDelete(user._id);
      // toast.success("Usuário excluído com sucesso!");
    }
  };

  return (
    <Card className={`transition-all p-2 ${!user.isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">{user.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleStatusToggle}>
              {user.active ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Desativar
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Ativar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRoleChange}>
              Alterar para {user.role === "admin" ? "Funcionário" : "Administrador"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              Excluir usuário
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{user.email}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Badge variant={user.type === "admin" ? "default" : "secondary"}>
            {user.type === "admin" ? "Administrador" : "Funcionário"}
          </Badge>
          <Badge variant={user.active ? "default" : "destructive"}>
            {user.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};