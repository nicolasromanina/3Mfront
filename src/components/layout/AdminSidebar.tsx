import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  MessageCircle,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Package,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingBag, label: 'Commandes', path: '/admin/orders' },
  { icon: FileText, label: 'Devis', path: '/admin/quotes' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: Settings, label: 'Services', path: '/admin/services' },
  { icon: Package, label: 'Stocks', path: '/admin/inventory' },
  { icon: MessageCircle, label: 'Messages', path: '/admin/chat' },
  { icon: BarChart3, label: 'Statistiques', path: '/admin/stats' },
  { icon: TrendingUp, label: 'Rapports', path: '/admin/reports' }
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-gray-900 text-white min-h-screen p-4 flex flex-col transition-transform duration-300 ease-in-out z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:w-64
        fixed w-80 max-w-[80vw]
      `}>
        {/* Logo */}
        <div className="mb-8 mt-12 lg:mt-0">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold">PrintPro</span>
          </div>
          <p className="text-gray-400 text-sm">Administration</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info et logout */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 px-4 py-2 mb-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium">{user?.name?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">Administrateur</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <Link
                  to="/admin/profile"
                  onClick={() => {
                    setShowUserMenu(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-t-lg"
                >
                  Mon profil
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => {
                    setShowUserMenu(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Paramètres
                </Link>
                <hr className="border-gray-700" />
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-b-lg"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};