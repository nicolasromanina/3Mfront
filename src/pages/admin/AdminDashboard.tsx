import React, { useState } from 'react';
import { ShoppingBag, Users, DollarSign, TrendingUp, Clock, CheckCircle, AlertTriangle, Calendar, Filter } from 'lucide-react';
import { mockDashboardStats, mockOrders } from '../../data/mockData';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AdminDashboard: React.FC = () => {
  const stats = mockDashboardStats;
  const [timeFilter, setTimeFilter] = useState('7days');
  const [showQuickActions, setShowQuickActions] = useState(true);

  const recentOrders = mockOrders.slice(0, 5);
  const urgentOrders = mockOrders.filter(order => 
    order.status === 'en_cours' && 
    order.dueDate && 
    new Date(order.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'devis': return 'info';
      case 'en_attente': return 'warning';
      case 'en_cours': return 'info';
      case 'terminee': return 'success';
      case 'livree': return 'success';
      case 'annulee': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">Vue d'ensemble de votre activité PrintPro</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="3months">3 derniers mois</option>
            <option value="12months">12 derniers mois</option>
          </select>
          <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filtres
          </Button>
        </div>
      </div>

      {/* Alertes urgentes */}
      {urgentOrders.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">Commandes urgentes</h3>
              <p className="text-orange-700 text-sm">
                {urgentOrders.length} commande(s) à livrer dans les 24h
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              Voir tout
            </Button>
          </div>
        </Card>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600">Total Commandes</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-xs text-green-600">+12% ce mois</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600">En Attente</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-xs text-orange-600">Urgent</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600">Terminées</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              <p className="text-xs text-green-600">+8% ce mois</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600">CA</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}MGA</p>
              <p className="text-xs text-green-600">+15% ce mois</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      {showQuickActions && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
              <button
                onClick={() => setShowQuickActions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" size="sm" className="h-auto py-3 flex-col">
                <ShoppingBag className="w-5 h-5 mb-1" />
                <span className="text-xs">Nouvelle commande</span>
              </Button>
              <Button variant="outline" size="sm" className="h-auto py-3 flex-col">
                <Users className="w-5 h-5 mb-1" />
                <span className="text-xs">Ajouter client</span>
              </Button>
              <Button variant="outline" size="sm" className="h-auto py-3 flex-col">
                <Calendar className="w-5 h-5 mb-1" />
                <span className="text-xs">Planifier</span>
              </Button>
              <Button variant="outline" size="sm" className="h-auto py-3 flex-col">
                <TrendingUp className="w-5 h-5 mb-1" />
                <span className="text-xs">Rapport</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Graphique des commandes mensuelles */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Évolution des commandes</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.monthlyOrders.slice(-6).map((month, index) => {
                const maxRevenue = Math.max(...stats.monthlyOrders.slice(-6).map(m => m.revenue));
                return (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{month.month}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {month.revenue.toLocaleString()}MGA
                        </div>
                        <div className="text-xs text-gray-600">
                          {month.count} commandes
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Commandes récentes */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 text-sm">#{order.id}</span>
                      <Badge variant={getStatusVariant(order.status)} className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{order.client.name}</p>
                    <p className="text-xs font-semibold text-gray-900">{order.totalPrice.toFixed(2)}MGA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Services populaires */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Services populaires</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topServices.map((service, index) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{service.service}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${(service.count / stats.topServices[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-6 text-right">{service.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité aujourd'hui */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Activité aujourd'hui</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nouvelles commandes</span>
                <span className="font-semibold text-green-600">+3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Commandes terminées</span>
                <span className="font-semibold text-blue-600">+5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nouveaux clients</span>
                <span className="font-semibold text-purple-600">+1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Messages reçus</span>
                <span className="font-semibold text-orange-600">+7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Chiffre d'affaires</span>
                <span className="font-semibold text-green-600">+450MGA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};