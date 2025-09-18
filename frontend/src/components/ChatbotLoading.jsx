import React from 'react';
import { Card, CardContent } from './ui/card';
import { Bot, Loader2 } from 'lucide-react';

const ChatbotLoading = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 shadow-2xl border-0 bg-white dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Bot className="h-8 w-8 text-blue-600" />
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin absolute -top-1 -right-1" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Initialisation du chatbot...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Chargement des données médicales
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotLoading;

