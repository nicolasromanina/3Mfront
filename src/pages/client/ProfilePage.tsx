import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, Shield, Bell, Download, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { orders } = useOrderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences' | 'activity'>('info');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    company: '',
    website: '',
    bio: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    newsletter: false,
    language: 'fr',
    timezone: 'Europe/Paris',
    currency: 'EUR'
  });

  const handleSaveProfile = () => {
    // Simulation de sauvegarde
    toast.success('Profil mis à jour avec succès !');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    toast.success('Mot de passe modifié avec succès !');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorEnabled: securityData.twoFactorEnabled });
  };

  const handleExportData = () => {
    toast.success('Export des données en cours...');
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      toast.error('Suppression du compte annulée pour la démo');
    }
  };

  const userStats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.totalPrice, 0),
    averageOrder: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length : 0,
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
  };

  const tabs = [
    { id: 'info', label: 'Informations', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Bell },
    { id: 'activity', label: 'Activité', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportData}
            className="w-full sm:w-auto"
          >
            Exporter mes données
          </Button>
        </div>
      </div>

      {/* Statistiques utilisateur */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{userStats.totalOrders}</div>
          <div className="text-sm text-gray-600">Commandes</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{userStats.totalSpent.toFixed(0)}MGA</div>
          <div className="text-sm text-gray-600">Total dépensé</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">{userStats.averageOrder.toFixed(0)}MGA</div>
          <div className="text-sm text-gray-600">Panier moyen</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">{userStats.memberSince}</div>
          <div className="text-sm text-gray-600">Membre depuis</div>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'info' && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold">Informations personnelles</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                    className="mt-2 sm:mt-0"
                  >
                    {isEditing ? 'Sauvegarder' : 'Modifier'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nom complet"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Téléphone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Entreprise"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <Input
                    label="Adresse"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Site web"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-50"
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Changer le mot de passe</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        label="Mot de passe actuel"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        label="Nouveau mot de passe"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Input
                      type="password"
                      label="Confirmer le nouveau mot de passe"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <Button onClick={handleChangePassword}>
                      Changer le mot de passe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Authentification à deux facteurs</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-gray-700">Sécurisez votre compte avec l'authentification à deux facteurs</p>
                      <p className="text-sm text-gray-500">Recommandé pour une sécurité maximale</p>
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={securityData.twoFactorEnabled}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Activer</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-red-600">Zone de danger</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Supprimer le compte</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Cette action est irréversible. Toutes vos données seront supprimées.
                      </p>
                      <Button variant="danger" onClick={handleDeleteAccount}>
                        Supprimer mon compte
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Préférences de notification</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevez des emails pour les mises à jour importantes' },
                        { key: 'smsNotifications', label: 'Notifications SMS', desc: 'Recevez des SMS pour les commandes urgentes' },
                        { key: 'orderUpdates', label: 'Mises à jour de commandes', desc: 'Notifications sur l\'état de vos commandes' },
                        { key: 'marketingEmails', label: 'Emails marketing', desc: 'Offres spéciales et promotions' },
                        { key: 'newsletter', label: 'Newsletter', desc: 'Newsletter mensuelle avec nos actualités' }
                      ].map(item => (
                        <div key={item.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                          <div className="mb-2 sm:mb-0">
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-sm text-gray-600">{item.desc}</div>
                          </div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={preferences[item.key as keyof typeof preferences] as boolean}
                              onChange={(e) => setPreferences(prev => ({ ...prev, [item.key]: e.target.checked }))}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">Activer</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Préférences régionales</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire</label>
                        <select
                          value={preferences.timezone}
                          onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        >
                          <option value="Europe/Paris">Paris (UTC+1)</option>
                          <option value="Europe/London">Londres (UTC+0)</option>
                          <option value="America/New_York">New York (UTC-5)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                        <select
                          value={preferences.currency}
                          onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        >
                          <option value="EUR">Ariary (MGA)</option>
                          <option value="USD">Dollar ($)</option>
                          <option value="GBP">Livre (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Button>Sauvegarder les préférences</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'activity' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Activité récente</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                      <div className="mb-2 sm:mb-0">
                        <div className="font-medium text-gray-900">Commande #{order.id}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.totalPrice.toFixed(2)}€
                        </div>
                      </div>
                      <Badge variant={order.status === 'terminee' ? 'success' : 'info'}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Photo de profil */}
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600 text-sm">{user?.email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Camera className="w-4 h-4" />}
                  className="mt-3"
                >
                  Changer la photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statut du compte */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Statut du compte</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email vérifié</span>
                  <Badge variant="success">Vérifié</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Téléphone vérifié</span>
                  <Badge variant="warning">En attente</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">2FA activé</span>
                  <Badge variant={securityData.twoFactorEnabled ? 'success' : 'danger'}>
                    {securityData.twoFactorEnabled ? 'Activé' : 'Désactivé'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Actions rapides</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger mes données
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Contacter le support
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Historique de sécurité
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};