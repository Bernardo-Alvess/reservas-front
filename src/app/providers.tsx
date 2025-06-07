'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';
import { ReactNode } from 'react';
import { UserProvider } from './context/user/userContext';
import { useUserContext } from './context/user/useUserContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CookiesProvider>
      <UserProvider>
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
      </UserProvider>
    </CookiesProvider>
  );
} 