import React, { useState, useEffect } from 'react';
import ChatbotMedical from './ChatbotMedical';
import ChatbotButton from './ChatbotButton';
import ChatbotLoading from './ChatbotLoading';

const ChatbotStandalone = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Simuler un utilisateur pour le chatbot
  useEffect(() => {
    const loadUser = () => {
      const userData = {
        id: 1,
        name: 'Utilisateur Test',
        email: 'test@example.com',
        role: 'patient',
        medicalData: {
          allergies: [
            { name: 'Pollens', type: 'saisonnière', severity: 'modérée' },
            { name: 'Pénicilline', type: 'médicamenteuse', severity: 'sévère' }
          ],
          medications: [
            { name: 'Metformine', dosage: '500mg', frequency: '2x/jour' },
            { name: 'Lisinopril', dosage: '10mg', frequency: '1x/jour' }
          ],
          medicalHistory: [
            { condition: 'Diabète de type 2', date: '2020', status: 'En cours' },
            { condition: 'Hypertension artérielle', date: '2019', status: 'Contrôlée' }
          ],
          appointments: [
            { date: '2024-01-15', time: '14:30', doctor: 'Dr. Martin', type: 'Consultation générale' }
          ]
        }
      };
      
      setUser(userData);
      setIsLoading(false);
    };

    // Délai pour simuler le chargement
    setTimeout(loadUser, 1000);
  }, []);

  // Simuler des messages non lus
  useEffect(() => {
    if (!isOpen && !isLoading) {
      const interval = setInterval(() => {
        setUnreadCount(prev => Math.min(prev + 1, 99));
      }, 30000);

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

export default ChatbotStandalone;

