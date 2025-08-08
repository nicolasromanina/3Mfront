import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'client' | 'admin';
  phone?: string;
  address?: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IService extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: 'flyers' | 'cartes' | 'affiches' | 'brochures' | 'autres';
  basePrice: number;
  unit: 'unité' | 'page' | 'm²';
  options: IServiceOption[];
  minQuantity: number;
  maxQuantity: number;
  isActive: boolean;
  images: string[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceOption {
  id: string;
  name: string;
  type: 'select' | 'checkbox' | 'number';
  options?: string[];
  priceModifier: number;
  required: boolean;
}

export interface IOrderItem {
  serviceId: Types.ObjectId;
  service: IService;
  quantity: number;
  options: Record<string, any>;
  unitPrice: number;
  totalPrice: number;
  files: string[];
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNumber: string;
  clientId: Types.ObjectId;
  client: IUser;
  items: IOrderItem[];
  status: 'devis' | 'en_attente' | 'en_cours' | 'terminee' | 'livree' | 'annulee';
  totalPrice: number;
  notes?: string;
  adminNotes?: string;
  quotePdf?: string;
  invoicePdf?: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage extends Document {
  _id: Types.ObjectId;
  orderId?: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: 'client' | 'admin';
  message: string;
  attachments: string[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  readAt?: Date;
  orderId?: Types.ObjectId;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInventoryItem extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  cost: number;
  lastRestocked: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response interfaces
export interface AuthRequest extends Request {
  user?: IUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  unit: string;
  options: IServiceOption[];
  minQuantity: number;
  maxQuantity: number;
}

export interface CreateOrderRequest {
  items: {
    serviceId: string;
    quantity: number;
    options: Record<string, any>;
  }[];
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
  adminNotes?: string;
  dueDate?: string;
}

export interface SendMessageRequest {
  orderId?: string;
  message: string;
  attachments?: string[];
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyStats: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
  topServices: Array<{
    service: string;
    count: number;
    revenue: number;
  }>;
  recentOrders: IOrder[];
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  clientId?: string;
  serviceCategory?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SocketUser {
  userId: string;
  socketId: string;
  role: 'client' | 'admin';
}