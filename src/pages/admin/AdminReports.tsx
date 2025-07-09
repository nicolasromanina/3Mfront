import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockOrders, mockUsers } from '../../data/mockData';
import toast from 'react-hot-toast';

export const AdminReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('30days');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'sales', name: 'Rapport de ventes', icon: DollarSign, description: 'Analyse des revenus et tendances' },
    { id: 'orders', name: 'Rapport de commandes', icon: Package, description: 'Statistiques des commandes' },
    { id: 'clients', name: 'Rapport clients', icon: Users, description: 'Analyse de la clientèle' },
    { id: 'performance', name: 'Performance', icon: TrendingUp, description: 'KPIs et métriques clés' }
  ];

  const predefinedReports = [
    {
      id: '1',
      name: 'Rapport mensuel - Novembre 2024',
      type: 'Ventes',
      generatedAt: '2024-12-01T10:00:00Z',
      size: '2.3 MB',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Analyse clients Q4 2024',
      type: 'Clients',
      generatedAt: '2024-11-30T15:30:00Z',
      size: '1.8 MB',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Performance hebdomadaire',
      type: 'Performance',
      generatedAt: '2024-12-02T09:15:00Z',
      size: '950 KB',
      status: 'generating'
    }
  ];

  // Calculs pour les métriques
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = mockOrders.length;
  const totalClients = mockUsers.filter(u => u.role === 'client').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulation de génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast.success('Rapport généré avec succès !');
  };

  const handleDownloadReport = (reportId: string) => {
    toast.success('Téléchargement du rapport en cours...');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="success">Prêt</Badge>;
      case 'generating':
        return <Badge variant="warning">En cours</Badge>;
      case 'error':
        return <Badge variant="danger">Erreur</Badge>;
      default:
        return <Badge variant="default">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rapports & Analytics</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            Générez et consultez vos rapports d'activité
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="3months">3 derniers mois</option>
            <option value="1year">1 an</option>
          </select>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filtres
          </Button>
        </div>
      </div>

      {/* Métriques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()}MGA</div>
          <div className="text-sm text-gray-600">Chiffre d'affaires</div>
          <div className="text-xs text-green-600 mt-1">+15% vs période précédente</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
          <div className="text-sm text-gray-600">Commandes</div>
          <div className="text-xs text-blue-600 mt-1">+8% vs période précédente</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">{totalClients}</div>
          <div className="text-sm text-gray-600">Clients actifs</div>
          <div className="text-xs text-purple-600 mt-1">+12% vs période précédente</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">{averageOrderValue.toFixed(0)}MGA</div>
          <div className="text-sm text-gray-600">Panier moyen</div>
          <div className="text-xs text-orange-600 mt-1">+5% vs période précédente</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Générateur de rapports */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Générer un nouveau rapport</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de rapport
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {reportTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedReport(type.id)}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          selectedReport === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${
                          selectedReport === type.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                        <div className="text-left">
                          <div className={`font-medium ${
                            selectedReport === type.id ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {type.name}
                          </div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="7days">7 derniers jours</option>
                  <option value="30days">30 derniers jours</option>
                  <option value="3months">3 derniers mois</option>
                  <option value="6months">6 derniers mois</option>
                  <option value="1year">1 an</option>
                  <option value="custom">Période personnalisée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format d'export
                </label>
                <div className="flex space-x-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" value="pdf" defaultChecked className="rounded" />
                    <span className="text-sm">PDF</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" value="excel" className="rounded" />
                    <span className="text-sm">Excel</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" value="csv" className="rounded" />
                    <span className="text-sm">CSV</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleGenerateReport}
                loading={isGenerating}
                icon={<FileText className="w-4 h-4" />}
                className="w-full"
              >
                {isGenerating ? 'Génération en cours...' : 'Générer le rapport'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rapports existants */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Rapports récents</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predefinedReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{report.name}</h4>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{report.type}</span>
                      <span>{report.size}</span>
                      <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {report.status === 'ready' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Download className="w-4 h-4" />}
                        onClick={() => handleDownloadReport(report.id)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu des données */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Aperçu des données - {reportTypes.find(r => r.id === selectedReport)?.name}</h3>
        </CardHeader>
        <CardContent>
          {selectedReport === 'sales' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Revenus par mois</h4>
                <div className="space-y-2">
                  {['Novembre', 'Octobre', 'Septembre'].map((month, index) => (
                    <div key={month} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{month}</span>
                      <span className="font-medium">{(3500 - index * 200).toLocaleString()}MGA</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Top services</h4>
                <div className="space-y-2">
                  {['Flyers A5', 'Cartes de visite', 'Affiches A3'].map((service, index) => (
                    <div key={service} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{service}</span>
                      <span className="font-medium">{(45 - index * 10)} ventes</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Tendances</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Croissance mensuelle</span>
                    <span className="font-medium text-green-600">+15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nouveaux clients</span>
                    <span className="font-medium text-blue-600">+8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de conversion</span>
                    <span className="font-medium text-purple-600">78%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'orders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Statuts des commandes</h4>
                <div className="space-y-2">
                  {[
                    { status: 'Terminées', count: 142, color: 'green' },
                    { status: 'En cours', count: 8, color: 'blue' },
                    { status: 'En attente', count: 3, color: 'yellow' },
                    { status: 'Annulées', count: 2, color: 'red' }
                  ].map(item => (
                    <div key={item.status} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.status}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Délais moyens</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Traitement</span>
                    <span className="font-medium">2.3 jours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Production</span>
                    <span className="font-medium">1.8 jours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Livraison</span>
                    <span className="font-medium">1.2 jours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'clients' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Segmentation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nouveaux clients</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clients réguliers</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clients VIP</span>
                    <span className="font-medium">5</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Géographie</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paris</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lyon</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Autres</span>
                    <span className="font-medium">30%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Satisfaction</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Note moyenne</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de recommandation</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clients satisfaits</span>
                    <span className="font-medium">96%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'performance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">KPIs opérationnels</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de conversion</span>
                    <span className="font-medium text-green-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temps de réponse moyen</span>
                    <span className="font-medium">2.3h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux d'erreur</span>
                    <span className="font-medium text-red-600">0.8%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Objectifs</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CA mensuel</span>
                    <span className="font-medium text-green-600">105% ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nouveaux clients</span>
                    <span className="font-medium text-blue-600">120% ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Satisfaction client</span>
                    <span className="font-medium text-green-600">98% ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};