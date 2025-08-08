import User from '@/models/User';
import { logger } from '@/utils/logger';

export const createDefaultAdmin = async (): Promise<void> => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      logger.info('Admin user already exists');
      return;
    }

    // Create default admin
    const adminData = {
      email: process.env.ADMIN_EMAIL || 'admin@printpro.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      name: process.env.ADMIN_NAME || 'Super Admin',
      role: 'admin' as const,
      isActive: true,
      isEmailVerified: true
    };

    const admin = new User(adminData);
    await admin.save();

    logger.info(`Default admin created with email: ${adminData.email}`);
    
  } catch (error) {
    logger.error('Error creating default admin:', error);
    throw error;
  }
};