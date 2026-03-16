'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { ToastContainer } from '@/components/Toast';
import { ReactNode, useState } from 'react';

export function AllProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        {children}
        <ToastContainer />
      </NotificationsProvider>
    </QueryClientProvider>
  );
}
