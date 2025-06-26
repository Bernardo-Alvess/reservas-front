'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX } from "lucide-react";
import { AddUserDialog } from "@/components/AddUserDialog";
import { UserCard } from "@/components/UserCard";
import { UserTypeEnum, useUser } from "@/app/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import Sidemenu from '@/components/Sidemenu';
import { StatCard } from "@/components/StatCard";

const UsersPage = () => {
  const { getUsers, addUser, getUserStats } = useUser();

  const {data: users = [], isLoading, isError} = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const {data: stats, isLoading: isLoadingStats, isError: isErrorStats} = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats
  });

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

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg text-muted-foreground">Carregando usuários...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-red-600 font-semibold mb-4">
              Erro ao carregar os usuários. Tente novamente mais tarde.
            </div>
          )}

          {/* Stats Cards */}
          {!isLoading && !isError && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total de Usuários"
                  value={stats?.total}
                  description="usuários cadastrados"
                  icon={<Users className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoadingStats}
                  isError={isErrorStats}
                />

                <StatCard
                  title="Usuários Ativos"
                  value={stats?.activeUsers}
                  description="usuários ativos"
                  icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoadingStats}
                  isError={isErrorStats}
                />

                <StatCard
                  title="Administradores"
                  value={stats?.adminUsers}
                  description="administradores"
                  icon={<Badge variant="default" className="h-4 px-2 text-xs">Admin</Badge>}
                  isLoading={isLoadingStats}
                  isError={isErrorStats}
                />

                <StatCard
                  title="Usuários Inativos"
                  value={stats?.inactiveUsers}
                  description="usuários inativos"
                  icon={<UserX className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoadingStats}
                  isError={isErrorStats}
                />
              </div>
              
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                      {users.map((user: any) => (
                        <UserCard
                          key={user._id}
                          user={user}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UsersPage;