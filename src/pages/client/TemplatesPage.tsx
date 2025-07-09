import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Heart, Star, Palette, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

export const TemplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const templates = [
    {
      id: '1',
      name: 'Flyer Moderne Business',
      category: 'flyers',
      type: 'Business',
      rating: 4.8,
      downloads: 1250,
      preview: '🎨',
      colors: ['#3B82F6', '#1E40AF', '#FFFFFF'],
      description: 'Design moderne et professionnel pour entreprises',
      tags: ['moderne', 'business', 'professionnel']
    },
    {
      id: '2',
      name: 'Carte de Visite Élégante',
      category: 'cartes',
      type: 'Professionnel',
      rating: 4.9,
      downloads: 890,
      preview: '💼',
      colors: ['#1F2937', '#F59E0B', '#FFFFFF'],
      description: 'Carte de visite élégante avec finitions dorées',
      tags: ['élégant', 'doré', 'luxe']
    },
    {
      id: '3',
      name: 'Affiche Événement Créatif',
      category: 'affiches',
      type: 'Événement',
      rating: 4.7,
      downloads: 650,
      preview: '🎪',
      colors: ['#EC4899', '#8B5CF6', '#FFFFFF'],
      description: 'Design coloré parfait pour vos événements',
      tags: ['coloré', 'événement', 'créatif']
    },
    {
      id: '4',
      name: 'Brochure Corporate',
      category: 'brochures',
      type: 'Corporate',
      rating: 4.6,
      downloads: 420,
      preview: '📊',
      colors: ['#059669', '#065F46', '#FFFFFF'],
      description: 'Brochure professionnelle pour présentation d\'entreprise',
      tags: ['corporate', 'présentation', 'données']
    },
    {
      id: '5',
      name: 'Menu Restaurant Vintage',
      category: 'autres',
      type: 'Restaurant',
      rating: 4.8,
      downloads: 780,
      preview: '🍽️',
      colors: ['#92400E', '#451A03', '#FEF3C7'],
      description: 'Menu au style vintage pour restaurants',
      tags: ['vintage', 'restaurant', 'nourriture']
    },
    {
      id: '6',
      name: 'Flyer Fitness Dynamique',
      category: 'flyers',
      type: 'Sport',
      rating: 4.5,
      downloads: 340,
      preview: '💪',
      colors: ['#DC2626', '#991B1B', '#FFFFFF'],
      description: 'Design énergique pour salles de sport',
      tags: ['sport', 'fitness', 'énergie']
    }
  ];

  const categories = [
    { value: 'all', label: 'Tous les templates', count: templates.length },
    { value: 'flyers', label: 'Flyers', count: templates.filter(t => t.category === 'flyers').length },
    { value: 'cartes', label: 'Cartes de visite', count: templates.filter(t => t.category === 'cartes').length },
    { value: 'affiches', label: 'Affiches', count: templates.filter(t => t.category === 'affiches').length },
    { value: 'brochures', label: 'Brochures', count: templates.filter(t => t.category === 'brochures').length },
    { value: 'autres', label: 'Autres', count: templates.filter(t => t.category === 'autres').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownloadTemplate = (template: any) => {
    toast.success(`Template "${template.name}" téléchargé !`);
  };

  const handleUseTemplate = (template: any) => {
    toast.success(`Template "${template.name}" ajouté à votre commande !`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Templates & Modèles</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            Découvrez notre collection de templates professionnels prêts à utiliser
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filtres avancés
          </Button>
          <Button icon={<Palette className="w-4 h-4" />}>
            Créer un template
          </Button>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Rechercher un template..."
            icon={<Search className="w-5 h-5 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.label}</span>
              <Badge variant={selectedCategory === category.value ? 'default' : 'info'} className="text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Templates populaires */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Templates populaires</h3>
        </div>
        <div className="p-4">
          <div className="flex space-x-4 overflow-x-auto">
            {templates.slice(0, 4).map(template => (
              <div key={template.id} className="flex-shrink-0 w-32 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">{template.preview}</span>
                </div>
                <div className="text-xs font-medium text-gray-900 truncate">{template.name}</div>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{template.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Grille des templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="group hover:shadow-lg transition-all duration-200">
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-6xl">{template.preview}</span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Heart className="w-4 h-4" />}
                  className="bg-white shadow-md"
                />
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="info" className="text-xs">
                  {template.type}
                </Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{template.rating}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {template.description}
              </p>

              <div className="flex items-center space-x-1 mb-3">
                {template.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="default" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{template.downloads} téléchargements</span>
                <span>Gratuit</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  icon={<Eye className="w-3 h-3" />}
                  onClick={() => setSelectedTemplate(template)}
                  className="flex-1 text-xs"
                >
                  Aperçu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-3 h-3" />}
                  onClick={() => handleDownloadTemplate(template)}
                  className="text-xs"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun template trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche
          </p>
          <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
            Réinitialiser les filtres
          </Button>
        </Card>
      )}

      {/* Modal aperçu template */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-8xl">{selectedTemplate.preview}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      icon={<Download className="w-4 h-4" />}
                      onClick={() => handleDownloadTemplate(selectedTemplate)}
                      className="flex-1"
                    >
                      Télécharger
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleUseTemplate(selectedTemplate)}
                      className="flex-1"
                    >
                      Utiliser ce template
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Détails</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Catégorie:</span>
                        <span className="font-medium">{selectedTemplate.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedTemplate.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Note:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{selectedTemplate.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Téléchargements:</span>
                        <span className="font-medium">{selectedTemplate.downloads}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Palette de couleurs</h3>
                    <div className="flex space-x-2">
                      {selectedTemplate.colors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="w-8 h-8 rounded border border-gray-200 mb-1"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-gray-600">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.tags.map(tag => (
                        <Badge key={tag} variant="default" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Formats disponibles</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">PDF haute résolution</span>
                        <Badge variant="success">✓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fichier source (AI/PSD)</span>
                        <Badge variant="success">✓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Formats d'impression</span>
                        <Badge variant="success">✓</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};