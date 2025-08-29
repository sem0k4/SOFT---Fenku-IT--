<<<<<<< HEAD
import axios from 'axios';

// Création d'une instance axios avec une configuration de base
export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // Modifié de 'token' à 'access'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service d'authentification pour les appels API
export const authService = {
  // Connexion utilisateur
  login: (username, password) => {
    return api.post('/auth/login/', { username, password });
  },
  
  // Inscription utilisateur
  register: (userData) => {
    return api.post('/auth/register/', userData);
  },
  
  // Renvoi de l'email de confirmation
  resendConfirmationEmail: (email) => {
    return api.post('/auth/resend-confirmation-email/', { email });
  },
  
  // Demande de réinitialisation de mot de passe
  requestPasswordReset: (email) => {
    return api.post('/auth/request-password-reset/', { email });
  },
  
  // Vérification du code de réinitialisation
  verifyResetCode: (email, code) => {
    return api.post('/auth/verify-reset-code/', { email, code });
  },
  
  // Définition d'un nouveau mot de passe
  setNewPassword: (email, code, password) => {
    return api.post('/auth/set-new-password/', { email, code, password });
  },
};

// Service pour les utilisateurs
export const userService = {
  // Récupérer le profil de l'utilisateur connecté
  getProfile: () => {
    return api.get('/auth/profile/');
  },
  
  // Mettre à jour le profil de l'utilisateur
  updateProfile: (userData) => {
    return api.put('/auth/profile/', userData);
  },
};

// Exportation de l'instance API pour une utilisation directe si nécessaire
=======
import axios from 'axios';

// Création d'une instance axios avec une configuration de base
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // Modifié de 'token' à 'access'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service d'authentification pour les appels API
export const authService = {
  // Connexion utilisateur
  login: (username, password) => {
    return api.post('/auth/login/', { username, password });
  },
  
  // Inscription utilisateur
  register: (userData) => {
    return api.post('/auth/register/', userData);
  },
  
  // Renvoi de l'email de confirmation
  resendConfirmationEmail: (email) => {
    return api.post('/auth/resend-confirmation-email/', { email });
  },
  
  // Demande de réinitialisation de mot de passe
  requestPasswordReset: (email) => {
    return api.post('/auth/request-password-reset/', { email });
  },
  
  // Vérification du code de réinitialisation
  verifyResetCode: (email, code) => {
    return api.post('/auth/verify-reset-code/', { email, code });
  },
  
  // Définition d'un nouveau mot de passe
  setNewPassword: (email, code, password) => {
    return api.post('/auth/set-new-password/', { email, code, password });
  },

  // Déconnexion utilisateur
  logout: (refreshToken) => {
    return api.post('/auth/logout/', refreshToken);
  },
};

// Service pour les utilisateurs
export const userService = {
  // Récupérer le profil de l'utilisateur connecté
  getProfile: () => {
    return api.get('/auth/profile/');
  },
  
  // Mettre à jour le profil de l'utilisateur
  updateProfile: (userData) => {
    return api.put('/auth/profile/', userData);
  },
};

// Exportation de l'instance API pour une utilisation directe si nécessaire
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
export default api;