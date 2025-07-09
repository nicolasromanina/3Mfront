import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Save, X } from 'lucide-react';
import { Service, ServiceOption } from '../../types';
import { mockServices } from '../../data/mockData';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'flyers' as Service['category'],
    basePrice: 0,
    unit: 'unité' as Service['unit'],
    minQuantity: 1,
    maxQuantity: 1000,
    options: [] as ServiceOption[]
  });

  useEffect(() => {
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 300);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'flyers',
      basePrice: 0,
      unit: 'unité',
      minQuantity: 1,
      maxQuantity: 1000,
      options: []
    });
    setEditingService(null);
  };

  const handleAddService = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice,
      unit: service.unit,
      minQuantity: service.minQuantity,
      maxQuantity: service.maxQuantity,
      options: [...service.options]
    });
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      setServices(prev => prev.filter(s => s.id !== serviceId));
      toast.success('Service supprimé avec succès');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      // Modification
      setServices(prev => prev.map(s => 
        s.id === editingService.id 
          ? { ...editingService, ...formData }
          : s
      ));
      toast.success('Service modifié avec succès');
    } else {
      // Ajout
      const newService: Service = {
        id: Date.now().toString(),
        ...formData
      };
      setServices(prev => [...prev, newService]);
      toast.success('Service ajouté avec succès');
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const addOption = () => {
    const newOption: ServiceOption = {
      id: Date.now().toString(),
      name: '',
      type: 'select',
      options: [''],
      priceModifier: 1.0,
      required: false
    };
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const updateOption = (index: number, field: keyof ServiceOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const categories = [
    { value: 'flyers', label: 'Flyers' },
    { value: 'cartes', label: 'Cartes de visite' },
    { value: 'affiches', label: 'Affiches' },
    { value: 'brochures', label: 'Brochures' },
    { value: 'autres', label: 'Autres' }
  ];

  const units = [
    { value: 'unité', label: 'Unité' },
    { value: 'page', label: 'Page' },
    { value: 'm²', label: 'M²' }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Services</h1>
          <p className="text-gray-600 mt-2">
            Configurez vos services d'impression et leurs options
          </p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={handleAddService}>
          Nouveau service
        </Button>
      </div>

      {/* Liste des services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map(service => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{service.category}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => handleEditService(service)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDeleteService(service.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{service.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Prix de base</span>
                  <p className="font-semibold">{service.basePrice.toFixed(2)}MGA/{service.unit}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Quantité</span>
                  <p className="font-semibold">{service.minQuantity} - {service.maxQuantity}</p>
                </div>
              </div>

              {service.options.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 mb-2 block">Options disponibles</span>
                  <div className="space-y-1">
                    {service.options.map(option => (
                      <div key={option.id} className="text-sm text-gray-700">
                        • {option.name} {option.required && <span className="text-red-500">*</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal d'ajout/modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Modifier le service' : 'Nouveau service'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom du service"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Service['category'] }))}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              label="Prix de base"
              value={formData.basePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }))}
              step="0.01"
              min="0"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unité
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value as Service['unit'] }))}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Quantité minimum"
              value={formData.minQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: parseInt(e.target.value) }))}
              min="1"
              required
            />
            <Input
              type="number"
              label="Quantité maximum"
              value={formData.maxQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, maxQuantity: parseInt(e.target.value) }))}
              min="1"
              required
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Options du service</h4>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                Ajouter une option
              </Button>
            </div>

            <div className="space-y-4">
              {formData.options.map((option, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium">Option {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => removeOption(index)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input
                      label="Nom de l'option"
                      value={option.name}
                      onChange={(e) => updateOption(index, 'name', e.target.value)}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={option.type}
                        onChange={(e) => updateOption(index, 'type', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                      >
                        <option value="select">Liste déroulante</option>
                        <option value="checkbox">Case à cocher</option>
                        <option value="number">Nombre</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      label="Modificateur de prix"
                      value={option.priceModifier}
                      onChange={(e) => updateOption(index, 'priceModifier', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                    />
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        checked={option.required}
                        onChange={(e) => updateOption(index, 'required', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label className="text-sm text-gray-700">Option obligatoire</label>
                    </div>
                  </div>

                  {option.type === 'select' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valeurs possibles (une par ligne)
                      </label>
                      <textarea
                        value={option.options?.join('\n') || ''}
                        onChange={(e) => updateOption(index, 'options', e.target.value.split('\n').filter(v => v.trim()))}
                        rows={3}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        placeholder="Valeur 1&#10;Valeur 2&#10;Valeur 3"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" icon={<Save className="w-4 h-4" />}>
              {editingService ? 'Modifier' : 'Créer'} le service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};