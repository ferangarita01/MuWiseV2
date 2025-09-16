// src/hooks/use-unified-auth.tsx
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { createDatabaseClient, isUsingSupabase } from '@/lib/database/factory';
import { AuthUser } from '@/lib/database/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  refreshToken: () => Promise<string | null>;
  provider: 'firebase' | 'supabase';
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  getToken: async () => null,
  refreshToken: async () => null,
  provider: 'firebase'
});

export function UnifiedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<'firebase' | 'supabase'>('firebase');

  // Obtener el cliente de base de datos
  const db = createDatabaseClient();

  useEffect(() => {
    // Determinar el proveedor actual
    const currentProvider = isUsingSupabase() ? 'supabase' : 'firebase';
    setProvider(currentProvider);

    // Configurar listener de cambios de autenticación
    const unsubscribe = db.auth.onAuthStateChanged((userState) => {
      setUser(userState);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [db.auth]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await db.auth.signIn(email, password);
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [db.auth]);

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      const result = await db.auth.signUp(email, password, metadata);
      
      if (result.error) {
        return { success: false, error: result.error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [db.auth]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await db.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  }, [db.auth]);

  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      return await db.auth.getToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }, [db.auth]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      return await db.auth.refreshToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }, [db.auth]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      getToken, 
      refreshToken,
      provider
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUnifiedAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

// Hook de conveniencia para verificar si el usuario está autenticado
export const useAuth = () => {
  const { user, loading } = useUnifiedAuth();
  return { user, loading };
};

// Hook de conveniencia para obtener el proveedor actual
export const useAuthProvider = () => {
  const { provider } = useUnifiedAuth();
  return provider;
};
