// Service pour le chatbot médical Fajma - Version améliorée
class ChatbotService {
  constructor() {
    this.conversationHistory = [];
    this.userContext = {};
    this.responseCache = new Map();
    this.typingSpeed = 30; // caractères par seconde
    
    this.medicalDatabase = {
      symptoms: {
        'fièvre': {
          description: 'Température corporelle élevée (>37.5°C)',
          advice: 'Reposez-vous, buvez beaucoup d\'eau, prenez du paracétamol si nécessaire. Consultez un médecin si la fièvre persiste plus de 3 jours.',
          urgency: 'moderate',
          keywords: ['fièvre', 'température', 'chaud', 'brûlant', 'hyperthermie', 'thermique'],
          followUp: ['Depuis combien de temps avez-vous de la fièvre ?', 'Avez-vous d\'autres symptômes ?', 'Quelle est votre température ?'],
          relatedSymptoms: ['frissons', 'sueurs', 'fatigue', 'maux de tête']
        },
        'toux': {
          description: 'Réflexe de toux pour expulser les sécrétions',
          advice: 'Buvez beaucoup d\'eau, utilisez des pastilles pour la gorge. Consultez si la toux persiste plus d\'une semaine.',
          urgency: 'low',
          keywords: ['toux', 'tousser', 'gorge', 'irritation']
        },
        'douleur thoracique': {
          description: 'Douleur dans la région du thorax',
          advice: 'URGENCE MÉDICALE - Appelez immédiatement les secours (15) ou rendez-vous aux urgences.',
          urgency: 'high',
          keywords: ['douleur thoracique', 'poitrine', 'cœur', 'oppression']
        },
        'essoufflement': {
          description: 'Difficulté à respirer normalement',
          advice: 'URGENCE MÉDICALE - Consultez immédiatement un médecin ou appelez les secours.',
          urgency: 'high',
          keywords: ['essoufflement', 'respiration', 'souffle', 'haletant']
        },
        'nausée': {
          description: 'Sensation de mal-être avec envie de vomir',
          advice: 'Reposez-vous, évitez les aliments gras. Consultez si les nausées persistent plus de 24h.',
          urgency: 'moderate',
          keywords: ['nausée', 'nausées', 'mal au cœur', 'vomir']
        },
        'maux de tête': {
          description: 'Douleur dans la région crânienne',
          advice: 'Reposez-vous dans un endroit calme, prenez du paracétamol. Consultez si les maux de tête sont intenses ou persistants.',
          urgency: 'moderate',
          keywords: ['maux de tête', 'céphalée', 'mal à la tête', 'migraine']
        },
        'douleur abdominale': {
          description: 'Douleur dans la région de l\'abdomen',
          advice: 'Évitez de manger, buvez de l\'eau. Consultez un médecin si la douleur est intense ou persistante.',
          urgency: 'moderate',
          keywords: ['douleur abdominale', 'ventre', 'estomac', 'crampes']
        },
        'vertiges': {
          description: 'Sensation de perte d\'équilibre',
          advice: 'Asseyez-vous ou allongez-vous, évitez les mouvements brusques. Consultez si les vertiges persistent.',
          urgency: 'moderate',
          keywords: ['vertiges', 'étourdissement', 'tournis', 'équilibre']
        }
      },
      medications: {
        'paracétamol': {
          description: 'Analgésique et antipyrétique',
          dosage: '1g toutes les 6-8h',
          maxDaily: '4g par jour',
          sideEffects: 'Rare, peut causer des réactions allergiques',
          interactions: 'Éviter avec l\'alcool en excès'
        },
        'ibuprofène': {
          description: 'Anti-inflammatoire non stéroïdien',
          dosage: '400mg toutes les 6-8h',
          maxDaily: '2.4g par jour',
          sideEffects: 'Peut causer des troubles digestifs',
          interactions: 'À prendre avec de la nourriture'
        },
        'aspirine': {
          description: 'Anti-inflammatoire et anticoagulant',
          dosage: '500mg toutes les 4-6h',
          maxDaily: '4g par jour',
          sideEffects: 'Risque de saignement, troubles digestifs',
          interactions: 'Attention aux interactions médicamenteuses'
        },
        'vitamine c': {
          description: 'Complément vitaminique',
          dosage: '500-1000mg par jour',
          maxDaily: '2g par jour',
          sideEffects: 'Diarrhée en cas de surdosage',
          interactions: 'Peut interférer avec certains traitements'
        }
      },
      emergencies: [
        'douleur thoracique',
        'essoufflement',
        'perte de conscience',
        'hémorragie',
        'traumatisme crânien',
        'brûlure grave',
        'intoxication',
        'crise cardiaque',
        'accident vasculaire cérébral'
      ],
      generalAdvice: {
        'prévention': [
          'Lavez-vous les mains régulièrement',
          'Mangez équilibré et varié',
          'Faites de l\'exercice régulièrement',
          'Dormez suffisamment (7-8h)',
          'Évitez le tabac et l\'alcool excessif'
        ],
        'hygiène': [
          'Lavez-vous les mains avant de manger',
          'Couvez-vous la bouche en toussant',
          'Aérez votre domicile quotidiennement',
          'Changez régulièrement vos draps',
          'Nettoyez vos surfaces de contact'
        ],
        'alimentation': [
          'Mangez 5 fruits et légumes par jour',
          'Buvez 1.5L d\'eau par jour',
          'Limitez le sucre et le sel',
          'Privilégiez les céréales complètes',
          'Évitez les aliments transformés'
        ]
      }
    };
  }

  // Analyser le message de l'utilisateur avec intelligence améliorée
  analyzeMessage(message, userId = null) {
    const lowerMessage = message.toLowerCase();
    const messageId = this.generateMessageId(message);
    
    // Vérifier le cache pour les réponses fréquentes
    if (this.responseCache.has(messageId)) {
      const cachedResponse = this.responseCache.get(messageId);
      this.addToHistory(message, cachedResponse, userId);
      return cachedResponse;
    }

    // Analyser le contexte de la conversation
    const context = this.analyzeContext(lowerMessage);
    
    // Détecter les urgences en premier (priorité maximale)
    const emergency = this.detectEmergency(lowerMessage);
    if (emergency) {
      const response = this.generateEmergencyResponse(emergency);
      this.cacheResponse(messageId, response);
      this.addToHistory(message, response, userId);
      return response;
    }

    // Détecter les symptômes avec contexte
    const symptom = this.detectSymptom(lowerMessage);
    if (symptom) {
      const response = this.generateSymptomResponse(symptom, context);
      this.cacheResponse(messageId, response);
      this.addToHistory(message, response, userId);
      return response;
    }

    // Détecter les médicaments
    const medication = this.detectMedication(lowerMessage);
    if (medication) {
      const response = this.generateMedicationResponse(medication, context);
      this.cacheResponse(messageId, response);
      this.addToHistory(message, response, userId);
      return response;
    }

    // Détecter les questions générales
    const general = this.detectGeneralQuestion(lowerMessage);
    if (general) {
      const response = this.generateGeneralResponse(general, lowerMessage, context);
      this.cacheResponse(messageId, response);
      this.addToHistory(message, response, userId);
      return response;
    }

    // Réponse contextuelle intelligente
    const response = this.generateContextualResponse(lowerMessage, context);
    this.cacheResponse(messageId, response);
    this.addToHistory(message, response, userId);
    return response;
  }

  // Détecter les urgences
  detectEmergency(message) {
    for (const emergency of this.medicalDatabase.emergencies) {
      if (message.includes(emergency)) {
        return emergency;
      }
    }
    return null;
  }

  // Détecter les symptômes
  detectSymptom(message) {
    for (const [symptom, data] of Object.entries(this.medicalDatabase.symptoms)) {
      for (const keyword of data.keywords) {
        if (message.includes(keyword)) {
          return { symptom, ...data };
        }
      }
    }
    return null;
  }

  // Détecter les médicaments
  detectMedication(message) {
    for (const [medication, data] of Object.entries(this.medicalDatabase.medications)) {
      if (message.includes(medication)) {
        return { medication, ...data };
      }
    }
    return null;
  }

  // Détecter les questions générales
  detectGeneralQuestion(message) {
    const generalKeywords = {
      'prévention': ['prévenir', 'éviter', 'prévention', 'précaution'],
      'hygiène': ['hygiène', 'propre', 'nettoyer', 'laver'],
      'alimentation': ['manger', 'aliment', 'nutrition', 'régime'],
      'santé': ['santé', 'médical', 'docteur', 'médecin'],
      'conseil': ['conseil', 'aide', 'suggestion', 'recommandation']
    };

    for (const [category, keywords] of Object.entries(generalKeywords)) {
      for (const keyword of keywords) {
        if (message.includes(keyword)) {
          return category;
        }
      }
    }
    return null;
  }

  // Générer les réponses
  generateEmergencyResponse(emergency) {
    return {
      type: 'emergency',
      text: `🚨 URGENCE MÉDICALE DÉTECTÉE 🚨\n\nSymptôme: ${emergency}\n\nVeuillez immédiatement :\n• Appeler le 15 (SAMU)\n• Ou vous rendre aux urgences les plus proches\n• Ne restez pas seul(e)\n\nJe vous conseille de consulter un professionnel de santé immédiatement.`,
      urgency: 'high',
      suggestions: [
        'Appeler le 15',
        'Trouver les urgences proches',
        'Contacter un médecin',
        'Autres urgences'
      ]
    };
  }

  generateSymptomResponse(symptomData) {
    const urgencyIcons = {
      high: '🚨',
      moderate: '⚠️',
      low: 'ℹ️'
    };

    return {
      type: 'symptom',
      text: `${urgencyIcons[symptomData.urgency]} Symptôme détecté: ${symptomData.symptom}\n\nDescription: ${symptomData.description}\n\nConseil: ${symptomData.advice}`,
      urgency: symptomData.urgency,
      suggestions: [
        'Prendre rendez-vous avec un médecin',
        'Appeler les urgences',
        'Consulter un pharmacien',
        'Autres questions'
      ]
    };
  }

  generateMedicationResponse(medicationData) {
    return {
      type: 'medication',
      text: `💊 Information sur ${medicationData.medication}:\n\nDescription: ${medicationData.description}\n\nPosologie: ${medicationData.dosage}\n\nMaximum par jour: ${medicationData.maxDaily}\n\nEffets secondaires: ${medicationData.sideEffects}\n\nInteractions: ${medicationData.interactions}`,
      suggestions: [
        'Posologie recommandée',
        'Effets secondaires',
        'Interactions médicamenteuses',
        'Autres questions'
      ]
    };
  }

  generateGeneralResponse(category, message) {
    const responses = {
      'prévention': {
        text: '🛡️ Conseils de prévention :\n\n' + this.medicalDatabase.generalAdvice.prévention.map(advice => `• ${advice}`).join('\n'),
        suggestions: ['Hygiène', 'Alimentation', 'Exercice', 'Autres conseils']
      },
      'hygiène': {
        text: '🧼 Conseils d\'hygiène :\n\n' + this.medicalDatabase.generalAdvice.hygiène.map(advice => `• ${advice}`).join('\n'),
        suggestions: ['Prévention', 'Alimentation', 'Exercice', 'Autres conseils']
      },
      'alimentation': {
        text: '🥗 Conseils alimentaires :\n\n' + this.medicalDatabase.generalAdvice.alimentation.map(advice => `• ${advice}`).join('\n'),
        suggestions: ['Prévention', 'Hygiène', 'Exercice', 'Autres conseils']
      },
      'santé': {
        text: '🏥 Je suis là pour vous aider avec vos questions de santé. Vous pouvez me demander des informations sur vos symptômes, médicaments, ou toute autre question médicale.',
        suggestions: ['Décrire mes symptômes', 'Questions sur mes médicaments', 'Conseils de prévention', 'Autres questions']
      },
      'conseil': {
        text: '💡 Je peux vous donner des conseils sur la prévention, l\'hygiène, l\'alimentation, et répondre à vos questions médicales. Que souhaitez-vous savoir ?',
        suggestions: ['Prévention', 'Hygiène', 'Alimentation', 'Symptômes']
      }
    };

    return {
      type: 'general',
      ...responses[category]
    };
  }

  generateDefaultResponse() {
    return {
      type: 'default',
      text: 'Je comprends votre question. Pour mieux vous aider, pourriez-vous me donner plus de détails sur vos symptômes ou votre préoccupation médicale ?',
      suggestions: [
        'Décrire mes symptômes',
        'Questions sur mes médicaments',
        'Conseils de prévention',
        'Prendre rendez-vous'
      ]
    };
  }

  // Obtenir des suggestions contextuelles
  getContextualSuggestions(lastMessage) {
    const suggestions = {
      'symptom': [
        'Quels sont les autres symptômes ?',
        'Depuis combien de temps ?',
        'L\'intensité est-elle forte ?',
        'Avez-vous pris des médicaments ?'
      ],
      'medication': [
        'Quelle est la posologie ?',
        'Y a-t-il des effets secondaires ?',
        'Puis-je prendre d\'autres médicaments ?',
        'Quand dois-je consulter ?'
      ],
      'general': [
        'Conseils de prévention',
        'Questions sur l\'hygiène',
        'Conseils alimentaires',
        'Autres questions médicales'
      ]
    };

    return suggestions[lastMessage?.type] || suggestions.general;
  }

  // Vérifier si c'est une urgence
  isEmergency(message) {
    return this.detectEmergency(message.toLowerCase()) !== null;
  }

  // Obtenir des conseils de prévention
  getPreventionAdvice() {
    return this.medicalDatabase.generalAdvice.prévention;
  }

  // Obtenir des conseils d'hygiène
  getHygieneAdvice() {
    return this.medicalDatabase.generalAdvice.hygiène;
  }

  // Obtenir des conseils alimentaires
  getNutritionAdvice() {
    return this.medicalDatabase.generalAdvice.alimentation;
  }

  // === MÉTHODES AVANCÉES POUR AMÉLIORER LES PERFORMANCES ===

  // Générer un ID unique pour le message
  generateMessageId(message) {
    return btoa(message.toLowerCase().replace(/\s+/g, '')).substring(0, 16);
  }

  // Analyser le contexte de la conversation
  analyzeContext(message) {
    const context = {
      hasPreviousSymptoms: this.hasPreviousSymptoms(),
      lastSymptom: this.getLastSymptom(),
      conversationLength: this.conversationHistory.length,
      timeOfDay: new Date().getHours(),
      urgencyLevel: this.getCurrentUrgencyLevel(),
      userMood: this.detectUserMood(message)
    };
    return context;
  }

  // Vérifier s'il y a des symptômes précédents
  hasPreviousSymptoms() {
    return this.conversationHistory.some(msg => 
      msg.response && msg.response.type === 'symptom'
    );
  }

  // Obtenir le dernier symptôme mentionné
  getLastSymptom() {
    const lastSymptomMessage = this.conversationHistory
      .reverse()
      .find(msg => msg.response && msg.response.type === 'symptom');
    return lastSymptomMessage ? lastSymptomMessage.response.symptom : null;
  }

  // Obtenir le niveau d'urgence actuel
  getCurrentUrgencyLevel() {
    const lastMessage = this.conversationHistory[this.conversationHistory.length - 1];
    return lastMessage?.response?.urgency || 'low';
  }

  // Détecter l'humeur de l'utilisateur
  detectUserMood(message) {
    const urgentWords = ['urgent', 'grave', 'sérieux', 'immédiat', 'rapide'];
    const calmWords = ['ok', 'bien', 'merci', 'd\'accord', 'compris'];
    const worriedWords = ['inquiet', 'peur', 'anxieux', 'stressé', 'panique'];

    if (urgentWords.some(word => message.includes(word))) return 'urgent';
    if (worriedWords.some(word => message.includes(word))) return 'worried';
    if (calmWords.some(word => message.includes(word))) return 'calm';
    return 'neutral';
  }

  // Ajouter à l'historique de conversation
  addToHistory(message, response, userId) {
    this.conversationHistory.push({
      timestamp: new Date(),
      userId,
      message,
      response,
      messageId: this.generateMessageId(message)
    });

    // Limiter l'historique à 50 messages pour les performances
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  // Mettre en cache la réponse
  cacheResponse(messageId, response) {
    this.responseCache.set(messageId, response);
    
    // Limiter le cache à 100 réponses
    if (this.responseCache.size > 100) {
      const firstKey = this.responseCache.keys().next().value;
      this.responseCache.delete(firstKey);
    }
  }

  // Générer une réponse contextuelle intelligente
  generateContextualResponse(message, context) {
    // Analyser les mots-clés pour une meilleure compréhension
    const keywords = this.extractKeywords(message);
    const sentiment = this.analyzeSentiment(message);
    
    // Réponse personnalisée basée sur le contexte
    if (context.hasPreviousSymptoms) {
      return this.generateFollowUpResponse(message, context);
    }

    if (sentiment === 'urgent') {
      return {
        type: 'urgent_clarification',
        text: 'Je comprends que c\'est urgent. Pouvez-vous me donner plus de détails sur vos symptômes pour que je puisse mieux vous aider ?',
        urgency: 'high',
        suggestions: [
          'Décrire mes symptômes',
          'Appeler les urgences',
          'Consulter un médecin',
          'Autres questions'
        ]
      };
    }

    // Réponse par défaut améliorée
    return {
      type: 'default',
      text: 'Je comprends votre question. Pour mieux vous aider, pourriez-vous me donner plus de détails sur vos symptômes ou votre préoccupation médicale ?',
      suggestions: [
        'Décrire mes symptômes',
        'Questions sur mes médicaments',
        'Conseils de prévention',
        'Prendre rendez-vous'
      ]
    };
  }

  // Extraire les mots-clés importants
  extractKeywords(message) {
    const medicalTerms = [
      'douleur', 'fièvre', 'toux', 'nausée', 'vomissement', 'diarrhée',
      'fatigue', 'vertiges', 'maux de tête', 'essoufflement', 'palpitations'
    ];
    
    return medicalTerms.filter(term => message.includes(term));
  }

  // Analyser le sentiment du message
  analyzeSentiment(message) {
    const urgentPatterns = /urgent|grave|sérieux|immédiat|rapide|dangereux/i;
    const worriedPatterns = /inquiet|peur|anxieux|stressé|panique|peur/i;
    const calmPatterns = /ok|bien|merci|d'accord|compris|calme/i;

    if (urgentPatterns.test(message)) return 'urgent';
    if (worriedPatterns.test(message)) return 'worried';
    if (calmPatterns.test(message)) return 'calm';
    return 'neutral';
  }

  // Générer une réponse de suivi
  generateFollowUpResponse(message, context) {
    const lastSymptom = context.lastSymptom;
    
    return {
      type: 'follow_up',
      text: `Je vois que nous parlions de ${lastSymptom}. Avez-vous d'autres symptômes ou des questions spécifiques ?`,
      urgency: context.urgencyLevel,
      suggestions: [
        'Décrire d\'autres symptômes',
        'Poser une question spécifique',
        'Consulter un médecin',
        'Autres questions'
      ]
    };
  }

  // Calculer le temps de frappe réaliste
  calculateTypingTime(text) {
    const charCount = text.length;
    const baseTime = charCount / this.typingSpeed;
    const randomDelay = Math.random() * 0.5; // Ajouter un délai aléatoire
    return Math.max(1000, (baseTime + randomDelay) * 1000); // Minimum 1 seconde
  }

  // Obtenir l'historique de conversation
  getConversationHistory(userId = null) {
    if (userId) {
      return this.conversationHistory.filter(msg => msg.userId === userId);
    }
    return this.conversationHistory;
  }

  // Effacer l'historique
  clearHistory(userId = null) {
    if (userId) {
      this.conversationHistory = this.conversationHistory.filter(msg => msg.userId !== userId);
    } else {
      this.conversationHistory = [];
    }
  }

  // Obtenir des statistiques de performance
  getPerformanceStats() {
    return {
      totalMessages: this.conversationHistory.length,
      cacheSize: this.responseCache.size,
      averageResponseTime: this.calculateAverageResponseTime(),
      mostCommonSymptoms: this.getMostCommonSymptoms()
    };
  }

  // Calculer le temps de réponse moyen
  calculateAverageResponseTime() {
    // Simulation - dans une vraie app, on mesurerait le temps réel
    return 1.2; // secondes
  }

  // Obtenir les symptômes les plus courants
  getMostCommonSymptoms() {
    const symptomCounts = {};
    this.conversationHistory.forEach(msg => {
      if (msg.response && msg.response.type === 'symptom') {
        const symptom = msg.response.symptom;
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      }
    });
    
    return Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, count }));
  }
}

export default new ChatbotService();
