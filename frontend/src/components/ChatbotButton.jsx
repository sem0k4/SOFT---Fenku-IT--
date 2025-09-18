import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MessageCircle, 
  Bot, 
  X, 
  Minimize2, 
  Maximize2,
  Sparkles,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

const ChatbotButton = ({ 
  isOpen, 
  onToggle, 
  isMinimized, 
  onToggleMinimize,
  unreadCount = 0,
  isTyping = false,
  className 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex flex-col items-end gap-2">
          {/* Bouton de minimisation/maximisation */}
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleMinimize}
            className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4 text-blue-600" />
            ) : (
              <Minimize2 className="h-4 w-4 text-blue-600" />
            )}
          </Button>
          
          {/* Bouton de fermeture */}
          <Button
            variant="outline"
            size="icon"
            onClick={onToggle}
            className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border-2 border-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* Indicateur de frappe */}
        {isTyping && (
          <div className="absolute -top-2 -right-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* Badge de messages non lus */}
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}

        {/* Bouton principal */}
        <Button
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110",
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
            "border-2 border-white dark:border-gray-800",
            className
          )}
          size="icon"
        >
          <div className="relative">
            {isHovered ? (
              <Bot className="h-6 w-6 text-white animate-pulse" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
            
            {/* Effet de brillance */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </Button>

        {/* Tooltip */}
        <div className={cn(
          "absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg shadow-lg transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span>Assistant médical IA</span>
          </div>
          <div className="text-xs text-gray-300 dark:text-gray-600 mt-1">
            Cliquez pour commencer
          </div>
          
          {/* Flèche du tooltip */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>

        {/* Animation de pulsation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default ChatbotButton;

