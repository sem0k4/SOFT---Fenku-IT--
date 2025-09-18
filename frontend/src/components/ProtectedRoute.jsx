import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

const ProtectedRoute = ({ children }) => {
  // Vérifier si l'utilisateur est authentifié
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Si non authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si authentifié, afficher le composant enfant
  return children;
};

export default ProtectedRoute;
