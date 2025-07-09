import React, { useState, useEffect } from 'react';
import { Upload, X, Calculator } from 'lucide-react';
import { Service, OrderItem } from '../../types';
import { useOrderStore } from '../../store/orderStore';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface OrderFormProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: OrderItem) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  service,
  isOpen,
  onClose,
  onSubmit
}) => {
  const { calculatePrice } = useOrderStore();
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (service) {
      setQuantity(service.minQuantity);
      const defaultOptions: Record<string, any> = {};
      service.options.forEach(option => {
        if (option.required && option.options) {
          defaultOptions[option.id] = option.options[0];
        }
      });
      setOptions(defaultOptions);
    }
  }, [service]);

  const handleOptionChange = (optionId: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalPrice = () => {
    if (!service) return 0;
    return calculatePrice(service, quantity, options);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    const orderItem: OrderItem = {
      serviceId: service.id,
      service,
      quantity,
      options,
      unitPrice: calculatePrice(service, 1, options),
      totalPrice: calculateTotalPrice(),
      files
    };

    onSubmit(orderItem);
    onClose();
    
    // Reset form
    setQuantity(service.minQuantity);
    setOptions({});
    setFiles([]);
    setNotes('');
  };

  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Commander - ${service.name}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quantité */}
        <div>
          <Input
            type="number"
            label="Quantité"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min={service.minQuantity}
            max={service.maxQuantity}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Min: {service.minQuantity} - Max: {service.maxQuantity}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Options</h4>
          {service.options.map(option => (
            <div key={option.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {option.name} {option.required && <span className="text-red-500">*</span>}
              </label>
              
              {option.type === 'select' && (
                <select
                  value={options[option.id] || ''}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required={option.required}
                >
                  {option.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              
              {option.type === 'checkbox' && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options[option.id] || false}
                    onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{option.name}</span>
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Upload de fichiers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichiers à imprimer
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Glissez vos fichiers ici ou cliquez pour sélectionner
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button type="button" variant="outline" size="sm">
                Sélectionner des fichiers
              </Button>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarques (optionnel)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Ajoutez des instructions spéciales..."
          />
        </div>

        {/* Prix */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Prix total</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {calculateTotalPrice().toFixed(2)}MGA
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Ajouter au panier
          </Button>
        </div>
      </form>
    </Modal>
  );
};