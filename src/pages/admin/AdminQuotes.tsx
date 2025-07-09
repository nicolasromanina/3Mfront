import React, { useEffect, useState } from 'react';
import { Search, FileText, Check, X, Eye, Download } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { Order } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export const AdminQuotes: React.FC = () => {
  const { orders, fetchOrders, updateOrderStatus, loading } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const quotes = orders.filter(order => order.status === 'devis');
  
  const filteredQuotes = quotes.filter(quote => 
    quote.id.includes(searchTerm) || 
    quote.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveQuote = async (quoteId: string) => {
    await updateOrderStatus(quoteId, 'en_attente');
    toast.success('Devis approuvé et converti en commande');
  };

  const handleRejectQuote = async (quoteId: string) => {
    await updateOrderStatus(quoteId, 'annulee');
    toast.success('Devis refusé');
  };

  const handleViewQuote = (quote: Order) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const generateQuotePDF = (quote: Order) => {
    // Simulation de génération PDF
    toast.success('Devis PDF généré avec succès');
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
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Devis</h1>
        <p className="text-gray-600 mt-2">
          Gérez et validez les devis clients
        </p>
      </div>

      {/* Recherche */}
      <div className="flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Rechercher un devis..."
          icon={<Search className="w-5 h-5 text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Liste des devis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuotes.map(quote => (
          <Card key={quote.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Devis #{quote.id}
                </h3>
                <p className="text-gray-600 text-sm">{quote.client.name}</p>
                <p className="text-gray-500 text-xs">{quote.client.email}</p>
              </div>
              <Badge variant="info">Devis</Badge>
            </div>

            <div className="space-y-2 mb-4">
              {quote.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.service.name} x{item.quantity}</span>
                  <span className="font-medium">{item.totalPrice.toFixed(2)}MGA</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-blue-600">{quote.totalPrice.toFixed(2)}MGA</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                icon={<Eye className="w-4 h-4" />}
                onClick={() => handleViewQuote(quote)}
              >
                Voir
              </Button>
              <Button
                size="sm"
                variant="outline"
                icon={<Download className="w-4 h-4" />}
                onClick={() => generateQuotePDF(quote)}
              >
                PDF
              </Button>
              <Button
                size="sm"
                icon={<Check className="w-4 h-4" />}
                onClick={() => handleApproveQuote(quote.id)}
              >
                Approuver
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon={<X className="w-4 h-4" />}
                onClick={() => handleRejectQuote(quote.id)}
              >
                Refuser
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucun devis en attente</p>
        </div>
      )}

      {/* Modal détail devis */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Détail du devis #${selectedQuote?.id}`}
        size="lg"
      >
        {selectedQuote && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Client</h4>
                <p className="text-gray-700">{selectedQuote.client.name}</p>
                <p className="text-gray-600 text-sm">{selectedQuote.client.email}</p>
                {selectedQuote.client.phone && (
                  <p className="text-gray-600 text-sm">{selectedQuote.client.phone}</p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Date</h4>
                <p className="text-gray-700">
                  {new Date(selectedQuote.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Articles</h4>
              <div className="space-y-3">
                {selectedQuote.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{item.service.name}</h5>
                      <span className="font-semibold">{item.totalPrice.toFixed(2)}€</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Quantité: {item.quantity}</p>
                    <div className="text-sm text-gray-600">
                      <strong>Options:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {Object.entries(item.options).map(([key, value]) => (
                          <li key={key}>{key}: {value.toString()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedQuote.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Remarques</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedQuote.notes}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total du devis</span>
                <span className="text-blue-600">{selectedQuote.totalPrice.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};