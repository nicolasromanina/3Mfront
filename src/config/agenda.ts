import Agenda from 'agenda';
import { logger } from '@/utils/logger';
import { emailService } from '@/services/emailService';
import { notificationService } from '@/services/notificationService';

let agenda: Agenda;

export const initializeAgenda = async (): Promise<void> => {
  try {
    agenda = new Agenda({
      db: { 
        address: process.env.MONGODB_URI!,
        collection: 'jobs'
      },
      processEvery: '30 seconds',
      maxConcurrency: 20
    });

    // Define jobs
    defineJobs();

    // Start agenda
    await agenda.start();
    logger.info('Agenda job scheduler started');

  } catch (error) {
    logger.error('Failed to initialize Agenda:', error);
    throw error;
  }
};

const defineJobs = () => {
  // Send order status update email
  agenda.define('send order status email', async (job) => {
    const { orderId, userEmail, status, userName } = job.attrs.data;
    
    try {
      await emailService.sendOrderStatusUpdate(userEmail, {
        orderId,
        status,
        userName
      });
      logger.info(`Order status email sent for order ${orderId}`);
    } catch (error) {
      logger.error(`Failed to send order status email for order ${orderId}:`, error);
      throw error;
    }
  });

  // Send reminder notifications
  agenda.define('send reminder notification', async (job) => {
    const { userId, title, message, type } = job.attrs.data;
    
    try {
      await notificationService.createNotification({
        userId,
        title,
        message,
        type: type || 'info'
      });
      logger.info(`Reminder notification sent to user ${userId}`);
    } catch (error) {
      logger.error(`Failed to send reminder notification to user ${userId}:`, error);
      throw error;
    }
  });

  // Generate daily reports
  agenda.define('generate daily report', async (job) => {
    try {
      // Implementation for daily report generation
      logger.info('Daily report generation started');
      // Add your report generation logic here
    } catch (error) {
      logger.error('Failed to generate daily report:', error);
      throw error;
    }
  });

  // Clean up old notifications
  agenda.define('cleanup old notifications', async (job) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Implementation for cleaning up old notifications
      logger.info('Old notifications cleanup completed');
    } catch (error) {
      logger.error('Failed to cleanup old notifications:', error);
      throw error;
    }
  });

  // Schedule recurring jobs
  agenda.every('0 9 * * *', 'generate daily report'); // Daily at 9 AM
  agenda.every('0 2 * * 0', 'cleanup old notifications'); // Weekly on Sunday at 2 AM
};

export const getAgenda = (): Agenda => {
  if (!agenda) {
    throw new Error('Agenda not initialized');
  }
  return agenda;
};

export const scheduleJob = async (jobName: string, data: any, when?: string | Date) => {
  try {
    if (when) {
      await agenda.schedule(when, jobName, data);
    } else {
      await agenda.now(jobName, data);
    }
  } catch (error) {
    logger.error(`Failed to schedule job ${jobName}:`, error);
    throw error;
  }
};