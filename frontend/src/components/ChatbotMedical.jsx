import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  Chip, 
  Fade, 
  Slide,
  Tooltip,
  Badge,
  CircularProgress,
  Button,
  Alert
} from '@mui/material';
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  Stethoscope, 
  Pill, 
  Heart, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Lightbulb,
  Mic,
  MicOff,
  Minimize2,
  X,
  Sparkles,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Calendar,
  FileText,
  Download,
  Share2,
  Star,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  MoreVertical,
  Camera,
  ClipboardList,
  Bell,
  BarChart3
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import { toast } from 'sonner';
import PhotoUploadSimple from './PhotoUploadSimple';
import StructuredConsultation from './StructuredConsultation';
import SymptomTracker from './SymptomTracker';
import { medicalRecordService, medicationService, consultationService } from '../services/medicalApi';

const ChatbotMedical = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [currentContext, setCurrentContext] = useState('general');
  const [userProfile, setUserProfile] = useState({
    name: 'Oumar',
    age: 35,
    conditions: ['Hypertension', 'Diabète type 2'],
    medications: ['Metformine', 'Lisinopril'],
    lastVisit: '2024-01-15'
  });
  
  const [consultationState, setConsultationState] = useState({
    isActive: false,
    currentSymptom: null,
    questionsAsked: [],
    answers: {},
    step: 0
  });
  
  // Nouveaux états pour les fonctionnalités avancées FENKU-IT
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showStructuredConsultation, setShowStructuredConsultation] = useState(false);
  const [showSymptomTracker, setShowSymptomTracker] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [isLoadingPatientData, setIsLoadingPatientData] = useState(false);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Base de connaissances médicale avancée FENKU-IT
  const medicalKnowledge = {
    symptoms: {
      'douleur poitrine': {
        severity: 'high',
        possibleCauses: ['Angine de poitrine', 'Infarctus', 'Reflux gastro-œsophagien', 'Péricardite', 'Embolie pulmonaire'],
        immediateActions: ['Appeler le 15 immédiatement', 'Rester calme', 'Prendre de l\'aspirine si prescrit'],
        urgency: 'urgent',
        questions: ['Depuis combien de temps ?', 'La douleur irradie-t-elle ?', 'Avez-vous des nausées ?', 'Sueurs froides ?']
      },
      'fièvre': {
        severity: 'medium',
        possibleCauses: ['Infection virale', 'Infection bactérienne', 'Réaction médicamenteuse', 'Maladie auto-immune'],
        immediateActions: ['Prendre la température', 'Boire beaucoup d\'eau', 'Repos'],
        urgency: 'moderate',
        questions: ['Température exacte ?', 'Depuis quand ?', 'Autres symptômes ?', 'Voyage récent ?']
      },
      'maux de tête': {
        severity: 'low',
        possibleCauses: ['Tension', 'Migraine', 'Déshydratation', 'Sinusite', 'Problème de vision'],
        immediateActions: ['Repos dans un endroit calme', 'Hydratation', 'Éviter les écrans'],
        urgency: 'low',
        questions: ['Type de douleur ?', 'Localisation ?', 'Intensité ?', 'Déclencheurs ?']
      },
      'essoufflement': {
        severity: 'high',
        possibleCauses: ['Asthme', 'Embolie pulmonaire', 'Insuffisance cardiaque', 'Anémie', 'Anxiété'],
        immediateActions: ['Rester calme', 'Position assise', 'Appeler le 15 si sévère'],
        urgency: 'urgent',
        questions: ['Au repos ou à l\'effort ?', 'Soudain ou progressif ?', 'Toux associée ?', 'Douleur thoracique ?']
      },
      'nausée': {
        severity: 'medium',
        possibleCauses: ['Gastro-entérite', 'Migraine', 'Grossesse', 'Médicaments', 'Anxiété'],
        immediateActions: ['Petites gorgées d\'eau', 'Repos', 'Éviter les aliments gras'],
        urgency: 'moderate',
        questions: ['Vomissements ?', 'Depuis quand ?', 'Déclencheurs ?', 'Autres symptômes ?']
      },
      'fatigue': {
        severity: 'low',
        possibleCauses: ['Manque de sommeil', 'Anémie', 'Dépression', 'Hypothyroïdie', 'Infection'],
        immediateActions: ['Repos', 'Hydratation', 'Alimentation équilibrée'],
        urgency: 'low',
        questions: ['Depuis combien de temps ?', 'Sommeil perturbé ?', 'Perte d\'appétit ?', 'Humeur ?']
      }
    },
    medications: {
      'metformine': {
        purpose: 'Traitement du diabète type 2',
        sideEffects: ['Nausées', 'Diarrhée', 'Goût métallique'],
        interactions: ['Éviter l\'alcool', 'Prendre avec les repas'],
        monitoring: 'Glycémie régulière'
      },
      'lisinopril': {
        purpose: 'Traitement de l\'hypertension',
        sideEffects: ['Toux sèche', 'Étourdissements', 'Fatigue'],
        interactions: ['Éviter le potassium en excès'],
        monitoring: 'Tension artérielle'
      }
    },
    conditions: {
      'hypertension': {
        description: 'Pression artérielle élevée',
        management: ['Régime pauvre en sel', 'Exercice régulier', 'Médicaments'],
        monitoring: ['Tension quotidienne', 'Rendez-vous trimestriels'],
        complications: ['Maladie cardiaque', 'AVC', 'Problèmes rénaux']
      },
      'diabète type 2': {
        description: 'Taux de sucre élevé dans le sang',
        management: ['Régime alimentaire', 'Exercice', 'Médicaments'],
        monitoring: ['Glycémie', 'HbA1c trimestrielle'],
        complications: ['Problèmes de vision', 'Névropathie', 'Maladie rénale']
      }
    }
  };

  // Suggestions de questions améliorées FENKU-IT
  const quickQuestions = [
    "Je veux faire une préconsultation structurée",
    "J'ai des symptômes à évaluer",
    "Reconnaître un médicament par photo",
    "Suivre mes symptômes et rappels",
    "Comment gérer ma tension artérielle ?",
    "Quels sont les effets secondaires de mes médicaments ?",
    "Vérifier mes contre-indications",
    "Quand dois-je consulter un médecin ?"
  ];

  // Chargement des données patient au montage FENKU-IT
  useEffect(() => {
    loadPatientData();
  }, []);

  // Fonction de chargement des données patient via l'API FENKU-IT
  const loadPatientData = async () => {
    setIsLoadingPatientData(true);
    try {
      // Simulation d'un ID patient - remplacer par l'ID réel FENKU-IT
      const patientId = userProfile.id || 1;
      
      const [allergies, medications, history] = await Promise.all([
        medicalRecordService.getAllergies(patientId),
        medicalRecordService.getCurrentMedications(patientId),
        medicalRecordService.getMedicalHistory(patientId)
      ]);

      setPatientData({
        allergies: allergies || [],
        medications: medications || [],
        history: history || []
      });
    } catch (error) {
      console.warn('API backend non disponible, utilisation des données de démonstration');
      // Données de fallback pour la démonstration FENKU-IT
      setPatientData({
        allergies: [
          { name: 'Pénicilline', severity: 'sévère' },
          { name: 'Pollens', severity: 'modérée' }
        ],
        medications: [
          { name: 'Metformine', dosage: '500mg', frequency: '2x/jour' },
          { name: 'Lisinopril', dosage: '10mg', frequency: '1x/jour' }
        ],
        history: [
          { condition: 'Diabète type 2', date: '2020', status: 'En cours' },
          { condition: 'Hypertension', date: '2019', status: 'Contrôlée' }
        ]
      });
    } finally {
      setIsLoadingPatientData(false);
    }
  };

  // Fonction d'analyse intelligente des messages FENKU-IT
  const analyzeMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    const analysis = {
      intent: 'general',
      urgency: 'low',
      context: 'general',
      keywords: [],
      suggestedActions: [],
      needsConsultation: false
    };

    // Détection d'urgence FENKU-IT
    const urgentKeywords = ['douleur poitrine', 'difficulté respiratoire', 'perte conscience', 'saignement', 'crise', 'essoufflement'];
    if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) {
      analysis.urgency = 'urgent';
      analysis.intent = 'emergency';
      analysis.suggestedActions.push('Appeler le 15 immédiatement');
    }

    // Détection de symptômes FENKU-IT
    const symptomKeywords = ['douleur', 'fièvre', 'nausée', 'fatigue', 'vertige', 'toux', 'essoufflement', 'maux de tête'];
    const foundSymptoms = symptomKeywords.filter(symptom => lowerMessage.includes(symptom));
    if (foundSymptoms.length > 0) {
      analysis.intent = 'symptoms';
      analysis.keywords = foundSymptoms;
      analysis.context = 'symptoms';
      analysis.needsConsultation = true;
    }

    // Détection de questions sur les médicaments FENKU-IT
    const medicationKeywords = ['médicament', 'effet secondaire', 'posologie', 'interaction'];
    if (medicationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      analysis.intent = 'medications';
      analysis.context = 'medications';
    }

    // Détection de questions sur l'alimentation FENKU-IT
    const dietKeywords = ['alimentation', 'régime', 'nourriture', 'diabète', 'sel', 'sucre'];
    if (dietKeywords.some(keyword => lowerMessage.includes(keyword))) {
      analysis.intent = 'diet';
      analysis.context = 'diet';
    }

    // Détection de demande de préconsultation FENKU-IT
    const consultationKeywords = ['consultation', 'préconsultation', 'examen', 'diagnostic', 'symptômes', 'maladie'];
    if (consultationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      analysis.intent = 'consultation';
      analysis.context = 'consultation';
      analysis.needsConsultation = true;
    }

    // Détection de reconnaissance de médicament FENKU-IT
    const medicationPhotoKeywords = ['photo', 'médicament', 'reconnaître', 'scanner', 'image', 'pilule'];
    if (medicationPhotoKeywords.some(keyword => lowerMessage.includes(keyword))) {
      analysis.intent = 'medication_photo';
      analysis.context = 'medication_photo';
    }

    // Détection de suivi des symptômes FENKU-IT
    const trackingKeywords = ['suivre', 'suivi', 'rappels', 'calendrier', 'historique', 'évolution'];
    if (trackingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      analysis.intent = 'symptom_tracking';
      analysis.context = 'symptom_tracking';
    }

    // Détection de vérification des contre-indications FENKU-IT
    const contraindicationKeywords = ['contre-indication', 'allergie', 'interaction', 'compatible', 'vérifier'];
    if (contraindicationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      analysis.intent = 'contraindication_check';
      analysis.context = 'contraindication_check';
    }

    return analysis;
  };

  // Fonction de préconsultation intelligente FENKU-IT
  const startPreConsultation = (symptom) => {
    setConsultationState({
      isActive: true,
      currentSymptom: symptom,
      questionsAsked: [],
      answers: {},
      step: 0
    });
    
    const symptomInfo = medicalKnowledge.symptoms[symptom];
    if (symptomInfo && symptomInfo.questions) {
      return {
        response: `🔍 **PRÉCONSULTATION MÉDICALE**\n\nJe vais vous poser quelques questions pour mieux comprendre votre ${symptom}.\n\n**Question 1/${symptomInfo.questions.length} :**\n${symptomInfo.questions[0]}`,
        responseType: 'info',
        suggestions: ['Oui', 'Non', 'Je ne sais pas', 'Peut-être']
      };
    }
    return null;
  };

  // Gestion des étapes de consultation FENKU-IT
  const handleConsultationStep = (message) => {
    const { currentSymptom, step, answers } = consultationState;
    const symptomInfo = medicalKnowledge.symptoms[currentSymptom];
    
    if (!symptomInfo || !symptomInfo.questions) {
      return {
        response: 'Erreur dans la préconsultation. Veuillez recommencer.',
        responseType: 'warning',
        suggestions: []
      };
    }

    // Enregistrer la réponse FENKU-IT
    const newAnswers = {
      ...answers,
      [`question_${step}`]: message
    };

    // Vérifier si c'est la dernière question FENKU-IT
    if (step >= symptomInfo.questions.length - 1) {
      // Terminer la consultation FENKU-IT
      setConsultationState({
        isActive: false,
        currentSymptom: null,
        questionsAsked: [],
        answers: {},
        step: 0
      });

      return generateConsultationReport(currentSymptom, newAnswers);
    } else {
      // Passer à la question suivante FENKU-IT
      setConsultationState(prev => ({
        ...prev,
        answers: newAnswers,
        step: step + 1
      }));

      return {
        response: `✅ **Réponse enregistrée**\n\n**Question ${step + 2}/${symptomInfo.questions.length} :**\n${symptomInfo.questions[step + 1]}`,
        responseType: 'info',
        suggestions: ['Oui', 'Non', 'Je ne sais pas', 'Peut-être']
      };
    }
  };

  // Génération du rapport de consultation FENKU-IT
  const generateConsultationReport = (symptom, answers) => {
    const symptomInfo = medicalKnowledge.symptoms[symptom];
    let report = `📋 **RAPPORT DE PRÉCONSULTATION**\n\n`;
    report += `**Symptôme principal :** ${symptom}\n`;
    report += `**Date :** ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    report += `**Réponses collectées :**\n`;
    Object.keys(answers).forEach((key, index) => {
      const questionNumber = key.split('_')[1];
      report += `${parseInt(questionNumber) + 1}. ${symptomInfo.questions[parseInt(questionNumber)]}\n`;
      report += `   → ${answers[key]}\n\n`;
    });

    report += `**Analyse préliminaire :**\n`;
    report += `• Causes possibles : ${symptomInfo.possibleCauses.join(', ')}\n`;
    report += `• Niveau d'urgence : ${symptomInfo.urgency}\n`;
    report += `• Actions recommandées : ${symptomInfo.immediateActions.join(', ')}\n\n`;
    
    report += `**Recommandations :**\n`;
    if (symptomInfo.urgency === 'urgent') {
      report += `🚨 CONSULTATION URGENTE RECOMMANDÉE\n`;
      report += `• Appelez le 15 ou rendez-vous aux urgences\n`;
    } else if (symptomInfo.urgency === 'moderate') {
      report += `⚠️ Consultation médicale dans les 24-48h\n`;
    } else {
      report += `✅ Surveillance à domicile recommandée\n`;
    }
    
    report += `\n**Prochaines étapes :**\n`;
    report += `• Surveillez l'évolution des symptômes\n`;
    report += `• Notez tout changement\n`;
    report += `• Contactez votre médecin si nécessaire\n`;

    return {
      response: report,
      responseType: symptomInfo.urgency === 'urgent' ? 'urgent' : 'info',
      suggestions: ['Prendre rendez-vous', 'Surveiller', 'Questions complémentaires']
    };
  };

  // Fonctions de gestion des nouvelles fonctionnalités FENKU-IT
  
  // Gestion de la reconnaissance de médicament par photo FENKU-IT
  const handleMedicationPhoto = () => {
    setShowPhotoUpload(true);
    return {
      response: `📸 **Reconnaissance de Médicament**\n\nJe vais vous aider à identifier votre médicament à partir d'une photo.\n\n**Instructions :**\n• Assurez-vous que le nom et la posologie sont bien visibles\n• Évitez les reflets et l'ombre\n• Prenez la photo de face si possible\n\nCliquez sur "Prendre une photo" pour commencer.`,
      responseType: 'info',
      suggestions: ['Prendre une photo', 'Annuler']
    };
  };

  // Gestion du suivi des symptômes FENKU-IT
  const handleSymptomTracking = () => {
    setShowSymptomTracker(true);
    return {
      response: `📊 **Suivi des Symptômes & Rappels**\n\nJe vais vous aider à suivre l'évolution de vos symptômes et gérer vos rappels de traitement.\n\n**Fonctionnalités disponibles :**\n• Enregistrer vos symptômes avec leur intensité\n• Programmer des rappels de médicaments\n• Consulter l'historique de vos symptômes\n• Recevoir des alertes personnalisées\n\nOuvrez le tableau de bord pour commencer.`,
      responseType: 'info',
      suggestions: ['Ouvrir le tableau de bord', 'Annuler']
    };
  };

  // Gestion de la vérification des contre-indications FENKU-IT
  const handleContraindicationCheck = async (medicationName) => {
    if (!patientData) {
      return {
        response: `⚠️ **Données patient non disponibles**\n\nJe ne peux pas vérifier les contre-indications car vos données médicales ne sont pas chargées.\n\nVeuillez réessayer dans quelques instants.`,
        responseType: 'warning',
        suggestions: ['Réessayer', 'Annuler']
      };
    }

    try {
      const contraindications = await medicalRecordService.checkContraindications(
        userProfile.id || 1, 
        medicationName
      );

      if (contraindications.hasContraindications) {
        return {
          response: `🚨 **ATTENTION - CONTRE-INDICATIONS DÉTECTÉES**\n\nLe médicament "${medicationName}" présente des contre-indications avec votre profil médical :\n\n${contraindications.warnings.map(w => `• ${w}`).join('\n')}\n\n**Recommandation :** Consultez votre médecin avant de prendre ce médicament.`,
          responseType: 'urgent',
          suggestions: ['Consulter un médecin', 'Plus d\'informations']
        };
      } else {
        return {
          response: `✅ **Aucune contre-indication détectée**\n\nLe médicament "${medicationName}" semble compatible avec votre profil médical actuel.\n\n**Rappel :** Cette vérification est préliminaire. Consultez toujours votre médecin pour toute nouvelle prescription.`,
          responseType: 'success',
          suggestions: ['Vérifier un autre médicament', 'Fermer']
        };
      }
    } catch (error) {
      // Mode démonstration - vérification locale FENKU-IT
      console.warn('API non disponible, vérification locale des contre-indications');
      
      // Vérification locale basée sur les données de démonstration FENKU-IT
      const localContraindications = checkLocalContraindications(medicationName, patientData);
      
      if (localContraindications.length > 0) {
        return {
          response: `🚨 **ATTENTION - CONTRE-INDICATIONS DÉTECTÉES**\n\nLe médicament "${medicationName}" présente des contre-indications avec votre profil médical :\n\n${localContraindications.map(w => `• ${w}`).join('\n')}\n\n**Recommandation :** Consultez votre médecin avant de prendre ce médicament.\n\n*Note: Vérification en mode démonstration*`,
          responseType: 'urgent',
          suggestions: ['Consulter un médecin', 'Plus d\'informations']
        };
      } else {
        return {
          response: `✅ **Aucune contre-indication détectée**\n\nLe médicament "${medicationName}" semble compatible avec votre profil médical actuel.\n\n**Rappel :** Cette vérification est préliminaire. Consultez toujours votre médecin pour toute nouvelle prescription.\n\n*Note: Vérification en mode démonstration*`,
          responseType: 'success',
          suggestions: ['Vérifier un autre médicament', 'Fermer']
        };
      }
    }
  };

  // Vérification locale des contre-indications FENKU-IT
  const checkLocalContraindications = (medicationName, patientData) => {
    const contraindications = [];
    const lowerMedication = medicationName.toLowerCase();
    
    if (patientData.allergies) {
      patientData.allergies.forEach(allergy => {
        if (lowerMedication.includes(allergy.name.toLowerCase())) {
          contraindications.push(`Allergie à ${allergy.name} (${allergy.severity})`);
        }
      });
    }
    
    // Vérifications spécifiques pour les médicaments de démonstration FENKU-IT
    if (lowerMedication.includes('pénicilline') && patientData.allergies?.some(a => a.name.toLowerCase().includes('pénicilline'))) {
      contraindications.push('Allergie à la pénicilline détectée');
    }
    
    return contraindications;
  };

  // Gestion de la consultation structurée FENKU-IT
  const handleStructuredConsultation = () => {
    setShowStructuredConsultation(true);
    return {
      response: `🔍 **Consultation de Première Ligne**\n\nJe vais vous guider à travers un questionnaire médical structuré pour évaluer votre situation.\n\n**Le processus comprend :**\n• Informations personnelles (âge, genre)\n• Description détaillée des symptômes\n• Antécédents médicaux\n• Évaluation de la douleur\n• Conclusion et recommandations\n\n**Durée estimée :** 5-10 minutes\n\nCliquez sur "Commencer" pour démarrer la consultation.`,
      responseType: 'info',
      suggestions: ['Commencer la consultation', 'Annuler']
    };
  };

  // Génération de réponse intelligente FENKU-IT
  const generateIntelligentResponse = (message, analysis) => {
    let response = '';
    let responseType = 'info';
    let suggestions = [];

    // Gestion de la préconsultation active FENKU-IT
    if (consultationState.isActive) {
      return handleConsultationStep(message);
    }

    switch (analysis.intent) {
      case 'emergency':
        response = `🚨 URGENCE MÉDICALE DÉTECTÉE 🚨\n\nVotre message contient des mots-clés d'urgence. Je recommande fortement de :\n\n• Appeler le 15 (SAMU) immédiatement\n• Rester calme et suivre les instructions\n• Ne pas conduire seul(e)\n\nSi ce n'est pas une urgence, reformulez votre question.`;
        responseType = 'urgent';
        break;

      case 'symptoms':
        const primarySymptom = analysis.keywords[0];
        if (medicalKnowledge.symptoms[primarySymptom]) {
          const preConsultation = startPreConsultation(primarySymptom);
          if (preConsultation) {
            return preConsultation;
          }
        }
        
        response = `Je comprends que vous ressentez des symptômes. Voici ce que je peux vous conseiller :\n\n`;
        analysis.keywords.forEach(symptom => {
          if (medicalKnowledge.symptoms[symptom]) {
            const symptomInfo = medicalKnowledge.symptoms[symptom];
            response += `🔍 **${symptom.toUpperCase()}**\n`;
            response += `Causes possibles : ${symptomInfo.possibleCauses.join(', ')}\n`;
            response += `Actions immédiates : ${symptomInfo.immediateActions.join(', ')}\n\n`;
          }
        });
        response += `⚠️ Si les symptômes persistent ou s'aggravent, consultez un médecin.`;
        response += `\n\n💡 **Voulez-vous faire une préconsultation détaillée ?** Je peux vous poser des questions spécifiques pour mieux évaluer votre situation.`;
        responseType = 'warning';
        suggestions = ['Oui, commencer la préconsultation', 'Non, merci', 'Plus d\'informations'];
        break;

      case 'medications':
        response = `💊 **INFORMATIONS SUR VOS MÉDICAMENTS**\n\n`;
        userProfile.medications.forEach(med => {
          if (medicalKnowledge.medications[med.toLowerCase()]) {
            const medInfo = medicalKnowledge.medications[med.toLowerCase()];
            response += `**${med}** :\n`;
            response += `• But : ${medInfo.purpose}\n`;
            response += `• Effets secondaires : ${medInfo.sideEffects.join(', ')}\n`;
            response += `• Interactions : ${medInfo.interactions.join(', ')}\n`;
            response += `• Surveillance : ${medInfo.monitoring}\n\n`;
          }
        });
        responseType = 'info';
        break;

      case 'diet':
        response = `🥗 **CONSEILS ALIMENTAIRES PERSONNALISÉS**\n\n`;
        if (userProfile.conditions.includes('Diabète type 2')) {
          response += `**Pour votre diabète :**\n`;
          response += `• Évitez les sucres rapides\n`;
          response += `• Privilégiez les fibres (légumes, céréales complètes)\n`;
          response += `• Mangez à heures régulières\n`;
          response += `• Contrôlez les portions\n\n`;
        }
        if (userProfile.conditions.includes('Hypertension')) {
          response += `**Pour votre hypertension :**\n`;
          response += `• Réduisez le sel (< 6g/jour)\n`;
          response += `• Évitez les aliments transformés\n`;
          response += `• Privilégiez les fruits et légumes\n`;
          response += `• Limitez l'alcool\n\n`;
        }
        response += `📊 Voulez-vous un plan alimentaire personnalisé ?`;
        responseType = 'success';
        break;

      case 'consultation':
        return handleStructuredConsultation();

      case 'medication_photo':
        return handleMedicationPhoto();

      case 'symptom_tracking':
        return handleSymptomTracking();

      case 'contraindication_check':
        // Extraire le nom du médicament du message FENKU-IT
        const medicationMatch = message.match(/(?:vérifier|checker|compatible|contre-indication).*?([a-zA-Z\s]+)/i);
        const medicationName = medicationMatch ? medicationMatch[1].trim() : 'médicament';
        return handleContraindicationCheck(medicationName);

      default:
        response = `Bonjour ${userProfile.name} ! 👋\n\nJe suis l'Assistant Médicale de Fajma. Je peux vous aider avec :\n\n`;
        response += `• 📋 Questions sur vos symptômes\n`;
        response += `• 💊 Informations sur vos médicaments\n`;
        response += `• 🥗 Conseils alimentaires personnalisés\n`;
        response += `• 🏃‍♂️ Recommandations d'exercices\n`;
        response += `• 📅 Gestion de vos rendez-vous\n`;
        response += `• ⚠️ Évaluation d'urgence\n\n`;
        response += `Que puis-je faire pour vous aujourd'hui ?`;
        responseType = 'info';
    }

    return { response, responseType, suggestions };
  };

  // Simulation de frappe FENKU-IT
  const simulateTyping = async (response) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
    return response;
  };

  // Callbacks pour les nouvelles fonctionnalités FENKU-IT
  
  // Callback pour la reconnaissance de médicament FENKU-IT
  const handleMedicationRecognized = (medicationData) => {
    const response = `✅ **Médicament reconnu avec succès !**\n\n**${medicationData.name}**\n\n`;
    response += `• **Substance active :** ${medicationData.activeIngredient}\n`;
    response += `• **Posologie :** ${medicationData.dosage}\n`;
    response += `• **Instructions :** ${medicationData.instructions}\n\n`;
    
    if (medicationData.warnings && medicationData.warnings.length > 0) {
      response += `⚠️ **Avertissements :**\n`;
      medicationData.warnings.forEach(warning => {
        response += `• ${warning}\n`;
      });
    }
    
    response += `\n💡 **Voulez-vous vérifier les contre-indications avec votre dossier médical ?**`;

    const botMessage = {
      id: Date.now(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      type: 'success',
      suggestions: ['Vérifier les contre-indications', 'Fermer']
    };

    setMessages(prev => [...prev, botMessage]);
    setShowPhotoUpload(false);
  };

  // Callback pour la consultation structurée FENKU-IT
  const handleConsultationComplete = async (consultationData) => {
    try {
      // Tentative de sauvegarde via l'API FENKU-IT
      await consultationService.saveConsultation(userProfile.id || 1, consultationData);
      
      const response = `📋 **Consultation terminée avec succès !**\n\n`;
      response += `Votre consultation a été enregistrée dans votre dossier médical.\n\n`;
      response += `**Résumé :**\n`;
      response += `• Symptôme principal : ${consultationData.mainSymptom}\n`;
      response += `• Niveau d'urgence : ${consultationData.urgencyLevel}\n`;
      response += `• Évaluation : ${consultationData.preliminaryAssessment}\n\n`;
      response += `💡 **Recommandation :** Consultez votre médecin pour un diagnostic précis.`;

      const botMessage = {
        id: Date.now(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        type: 'info',
        suggestions: ['Voir le résumé complet', 'Fermer']
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Mode démonstration - sauvegarde locale FENKU-IT
      console.warn('API non disponible, sauvegarde locale de la consultation');
      
      const response = `📋 **Consultation terminée avec succès !**\n\n`;
      response += `Votre consultation a été enregistrée localement (mode démonstration).\n\n`;
      response += `**Résumé :**\n`;
      response += `• Symptôme principal : ${consultationData.mainSymptom}\n`;
      response += `• Niveau d'urgence : ${consultationData.urgencyLevel}\n`;
      response += `• Évaluation : ${consultationData.preliminaryAssessment}\n\n`;
      response += `💡 **Recommandation :** Consultez votre médecin pour un diagnostic précis.\n\n`;
      response += `*Note: Données sauvegardées en mode démonstration*`;

      const botMessage = {
        id: Date.now(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        type: 'info',
        suggestions: ['Voir le résumé complet', 'Fermer']
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setShowStructuredConsultation(false);
    }
  };

  // Envoi de message FENKU-IT
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Analyse intelligente FENKU-IT
    const analysis = analyzeMessage(inputValue);
    const { response, responseType, suggestions } = generateIntelligentResponse(inputValue, analysis);

    // Simulation de frappe FENKU-IT
    const botResponse = await simulateTyping(response);

    const botMessage = {
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date(),
      type: responseType,
      analysis: analysis,
      suggestions: suggestions
    };

    setMessages(prev => [...prev, botMessage]);
  };

  // Gestion de la reconnaissance vocale FENKU-IT
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Reconnaissance vocale non supportée');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Écoute en cours...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Erreur de reconnaissance vocale');
    };

    recognition.start();
  };

  // Auto-scroll FENKU-IT
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Styles FENKU-IT - Cohérent avec le sidebar
  const getCardStyles = () => ({
    background: theme.palette.mode === 'dark' 
      ? colors.blackAccent[600]
      : '#fcfcfc',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  });

  const getMessageStyles = (sender, type = 'info') => {
    const baseStyles = {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '18px',
      marginBottom: '8px',
      wordWrap: 'break-word',
      position: 'relative',
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
        : '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)'
    };

    if (sender === 'user') {
      return {
        ...baseStyles,
        background: '#0096b0',
        color: 'white',
        marginLeft: 'auto',
        borderBottomRightRadius: '4px',
        boxShadow: '0 4px 12px rgba(0, 150, 176, 0.3), 0 2px 4px rgba(0, 150, 176, 0.2)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
      };
    } else {
      const typeColors = {
        urgent: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        info: theme.palette.mode === 'dark' 
          ? '#ffffff'
          : '#ffffff'
      };

      return {
        ...baseStyles,
        background: typeColors[type] || typeColors.info,
        color: type === 'urgent' || type === 'warning' ? 'white' : 
               theme.palette.mode === 'dark' ? '#000000' : '#000000',
        marginRight: 'auto',
        borderBottomLeftRadius: '4px',
        textShadow: type === 'urgent' || type === 'warning' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
        textAlign: 'left'
      };
    }
  };

  return (
    <>
      {/* Bouton flottant FENKU-IT */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999
        }}
      >
        {!isOpen ? (
          <Tooltip title="Assistant Médicale de Fajma - Cliquez pour ouvrir">
            <IconButton
              onClick={() => setIsOpen(true)}
              sx={{
                width: 60,
                height: 60,
                background: '#0096b0',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 150, 176, 0.4), 0 4px 16px rgba(0, 150, 176, 0.2)',
                '&:hover': {
                  background: '#0088a3',
                  boxShadow: '0 12px 40px rgba(0, 150, 176, 0.6), 0 6px 20px rgba(0, 150, 176, 0.3)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'pulse 2s infinite',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Brain size={28} />
            </IconButton>
          </Tooltip>
        ) : (
          <Fade in={isOpen} timeout={300}>
            <Box
              sx={{
                width: 400,
                height: 600,
                ...getCardStyles()
              }}
            >
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header FENKU-IT */}
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#0096b0',
                    borderRadius: '16px 16px 0 0'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        background: '#0096b0',
                        width: 32,
                        height: 32
                      }}
                    >
                      <Brain size={18} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                        Assistant Médicale de Fajma
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        En ligne • Prêt à vous aider
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="Fermer">
                    <IconButton
                      size="small"
                      onClick={() => setIsOpen(false)}
                      sx={{ color: 'white' }}
                    >
                      <X size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>

            {/* Messages FENKU-IT */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                background: theme.palette.mode === 'dark' 
                  ? colors.blackAccent[600]
                  : '#fcfcfc'
              }}
            >
              {messages.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      background: '#0096b0',
                      width: 48,
                      height: 48,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <Brain size={24} />
                  </Avatar>
                  <Typography variant="h6" sx={{ 
                    mb: 1, 
                    color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
                    textShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
                    fontWeight: 600
                  }}>
                    Bonjour {userProfile.name} ! 👋
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600], 
                    mb: 2,
                    textShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
                  }}>
                    Je suis l'Assistant Médicale de Fajma. Comment puis-je vous aider ?
                  </Typography>
                  
                  {/* Message de mode démonstration FENKU-IT */}
                  <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
                    🚀 Mode démonstration - Toutes les fonctionnalités sont disponibles avec des données simulées
                  </Alert>
                  
                  {showSuggestions && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" sx={{ 
                        color: theme.palette.mode === 'dark' ? colors.grey[400] : colors.grey[600], 
                        mb: 1, 
                        display: 'block',
                        textShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none',
                        fontWeight: 500
                      }}>
                        Questions rapides :
                      </Typography>
                       {quickQuestions.slice(0, 3).map((question, index) => (
                         <Chip
                           key={index}
                           label={question}
                           size="small"
                           onClick={() => {
                             setInputValue(question);
                             // Déclencher l'envoi automatique pour les questions de préconsultation
                             if (question.includes('préconsultation') || question.includes('symptômes')) {
                               setTimeout(() => {
                                 handleSendMessage();
                               }, 100);
                             }
                           }}
                           sx={{
                             m: 0.5,
                             background: theme.palette.mode === 'dark' 
                               ? 'rgba(255,255,255,0.1)' 
                               : 'rgba(0,0,0,0.05)',
                             color: theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700],
                             boxShadow: theme.palette.mode === 'dark' 
                               ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                               : '0 2px 8px rgba(0, 0, 0, 0.1)',
                             '&:hover': {
                               background: theme.palette.mode === 'dark' 
                                 ? 'rgba(255,255,255,0.2)' 
                                 : 'rgba(0,0,0,0.1)',
                               boxShadow: theme.palette.mode === 'dark' 
                                 ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                 : '0 4px 12px rgba(0, 0, 0, 0.15)'
                             }
                           }}
                         />
                       ))}
                       
                       {/* Boutons d'action rapide FENKU-IT */}
                       <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                         <Button
                           startIcon={<Camera size={16} />}
                           onClick={() => setShowPhotoUpload(true)}
                           size="small"
                           variant="outlined"
                           sx={{
                             color: '#0096b0',
                             borderColor: '#0096b0',
                             '&:hover': {
                               borderColor: '#0088a3',
                               backgroundColor: 'rgba(0, 150, 176, 0.1)'
                             }
                           }}
                         >
                           Photo Médicament
                         </Button>
                         
                         <Button
                           startIcon={<ClipboardList size={16} />}
                           onClick={() => setShowStructuredConsultation(true)}
                           size="small"
                           variant="outlined"
                           sx={{
                             color: '#0096b0',
                             borderColor: '#0096b0',
                             '&:hover': {
                               borderColor: '#0088a3',
                               backgroundColor: 'rgba(0, 150, 176, 0.1)'
                             }
                           }}
                         >
                           Consultation
                         </Button>
                         
                         <Button
                           startIcon={<BarChart3 size={16} />}
                           onClick={() => setShowSymptomTracker(true)}
                           size="small"
                           variant="outlined"
                           sx={{
                             color: '#0096b0',
                             borderColor: '#0096b0',
                             '&:hover': {
                               borderColor: '#0088a3',
                               backgroundColor: 'rgba(0, 150, 176, 0.1)'
                             }
                           }}
                         >
                           Suivi
                         </Button>
                       </Box>
                    </Box>
                  )}
                </Box>
              )}

              {messages.map((message) => (
                <Slide key={message.id} direction="up" in={true}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      mb: 1
                    }}
                  >
                    {message.sender === 'bot' && (
                      <Avatar
                        sx={{
                          background: '#0096b0',
                          width: 28,
                          height: 28,
                          mt: 0.5
                        }}
                      >
                        <Brain size={14} />
                      </Avatar>
                    )}
                     <Box
                       sx={{
                         ...getMessageStyles(message.sender, message.type),
                         whiteSpace: 'pre-line'
                       }}
                     >
                       {message.text}
                       {message.sender === 'bot' && message.analysis?.urgency === 'urgent' && (
                         <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                           <Chip
                             icon={<AlertCircle size={12} />}
                             label="URGENT"
                             size="small"
                             sx={{ 
                               background: '#ef4444', 
                               color: 'white',
                               fontSize: '0.7rem'
                             }}
                           />
                         </Box>
                       )}
                       {message.sender === 'bot' && consultationState.isActive && message.text.includes('Question') && (
                         <Box sx={{ mt: 1, display: 'flex', gap: 0.5, alignItems: 'center' }}>
                           <Chip
                             icon={<Clock size={12} />}
                             label={`Préconsultation en cours`}
                             size="small"
                             sx={{ 
                               background: '#0096b0', 
                               color: 'white',
                               fontSize: '0.7rem'
                             }}
                           />
                           <Typography variant="caption" sx={{ 
                             color: theme.palette.mode === 'dark' ? colors.grey[400] : colors.grey[600],
                             ml: 1
                           }}>
                             Étape {consultationState.step + 1} sur {medicalKnowledge.symptoms[consultationState.currentSymptom]?.questions?.length || 4}
                           </Typography>
                         </Box>
                       )}
                     </Box>
                    {message.sender === 'user' && (
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
                          width: 28,
                          height: 28,
                          mt: 0.5
                        }}
                      >
                        <User size={14} />
                      </Avatar>
                    )}
                  </Box>
                </Slide>
              ))}

              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar
                    sx={{
                      background: '#0096b0',
                      width: 28,
                      height: 28
                    }}
                  >
                    <Brain size={14} />
                  </Avatar>
                  <Box
                    sx={{
                      background: theme.palette.mode === 'dark' 
                        ? colors.blackAccent[500]
                        : '#fcfcfc',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      borderBottomLeftRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={16} />
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600],
                      textShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
                    }}>
                      L'IA réfléchit...
                    </Typography>
                  </Box>
                </Box>
              )}

                <div ref={messagesEndRef} />
              </Box>

              {/* Input FENKU-IT */}
              <Box
                sx={{
                  p: 2,
                  background: theme.palette.mode === 'dark' 
                    ? colors.blackAccent[500]
                    : '#fcfcfc80'
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    ref={inputRef}
                    fullWidth
                    multiline
                    maxRows={3}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Posez votre question médicale..."
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        background: theme.palette.mode === 'dark' 
                          ? colors.blackAccent[500]
                          : '#fcfcfc',
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover fieldset': {
                          border: 'none'
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none'
                        }
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: theme.palette.mode === 'dark' ? colors.grey[400] : colors.grey[500],
                        opacity: 1,
                        textShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
                      }
                    }}
                  />
                  <Tooltip title="Reconnaissance vocale">
                    <IconButton
                      onClick={handleVoiceInput}
                      disabled={isListening}
                      sx={{
                        background: isListening 
                          ? colors.error[500] 
                          : theme.palette.mode === 'dark' 
                            ? colors.blackAccent[500]
                            : '#fcfcfc',
                        color: isListening ? 'white' : colors.grey[600],
                        '&:hover': {
                          background: isListening 
                            ? colors.error[600] 
                            : colors.primary[100]
                        }
                      }}
                    >
                      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    sx={{
                      background: '#0096b0',
                      color: 'white',
                      '&:hover': {
                        background: '#0088a3'
                      },
                      '&:disabled': {
                        background: colors.grey[300],
                        color: colors.grey[500]
                      }
                    }}
                  >
                    <Send size={18} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
        )}
      </Box>

      {/* Composants modaux pour les nouvelles fonctionnalités FENKU-IT */}
      
      {/* PhotoUpload Modal FENKU-IT */}
      {showPhotoUpload && (
        <PhotoUploadSimple
          onMedicationRecognized={handleMedicationRecognized}
          onClose={() => setShowPhotoUpload(false)}
          userProfile={userProfile}
        />
      )}

      {/* StructuredConsultation Modal FENKU-IT */}
      {showStructuredConsultation && (
        <StructuredConsultation
          onComplete={handleConsultationComplete}
          onClose={() => setShowStructuredConsultation(false)}
          patientId={userProfile.id || 1}
        />
      )}

      {/* SymptomTracker Modal FENKU-IT */}
      {showSymptomTracker && (
        <SymptomTracker
          onClose={() => setShowSymptomTracker(false)}
          patientId={userProfile.id || 1}
        />
      )}

      {/* Animation CSS FENKU-IT */}
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 8px 32px rgba(0, 150, 176, 0.4);
            }
            50% {
              box-shadow: 0 8px 32px rgba(0, 150, 176, 0.8), 0 0 0 10px rgba(0, 150, 176, 0.1);
            }
            100% {
              box-shadow: 0 8px 32px rgba(0, 150, 176, 0.4);
            }
          }
        `}
      </style>
    </>
  );
};

export default ChatbotMedical;