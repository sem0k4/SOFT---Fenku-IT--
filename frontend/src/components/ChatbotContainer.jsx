import React, { useState, useEffect } from 'react';
import ChatbotMedical from './ChatbotMedical';
import ChatbotButton from './ChatbotButton';
import ChatbotLoading from './ChatbotLoading';
import { useAuth } from '../services/auth';

const ChatbotContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user, loading } = useAuth();

  // Gérer le chargement et les erreurs
  useEffect(() => {
    if (!loading) {
      if (user) {
        setIsLoading(false);
        setHasError(false);
      } else {
        // Même sans utilisateur, on peut afficher le chatbot avec des données par défaut
        setIsLoading(false);
        setHasError(false);
      }
    }
  }, [loading, user]);

  // Simuler des messages non lus (dans une vraie app, cela viendrait d'un service)
  useEffect(() => {
    if (!isOpen && !isLoading) {
      // Simuler des notifications
      const interval = setInterval(() => {
        setUnreadCount(prev => Math.min(prev + 1, 99));
      }, 30000); // Toutes les 30 secondes

      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isOpen, isLoading]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Afficher le composant de chargement
  if (isLoading) {
    return <ChatbotLoading />;
  }

  // Afficher une erreur si nécessaire
  if (hasError) {
    return null; // L'ErrorBoundary s'occupera de l'affichage
  }

  return (
    <>
      <ChatbotButton
        isOpen={isOpen}
        onToggle={handleToggle}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
        unreadCount={unreadCount}
        className="fixed bottom-4 right-4 z-50"
      />
      
      <ChatbotMedical
        isOpen={isOpen}
        onClose={handleClose}
        userProfile={user}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
      />
    </>
  );
};

export default ChatbotContainer;
