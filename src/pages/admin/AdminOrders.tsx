import React, { useEffect, useState } from 'react';
import { Search, Eye, FileText } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { Order } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const AdminOrders: React.FC = () => {
  const { orders, fetchOrders, updateOrderStatus, loading } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders(); // Récupère toutes les commandes pour l'admin
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) || 
                         order.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
  };


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
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
        <p className="text-gray-600 mt-2">
          Gérez et suivez toutes les commandes clients
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Rechercher par ID ou nom client..."
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

      {/* Tableau des commandes */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Services</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Montant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">#{order.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{order.client.name}</div>
                      <div className="text-sm text-gray-600">{order.client.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-gray-900">
                          {item.service.name} (x{item.quantity})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">
                      {order.totalPrice.toFixed(2)}MGA
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="rounded px-2 py-1 border border-gray-300 text-sm"
                    >
                      <option value="devis">Devis</option>
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="terminee">Terminée</option>
                      <option value="livree">Livrée</option>
                      <option value="annulee">Annulée</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                        Voir
                      </Button>
                      <Button variant="ghost" size="sm" icon={<FileText className="w-4 h-4" />}>
                        Facture
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
          <p className="text-gray-400 mt-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos filtres' 
              : 'Aucune commande disponible'}
          </p>
        </div>
      )}
    </div>
  );
};