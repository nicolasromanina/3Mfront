import React from 'react';
import { ChatWindow } from '../../components/chat/ChatWindow';

export const ChatPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Client</h1>
        <p className="text-gray-600 mt-2">
          Contactez notre équipe pour toute question ou assistance
        </p>
      </div>

      <div className="max-w-4xl">
        <ChatWindow />
      </div>
    </div>
  );
};