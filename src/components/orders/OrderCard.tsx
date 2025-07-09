import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, FileText, Eye } from 'lucide-react';
import { Order } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface OrderCardProps {
  order: Order;
}

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

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Commande #{order.id}
          </h3>
          <p className="text-gray-600 text-sm">
            {order.items.length} article{order.items.length > 1 ? 's' : ''}
          </p>
        </div>
        <Badge variant={getStatusVariant(order.status)}>
          {getStatusLabel(order.status)}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div>
              <span className="font-medium">{item.service.name}</span>
              <span className="text-gray-500 ml-2">x{item.quantity}</span>
            </div>
            <span className="font-medium">{item.totalPrice.toFixed(2)}MGA</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          {order.dueDate && (
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4" />
              <span>Livraison: {new Date(order.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className="text-lg font-bold text-gray-900">
          {order.totalPrice.toFixed(2)}MGA
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          icon={<Eye className="w-4 h-4" />}
          as={Link}
          to={`/orders/${order.id}`}
        >
          Détails
        </Button>
        {order.status === 'devis' && (
          <Button 
            size="sm" 
            icon={<FileText className="w-4 h-4" />}
          >
            Télécharger devis
          </Button>
        )}
        {(order.status === 'terminee' || order.status === 'livree') && (
          <Button 
            variant="outline" 
            size="sm" 
            icon={<FileText className="w-4 h-4" />}
          >
            Facture
          </Button>
        )}
      </div>
    </Card>
  );
};