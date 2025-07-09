import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { OrderCard } from '../../components/orders/OrderCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, fetchOrders, loading } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchOrders(user.id);
    }
  }, [user, fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) || 
                         order.items.some(item => item.service.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'devis', label: 'Devis' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'terminee', label: 'Terminée' },
    { value: 'livree', label: 'Livrée' },
    { value: 'annulee', label: 'Annulée' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
        <p className="text-gray-600 mt-2">
          Suivez l'état de vos commandes et téléchargez vos documents
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Rechercher une commande..."
            icon={<Search className="w-5 h-5 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
          <p className="text-gray-400 mt-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos filtres' 
              : 'Vous n\'avez pas encore passé de commande'}
          </p>
        </div>
      )}
    </div>
  );
};