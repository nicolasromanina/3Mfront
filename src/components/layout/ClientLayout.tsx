import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useChatStore } from '../../store/chatStore';
import { Header } from './Header';

export const ClientLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();
  const { fetchMessages } = useChatStore();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
      fetchMessages(user.id);
    }
  }, [user, fetchNotifications, fetchMessages]);

  if (!isAuthenticated || user?.role !== 'client') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};