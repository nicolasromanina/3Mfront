import Notification from '@/models/Notification';
import { socketService } from './socketService';
import { logger } from '@/utils/logger';
import { Types } from 'mongoose';

class NotificationService {
  async createNotification(data: {
    userId: string | Types.ObjectId;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    orderId?: string | Types.ObjectId;
    actionUrl?: string;
  }) {
    try {
      const notification = new Notification({
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        orderId: data.orderId,
        actionUrl: data.actionUrl
      });

      await notification.save();
      await notification.populate('user', 'name email');

      // Send real-time notification
      socketService.sendNotificationToUser(
        notification.userId.toString(),
        notification.toJSON()
      );

      logger.info(`Notification created for user ${notification.userId}`);
      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ) {
    const skip = (page - 1) * limit;
    const filter: any = { userId };
    
    if (unreadOnly) {
      filter.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('order', 'orderNumber status'),
      Notification.countDocuments(filter)
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({ userId, isRead: false });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return { message: 'Notification deleted successfully' };
  }

  async deleteOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true
    });

    logger.info(`Deleted ${result.deletedCount} old notifications`);
    return result;
  }

  // Notification templates
  async notifyOrderStatusChange(
    userId: string,
    orderId: string,
    orderNumber: string,
    newStatus: string
  ) {
    const statusMessages: Record<string, { title: string; message: string; type: any }> = {
      'en_attente': {
        title: 'Commande en attente',
        message: `Votre commande #${orderNumber} est en attente de validation.`,
        type: 'info'
      },
      'en_cours': {
        title: 'Commande en cours',
        message: `Votre commande #${orderNumber} est maintenant en cours de production.`,
        type: 'info'
      },
      'terminee': {
        title: 'Commande terminée',
        message: `Votre commande #${orderNumber} est terminée et prête pour la livraison.`,
        type: 'success'
      },
      'livree': {
        title: 'Commande livrée',
        message: `Votre commande #${orderNumber} a été livrée avec succès.`,
        type: 'success'
      },
      'annulee': {
        title: 'Commande annulée',
        message: `Votre commande #${orderNumber} a été annulée.`,
        type: 'warning'
      }
    };

    const template = statusMessages[newStatus];
    if (template) {
      await this.createNotification({
        userId,
        title: template.title,
        message: template.message,
        type: template.type,
        orderId,
        actionUrl: `/orders/${orderId}`
      });
    }
  }

  async notifyNewOrder(adminUserIds: string[], orderNumber: string, clientName: string) {
    const promises = adminUserIds.map(adminId =>
      this.createNotification({
        userId: adminId,
        title: 'Nouvelle commande',
        message: `Une nouvelle commande #${orderNumber} a été passée par ${clientName}.`,
        type: 'info',
        actionUrl: `/admin/orders`
      })
    );

    await Promise.all(promises);
  }

  async notifyLowStock(adminUserIds: string[], itemName: string, currentStock: number) {
    const promises = adminUserIds.map(adminId =>
      this.createNotification({
        userId: adminId,
        title: 'Stock faible',
        message: `Le stock de "${itemName}" est faible (${currentStock} unités restantes).`,
        type: 'warning',
        actionUrl: '/admin/inventory'
      })
    );

    await Promise.all(promises);
  }
}

export const notificationService = new NotificationService();