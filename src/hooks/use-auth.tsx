// src/hooks/use-auth.tsx
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useRef, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    getToken: async () => null,
});

async function syncSession(user: User | null) {
  if (user) {
    try {
      const idToken = await user.getIdToken(true); // Force refresh
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to sync session cookie:', errorData.message);
      }
    } catch (error) {
      console.error('Error getting ID token or syncing session cookie:', error);
    }
  } else {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete session cookie:', error);
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isSyncing = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userState) => {
      // This is a simple semaphore to prevent race conditions on fast reloads
      if (isSyncing.current) return;
      
      isSyncing.current = true;
      setLoading(true);

      setUser(userState);
      
      // Sync the server-side session cookie
      await syncSession(userState);
      
      setLoading(false);
      isSyncing.current = false;
    });

    return () => unsubscribe();
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
      if (!auth.currentUser) return null;
      try {
        return await auth.currentUser.getIdToken();
      } catch (error) {
        console.error("Error getting ID token:", error);
        return null;
      }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
