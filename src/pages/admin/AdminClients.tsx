import React, { useEffect, useState } from 'react';
import { Search, User, Mail, Phone, MapPin, Package, Eye } from 'lucide-react';
import { mockUsers, mockOrders } from '../../data/mockData';
import { User as UserType, Order } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<UserType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<UserType | null>(null);
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement des données
    setTimeout(() => {
      const clientUsers = mockUsers.filter(user => user.role === 'client');
      setClients(clientUsers);
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (client: UserType) => {
    const userOrders = orders.filter(order => order.clientId === client.id);
    setSelectedClient(client);
    setClientOrders(userOrders);
    setIsModalOpen(true);
  };

  const getClientStats = (clientId: string) => {
    const clientOrders = orders.filter(order => order.clientId === clientId);
    const totalOrders = clientOrders.length;
    const totalSpent = clientOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const activeOrders = clientOrders.filter(order => 
      ['devis', 'en_attente', 'en_cours'].includes(order.status)
    ).length;

    return { totalOrders, totalSpent, activeOrders };
  };

  const getStatusVariant = (status: Order['status']) => {
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

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'devis': return 'Devis';
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'terminee': return 'Terminée';
      case 'livree': return 'Livrée';
      case 'annulee': return 'Annulée';
      default: return status;
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
        <p className="text-gray-600 mt-2">
          Consultez et gérez vos clients
        </p>
      </div>

      {/* Recherche */}
      <div className="flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Rechercher un client..."
          icon={<Search className="w-5 h-5 text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Liste des clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map(client => {
          const stats = getClientStats(client.id);
          return (
            <Card key={client.id}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {client.phone}
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {client.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stats.totalOrders}
                    </div>
                    <div className="text-xs text-gray-600">Commandes</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stats.totalSpent.toFixed(0)}MGA
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stats.activeOrders}
                    </div>
                    <div className="text-xs text-gray-600">Actives</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye className="w-4 h-4" />}
                  onClick={() => handleViewClient(client)}
                  className="w-full"
                >
                  Voir détails
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucun client trouvé</p>
        </div>
      )}

      {/* Modal détail client */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Détail client - ${selectedClient?.name}`}
        size="xl"
      >
        {selectedClient && (
          <div className="space-y-6">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Informations personnelles</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom</label>
                    <p className="text-gray-900">{selectedClient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedClient.email}</p>
                  </div>
                  {selectedClient.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Téléphone</label>
                      <p className="text-gray-900">{selectedClient.phone}</p>
                    </div>
                  )}
                  {selectedClient.address && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Adresse</label>
                      <p className="text-gray-900">{selectedClient.address}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Membre depuis</label>
                    <p className="text-gray-900">
                      {new Date(selectedClient.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique des commandes */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Historique des commandes</h3>
              </CardHeader>
              <CardContent>
                {clientOrders.length > 0 ? (
                  <div className="space-y-4">
                    {clientOrders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Commande #{order.id}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusVariant(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                            <p className="text-sm font-semibold mt-1">
                              {order.totalPrice.toFixed(2)}MGA
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.service.name} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Aucune commande</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};