/**
 * Configuration de l'API Backend
 * Technologies: Vite, React
 * Configuration centralisée pour les URLs et paramètres de l'API
 */

// Configuration de base de l'API FENKU-IT
export const apiConfig = {
  // URL de base de l'API backend FENKU-IT
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  // Timeout pour les requêtes FENKU-IT
  timeout: 10000,
  
  // Headers par défaut FENKU-IT
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  
  // Configuration des endpoints FENKU-IT
  endpoints: {
    // Dossier médical FENKU-IT
    medicalRecord: (patientId) => `/patients/${patientId}/medical-record`,
    allergies: (patientId) => `/patients/${patientId}/allergies`,
    medications: (patientId) => `/patients/${patientId}/medications`,
    medicalHistory: (patientId) => `/patients/${patientId}/history`,
    
    // Médicaments FENKU-IT
    recognizeMedication: '/medications/recognize',
    medicationDetails: '/medications/details',
    drugInteractions: '/medications/interactions',
    
    // Consultations FENKU-IT
    consultations: (patientId) => `/patients/${patientId}/consultations`,
    saveConsultation: (patientId) => `/patients/${patientId}/consultations`,
    reminders: (patientId) => `/patients/${patientId}/reminders`,
    symptomFollowUp: (patientId) => `/patients/${patientId}/symptom-follow-up`,
    
    // Rapports FENKU-IT
    consultationSummary: (patientId, consultationId) => 
      `/patients/${patientId}/consultations/${consultationId}/summary`,
    exportForDoctor: (patientId) => `/patients/${patientId}/export`,
    
    // Contre-indications FENKU-IT
    checkContraindications: (patientId) => `/patients/${patientId}/check-contraindications`
  }
};

// Fonction pour obtenir l'URL complète d'un endpoint FENKU-IT
export const getApiUrl = (endpoint) => {
  return `${apiConfig.baseURL}${endpoint}`;
};

// Fonction pour obtenir le token d'authentification FENKU-IT
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Fonction pour obtenir les headers d'authentification FENKU-IT
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default apiConfig;
