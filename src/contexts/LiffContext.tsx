'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Liff } from '@line/liff';
import { signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';

// Types
interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

interface LiffContextType {
  // LIFF Instance
  liff: Liff | null;
  
  // Authentication State
  isLoggedIn: boolean;
  isReady: boolean;
  isLoading: boolean;
  loading: boolean; // Alias for backward compatibility
  
  // User Data
  profile: Profile | null;
  idToken: string | null;
  
  // Error Handling
  error: Error | string | null;
  
  // Actions
  login: () => void;
  logout: () => void;
  loginWithNextAuth: () => Promise<void>;
  loginWithLineLiff: () => Promise<void>; // Alias for backward compatibility
}

// Default Context Value
const defaultContextValue: LiffContextType = {
  liff: null,
  isLoggedIn: false,
  isReady: false,
  isLoading: true,
  loading: true, // Alias
  profile: null,
  idToken: null,
  error: null,
  login: () => {},
  logout: () => {},
  loginWithNextAuth: async () => {},
  loginWithLineLiff: async () => {}, // Alias
};

// Create Context
const LiffContext = createContext<LiffContextType>(defaultContextValue);

// LIFF ID Mapping Function
const getLiffIdByPath = (pathname: string): string | undefined => {
  const pathMappings: Record<string, string | undefined> = {
    '/register': process.env.NEXT_PUBLIC_LIFF_ID_REGISTER || process.env.NEXT_PUBLIC_LIFF_ID_REGISTOR,
    '/liff/register': process.env.NEXT_PUBLIC_LIFF_ID_REGISTER || process.env.NEXT_PUBLIC_LIFF_ID_REGISTOR,
    '/orders': process.env.NEXT_PUBLIC_LIFF_ID_ORDERS,
    '/liff/orders': process.env.NEXT_PUBLIC_LIFF_ID_ORDERS,
    '/categories': process.env.NEXT_PUBLIC_LIFF_ID_CATEGORIES,
    '/liff/categories': process.env.NEXT_PUBLIC_LIFF_ID_CATEGORIES,
  };

  // Check exact matches first
  for (const [path, liffId] of Object.entries(pathMappings)) {
    if (pathname.includes(path)) {
      return liffId;
    }
  }

  // Fallback to categories LIFF ID
  return process.env.NEXT_PUBLIC_LIFF_ID_CATEGORIES;
};

// Provider Component
export function LiffProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // State Management
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Initialize LIFF
  useEffect(() => {
    const initLiff = async () => {
      // Skip initialization on server side
      if (typeof window === 'undefined') return;

      try {
        setIsLoading(true);
        setError(null);

        // Get LIFF ID based on current path
        const liffId = getLiffIdByPath(pathname);
        
        console.log(`LIFF Path: ${pathname}, Using LIFF ID: ${liffId}`);
        
        if (!liffId) {
          throw new Error(`LIFF ID is not configured for path: ${pathname}`);
        }

        // Dynamic import LIFF
        const { liff } = await import('@line/liff');
        
        // Initialize LIFF
        await liff.init({ liffId });
        setLiffObject(liff);

        // Check login status
        const loggedIn = liff.isLoggedIn();
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          // Get user profile and ID token
          const [userProfile, token] = await Promise.all([
            liff.getProfile(),
            Promise.resolve(liff.getIDToken())
          ]);

          setProfile({
            userId: userProfile.userId,
            displayName: userProfile.displayName,
            pictureUrl: userProfile.pictureUrl,
          });
          setIdToken(token);
        }

        setIsReady(true);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err : new Error('Failed to initialize LIFF');
        setError(errorMessage);
        console.error('LIFF initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, [pathname]);

  // Login Function
  const login = () => {
    if (typeof window === 'undefined' || !liffObject) return;
    
    if (!liffObject.isLoggedIn()) {
      const redirectUri = window.location.origin + window.location.pathname;
      console.log('Attempting LIFF login with redirectUri:', redirectUri);
      liffObject.login({ redirectUri });
    }
  };

  // Logout Function
  const logout = () => {
    if (typeof window === 'undefined' || !liffObject) return;
    
    try {
      liffObject.logout();
      
      // Reset state
      setIsLoggedIn(false);
      setProfile(null);
      setIdToken(null);
      
      // Reload page to ensure clean state
      window.location.reload();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // NextAuth Integration
  const loginWithNextAuth = async () => {
    if (typeof window === 'undefined' || !liffObject || !isLoggedIn) return;
    
    try {
      const token = liffObject.getIDToken();
      if (token) {
        await signIn('line-liff', {
          idToken: token,
          callbackUrl: '/', // Customize as needed
        });
      }
    } catch (err) {
      console.error('NextAuth login failed:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(`Failed to sign in with NextAuth: ${errorMessage}`));
    }
  };

  // Alias for backward compatibility
  const loginWithLineLiff = loginWithNextAuth;

  // Context Value
  const contextValue: LiffContextType = {
    liff: liffObject,
    isLoggedIn,
    isReady,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    profile,
    idToken,
    error,
    login,
    logout,
    loginWithNextAuth,
    loginWithLineLiff, // Alias for backward compatibility
  };

  return (
    <LiffContext.Provider value={contextValue}>
      {children}
    </LiffContext.Provider>
  );
}

// Custom Hook
export function useLiff() {
  const context = useContext(LiffContext);
  
  if (context === undefined) {
    throw new Error('useLiff must be used within a LiffProvider');
  }
  
  return context;
}

// Legacy hook for backward compatibility (with additional properties)
export function useLIFFContext() {
  const context = useContext(LiffContext);
  
  if (context === undefined) {
    throw new Error('useLIFFContext must be used within a LiffProvider');
  }
  
  // Return context with legacy property names for backward compatibility
  return {
    ...context,
    // Add any missing properties that the old context might have had
    liff: context.liff,
    isReady: context.isReady,
    isLoggedIn: context.isLoggedIn,
    profile: context.profile,
    error: context.error,
    isLoading: context.isLoading,
  };
}

// Export types for external use
export type { LiffContextType, Profile };