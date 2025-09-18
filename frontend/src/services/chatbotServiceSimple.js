// Service simplifié pour le chatbot médical (sans dépendances API)
class ChatbotServiceSimple {
  constructor() {
    this.conversationHistory = [];
    this.userProfile = null;
    this.medicalData = null;
  }

  // Initialiser le service avec le profil utilisateur
  async initialize(userProfile) {
    this.userProfile = userProfile;
    await this.loadMedicalData();
  }

  // Charger les données médicales de l'utilisateur
  async loadMedicalData() {
    try {
      // Pour le développement, utiliser les données du profil utilisateur
      if (this.userProfile && this.userProfile.medicalData) {
        this.medicalData = this.userProfile.medicalData;
        return this.medicalData;
      }
      
      // Données par défaut si pas de profil utilisateur
      this.medicalData = {
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
      
      return this.medicalData;
    } catch (error) {
      console.error('Erreur lors du chargement des données médicales:', error);
      return null;
    }
  }

  // Analyser l'intention de l'utilisateur
  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Mots-clés pour la préconsultation
    const preconsultationKeywords = [
      'symptôme', 'douleur', 'mal', 'fièvre', 'nausée', 'fatigue',
      'consultation', 'rendez-vous', 'maladie', 'problème de santé'
    ];
    
    // Mots-clés pour la consultation du dossier
    const dossierKeywords = [
      'dossier', 'allergie', 'médicament', 'traitement', 'antécédent',
      'analyse', 'résultat', 'historique', 'prescription'
    ];
    
    // Mots-clés pour les conseils
    const conseilsKeywords = [
      'conseil', 'alimentation', 'exercice', 'sport', 'nutrition',
      'prévention', 'soin', 'hygiène', 'lifestyle', 'bien-être'
    ];
    
    // Mots-clés d'urgence
    const urgenceKeywords = [
      'urgence', 'urgent', 'grave', 'sérieux', 'danger',
      'ambulance', 'hôpital', 'immédiat'
    ];

    if (urgenceKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return { intent: 'urgence', confidence: 0.9 };
    }
    
    if (preconsultationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return { intent: 'preconsultation', confidence: 0.8 };
    }
    
    if (dossierKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return { intent: 'dossier', confidence: 0.8 };
    }
    
    if (conseilsKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return { intent: 'conseils', confidence: 0.8 };
    }
    
    return { intent: 'general', confidence: 0.5 };
  }

  // Générer une réponse intelligente
  async generateResponse(message, currentMode) {
    const intent = this.analyzeIntent(message);
    this.conversationHistory.push({ role: 'user', content: message, timestamp: new Date() });

    let response;
    
    switch (intent.intent) {
      case 'urgence':
        response = this.handleUrgence(message);
        break;
      case 'preconsultation':
        response = this.handlePreconsultation(message);
        break;
      case 'dossier':
        response = await this.handleDossier(message);
        break;
      case 'conseils':
        response = this.handleConseils(message);
        break;
      default:
        response = this.handleGeneral(message, currentMode);
    }

    this.conversationHistory.push({ role: 'assistant', content: response.content, timestamp: new Date() });
    return response;
  }

  // Gérer les urgences
  handleUrgence(message) {
    return {
      content: `🚨 **URGENCE MÉDICALE DÉTECTÉE** 🚨

Si vous êtes en situation d'urgence médicale :
• **Appelez immédiatement le 15 (SAMU)**
• **Ou le 18 (Pompiers)**
• **Ou le 112 (Numéro d'urgence européen)**

⚠️ **Ne vous fiez pas uniquement à ce chatbot pour les urgences !**

Si votre situation n'est pas urgente, je peux vous aider avec :
• Préconsultation
• Consultation de votre dossier
• Conseils médicaux généraux`,
      suggestions: [
        "Appeler le 15",
        "Appeler le 18", 
        "Ce n'est pas urgent",
        "Retour au menu principal"
      ],
      isUrgent: true
    };
  }

  // Gérer la préconsultation
  handlePreconsultation(message) {
    const lowerMessage = message.toLowerCase();
    
    // Analyser les symptômes mentionnés
    const symptoms = this.extractSymptoms(message);
    
    let response = {
      content: "",
      suggestions: [],
      followUpQuestions: []
    };

    if (symptoms.length > 0) {
      response.content = `Je comprends que vous ressentez : ${symptoms.join(', ')}.\n\n`;
      
      // Questions de suivi basées sur les symptômes
      if (symptoms.includes('douleur')) {
        response.followUpQuestions = [
          "Où se situe exactement cette douleur ?",
          "Depuis combien de temps ?",
          "Sur une échelle de 1 à 10, quelle est son intensité ?",
          "Y a-t-il des facteurs qui l'aggravent ou la soulagent ?"
        ];
      } else if (symptoms.includes('fièvre')) {
        response.followUpQuestions = [
          "Quelle est votre température actuelle ?",
          "Depuis combien de temps avez-vous de la fièvre ?",
          "Avez-vous d'autres symptômes (frissons, sueurs) ?",
          "Prenez-vous des médicaments pour la faire baisser ?"
        ];
      }
      
      response.content += response.followUpQuestions.join('\n• ');
      response.suggestions = ["Décrire plus en détail", "Autres symptômes", "Intensité", "Durée"];
    } else {
      response.content = "Pour mieux vous aider, pouvez-vous me décrire vos symptômes principaux ?";
      response.suggestions = ["Douleur", "Fièvre", "Fatigue", "Nausée", "Autres symptômes"];
    }

    return response;
  }

  // Gérer la consultation du dossier médical
  async handleDossier(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('allergie')) {
      return this.getUserAllergies();
    }
    
    if (lowerMessage.includes('médicament') || lowerMessage.includes('traitement')) {
      return this.getUserMedications();
    }
    
    if (lowerMessage.includes('antécédent')) {
      return this.getUserMedicalHistory();
    }
    
    if (lowerMessage.includes('rendez-vous') || lowerMessage.includes('rdv')) {
      return this.getUserAppointments();
    }
    
    return {
      content: "Je peux vous aider à consulter :\n• Vos allergies\n• Vos traitements actuels\n• Vos antécédents médicaux\n• Vos prochains rendez-vous\n• Vos résultats d'analyses\n\nQue souhaitez-vous voir ?",
      suggestions: ["Allergies", "Médicaments", "Antécédents", "Rendez-vous", "Analyses"]
    };
  }

  // Gérer les conseils médicaux
  handleConseils(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('alimentation') || lowerMessage.includes('manger')) {
      return this.getNutritionAdvice();
    }
    
    if (lowerMessage.includes('exercice') || lowerMessage.includes('sport')) {
      return this.getExerciseAdvice();
    }
    
    if (lowerMessage.includes('sommeil')) {
      return this.getSleepAdvice();
    }
    
    if (lowerMessage.includes('stress')) {
      return this.getStressAdvice();
    }
    
    return {
      content: "Je peux vous donner des conseils sur :\n• L'alimentation et la nutrition\n• L'activité physique\n• Le sommeil et la relaxation\n• La gestion du stress\n• La prévention des maladies\n• Les soins quotidiens\n\nQuel sujet vous intéresse ?",
      suggestions: ["Nutrition", "Exercice", "Sommeil", "Stress", "Prévention", "Soins"]
    };
  }

  // Gérer les demandes générales
  handleGeneral(message, currentMode) {
    return {
      content: "Je comprends votre demande. Pour vous aider au mieux, choisissez une option :",
      suggestions: [
        { text: "Préconsultation", mode: "preconsultation" },
        { text: "Consulter mon dossier", mode: "dossier" },
        { text: "Conseils médicaux", mode: "conseils" }
      ]
    };
  }

  // Extraire les symptômes du message
  extractSymptoms(message) {
    const symptomKeywords = {
      'douleur': ['douleur', 'mal', 'souffrance', 'élancement'],
      'fièvre': ['fièvre', 'température', 'chaud', 'brûlant'],
      'fatigue': ['fatigue', 'épuisement', 'lassitude', 'faiblesse'],
      'nausée': ['nausée', 'mal au cœur', 'envie de vomir'],
      'maux de tête': ['mal de tête', 'céphalée', 'migraine'],
      'douleur abdominale': ['mal au ventre', 'douleur abdominale', 'crampes'],
      'douleur thoracique': ['mal à la poitrine', 'douleur thoracique', 'oppression']
    };

    const foundSymptoms = [];
    const lowerMessage = message.toLowerCase();

    Object.entries(symptomKeywords).forEach(([symptom, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        foundSymptoms.push(symptom);
      }
    });

    return foundSymptoms;
  }

  // Obtenir les allergies de l'utilisateur
  getUserAllergies() {
    const allergies = this.medicalData?.allergies || [
      { name: 'Pollens', type: 'saisonnière', severity: 'modérée' },
      { name: 'Pénicilline', type: 'médicamenteuse', severity: 'sévère' },
      { name: 'Arachides', type: 'alimentaire', severity: 'sévère' }
    ];

    return {
      content: `📋 **Vos allergies enregistrées :**\n\n${allergies.map(allergy => 
        `• **${allergy.name}** (${allergy.type}) - Gravité: ${allergy.severity}`
      ).join('\n')}\n\n⚠️ **Recommandations :**\n• Éviter les expositions connues\n• Avoir toujours votre auto-injecteur d'épinéphrine\n• Informer tout professionnel de santé`,
      suggestions: ["Ajouter une allergie", "Modifier les allergies", "Conseils de prévention", "Retour au menu"]
    };
  }

  // Obtenir les médicaments de l'utilisateur
  getUserMedications() {
    const medications = this.medicalData?.medications || [
      { name: 'Metformine', dosage: '500mg', frequency: '2x/jour', nextDose: 'dans 2 heures' },
      { name: 'Lisinopril', dosage: '10mg', frequency: '1x/jour', nextDose: 'demain matin' },
      { name: 'Multivitamines', dosage: '1 comprimé', frequency: '1x/jour', nextDose: 'ce soir' }
    ];

    return {
      content: `💊 **Traitements actuels :**\n\n${medications.map(med => 
        `• **${med.name}** ${med.dosage} (${med.frequency})\n  Prochaine prise: ${med.nextDose}`
      ).join('\n\n')}\n\n📅 **Rappels :**\n• Prenez vos médicaments à heures régulières\n• Ne modifiez jamais la posologie sans avis médical\n• Signalez tout effet secondaire`,
      suggestions: ["Posologie détaillée", "Effets secondaires", "Interactions", "Rappels", "Retour au menu"]
    };
  }

  // Obtenir l'historique médical
  getUserMedicalHistory() {
    const history = this.medicalData?.medicalHistory || [
      { condition: 'Diabète de type 2', date: '2020', status: 'En cours' },
      { condition: 'Hypertension artérielle', date: '2019', status: 'Contrôlée' },
      { condition: 'Appendicectomie', date: '2015', status: 'Résolu' }
    ];

    return {
      content: `📋 **Vos antécédents médicaux :**\n\n${history.map(h => 
        `• **${h.condition}** (${h.date}) - ${h.status}`
      ).join('\n')}\n\n💡 **Note :** Ces informations sont importantes pour vos soins futurs.`,
      suggestions: ["Ajouter un antécédent", "Modifier un antécédent", "Détails", "Retour au menu"]
    };
  }

  // Obtenir les rendez-vous
  getUserAppointments() {
    const appointments = this.medicalData?.appointments || [
      { date: '2024-01-15', time: '14:30', doctor: 'Dr. Martin', type: 'Consultation générale' },
      { date: '2024-01-22', time: '10:00', doctor: 'Dr. Dubois', type: 'Spécialiste cardiologie' }
    ];

    return {
      content: `📅 **Vos prochains rendez-vous :**\n\n${appointments.map(apt => 
        `• **${apt.date}** à ${apt.time}\n  ${apt.doctor} - ${apt.type}`
      ).join('\n\n')}\n\n💡 **Conseil :** Arrivez 10 minutes en avance.`,
      suggestions: ["Prendre RDV", "Modifier RDV", "Annuler RDV", "Retour au menu"]
    };
  }

  // Conseils nutritionnels
  getNutritionAdvice() {
    return {
      content: `🥗 **Conseils nutritionnels personnalisés :**\n\n• **Fruits et légumes :** 5 portions par jour minimum\n• **Céréales complètes :** Riz brun, quinoa, pain complet\n• **Protéines :** Poissons gras 2x/semaine, légumineuses\n• **Hydratation :** 1,5-2L d'eau par jour\n• **Limiter :** Sel (5g/jour max), sucre, graisses saturées\n\n💡 **Astuce :** Commencez par remplacer un repas par semaine par une option plus saine.`,
      suggestions: ["Recettes saines", "Planification des repas", "Suppléments", "Hydratation", "Retour au menu"]
    };
  }

  // Conseils d'exercice
  getExerciseAdvice() {
    return {
      content: `🏃‍♂️ **Activité physique recommandée :**\n\n• **Cardio :** 150 min/semaine d'activité modérée\n• **Renforcement :** 2x/semaine (muscles principaux)\n• **Étirements :** Quotidiennement\n• **Exemples :** Marche rapide, natation, vélo, yoga\n\n⚠️ **Important :** Consultez votre médecin avant de commencer un nouveau programme.`,
      suggestions: ["Exercices à domicile", "Programmes d'entraînement", "Équipements", "Motivation", "Retour au menu"]
    };
  }

  // Conseils sur le sommeil
  getSleepAdvice() {
    return {
      content: `😴 **Conseils pour un meilleur sommeil :**\n\n• **Routine :** Couchez-vous et levez-vous à heures fixes\n• **Environnement :** Chambre fraîche, sombre et silencieuse\n• **Écrans :** Évitez 1h avant le coucher\n• **Caféine :** Pas après 14h\n• **Durée :** 7-9h par nuit pour les adultes\n\n💡 **Astuce :** Une routine relaxante avant le coucher améliore la qualité du sommeil.`,
      suggestions: ["Techniques de relaxation", "Routine du coucher", "Problèmes de sommeil", "Retour au menu"]
    };
  }

  // Conseils sur le stress
  getStressAdvice() {
    return {
      content: `🧘‍♀️ **Gestion du stress :**\n\n• **Respiration :** Exercices de respiration profonde\n• **Méditation :** 10-15 min par jour\n• **Activité physique :** Excellent anti-stress\n• **Sommeil :** Priorité absolue\n• **Loisirs :** Prenez du temps pour vous\n\n💡 **Astuce :** Identifiez vos facteurs de stress pour mieux les gérer.`,
      suggestions: ["Techniques de relaxation", "Méditation", "Exercices de respiration", "Retour au menu"]
    };
  }

  // Obtenir l'historique de conversation
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Réinitialiser la conversation
  resetConversation() {
    this.conversationHistory = [];
  }
}

export default new ChatbotServiceSimple();

