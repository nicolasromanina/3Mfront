import React, { useState } from 'react';
import { ServiceSelector } from '../../components/orders/ServiceSelector';
import { OrderForm } from '../../components/orders/OrderForm';
import { Service } from '../../types';

export const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsOrderFormOpen(true);
  };

  const handleOrderSubmit = (orderItem: any) => {
    // Logique pour ajouter au panier
    console.log('Order item added:', orderItem);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nos Services</h1>
        <p className="text-gray-600 mt-2">
          Découvrez notre gamme complète de services d'impression professionnelle
        </p>
      </div>

      <ServiceSelector onServiceSelect={handleServiceSelect} />

      <OrderForm
        service={selectedService}
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
};