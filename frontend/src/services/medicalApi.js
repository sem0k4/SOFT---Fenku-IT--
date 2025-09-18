import axios from 'axios';
import { apiConfig, getAuthHeaders } from '../config/api';

/**
 * Service API pour les interactions avec le dossier médical
 * Technologies: Axios, React
 * Gère toutes les communications avec l'API backend pour les données médicales
 */

// Configuration de base Axios FENKU-IT
const medicalApi = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    ...apiConfig.defaultHeaders,
  }
});

// Intercepteur pour ajouter le token d'authentification FENKU-IT
medicalApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse FENKU-IT
medicalApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers la connexion FENKU-IT
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Service pour la gestion du dossier médical du patient
 * Récupère et met à jour les informations médicales via l'API backend
 */
export const medicalRecordService = {
  // Récupérer le dossier médical complet FENKU-IT
  async getMedicalRecord(patientId) {
    try {
      const response = await medicalApi.get(apiConfig.endpoints.medicalRecord(patientId));
      return response.data;
    } catch (error) {
      console.error('Erreur récupération dossier médical:', error);
      throw new Error('Impossible de récupérer le dossier médical');
    }
  },

  // Récupérer les allergies du patient FENKU-IT
  async getAllergies(patientId) {
    try {
      const response = await medicalApi.get(apiConfig.endpoints.allergies(patientId));
      return response.data;
    } catch (error) {
      console.error('Erreur récupération allergies:', error);
      return []; // Retourner un tableau vide en cas d'erreur
    }
  },

  // Récupérer les médicaments en cours FENKU-IT
  async getCurrentMedications(patientId) {
    try {
      const response = await medicalApi.get(apiConfig.endpoints.medications(patientId));
      return response.data;
    } catch (error) {
      console.error('Erreur récupération médicaments:', error);
      return [];
    }
  },

  // Récupérer les antécédents médicaux FENKU-IT
  async getMedicalHistory(patientId) {
    try {
      const response = await medicalApi.get(apiConfig.endpoints.medicalHistory(patientId));
      return response.data;
    } catch (error) {
      console.error('Erreur récupération antécédents:', error);
      return [];
    }
  },

  // Vérifier les contre-indications d'un médicament FENKU-IT
  async checkContraindications(patientId, medicationName) {
    try {
      const response = await medicalApi.post(apiConfig.endpoints.checkContraindications(patientId), {
        medication: medicationName
      });
      return response.data;
    } catch (error) {
      console.error('Erreur vérification contre-indications:', error);
      return { hasContraindications: false, warnings: [] };
    }
  }
};

/**
 * Service pour la reconnaissance et gestion des médicaments
 * Gère l'OCR et la reconnaissance des médicaments via l'API backend
 */
export const medicationService = {
  // Reconnaître un médicament à partir d'une image FENKU-IT
  async recognizeMedication(imageData, patientId) {
    try {
      const formData = new FormData();
      formData.append('image', imageData);
      formData.append('patientId', patientId);

      const response = await medicalApi.post(apiConfig.endpoints.recognizeMedication, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur reconnaissance médicament:', error);
      throw new Error('Impossible de reconnaître le médicament');
    }
  },

  // Récupérer les informations détaillées d'un médicament FENKU-IT
  async getMedicationDetails(medicationName) {
    try {
      const response = await medicalApi.get(apiConfig.endpoints.medicationDetails, {
        params: { name: medicationName }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur détails médicament:', error);
      return null;
    }
  },

  // Vérifier les interactions médicamenteuses FENKU-IT
  async checkDrugInteractions(medications) {
    try {
      const response = await medicalApi.post(apiConfig.endpoints.drugInteractions, {
        medications: medications
      });
      return response.data;
    } catch (error) {
      console.error('Erreur vérification interactions:', error);
      return { hasInteractions: false, warnings: [] };
    }
  }
};

/**
 * Service pour la consultation médicale et le suivi
 * Gère les consultations, rappels et suivi des symptômes
 */
export const consultationService = {
  // Enregistrer une consultation de première ligne FENKU-IT
  async saveConsultation(patientId, consultationData) {
    try {
      const response = await medicalApi.post(apiConfig.endpoints.saveConsultation(patientId), {
        type: 'first_line',
        data: consultationData,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Erreur sauvegarde consultation:', error);
      throw new Error('Impossible de sauvegarder la consultation');
    }
  },

  // Programmer un rappel de traitement FENKU-IT
  async scheduleReminder(patientId, reminderData) {
    try {
      const response = await medicalApi.post(apiConfig.endpoints.reminders(patientId), {
        type: 'medication',
        data: reminderData,
        scheduledFor: reminderData.scheduledFor
      });
      return response.data;
    } catch (error) {
      console.error('Erreur programmation rappel:', error);
      throw new Error('Impossible de programmer le rappel');
    }
  },

  // Enregistrer le suivi des symptômes FENKU-IT
  async recordSymptomFollowUp(patientId, symptomData) {
    try {
      const response = await medicalApi.post(apiConfig.endpoints.symptomFollowUp(patientId), {
        symptoms: symptomData.symptoms,
        severity: symptomData.severity,
        notes: symptomData.notes,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Erreur enregistrement suivi:', error);
      throw new Error('Impossible d\'enregistrer le suivi');
    }
  },

  // Récupérer l'historique des consultations FENKU-IT
  async getConsultationHistory(patientId) {
    try {
      const response = await medicalApi.get(apiConfig.endpoints.consultations(patientId));
      return response.data;
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }
  }
};

/**
 * Service pour la génération de rapports et résumés
 * Génère des résumés JSON pour le dashboard médical
 */
export const reportService = {
  // Générer un résumé de consultation FENKU-IT
  async generateConsultationSummary(patientId, consultationId) {
    try {
      const response = await medicalApi.get(apiConfig.endpoints.consultationSummary(patientId, consultationId));
      return response.data;
    } catch (error) {
      console.error('Erreur génération résumé:', error);
      throw new Error('Impossible de générer le résumé');
    }
  },

  // Exporter les données pour le médecin FENKU-IT
  async exportForDoctor(patientId, dateRange) {
    try {
      const response = await medicalApi.post(apiConfig.endpoints.exportForDoctor(patientId), {
        dateRange: dateRange,
        format: 'json'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur export données:', error);
      throw new Error('Impossible d\'exporter les données');
    }
  }
};

export default medicalApi;
