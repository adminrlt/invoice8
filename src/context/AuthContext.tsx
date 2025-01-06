import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../lib/api/auth';
import { supabase } from '../lib/supabase';
import { refreshSession } from '../lib/api/auth/refresh';
import type { AuthUser } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  refreshAuth: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  const updateAuthState = async (session: any | null) => {
    try {
      if (session?.user) {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error updating auth state:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const session = await refreshSession();
      await updateAuthState(session);
    } catch (error) {
      console.error('Auth refresh error:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAuthState(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};