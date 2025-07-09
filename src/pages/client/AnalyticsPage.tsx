import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, DollarSign, Package, Clock, Download, Filter } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AnalyticsPage: React.FC = () => {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('spending');

  // Calculs des métriques
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'terminee' || o.status === 'livree').length;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Données mensuelles simulées
  const monthlyData = [
    { month: 'Jan', orders: 2, spending: 150, avgTime: 3 },
    { month: 'Fév', orders: 4, spending: 320, avgTime: 2.5 },
    { month: 'Mar', orders: 1, spending: 85, avgTime: 4 },
    { month: 'Avr', orders: 3, spending: 240, avgTime: 3.2 },
    { month: 'Mai', orders: 5, spending: 450, avgTime: 2.8 },
    { month: 'Jun', orders: 2, spending: 180, avgTime: 3.5 }
  ];

  // Services les plus commandés
  const serviceStats = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      const serviceName = item.service.name;
      if (!acc[serviceName]) {
        acc[serviceName] = { count: 0, total: 0 };
      }
      acc[serviceName].count += item.quantity;
      acc[serviceName].total += item.totalPrice;
    });
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  const topServices = Object.entries(serviceStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const metrics = [
    { key: 'spending', label: 'Dépenses', icon: DollarSign, color: 'blue' },
    { key: 'orders', label: 'Commandes', icon: Package, color: 'green' },
    { key: 'avgTime', label: 'Temps moyen', icon: Clock, color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes Statistiques</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            Analysez vos habitudes de commande et optimisez vos dépenses
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="3months">3 derniers mois</option>
            <option value="6months">6 derniers mois</option>
            <option value="1year">1 an</option>
            <option value="all">Tout</option>
          </select>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-blue-600">{totalSpent.toFixed(0)}MGA</div>
          <div className="text-sm text-gray-600">Total dépensé</div>
          <div className="text-xs text-green-600 mt-1">+15% vs période précédente</div>
        </Card>
        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-green-600">{totalOrders}</div>
          <div className="text-sm text-gray-600">Commandes passées</div>
          <div className="text-xs text-blue-600 mt-1">+8% vs période précédente</div>
        </Card>
        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-purple-600">{averageOrderValue.toFixed(0)}MGA</div>
          <div className="text-sm text-gray-600">Panier moyen</div>
          <div className="text-xs text-orange-600 mt-1">+5% vs période précédente</div>
        </Card>
        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-orange-600">{completionRate.toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Taux de finalisation</div>
          <div className="text-xs text-green-600 mt-1">Excellent</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'évolution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Évolution mensuelle</h3>
              <div className="flex space-x-1">
                {metrics.map(metric => (
                  <button
                    key={metric.key}
                    onClick={() => setSelectedMetric(metric.key)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      selectedMetric === metric.key
                        ? `bg-${metric.color}-100 text-${metric.color}-700`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, index) => {
                const value = selectedMetric === 'spending' ? month.spending : 
                             selectedMetric === 'orders' ? month.orders : month.avgTime;
                const maxValue = Math.max(...monthlyData.map(m => 
                  selectedMetric === 'spending' ? m.spending : 
                  selectedMetric === 'orders' ? m.orders : m.avgTime
                ));
                const percentage = (value / maxValue) * 100;

                return (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{month.month}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {selectedMetric === 'spending' ? `${value}MGA` : 
                         selectedMetric === 'orders' ? `${value} cmd` : `${value}j`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r from-${metrics.find(m => m.key === selectedMetric)?.color}-400 to-${metrics.find(m => m.key === selectedMetric)?.color}-600 h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Services favoris */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Mes services favoris</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-xs text-gray-600">{service.count} unités commandées</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{service.total.toFixed(0)}MGA</div>
                    <div className="text-xs text-gray-600">
                      {((service.total / totalSpent) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
              {topServices.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucune donnée disponible</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analyse des habitudes */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Analyse des habitudes</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-900">Jour préféré</div>
                  <div className="text-sm text-blue-700">Mardi</div>
                </div>
                <div className="text-2xl">📅</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-900">Heure préférée</div>
                  <div className="text-sm text-green-700">14h-16h</div>
                </div>
                <div className="text-2xl">🕐</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-purple-900">Délai moyen</div>
                  <div className="text-sm text-purple-700">3.2 jours</div>
                </div>
                <div className="text-2xl">⏱️</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="font-medium text-orange-900">Satisfaction</div>
                  <div className="text-sm text-orange-700">4.8/5 ⭐</div>
                </div>
                <div className="text-2xl">😊</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommandations */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recommandations</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600">💡</div>
                  <div>
                    <div className="font-medium text-blue-900">Économies possibles</div>
                    <div className="text-sm text-blue-700">
                      Commandez en plus grande quantité pour bénéficier de tarifs dégressifs
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-start space-x-2">
                  <div className="text-green-600">🎯</div>
                  <div>
                    <div className="font-medium text-green-900">Optimisation</div>
                    <div className="text-sm text-green-700">
                      Planifiez vos commandes le mardi pour des délais optimaux
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                <div className="flex items-start space-x-2">
                  <div className="text-purple-600">🚀</div>
                  <div>
                    <div className="font-medium text-purple-900">Nouveauté</div>
                    <div className="text-sm text-purple-700">
                      Découvrez nos nouveaux services de finition premium
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};