import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Client Pages
import { ClientLayout } from './components/layout/ClientLayout';
import { HomePage } from './pages/client/HomePage';
import { ServicesPage } from './pages/client/ServicesPage';
import { OrdersPage } from './pages/client/OrdersPage';
import { ChatPage } from './pages/client/ChatPage';
import { SupportPage } from './pages/client/SupportPage';
import { NewOrderPage } from './pages/client/NewOrderPage';
import { ProfilePage } from './pages/client/ProfilePage';
import { WishlistPage } from './pages/client/WishlistPage';
import { NotificationsPage } from './pages/client/NotificationsPage';
import { AnalyticsPage } from './pages/client/AnalyticsPage';
import { TemplatesPage } from './pages/client/TemplatesPage';

// Admin Pages
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminQuotes } from './pages/admin/AdminQuotes';
import { AdminClients } from './pages/admin/AdminClients';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminChat } from './pages/admin/AdminChat';
import { AdminStats } from './pages/admin/AdminStats';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminInventory } from './pages/admin/AdminInventory';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />

          {/* Client Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <ClientLayout />
            </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="new-order" element={<NewOrderPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="templates" element={<TemplatesPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/quotes" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminQuotes />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminClients />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminServices />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/chat" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminChat />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminStats />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminReports />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/inventory" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminInventory />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Redirect based on user role */}
          <Route path="*" element={
            <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />
          } />
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;