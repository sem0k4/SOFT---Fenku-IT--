import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Chip,
  Divider,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Close,
  ExpandMore,
  ExpandLess,
  LocalHospital,
  Favorite,
  Warning,
  Info
} from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';

const PatientChatbot = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Base de connaissances médicales
  const medicalKnowledge = {
    symptoms: {
      'fièvre': {
        description: 'Température corporelle élevée (>37.5°C)',
        advice: 'Reposez-vous, buvez beaucoup d\'eau, prenez du paracétamol si nécessaire. Consultez un médecin si la fièvre persiste plus de 3 jours.',
        urgency: 'moderate'
      },
      'toux': {
        description: 'Réflexe de toux pour expulser les sécrétions',
        advice: 'Buvez beaucoup d\'eau, utilisez des pastilles pour la gorge. Consultez si la toux persiste plus d\'une semaine.',
        urgency: 'low'
      },
      'douleur thoracique': {
        description: 'Douleur dans la région du thorax',
        advice: 'URGENCE MÉDICALE - Appelez immédiatement les secours (15) ou rendez-vous aux urgences.',
        urgency: 'high'
      },
      'essoufflement': {
        description: 'Difficulté à respirer normalement',
        advice: 'URGENCE MÉDICALE - Consultez immédiatement un médecin ou appelez les secours.',
        urgency: 'high'
      },
      'nausée': {
        description: 'Sensation de mal-être avec envie de vomir',
        advice: 'Reposez-vous, évitez les aliments gras. Consultez si les nausées persistent plus de 24h.',
        urgency: 'moderate'
      },
      'maux de tête': {
        description: 'Douleur dans la région crânienne',
        advice: 'Reposez-vous dans un endroit calme, prenez du paracétamol. Consultez si les maux de tête sont intenses ou persistants.',
        urgency: 'moderate'
      }
    },
    medications: {
      'paracétamol': 'Analgésique et antipyrétique. Dose recommandée: 1g toutes les 6-8h. Ne pas dépasser 4g/jour.',
      'ibuprofène': 'Anti-inflammatoire. Dose recommandée: 400mg toutes les 6-8h. À prendre avec de la nourriture.',
      'aspirine': 'Anti-inflammatoire et anticoagulant. Attention aux interactions médicamenteuses.',
      'vitamine c': 'Complément vitaminique pour renforcer le système immunitaire.'
    },
    emergencies: [
      'douleur thoracique',
      'essoufflement',
      'perte de conscience',
      'hémorragie',
      'traumatisme crânien',
      'brûlure grave',
      'intoxication'
    ]
  };

  // Messages d'accueil
  const welcomeMessages = [
    "Bonjour ! Je suis votre assistant médical virtuel. Comment puis-je vous aider aujourd'hui ?",
    "Salut ! Je suis là pour répondre à vos questions de santé. Que souhaitez-vous savoir ?",
    "Bonjour ! En tant que votre assistant médical, je peux vous aider avec vos symptômes, médicaments ou questions de santé."
  ];

  // Initialiser le chatbot
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Analyser le message de l'utilisateur
  const analyzeMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Détecter les symptômes
    for (const [symptom, info] of Object.entries(medicalKnowledge.symptoms)) {
      if (lowerMessage.includes(symptom)) {
        return {
          type: 'symptom',
          data: { symptom, ...info },
          response: generateSymptomResponse(symptom, info)
        };
      }
    }

    // Détecter les médicaments
    for (const [medication, info] of Object.entries(medicalKnowledge.medications)) {
      if (lowerMessage.includes(medication)) {
        return {
          type: 'medication',
          data: { medication, info },
          response: generateMedicationResponse(medication, info)
        };
      }
    }

    // Détecter les urgences
    for (const emergency of medicalKnowledge.emergencies) {
      if (lowerMessage.includes(emergency)) {
        return {
          type: 'emergency',
          data: { emergency },
          response: generateEmergencyResponse(emergency)
        };
      }
    }

    // Détecter les questions générales
    if (lowerMessage.includes('comment') || lowerMessage.includes('quoi') || lowerMessage.includes('pourquoi')) {
      return {
        type: 'general',
        data: {},
        response: generateGeneralResponse(lowerMessage)
      };
    }

    // Réponse par défaut
    return {
      type: 'default',
      data: {},
      response: generateDefaultResponse()
    };
  };

  // Générer les réponses selon le type
  const generateSymptomResponse = (symptom, info) => {
    const urgencyIcons = {
      high: <Warning sx={{ color: 'red' }} />,
      moderate: <Info sx={{ color: 'orange' }} />,
      low: <Info sx={{ color: 'green' }} />
    };

    return {
      text: `Je comprends que vous ressentez des symptômes de ${symptom}. ${info.description}\n\n${info.advice}`,
      icon: urgencyIcons[info.urgency],
      urgency: info.urgency,
      suggestions: [
        'Prendre rendez-vous avec un médecin',
        'Appeler les urgences',
        'Consulter un pharmacien',
        'Autres questions'
      ]
    };
  };

  const generateMedicationResponse = (medication, info) => {
    return {
      text: `À propos de ${medication} :\n\n${info}`,
      icon: <LocalHospital sx={{ color: 'blue' }} />,
      suggestions: [
        'Posologie recommandée',
        'Effets secondaires',
        'Interactions médicamenteuses',
        'Autres questions'
      ]
    };
  };

  const generateEmergencyResponse = (emergency) => {
    return {
      text: `🚨 URGENCE MÉDICALE DÉTECTÉE 🚨\n\nSymptôme: ${emergency}\n\nVeuillez immédiatement :\n• Appeler le 15 (SAMU)\n• Ou vous rendre aux urgences les plus proches\n• Ne restez pas seul(e)\n\nJe vous conseille de consulter un professionnel de santé immédiatement.`,
      icon: <Warning sx={{ color: 'red' }} />,
      urgency: 'high',
      suggestions: [
        'Appeler le 15',
        'Trouver les urgences proches',
        'Contacter un médecin',
        'Autres urgences'
      ]
    };
  };

  const generateGeneralResponse = (message) => {
    if (message.includes('santé') || message.includes('médical')) {
      return {
        text: "Je suis là pour vous aider avec vos questions de santé. Vous pouvez me demander des informations sur vos symptômes, médicaments, ou toute autre question médicale.",
        icon: <LocalHospital sx={{ color: 'blue' }} />,
        suggestions: [
          'Décrire mes symptômes',
          'Questions sur mes médicaments',
          'Conseils de prévention',
          'Autres questions'
        ]
      };
    }
    return generateDefaultResponse();
  };

  const generateDefaultResponse = () => {
    return {
      text: "Je comprends votre question. Pour mieux vous aider, pourriez-vous me donner plus de détails sur vos symptômes ou votre préoccupation médicale ?",
      icon: <Info sx={{ color: 'blue' }} />,
      suggestions: [
        'Décrire mes symptômes',
        'Questions sur mes médicaments',
        'Conseils de prévention',
        'Prendre rendez-vous'
      ]
    };
  };

  // Envoyer un message
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler le délai de réponse du bot
    setTimeout(() => {
      const analysis = analyzeMessage(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: analysis.response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: analysis.type,
        icon: analysis.response.icon,
        urgency: analysis.response.urgency,
        suggestions: analysis.response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Gérer les suggestions
  const handleSuggestion = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  // Gérer les touches
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
    >
      {/* Bouton de chat */}
      {!isOpen && (
        <Fade in={!isOpen}>
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              backgroundColor: colors.primary[500],
              color: 'white',
              width: 60,
              height: 60,
              '&:hover': {
                backgroundColor: colors.primary[600],
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <SmartToy />
          </IconButton>
        </Fade>
      )}

      {/* Interface du chat */}
      {isOpen && (
        <Fade in={isOpen}>
          <Paper
            elevation={10}
            sx={{
              width: isMinimized ? 300 : 400,
              height: isMinimized ? 60 : 500,
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : 'white',
              border: `1px solid ${colors.primary[200]}`
            }}
          >
            {/* En-tête */}
            <Box
              sx={{
                backgroundColor: colors.primary[500],
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, backgroundColor: 'white', color: colors.primary[500] }}>
                  <SmartToy />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Assistant Médical
                </Typography>
              </Box>
              <Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  sx={{ color: 'white' }}
                >
                  {isMinimized ? <ExpandMore /> : <ExpandLess />}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setIsOpen(false)}
                  sx={{ color: 'white', ml: 1 }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Box>

            {!isMinimized && (
              <>
                {/* Messages */}
                <Box
                  sx={{
                    height: 350,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '80%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'user' 
                            ? colors.primary[500] 
                            : colors.grey[100],
                          color: message.sender === 'user' ? 'white' : 'text.primary',
                          position: 'relative'
                        }}
                      >
                        {message.sender === 'bot' && message.icon && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {message.icon}
                            {message.urgency === 'high' && (
                              <Chip 
                                label="URGENT" 
                                size="small" 
                                color="error" 
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        )}
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                          {message.text}
                        </Typography>
                        {message.suggestions && (
                          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {message.suggestions.map((suggestion, index) => (
                              <Chip
                                key={index}
                                label={suggestion}
                                size="small"
                                onClick={() => handleSuggestion(suggestion)}
                                sx={{
                                  cursor: 'pointer',
                                  fontSize: '0.7rem',
                                  '&:hover': {
                                    backgroundColor: colors.primary[200]
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                  
                  {isTyping && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        L'assistant tape...
                      </Typography>
                    </Box>
                  )}
                  
                  <div ref={messagesEndRef} />
                </Box>

                <Divider />

                {/* Zone de saisie */}
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      ref={inputRef}
                      fullWidth
                      placeholder="Posez votre question médicale..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      multiline
                      maxRows={3}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                    <IconButton
                      onClick={sendMessage}
                      disabled={!inputMessage.trim()}
                      sx={{
                        backgroundColor: colors.primary[500],
                        color: 'white',
                        '&:hover': {
                          backgroundColor: colors.primary[600]
                        },
                        '&:disabled': {
                          backgroundColor: colors.grey[300],
                          color: colors.grey[500]
                        }
                      }}
                    >
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default PatientChatbot;
