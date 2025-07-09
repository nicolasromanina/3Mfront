export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'flyers' | 'cartes' | 'affiches' | 'brochures' | 'autres';
  basePrice: number;
  unit: 'unité' | 'page' | 'm²';
  options: ServiceOption[];
  minQuantity: number;
  maxQuantity: number;
}

export interface ServiceOption {
  id: string;
  name: string;
  type: 'select' | 'checkbox' | 'number';
  options?: string[];
  priceModifier: number; // Multiplicateur ou ajout de prix
  required: boolean;
}

export interface OrderItem {
  serviceId: string;
  service: Service;
  quantity: number;
  options: Record<string, any>;
  unitPrice: number;
  totalPrice: number;
  files?: File[];
}

export interface Order {
  id: string;
  clientId: string;
  client: User;
  items: OrderItem[];
  status: 'devis' | 'en_attente' | 'en_cours' | 'terminee' | 'livree' | 'annulee';
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  quotePdf?: string;
  invoicePdf?: string;
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  orderId?: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyOrders: Array<{ month: string; count: number; revenue: number }>;
  topServices: Array<{ service: string; count: number }>;
}