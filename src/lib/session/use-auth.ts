'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/api/axios-server';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface AuthState {
  isLoggedIn: boolean | null;
  userData: UserData | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: null,
    userData: null,
    loading: true,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('/api/auth/me');
      const isLoggedIn = response.data.loggedIn;
      
      setAuthState({
        isLoggedIn,
        userData: response.data.user || null,
        loading: false,
      });
    } catch {
      setAuthState({
        isLoggedIn: false,
        userData: null,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
    
    // Listen for visibility change (user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup listeners on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAuth]);

  return {
    ...authState,
    checkAuth,
  };
} 
