'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Liff } from '@line/liff';

interface LIFFContextType {
  liff: Liff | null;
  isLoggedIn: boolean;
  profile: {
    userId: string;
    displayName: string;
    pictureUrl?: string;
  } | null;
  error: Error | null;
  isLoading: boolean;
  isReady: boolean;
}

const LIFFContext = createContext<LIFFContextType>({
  liff: null,
  isLoggedIn: false,
  profile: null,
  error: null,
  isLoading: true,
  isReady: false,
});

export const useLIFFContext = () => useContext(LIFFContext);

export function LIFFProvider({ children }: { children: ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LIFFContextType['profile']>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLiff = async () => {
      try {
        // ตรวจสอบว่าอยู่ในหน้าลงทะเบียนหรือไม่
        const isRegisterPage = window.location.pathname.includes('/register');
        
        // เลือก LIFF ID ตามหน้า
        const liffID = isRegisterPage 
          ? process.env.NEXT_PUBLIC_LIFF_ID_REGISTOR 
          : process.env.NEXT_PUBLIC_LIFF_ID_CATEGORIES;
        
        if (!liffID) {
          throw new Error('LIFF ID is required');
        }

        const { liff } = await import('@line/liff');
        await liff.init({ liffId: liffID });

        setLiffObject(liff);
        
        const loggedIn = liff.isLoggedIn();
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          const profile = await liff.getProfile();
          setProfile({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
          });
        }
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize LIFF'));
        console.error('LIFF initialization failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  return (
    <LIFFContext.Provider value={{ 
      liff: liffObject, 
      isLoggedIn, 
      profile, 
      error, 
      isLoading,
      isReady
    }}>
      {children}
    </LIFFContext.Provider>
  );
}