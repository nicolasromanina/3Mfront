import React, { useEffect, useState } from 'react';
import { MessageCircle, User, Clock } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { mockUsers } from '../../data/mockData';

export const AdminChat: React.FC = () => {
  const { user } = useAuthStore();
  const { messages, fetchMessages } = useChatStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user, fetchMessages]);

  // Grouper les messages par client
  const conversations = messages.reduce((acc, message) => {
    const clientId = message.senderRole === 'client' ? message.senderId : 
                    messages.find(m => m.orderId === message.orderId && m.senderRole === 'client')?.senderId;
    
    if (clientId) {
      if (!acc[clientId]) {
        const client = mockUsers.find(u => u.id === clientId);
        acc[clientId] = {
          client,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        };
      }
      
      acc[clientId].messages.push(message);
      
      if (!acc[clientId].lastMessage || new Date(message.timestamp) > new Date(acc[clientId].lastMessage.timestamp)) {
        acc[clientId].lastMessage = message;
      }
      
      if (!message.read && message.senderRole === 'client') {
        acc[clientId].unreadCount++;
      }
    }
    
    return acc;
  }, {} as Record<string, any>);

  const conversationList = Object.values(conversations).sort((a: any, b: any) => 
    new Date(b.lastMessage?.timestamp || 0).getTime() - new Date(a.lastMessage?.timestamp || 0).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages Clients</h1>
        <p className="text-gray-600 mt-2">
          Gérez les conversations avec vos clients
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Liste des conversations */}
        <div className="lg:col-span-1">
          <Card className="h-full" padding={false}>
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-full">
              {conversationList.length > 0 ? (
                <div className="space-y-1 p-2">
                  {conversationList.map((conversation: any) => (
                    <button
                      key={conversation.client?.id}
                      onClick={() => setSelectedConversation(conversation.client?.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedConversation === conversation.client?.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 truncate">
                              {conversation.client?.name}
                            </h4>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="danger" className="ml-2">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage?.message}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {conversation.lastMessage && 
                              new Date(conversation.lastMessage.timestamp).toLocaleDateString()
                            }
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle className="w-12 h-12 mb-2" />
                  <p>Aucune conversation</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Fenêtre de chat */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="h-full">
              <ChatWindow />
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Sélectionnez une conversation</p>
                <p className="text-sm">Choisissez un client pour commencer à discuter</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};