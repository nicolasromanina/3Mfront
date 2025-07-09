import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Package, Calendar, BarChart3 } from 'lucide-react';
import { mockDashboardStats, mockOrders, mockUsers } from '../../data/mockData';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState(mockDashboardStats);
  const [timeRange, setTimeRange] = useState('12months');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const getRevenueGrowth = () => {
    const currentMonth = stats.monthlyOrders[stats.monthlyOrders.length - 1];
    const previousMonth = stats.monthlyOrders[stats.monthlyOrders.length - 2];
    if (!previousMonth) return 0;
    return ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100);
  };

  const getOrderGrowth = () => {
    const currentMonth = stats.monthlyOrders[stats.monthlyOrders.length - 1];
    const previousMonth = stats.monthlyOrders[stats.monthlyOrders.length - 2];
    if (!previousMonth) return 0;
    return ((currentMonth.count - previousMonth.count) / previousMonth.count * 100);
  };

  const getStatusDistribution = () => {
    const statusCounts = mockOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: (count / mockOrders.length * 100).toFixed(1)
    }));
  };

  const getTopClients = () => {
    const clientStats = mockOrders.reduce((acc, order) => {
      if (!acc[order.clientId]) {
        acc[order.clientId] = {
          client: order.client,
          totalOrders: 0,
          totalSpent: 0
        };
      }
      acc[order.clientId].totalOrders++;
      acc[order.clientId].totalSpent += order.totalPrice;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(clientStats)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  };

  const statusDistribution = getStatusDistribution();
  const topClients = getTopClients();
  const revenueGrowth = getRevenueGrowth();
  const orderGrowth = getOrderGrowth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600 mt-2">Analyse détaillée de votre activité</p>
        </div>
        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="3months">3 derniers mois</option>
            <option value="12months">12 derniers mois</option>
          </select>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalRevenue.toLocaleString()}MGA
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className={`w-4 h-4 mr-1 ${revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commandes totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className={`w-4 h-4 mr-1 ${orderGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm ${orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {orderGrowth >= 0 ? '+' : ''}{orderGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clients actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockUsers.filter(u => u.role === 'client').length}
              </p>
              <p className="text-sm text-gray-500 mt-1">+2 ce mois</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Panier moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.totalRevenue / stats.totalOrders).toFixed(0)}MGA
              </p>
              <p className="text-sm text-gray-500 mt-1">Par commande</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Évolution mensuelle */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Évolution mensuelle</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.monthlyOrders.slice(-6).map((month, index) => {
                const maxRevenue = Math.max(...stats.monthlyOrders.slice(-6).map(m => m.revenue));
                const maxOrders = Math.max(...stats.monthlyOrders.slice(-6).map(m => m.count));
                
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
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: `${(month.count / maxOrders) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Répartition des statuts */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Répartition des commandes</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusDistribution.map(({ status, count, percentage }) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'devis': return 'bg-blue-500';
                    case 'en_attente': return 'bg-yellow-500';
                    case 'en_cours': return 'bg-orange-500';
                    case 'terminee': return 'bg-green-500';
                    case 'livree': return 'bg-emerald-500';
                    case 'annulee': return 'bg-red-500';
                    default: return 'bg-gray-500';
                  }
                };

                const getStatusLabel = (status: string) => {
                  switch (status) {
                    case 'devis': return 'Devis';
                    case 'en_attente': return 'En attente';
                    case 'en_cours': return 'En cours';
                    case 'terminee': return 'Terminées';
                    case 'livree': return 'Livrées';
                    case 'annulee': return 'Annulées';
                    default: return status;
                  }
                };

                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${getStatusColor(status)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Services populaires */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Services les plus demandés</h2>
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
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${(service.count / stats.topServices[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{service.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top clients */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Meilleurs clients</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.map((clientData: any, index) => (
                <div key={clientData.client.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{clientData.client.name}</p>
                      <p className="text-xs text-gray-600">{clientData.totalOrders} commandes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {clientData.totalSpent.toFixed(0)}MGA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};