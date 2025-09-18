// Configuration du chatbot médical
export const CHATBOT_CONFIG = {
  // Configuration de l'API
  API: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  },

  // Configuration de l'interface
  UI: {
    WIDTH: 384, // w-96
    HEIGHT: 600,
    MINIMIZED_HEIGHT: 64,
    ANIMATION_DURATION: 300
  },

  // Configuration des modes
  MODES: {
    GENERAL: 'general',
    PRECONSULTATION: 'preconsultation',
    DOSSIER: 'dossier',
    CONSEILS: 'conseils',
    URGENCES: 'urgences'
  },

  // Configuration des urgences
  URGENCY: {
    KEYWORDS: ['urgent', 'grave', 'sérieux', 'danger', 'ambulance', 'hôpital', 'immédiat'],
    PHONE_NUMBERS: {
      SAMU: '15',
      POMPIERS: '18',
      EUROPEAN: '112'
    }
  },

  // Configuration des suggestions
  SUGGESTIONS: {
    MAX_COUNT: 4,
    AUTO_HIDE_DELAY: 5000
  },

  // Configuration des messages
  MESSAGES: {
    TYPING_DELAY: 1500,
    MAX_LENGTH: 1000,
    HISTORY_LIMIT: 100
  },

  // Configuration des données médicales
  MEDICAL_DATA: {
    CACHE_DURATION: 300000, // 5 minutes
    AUTO_REFRESH: true
  },

  // Configuration du développement
  DEVELOPMENT: {
    ENABLE_LOGS: process.env.NODE_ENV === 'development',
    MOCK_DATA: true,
    SIMULATE_DELAYS: true
  }
};

// Messages par défaut
export const DEFAULT_MESSAGES = {
  WELCOME: {
    GENERAL: "Bonjour ! Je suis votre assistant médical intelligent. Comment puis-je vous aider aujourd'hui ?",
    PRECONSULTATION: "Je vais vous poser quelques questions pour préparer votre consultation. Commençons par vos symptômes principaux.",
    DOSSIER: "Je peux vous aider à consulter vos informations médicales. Que souhaitez-vous savoir ?",
    CONSEILS: "Je peux vous donner des conseils généraux sur la santé. Quel est votre sujet d'intérêt ?"
  },
  ERROR: {
    GENERIC: "Désolé, une erreur s'est produite. Pouvez-vous reformuler votre question ?",
    NETWORK: "Problème de connexion. Vérifiez votre connexion internet.",
    TIMEOUT: "La requête a pris trop de temps. Veuillez réessayer.",
    UNAUTHORIZED: "Vous devez être connecté pour utiliser cette fonctionnalité."
  },
  URGENCY: {
    DETECTED: "🚨 **URGENCE MÉDICALE DÉTECTÉE** 🚨\n\nSi vous êtes en situation d'urgence médicale :\n• **Appelez immédiatement le 15 (SAMU)**\n• **Ou le 18 (Pompiers)**\n• **Ou le 112 (Numéro d'urgence européen)**\n\n⚠️ **Ne vous fiez pas uniquement à ce chatbot pour les urgences !**"
  }
};

// Données médicales par défaut
export const DEFAULT_MEDICAL_DATA = {
  allergies: [
    { name: 'Pollens', type: 'saisonnière', severity: 'modérée' },
    { name: 'Pénicilline', type: 'médicamenteuse', severity: 'sévère' },
    { name: 'Arachides', type: 'alimentaire', severity: 'sévère' }
  ],
  medications: [
    { name: 'Metformine', dosage: '500mg', frequency: '2x/jour', nextDose: 'dans 2 heures' },
    { name: 'Lisinopril', dosage: '10mg', frequency: '1x/jour', nextDose: 'demain matin' },
    { name: 'Multivitamines', dosage: '1 comprimé', frequency: '1x/jour', nextDose: 'ce soir' }
  ],
  medicalHistory: [
    { condition: 'Diabète de type 2', date: '2020', status: 'En cours' },
    { condition: 'Hypertension artérielle', date: '2019', status: 'Contrôlée' },
    { condition: 'Appendicectomie', date: '2015', status: 'Résolu' }
  ],
  appointments: [
    { date: '2024-01-15', time: '14:30', doctor: 'Dr. Martin', type: 'Consultation générale' },
    { date: '2024-01-22', time: '10:00', doctor: 'Dr. Dubois', type: 'Spécialiste cardiologie' }
  ]
};

