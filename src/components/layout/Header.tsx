import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, User, LogOut, ShoppingCart, ChevronDown, Heart, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useChatStore } from '../../store/chatStore';
import { useOrderStore } from '../../store/orderStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { unreadCount: notificationCount } = useNotificationStore();
  const { unreadCount: chatCount } = useChatStore();
  const { currentOrder } = useOrderStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { to: '/services', label: 'Services' },
    { to: '/orders', label: 'Mes Commandes' },
    { to: '/support', label: 'Support' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">PrintPro</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Panier */}
            <Link to="/new-order" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {currentOrder.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {currentOrder.length}
                </span>
              )}
            </Link>

            {/* Liste de souhaits */}
            <Link to="/wishlist" className="hidden sm:block relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Heart className="w-6 h-6" />
            </Link>

            {/* Notifications */}
            <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Link>

            {/* Chat */}
            <Link to="/chat" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              {chatCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {chatCount}
                </span>
              )}
            </Link>

            {/* User Menu Desktop */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-medium">{user?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mon Profil
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mes Commandes
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Liste de souhaits
                  </Link>
                  <Link 
                    to="/support" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Support
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setShowMobileMenu(false)}
              >
                Mon Profil
              </Link>
              <Link
                to="/wishlist"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setShowMobileMenu(false)}
              >
                Liste de souhaits
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour fermer les menus */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}
    </header>
  );
};