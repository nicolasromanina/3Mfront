import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { logger } from '@/utils/logger';
import { SocketUser } from '@/types';

class SocketService {
  private io: Server | null = null;
  private connectedUsers: Map<string, SocketUser> = new Map();

  initialize(io: Server) {
    this.io = io;
    
    // Authentication middleware
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await User.findById(decoded.id);
        
        if (!user || !user.isActive) {
          return next(new Error('Authentication error'));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      this.handleConnection(socket);
    });

    logger.info('Socket.IO initialized');
  }

  private handleConnection(socket: Socket) {
    const user = socket.data.user;
    
    // Store connected user
    this.connectedUsers.set(socket.id, {
      userId: user._id.toString(),
      socketId: socket.id,
      role: user.role
    });

    logger.info(`User ${user.email} connected with socket ${socket.id}`);

    // Join user to their personal room
    socket.join(`user:${user._id}`);
    
    // Join admin users to admin room
    if (user.role === 'admin') {
      socket.join('admin');
    }

    // Handle chat events
    socket.on('join_chat', (data) => {
      if (data.orderId) {
        socket.join(`order:${data.orderId}`);
      }
    });

    socket.on('leave_chat', (data) => {
      if (data.orderId) {
        socket.leave(`order:${data.orderId}`);
      }
    });

    socket.on('send_message', (data) => {
      // Emit to order room or general admin room
      if (data.orderId) {
        socket.to(`order:${data.orderId}`).emit('new_message', data);
      } else {
        // General support message
        if (user.role === 'client') {
          socket.to('admin').emit('new_message', data);
        } else {
          socket.to(`user:${data.recipientId}`).emit('new_message', data);
        }
      }
    });

    socket.on('typing', (data) => {
      if (data.orderId) {
        socket.to(`order:${data.orderId}`).emit('user_typing', {
          userId: user._id,
          userName: user.name,
          isTyping: data.isTyping
        });
      }
    });

    socket.on('disconnect', () => {
      this.connectedUsers.delete(socket.id);
      logger.info(`User ${user.email} disconnected`);
    });
  }

  // Send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit('new_notification', notification);
    }
  }

  // Send notification to all admins
  sendNotificationToAdmins(notification: any) {
    if (this.io) {
      this.io.to('admin').emit('new_notification', notification);
    }
  }

  // Send order update to client and admins
  sendOrderUpdate(orderId: string, clientId: string, orderData: any) {
    if (this.io) {
      this.io.to(`user:${clientId}`).emit('order_updated', orderData);
      this.io.to('admin').emit('order_updated', orderData);
      this.io.to(`order:${orderId}`).emit('order_updated', orderData);
    }
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get connected admins count
  getConnectedAdminsCount(): number {
    return Array.from(this.connectedUsers.values())
      .filter(user => user.role === 'admin').length;
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return Array.from(this.connectedUsers.values())
      .some(user => user.userId === userId);
  }
}

export const socketService = new SocketService();

export const initializeSocket = (io: Server) => {
  socketService.initialize(io);
};