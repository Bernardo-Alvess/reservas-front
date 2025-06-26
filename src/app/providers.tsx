'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';
import { ReactNode } from 'react';
import { UserProvider } from './context/user/userContext';
import { RestaurantProvider } from './context/selectedRestaurant/selectedRestaurantContext';
import { Bounce, ToastContainer } from 'react-toastify';

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
    <body>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RestaurantProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="colored"
            transition={Bounce}
            />
            {children}
          </RestaurantProvider>
        </UserProvider>
      </QueryClientProvider>
    </CookiesProvider>
    </body>
  );
} 