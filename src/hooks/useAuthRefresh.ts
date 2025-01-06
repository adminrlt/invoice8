import { useEffect } from 'react';
import { refreshSession } from '../lib/api/auth/refresh';
import { useAuth } from '../context/AuthContext';

export const useAuthRefresh = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Refresh session every 10 minutes
    const interval = setInterval(refreshSession, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);
};