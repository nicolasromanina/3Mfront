import { create } from 'zustand';
import { ChatMessage } from '../types';
import { mockChatMessages } from '../data/mockData';

interface ChatState {
  messages: ChatMessage[];
  unreadCount: number;
  loading: boolean;
  
  fetchMessages: (userId?: string, orderId?: string) => Promise<void>;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  markAsRead: (messageId: string) => void;
  markAllAsRead: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  unreadCount: 0,
  loading: false,
  
  fetchMessages: async (userId, orderId) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredMessages = [...mockChatMessages];
    
    if (orderId) {
      filteredMessages = filteredMessages.filter(msg => msg.orderId === orderId);
    }
    
    if (userId) {
      filteredMessages = filteredMessages.filter(msg => 
        msg.senderId === userId || 
        (msg.senderRole === 'admin' && mockChatMessages.some(m => m.senderId === userId))
      );
    }
    
    const unreadCount = filteredMessages.filter(msg => !msg.read && msg.senderId !== userId).length;
    
    set({ 
      messages: filteredMessages, 
      unreadCount,
      loading: false 
    });
  },
  
  sendMessage: async (messageData) => {
    const { messages } = get();
    
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    set({ messages: [...messages, newMessage] });
    
    // Simulation de réponse automatique admin
    if (messageData.senderRole === 'client') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          orderId: messageData.orderId,
          senderId: '2',
          senderName: 'Admin Système',
          senderRole: 'admin',
          message: 'Merci pour votre message. Un membre de notre équipe vous répondra rapidement.',
          timestamp: new Date().toISOString(),
          read: false
        };
        
        set({ messages: [...get().messages, autoReply] });
      }, 2000);
    }
  },
  
  markAsRead: (messageId) => {
    const { messages } = get();
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    
    const unreadCount = updatedMessages.filter(msg => !msg.read).length;
    
    set({ messages: updatedMessages, unreadCount });
  },
  
  markAllAsRead: (userId) => {
    const { messages } = get();
    const updatedMessages = messages.map(msg => 
      msg.senderId !== userId ? { ...msg, read: true } : msg
    );
    
    set({ messages: updatedMessages, unreadCount: 0 });
  }
}));