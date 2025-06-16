'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX } from "lucide-react";
import { AddUserDialog } from "@/components/AddUserDialog";
import { UserCard } from "@/components/UserCard";
import { UserTypeEnum, useUser } from "@/app/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import Sidemenu from '@/app/components/Sidemenu';

const UsersPage = () => {
  const { getUsers, addUser, updateUserStatus, updateUserRole, deleteUser, getUserStats } = useUser();

  const {data: users, isLoading} = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const {data: stats, isLoading: isLoadingStats} = useQuery({
    queryKey: ['stats'],
    queryFn: getUserStats
  });

  if(isLoading) return <div>Carregando...</div>;

  return (
    <div className="flex h-screen">
      <Sidemenu />
      <main className="flex-1 p-6 space-y-6 overflow-auto bg-zinc-100">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
              <p className="text-muted-foreground">
                Gerencie os usuários do seu restaurante
              </p>
            </div>
            <AddUserDialog onAddUser={addUser} />
          </div>

          {/* Stats Cards */}
          {isLoadingStats || !stats ? (
            <div>Carregando...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  usuários cadastrados
                </p>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  usuários ativos
                </p>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                <Badge variant="default" className="h-4 px-2 text-xs">Admin</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.adminUsers}</div>
                <p className="text-xs text-muted-foreground">
                  administradores
                </p>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.workerUsers}</div>
                <p className="text-xs text-muted-foreground">
                  usuários inativos
                </p>
              </CardContent>
            </Card>
          </div>
          )}
          

          {/* Users List */}
          <Card className="p-2">
          <CardHeader>
              <CardTitle>Funcionários do Restaurante</CardTitle>
              <CardDescription>
                Lista de todos os usuários cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">Nenhum usuário cadastrado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Comece adicionando o primeiro usuário ao sistema.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {users.map((user: any) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      onUpdateStatus={() => updateUserStatus(user._id)}
                      onUpdateRole={() => updateUserRole(user._id, user.role === UserTypeEnum.ADMIN ? UserTypeEnum.WORKER : UserTypeEnum.ADMIN)}
                      onDelete={() => deleteUser(user._id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UsersPage;