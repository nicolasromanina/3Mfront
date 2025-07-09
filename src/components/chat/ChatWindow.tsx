import React, { useState, useEffect, useRef } from 'react';
import { Send, User, HeadphonesIcon } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ChatWindowProps {
  orderId?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ orderId }) => {
  const { user } = useAuthStore();
  const { messages, fetchMessages, sendMessage, markAsRead } = useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchMessages(user.id, orderId);
    }
  }, [user, orderId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    await sendMessage({
      orderId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: newMessage.trim(),
      read: false
    });
    
    setNewMessage('');
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-200">
        <HeadphonesIcon className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">
          {orderId ? `Chat - Commande #${orderId}` : 'Support Client'}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === user?.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {message.senderId !== user?.id && (
                  <User className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">
                  {message.senderName}
                </span>
                <span className="text-xs opacity-75">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            icon={<Send className="w-4 h-4" />}
            loading={loading}
            disabled={!newMessage.trim()}
          >
            Envoyer
          </Button>
        </div>
      </form>
    </Card>
  );
};