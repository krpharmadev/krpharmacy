'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamic import AppContextProvider with SSR disabled
const AppContextProvider = dynamic(
  () => import('@/contexts/AppContext').then(mod => mod.AppContextProvider),
  { ssr: false }
);

export function ClientProvider({ children }: { children: ReactNode }) {
  return <AppContextProvider>{children}</AppContextProvider>;
} 