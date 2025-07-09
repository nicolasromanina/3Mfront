import { create } from 'zustand';
import { Order, OrderItem, Service } from '../types';
import { mockOrders, mockServices } from '../data/mockData';

interface OrderState {
  orders: Order[];
  currentOrder: OrderItem[];
  services: Service[];
  loading: boolean;
  
  // Actions
  fetchOrders: (clientId?: string) => Promise<void>;
  fetchServices: () => Promise<void>;
  addToOrder: (item: OrderItem) => void;
  removeFromOrder: (index: number) => void;
  updateOrderItem: (index: number, item: OrderItem) => void;
  clearOrder: () => void;
  submitOrder: (clientId: string, notes?: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  calculatePrice: (service: Service, quantity: number, options: Record<string, any>) => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: [],
  services: [],
  loading: false,
  
  fetchOrders: async (clientId) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filteredOrders = clientId 
      ? mockOrders.filter(order => order.clientId === clientId)
      : mockOrders;
    
    set({ orders: filteredOrders, loading: false });
  },
  
  fetchServices: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ services: mockServices, loading: false });
  },
  
  addToOrder: (item) => {
    const { currentOrder } = get();
    set({ currentOrder: [...currentOrder, item] });
  },
  
  removeFromOrder: (index) => {
    const { currentOrder } = get();
    const newOrder = currentOrder.filter((_, i) => i !== index);
    set({ currentOrder: newOrder });
  },
  
  updateOrderItem: (index, item) => {
    const { currentOrder } = get();
    const newOrder = [...currentOrder];
    newOrder[index] = item;
    set({ currentOrder: newOrder });
  },
  
  clearOrder: () => {
    set({ currentOrder: [] });
  },
  
  submitOrder: async (clientId, notes) => {
    const { currentOrder, orders } = get();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      clientId,
      client: mockOrders[0].client, // Simulation
      items: currentOrder,
      status: 'devis',
      totalPrice: currentOrder.reduce((sum, item) => sum + item.totalPrice, 0),
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set({ 
      orders: [...orders, newOrder],
      currentOrder: []
    });
    
    return newOrder.id;
  },
  
  updateOrderStatus: async (orderId, status) => {
    const { orders } = get();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    );
    
    set({ orders: updatedOrders });
  },
  
  calculatePrice: (service, quantity, options) => {
    let price = service.basePrice;
    
    service.options.forEach(option => {
      const selectedValue = options[option.id];
      if (selectedValue) {
        if (option.type === 'checkbox' && selectedValue) {
          price *= option.priceModifier;
        } else if (option.type === 'select' && selectedValue !== option.options?.[0]) {
          price *= option.priceModifier;
        }
      }
    });
    
    return price * quantity;
  }
}));