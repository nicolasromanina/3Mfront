import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, MessageCircle, Plus, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  const { notifications } = useNotificationStore();

  useEffect(() => {
    if (user) {
      fetchOrders(user.id);
    }
  }, [user, fetchOrders]);

  const recentOrders = orders.slice(0, 3);
  const recentNotifications = notifications.slice(0, 3);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'devis': return 'info';
      case 'en_attente': return 'warning';
      case 'en_cours': return 'info';
      case 'terminee': return 'success';
      case 'livree': return 'success';
      case 'annulee': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8">
      {/* Bienvenue */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour {user?.name} !
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenue sur votre espace client PrintPro. Gérez vos commandes et découvrez nos services.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button icon={<Plus className="w-5 h-5" />} as={Link} to="/services">
              Nouvelle commande
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total commandes</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'en_cours' || o.status === 'en_attente').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'terminee' || o.status === 'livree').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Commandes récentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
              <Link to="/orders" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                Voir tout
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Commande #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''} • {order.totalPrice.toFixed(2)}MGA
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                    <Link to={`/orders/${order.id}`}>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucune commande récente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications récentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <Button variant="ghost" size="sm">
                Tout marquer lu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map(notification => (
                <div key={notification.id} className={`p-4 border rounded-lg ${
                  notification.read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                }`}>
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {recentNotifications.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucune notification</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};