import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, AlertTriangle, Search, Filter, Download } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export const AdminInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [inventory, setInventory] = useState([
    {
      id: '1',
      name: 'Papier A4 90g',
      category: 'papier',
      currentStock: 5000,
      minStock: 1000,
      maxStock: 10000,
      unit: 'feuilles',
      supplier: 'Papeterie Pro',
      lastRestocked: '2024-11-28',
      cost: 0.02,
      status: 'ok'
    },
    {
      id: '2',
      name: 'Encre Cyan',
      category: 'encre',
      currentStock: 150,
      minStock: 200,
      maxStock: 500,
      unit: 'ml',
      supplier: 'Ink Solutions',
      lastRestocked: '2024-11-25',
      cost: 0.15,
      status: 'low'
    },
    {
      id: '3',
      name: 'Carton 350g',
      category: 'papier',
      currentStock: 2500,
      minStock: 500,
      maxStock: 5000,
      unit: 'feuilles',
      supplier: 'Carton Expert',
      lastRestocked: '2024-12-01',
      cost: 0.08,
      status: 'ok'
    },
    {
      id: '4',
      name: 'Film plastification',
      category: 'finition',
      currentStock: 50,
      minStock: 100,
      maxStock: 300,
      unit: 'mètres',
      supplier: 'Finition Plus',
      lastRestocked: '2024-11-20',
      cost: 2.50,
      status: 'critical'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'papier',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'feuilles',
    supplier: '',
    cost: 0
  });

  const categories = [
    { value: 'all', label: 'Toutes catégories' },
    { value: 'papier', label: 'Papier' },
    { value: 'encre', label: 'Encre' },
    { value: 'finition', label: 'Finition' },
    { value: 'equipement', label: 'Équipement' }
  ];

  const getStatusInfo = (item: any) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (item.currentStock <= item.minStock * 0.5) {
      return { variant: 'danger', label: 'Critique', color: 'red' };
    } else if (item.currentStock <= item.minStock) {
      return { variant: 'warning', label: 'Faible', color: 'yellow' };
    } else if (percentage > 80) {
      return { variant: 'info', label: 'Plein', color: 'blue' };
    } else {
      return { variant: 'success', label: 'OK', color: 'green' };
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const criticalItems = inventory.filter(item => item.currentStock <= item.minStock * 0.5);

  const handleAddItem = () => {
    setFormData({
      name: '',
      category: 'papier',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: 'feuilles',
      supplier: '',
      cost: 0
    });
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: any) => {
    setFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unit: item.unit,
      supplier: item.supplier,
      cost: item.cost
    });
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setInventory(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, lastRestocked: new Date().toISOString().split('T')[0] }
          : item
      ));
      toast.success('Article mis à jour avec succès');
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        lastRestocked: new Date().toISOString().split('T')[0],
        status: 'ok'
      };
      setInventory(prev => [...prev, newItem]);
      toast.success('Article ajouté avec succès');
    }
    
    setIsModalOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setInventory(prev => prev.filter(item => item.id !== itemId));
      toast.success('Article supprimé');
    }
  };

  const handleRestock = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      const restockAmount = item.maxStock - item.currentStock;
      setInventory(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, currentStock: i.maxStock, lastRestocked: new Date().toISOString().split('T')[0] }
          : i
      ));
      toast.success(`Réapprovisionnement de ${restockAmount} ${item.unit} effectué`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            Gérez votre inventaire et suivez les niveaux de stock
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={handleAddItem}>
            Ajouter un article
          </Button>
        </div>
      </div>

      {/* Alertes de stock */}
      {(lowStockItems.length > 0 || criticalItems.length > 0) && (
        <div className="space-y-3">
          {criticalItems.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Stock critique</h3>
                  <p className="text-red-700 text-sm">
                    {criticalItems.length} article{criticalItems.length > 1 ? 's' : ''} en rupture imminente
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Voir tout
                </Button>
              </div>
            </Card>
          )}
          {lowStockItems.length > criticalItems.length && (
            <Card className="border-orange-200 bg-orange-50">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900">Stock faible</h3>
                  <p className="text-orange-700 text-sm">
                    {lowStockItems.length - criticalItems.length} article{lowStockItems.length - criticalItems.length > 1 ? 's' : ''} à réapprovisionner
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Planifier réapprovisionnement
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Rechercher un article..."
            icon={<Search className="w-5 h-5 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
          Filtres
        </Button>
      </div>

      {/* Tableau d'inventaire */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Article</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Catégorie</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stock actuel</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Fournisseur</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Dernier réappro.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => {
                const statusInfo = getStatusInfo(item);
                const stockPercentage = (item.currentStock / item.maxStock) * 100;
                
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.cost.toFixed(2)}MGA/{item.unit}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="default" className="capitalize">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.currentStock} {item.unit}</span>
                          <span className="text-gray-500">{stockPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-${statusInfo.color}-500 h-2 rounded-full transition-all`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Min: {item.minStock} • Max: {item.maxStock}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={statusInfo.variant as any}>
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">{item.supplier}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {new Date(item.lastRestocked).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {item.currentStock <= item.minStock && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestock(item.id)}
                            className="text-blue-600"
                          >
                            Réappro.
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                          onClick={() => handleEditItem(item)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal d'ajout/modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Modifier l\'article' : 'Ajouter un article'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom de l'article"
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
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                <option value="papier">Papier</option>
                <option value="encre">Encre</option>
                <option value="finition">Finition</option>
                <option value="equipement">Équipement</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              label="Stock actuel"
              value={formData.currentStock}
              onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) }))}
              min="0"
              required
            />
            <Input
              type="number"
              label="Stock minimum"
              value={formData.minStock}
              onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) }))}
              min="0"
              required
            />
            <Input
              type="number"
              label="Stock maximum"
              value={formData.maxStock}
              onChange={(e) => setFormData(prev => ({ ...prev, maxStock: parseInt(e.target.value) }))}
              min="0"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Unité"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="ex: feuilles, ml, mètres"
              required
            />
            <Input
              type="number"
              label="Coût unitaire (MGA)"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
              step="0.01"
              min="0"
              required
            />
          </div>

          <Input
            label="Fournisseur"
            value={formData.supplier}
            onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
            required
          />

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {editingItem ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};