import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ServiceSelector } from '../../components/orders/ServiceSelector';
import { OrderForm } from '../../components/orders/OrderForm';
import { Service, OrderItem } from '../../types';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export const NewOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentOrder, addToOrder, removeFromOrder, clearOrder, submitOrder } = useOrderStore();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [step, setStep] = useState<'services' | 'cart' | 'confirmation'>('services');

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsOrderFormOpen(true);
  };

  const handleOrderSubmit = (orderItem: OrderItem) => {
    addToOrder(orderItem);
    toast.success('Article ajouté au panier !');
    setIsOrderFormOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    removeFromOrder(index);
    toast.success('Article retiré du panier');
  };

  const getTotalPrice = () => {
    return currentOrder.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmitOrder = async () => {
    if (!user || currentOrder.length === 0) return;

    try {
      const orderId = await submitOrder(user.id, 'Nouvelle commande depuis l\'interface');
      toast.success('Commande créée avec succès !');
      navigate(`/orders/${orderId}`);
    } catch (error) {
      toast.error('Erreur lors de la création de la commande');
    }
  };

  const handleContinueShopping = () => {
    setStep('services');
  };

  const handleViewCart = () => {
    setStep('cart');
  };

  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouvelle Commande</h1>
            <p className="text-gray-600 mt-1">
              {step === 'services' && 'Choisissez vos services d\'impression'}
              {step === 'cart' && 'Vérifiez votre panier'}
              {step === 'confirmation' && 'Confirmez votre commande'}
            </p>
          </div>
        </div>

        {/* Panier */}
        {currentOrder.length > 0 && (
          <Button
            variant="outline"
            icon={<ShoppingCart className="w-5 h-5" />}
            onClick={handleViewCart}
          >
            Panier ({currentOrder.length})
          </Button>
        )}
      </div>

      {/* Étapes */}
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          step === 'services' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <span className="w-6 h-6 rounded-full bg-current text-white text-sm flex items-center justify-center">1</span>
          <span className="font-medium">Services</span>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          step === 'cart' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <span className="w-6 h-6 rounded-full bg-current text-white text-sm flex items-center justify-center">2</span>
          <span className="font-medium">Panier</span>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          step === 'confirmation' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <span className="w-6 h-6 rounded-full bg-current text-white text-sm flex items-center justify-center">3</span>
          <span className="font-medium">Confirmation</span>
        </div>
      </div>

      {/* Contenu selon l'étape */}
      {step === 'services' && (
        <ServiceSelector onServiceSelect={handleServiceSelect} />
      )}

      {step === 'cart' && (
        <div className="max-w-4xl">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Votre panier</h2>
              <Button
                variant="outline"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleContinueShopping}
              >
                Ajouter des articles
              </Button>
            </div>

            {currentOrder.length > 0 ? (
              <div className="space-y-4">
                {currentOrder.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.service.name}</h3>
                        <p className="text-gray-600 text-sm">{item.service.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Quantité</span>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Prix unitaire</span>
                        <p className="font-medium">{item.unitPrice.toFixed(2)}MGA</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Total</span>
                        <p className="font-semibold text-blue-600">{item.totalPrice.toFixed(2)}MGA</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Fichiers</span>
                        <p className="font-medium">{item.files?.length || 0}</p>
                      </div>
                    </div>

                    {Object.keys(item.options).length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 mb-1 block">Options sélectionnées</span>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(item.options).map(([key, value]) => (
                            <Badge key={key} variant="info">
                              {key}: {value.toString()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total de la commande</span>
                    <span className="text-blue-600">{getTotalPrice().toFixed(2)}MGA</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" onClick={handleContinueShopping}>
                    Continuer mes achats
                  </Button>
                  <Button onClick={handleSubmitOrder}>
                    Confirmer la commande
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Votre panier est vide</p>
                <Button
                  className="mt-4"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleContinueShopping}
                >
                  Ajouter des articles
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Formulaire de commande */}
      <OrderForm
        service={selectedService}
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
};