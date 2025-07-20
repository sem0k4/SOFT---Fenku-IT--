<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
import { authService } from './api';

// Service d'authentification pour gérer l'état de connexion de l'utilisateur
const AuthService = {
  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return localStorage.getItem('access') !== null;
  },
  
  // Récupérer le token d'authentification
  getToken: () => {
    return localStorage.getItem('access');
  },
  
  // Récupérer les informations de l'utilisateur connecté
  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },
  
  // Connexion de l'utilisateur
  login: async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      // Stocker les tokens et les informations de l'utilisateur
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Déconnexion de l'utilisateur
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        await authService.logout({ refresh: refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
    }
  },
  
  // Renvoi de l'email de confirmation
  resendConfirmationEmail: async (email) => {
    try {
      const response = await authService.resendConfirmationEmail(email);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Réinitialisation du mot de passe - Demande
  requestPasswordReset: async (email) => {
    try {
      const response = await authService.requestPasswordReset(email);
      localStorage.setItem('resetEmail', email); // Stocker l'email pour les étapes suivantes
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Réinitialisation du mot de passe - Vérification du code
  verifyResetCode: async (email, code) => {
    try {
      const response = await authService.verifyResetCode(email, code);
      localStorage.setItem('resetCode', code); // Stocker le code pour l'étape finale
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Réinitialisation du mot de passe - Définition du nouveau mot de passe
  setNewPassword: async (email, code, password) => {
    try {
      const response = await authService.setNewPassword(email, code, password);
      // Nettoyer les données temporaires après réinitialisation réussie
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

<<<<<<< HEAD
=======
import { authService } from './api';

// Service d'authentification pour gérer l'état de connexion de l'utilisateur
const AuthService = {
  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return localStorage.getItem('access') !== null;
  },
  
  // Récupérer le token d'authentification
  getToken: () => {
    return localStorage.getItem('access');
  },
  
  // Récupérer les informations de l'utilisateur connecté
  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },
  
  // Connexion de l'utilisateur
  login: async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      // Stocker les tokens et les informations de l'utilisateur
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Déconnexion de l'utilisateur
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        await authService.logout({ refresh: refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
    }
  },
  
  // Renvoi de l'email de confirmation
  resendConfirmationEmail: async (email) => {
    try {
      const response = await authService.resendConfirmationEmail(email);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Réinitialisation du mot de passe - Demande
  requestPasswordReset: async (email) => {
    try {
      const response = await authService.requestPasswordReset(email);
      localStorage.setItem('resetEmail', email); // Stocker l'email pour les étapes suivantes
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Réinitialisation du mot de passe - Vérification du code
  verifyResetCode: async (email, code) => {
    try {
      const response = await authService.verifyResetCode(email, code);
      localStorage.setItem('resetCode', code); // Stocker le code pour l'étape finale
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Réinitialisation du mot de passe - Définition du nouveau mot de passe
  setNewPassword: async (email, code, password) => {
    try {
      const response = await authService.setNewPassword(email, code, password);
      // Nettoyer les données temporaires après réinitialisation réussie
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
export default AuthService;