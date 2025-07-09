import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthInitializer = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
};