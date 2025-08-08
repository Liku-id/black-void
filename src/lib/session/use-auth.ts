'use client';

import { useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { authAtom } from '@/store';
import axios from '@/lib/api/axios-client';

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  const checkAuth = useCallback(async () => {
    setAuth(prev => ({ ...prev, loading: true }));
    try {
      const res = await axios.get('/api/auth/me');
      setAuth({
        isLoggedIn: res.data.loggedIn,
        userData: res.data.user || null,
        loading: false,
      });
    } catch {
      setAuth({ isLoggedIn: false, userData: null, loading: false });
    }
  }, [setAuth]);

  // Setter manual
  const setAuthUser = useCallback(
    (user: any) => {
      setAuth({
        isLoggedIn: true,
        userData: user,
        loading: false,
      });
    },
    [setAuth]
  );

  useEffect(() => {
    if (auth.isLoggedIn === null) {
      checkAuth();
    }
  }, [auth.isLoggedIn, checkAuth]);

  return { ...auth, checkAuth, setAuthUser };
}
