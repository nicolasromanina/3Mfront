import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Share2, Eye, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockServices } from '../../data/mockData';
import toast from 'react-hot-toast';

export const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState([
    { id: '1', service: mockServices[0], addedAt: '2024-12-01', notes: 'Pour la prochaine campagne marketing' },
    { id: '2', service: mockServices[1], addedAt: '2024-11-28', notes: 'Cartes pour nouveaux employés' },
    { id: '3', service: mockServices[2], addedAt: '2024-11-25', notes: '' }
  ]);

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Article retiré de la liste de souhaits');
  };

  const handleAddToCart = (item: any) => {
    toast.success(`${item.service.name} ajouté au panier`);
  };

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien de la liste copié dans le presse-papiers');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ma Liste de Souhaits</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            {wishlistItems.length} service{wishlistItems.length > 1 ? 's' : ''} sauvegardé{wishlistItems.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            icon={<Share2 className="w-4 h-4" />}
            onClick={handleShareWishlist}
          >
            Partager
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            Ajouter des services
          </Button>
        </div>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map(item => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                  <div className="text-4xl">📄</div>
                </div>
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.service.name}</h3>
                  <Badge variant="info" className="text-xs">
                    {item.service.category}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.service.description}
                </p>

                {item.notes && (
                  <div className="mb-3 p-2 bg-yellow-50 rounded border-l-2 border-yellow-200">
                    <p className="text-xs text-yellow-800">{item.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      {item.service.basePrice.toFixed(2)}MGA
                    </span>
                    <span className="text-sm text-gray-500">/{item.service.unit}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Ajouté le {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    icon={<ShoppingCart className="w-4 h-4" />}
                    onClick={() => handleAddToCart(item)}
                    className="flex-1"
                  >
                    Commander
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Eye className="w-4 h-4" />}
                  >
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Votre liste de souhaits est vide
          </h3>
          <p className="text-gray-600 mb-6">
            Découvrez nos services et ajoutez vos favoris à votre liste
          </p>
          <Button icon={<Plus className="w-4 h-4" />}>
            Découvrir nos services
          </Button>
        </Card>
      )}
    </div>
  );
};