import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password') {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      register: async (userData) => {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        
        // En réalité, on ajouterait l'utilisateur à la base de données
        set({ user: newUser, isAuthenticated: true });
        return true;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);