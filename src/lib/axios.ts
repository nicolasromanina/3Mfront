import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState();
  
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs et les tokens expirés
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { tokens, logout } = useAuthStore.getState();
    
    if (error.response?.status === 401 && !originalRequest._retry && tokens?.refresh) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken: tokens.refresh
        });
        
        const { access, refresh } = response.data;
        useAuthStore.setState({ 
          tokens: { access, refresh } 
        });
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;