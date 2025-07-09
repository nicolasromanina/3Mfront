import React, { useState, useEffect } from 'react';
import { Package, Plus } from 'lucide-react';
import { Service, OrderItem } from '../../types';
import { useOrderStore } from '../../store/orderStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ServiceSelectorProps {
  onServiceSelect: (service: Service) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onServiceSelect }) => {
  const { services, fetchServices } = useOrderStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const categories = [
    { value: 'all', label: 'Tous les services' },
    { value: 'flyers', label: 'Flyers' },
    { value: 'cartes', label: 'Cartes de visite' },
    { value: 'affiches', label: 'Affiches' },
    { value: 'brochures', label: 'Brochures' },
    { value: 'autres', label: 'Autres' }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <Card key={service.id}>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    À partir de <span className="font-semibold text-blue-600">
                      {service.basePrice.toFixed(2)}MGA
                    </span>/{service.unit}
                  </div>
                  <Button
                    size="sm"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => onServiceSelect(service)}
                  >
                    Choisir
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};