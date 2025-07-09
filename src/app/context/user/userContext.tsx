import { useUser } from '@/app/hooks/useUser';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  type: string;
  restaurant: Record<string, any>[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  invalidateUserCache: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const { getUserLogged } = useUser();
  const queryClient = useQueryClient();
  
  const fetchUser = async () => {
    const data = await getUserLogged();
    setUser(data);
    
    // Após buscar dados do usuário, notificar o contexto do restaurante
    if (data && data.restaurant && data.restaurant.length > 0) {
      // Enviar evento customizado para notificar o contexto do restaurante
      window.dispatchEvent(new CustomEvent('userDataLoaded', { detail: data }));
    }
  }

  const invalidateUserCache = () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    queryClient.invalidateQueries({ queryKey: ['tables'] });
  };
  
  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, invalidateUserCache }}>
      {children}
    </UserContext.Provider>
  );
}
