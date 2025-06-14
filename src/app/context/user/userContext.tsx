import { useUser } from '@/app/hooks/useUser';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

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
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const { getUserLogged } = useUser();
  
  const fetchUser = async () => {
    const data = await getUserLogged();
    setUser(data);
  }

  useEffect(() => {
    fetchUser();
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
