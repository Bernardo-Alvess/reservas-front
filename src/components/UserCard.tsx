import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, UserCheck, UserX, Mail, Edit } from "lucide-react";
import { UserTypeEnum, useUser } from "@/app/hooks/useUser";
import { HoverTooltip } from "@/components/ui/hover-tooltip";
import { AddUserDialog } from "@/components/AddUserDialog";
import { useState } from "react";

interface UserCardProps {
  user: any;
}

export const UserCard = ({ user }: UserCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { updateUserStatus, updateUserRole, deleteUser } = useUser();

  const handleStatusToggle = () => {
    updateUserStatus(user._id);
  };

  const handleRoleChange = () => {
    const newRole = user.type === "admin" ? UserTypeEnum.WORKER : UserTypeEnum.ADMIN;
    updateUserRole(user._id, newRole);
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUser(user._id);
    }
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  return (
    <>
      <Card className={`transition-all px-3 py-2 ${!user.active ? 'opacity-60' : ''} w-full min-w-[200px] max-w-full`}>
        <HoverTooltip content={user.email}>
          <span 
            className="text-sm cursor-help block"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg text-ellipsis overflow-hidden whitespace-nowrap">{user.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
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
                    Alterar para {user.type === "admin" ? "Funcionário" : "Administrador"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    Excluir usuário
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-col space-y-2">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-ellipsis overflow-hidden whitespace-nowrap min-w-0 flex-1">
                  {user.email}
                </span>
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
          </span>
        </HoverTooltip>
      </Card>
      
      <AddUserDialog
        mode="edit"
        user={user}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
};