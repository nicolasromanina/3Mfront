import React, { useState } from 'react';
import { Bell, Check, Trash2, Filter, AreaChart as MarkAsUnread, Archive } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'info';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            {notifications.filter(n => !n.read).length} notification{notifications.filter(n => !n.read).length > 1 ? 's' : ''} non lue{notifications.filter(n => !n.read).length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Check className="w-4 h-4" />}
            onClick={() => markAllAsRead('1')}
          >
            Tout marquer lu
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
          >
            Filtrer
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex space-x-2 overflow-x-auto">
        {[
          { key: 'all', label: 'Toutes', count: notifications.length },
          { key: 'unread', label: 'Non lues', count: notifications.filter(n => !n.read).length },
          { key: 'read', label: 'Lues', count: notifications.filter(n => n.read).length }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === filterOption.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{filterOption.label}</span>
            <Badge variant={filter === filterOption.key ? 'default' : 'info'} className="text-xs">
              {filterOption.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Actions en lot */}
      {selectedNotifications.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="text-sm font-medium text-blue-900">
                {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} sélectionnée{selectedNotifications.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" icon={<Check className="w-4 h-4" />}>
                Marquer comme lues
              </Button>
              <Button variant="outline" size="sm" icon={<Archive className="w-4 h-4" />}>
                Archiver
              </Button>
              <Button variant="outline" size="sm" icon={<Trash2 className="w-4 h-4" />}>
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des notifications */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {/* Sélection globale */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedNotifications.length === filteredNotifications.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">
              Sélectionner tout ({filteredNotifications.length})
            </span>
          </div>

          {filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read ? 'border-blue-200 bg-blue-50' : 'bg-white'
              } ${
                selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                  className="mt-1 rounded border-gray-300"
                />
                
                <div className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <Badge variant={getTypeVariant(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex space-x-1 mt-2 sm:mt-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Check className="w-4 h-4" />}
                          onClick={() => markAsRead(notification.id)}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<MarkAsUnread className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                        className="text-red-600 hover:text-red-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
          </h3>
          <p className="text-gray-600">
            {filter === 'unread' 
              ? 'Toutes vos notifications ont été lues'
              : 'Vous recevrez ici les mises à jour sur vos commandes'
            }
          </p>
        </Card>
      )}
    </div>
  );
};