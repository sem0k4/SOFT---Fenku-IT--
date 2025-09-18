
// ===== IMPORTS =====
// React - Bibliothèque principale pour la création d'interfaces utilisateur
import React, { useState, useContext, useEffect } from 'react';

// Material-UI - Bibliothèque de composants UI pour React
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button as MuiButton, Chip, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputBase, IconButton, Pagination, Select, MenuItem, FormControl, InputLabel, Modal, Backdrop, Fade, Divider } from '@mui/material';

// Thème personnalisé - Système de thème avec mode sombre/clair
import { ColorModeContext, tokens } from '../../theme';

// CSS personnalisé - Animations et styles pour le dashboard
import '../../styles/dashboard.css';

// shadcn/ui - Composants UI modernes
import { Toaster } from '../../components/ui/sonner';
import { toast } from 'sonner';
import { Skeleton } from '../../components/ui/skeleton';

// Composants partagés
import HeaderDashboard from '../../components/shared/HeaderDashboard';

// Lucide React - Icônes modernes et légères
import { 
  Search,
  Calendar,
  Filter,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Eye,
  X,
  Grid3X3,
  List,
  XCircle,
  FileText,
  Pill,
  Stethoscope,
  ClipboardList
} from 'lucide-react';

const Consultation = () => {
  // ===== HOOKS =====
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // ===== ÉTATS =====
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('Aujourd\'hui');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [consultationView, setConsultationView] = useState('list'); // 'cards' ou 'list'
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // ===== DONNÉES CONSULTATIONS =====
  const consultationsData = [
    {
      id: 1,
      doctor: {
        name: "Dr Mbengue",
        avatar: "M",
        color: "#3B82F6",
        specialty: "Médecine générale",
        phone: "+221 77 123 45 67",
        email: "dr.mbengue@clinic.sn"
      },
      date: "30 Aout 2025",
      time: "10:30",
      mode: "présentielle",
      status: "terminée",
      statusColor: "#10B981",
      details: {
        symptoms: "Maux de tête, fièvre légère, fatigue",
        diagnosis: "Grippe saisonnière",
        observations: "Patient présente des symptômes typiques de la grippe. Température à 38.2°C, gorge légèrement irritée. État général correct.",
        treatment: "Repos, hydratation, traitement symptomatique",
        followUp: "Contrôle dans 3 jours si pas d'amélioration"
      },
      prescription: {
        id: "ORD-2025-001",
        date: "30 Aout 2025",
        doctor: "Dr Mbengue",
        medications: [
          {
            id: 1,
            name: "Paracétamol 1000mg",
            dosage: "1 comprimé",
            frequency: "3 fois par jour",
            duration: "5 jours",
            instructions: "À prendre après les repas"
          },
          {
            id: 2,
            name: "Vitamine C 500mg",
            dosage: "1 comprimé",
            frequency: "1 fois par jour",
            duration: "7 jours",
            instructions: "Le matin au petit-déjeuner"
          },
          {
            id: 3,
            name: "Sirop antitussif",
            dosage: "1 cuillère à soupe",
            frequency: "3 fois par jour",
            duration: "5 jours",
            instructions: "En cas de toux sèche"
          }
        ]
      }
    },
    {
      id: 2,
      doctor: {
        name: "Dr Diop",
        avatar: "D",
        color: "#EC4899",
        specialty: "Cardiologie",
        phone: "+221 77 234 56 78",
        email: "dr.diop@clinic.sn"
      },
      date: "09 Décembre 2025",
      time: "08:00",
      mode: "en ligne",
      status: "en attente",
      statusColor: "#3B82F6"
    },
    {
      id: 3,
      doctor: {
        name: "Dr Sow",
        avatar: "S",
        color: "#10B981",
        specialty: "Dermatologie",
        phone: "+221 77 345 67 89",
        email: "dr.sow@clinic.sn"
      },
      date: "01 Janvier 2026",
      time: "12:00",
      mode: "en ligne",
      status: "terminée",
      statusColor: "#10B981",
      details: {
        symptoms: "Éruption cutanée sur les bras, démangeaisons",
        diagnosis: "Dermatite de contact",
        observations: "Lésions érythémateuses et prurigineuses sur les avant-bras. Pas de signes d'infection. Patient a récemment changé de lessive.",
        treatment: "Éviction de l'allergène, traitement topique",
        followUp: "Contrôle dans 1 semaine"
      },
      prescription: {
        id: "ORD-2025-002",
        date: "01 Janvier 2026",
        doctor: "Dr Sow",
        medications: [
          {
            id: 1,
            name: "Crème corticoïde",
            dosage: "Application locale",
            frequency: "2 fois par jour",
            duration: "7 jours",
            instructions: "Appliquer en couche fine sur les zones atteintes"
          },
          {
            id: 2,
            name: "Antihistaminique",
            dosage: "1 comprimé",
            frequency: "1 fois par jour",
            duration: "5 jours",
            instructions: "Le soir au coucher"
          }
        ]
      }
    },
    {
      id: 4,
      doctor: {
        name: "Dr Mbengue",
        avatar: "M",
        color: "#3B82F6",
        specialty: "Médecine générale",
        phone: "+221 77 123 45 67",
        email: "dr.mbengue@clinic.sn"
      },
      date: "30 Aout 2025",
      time: "10:30",
      mode: "présentielle",
      status: "confirmée",
      statusColor: "#10B981"
    },
    {
      id: 5,
      doctor: {
        name: "Dr Diop",
        avatar: "D",
        color: "#EC4899",
        specialty: "Cardiologie",
        phone: "+221 77 234 56 78",
        email: "dr.diop@clinic.sn"
      },
      date: "09 Décembre 2025",
      time: "08:00",
      mode: "en ligne",
      status: "en attente",
      statusColor: "#3B82F6"
    },
    {
      id: 6,
      doctor: {
        name: "Dr Sow",
        avatar: "S",
        color: "#10B981",
        specialty: "Dermatologie",
        phone: "+221 77 345 67 89",
        email: "dr.sow@clinic.sn"
      },
      date: "01 Janvier 2026",
      time: "12:00",
      mode: "en ligne",
      status: "annulée",
      statusColor: "#EF4444"
    }
  ];

  // ===== EFFET DE CHARGEMENT =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Consultations chargées', {
        description: 'Vos consultations sont maintenant disponibles.',
        duration: 2000,
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // ===== FONCTIONS UTILITAIRES =====
  const getCardStyles = () => ({
    background: theme.palette.mode === 'dark' 
      ? 'rgba(30, 41, 59, 0.4)' // Fond semi-transparent sombre
      : 'rgba(255, 255, 255, 0.25)', // Fond semi-transparent clair
    backdropFilter: 'blur(16px)', // Effet de flou d'arrière-plan
    WebkitBackdropFilter: 'blur(16px)', // Support WebKit
    borderRadius: '16px', // Coins plus arrondis pour l'effet glass
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' // Ombre et highlight en mode sombre
      : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)', // Ombre et highlight en mode clair
    border: theme.palette.mode === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.1)' // Bordure transparente en mode sombre
      : '1px solid rgba(255, 255, 255, 0.2)', // Bordure transparente en mode clair
    p: 3 // Padding de 24px (Material-UI spacing)
  });

  const getTextColor = (variant = 'primary') => {
    if (variant === 'primary') {
      return theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600];
    }
    return theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400];
  };

  const getAccentColor = () => theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0';

  // ===== FILTRAGE =====
  const filteredConsultations = consultationsData.filter(consultation => {
    const matchesSearch = consultation.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.mode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === '' || consultation.status === selectedStatus;
    const matchesMode = selectedMode === '' || consultation.mode === selectedMode;
    
    // Filtrage par date (simplifié pour la démo)
    let matchesDate = true;
    if (selectedDate === 'Aujourd\'hui') {
      // Dans un vrai projet, vous compareriez avec la date actuelle
      matchesDate = consultation.date.includes('Aout') || consultation.date.includes('Décembre') || consultation.date.includes('Janvier');
    } else if (selectedDate === 'Cette semaine') {
      matchesDate = true; // Toutes les consultations pour la démo
    } else if (selectedDate === 'Ce mois') {
      matchesDate = true; // Toutes les consultations pour la démo
    }
    
    return matchesSearch && matchesStatus && matchesMode && matchesDate;
  });

  // Options pour les filtres
  const statusOptions = [...new Set(consultationsData.map(consultation => consultation.status))];
  const modeOptions = [...new Set(consultationsData.map(consultation => consultation.mode))];
  const dateOptions = ['Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Toutes'];

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedMode('');
    setSelectedDate('Aujourd\'hui');
  };

  // Fonction pour ouvrir le modal de consultation
  const handleViewConsultation = (consultation) => {
    if (consultation.status === 'terminée') {
      setSelectedConsultation(consultation);
      setShowConsultationModal(true);
      toast.info('Ouverture des détails', {
        description: `Détails de la consultation avec ${consultation.doctor.name}`,
        duration: 2000,
      });
    } else {
      toast.warning('Consultation non terminée', {
        description: 'Les détails ne sont disponibles que pour les consultations terminées.',
        duration: 3000,
      });
    }
  };

  // ===== SKELETON DE CHARGEMENT =====
  const renderLoadingSkeleton = () => (
    <Box sx={{ p: 2, pt: 10 }}>
      {/* Skeleton pour l'en-tête */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 4,
        mt: 4,
        gap: 2
      }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton height={40} width="60%" sx={{ mb: 1 }} />
          <Skeleton height={20} width="80%" />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton height={40} width={180} />
          <Skeleton height={40} width={200} />
        </Box>
      </Box>

      {/* Skeleton pour les contrôles */}
      <Box sx={{ 
        mb: 4,
        ...getCardStyles()
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Skeleton height={40} width="60%" />
          <Skeleton height={40} width={100} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton height={40} width={80} />
            <Skeleton height={40} width={80} />
          </Box>
        </Box>
      </Box>

      {/* Skeleton pour les consultations en cartes */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
        gap: 3 
      }}>
        {[...Array(6)].map((_, index) => (
          <Box key={index} sx={{ ...getCardStyles(), p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Skeleton height={24} width="70%" />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={16} height={16} />
              <Skeleton height={16} width="60%" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Skeleton height={24} width={80} />
              <Skeleton height={24} width={80} />
            </Box>
            <Skeleton height={32} width="100%" />
          </Box>
        ))}
      </Box>
    </Box>
  );

  // ===== MODAL DÉTAILS CONSULTATION =====
  const renderConsultationModal = () => (
    <Modal
      open={showConsultationModal}
      onClose={() => {
        setShowConsultationModal(false);
        setSelectedConsultation(null);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(0, 0, 0, 0.7)' 
            : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }
      }}
      sx={{
        zIndex: 999999
      }}
    >
      <Fade in={showConsultationModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          maxWidth: 1000,
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          p: 4,
          outline: 'none',
          zIndex: 1000000
        }}>
          {selectedConsultation ? (
            <>
              {/* En-tête du modal */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    backgroundColor: selectedConsultation.doctor.color,
                    color: 'white',
                    fontWeight: 'bold',
                    width: 50,
                    height: 50
                  }}>
                    {selectedConsultation.doctor.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold', 
                      color: getTextColor(),
                      fontSize: '24px'
                    }}>
                      {selectedConsultation.doctor.name}
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '16px'
                    }}>
                      {selectedConsultation.doctor.specialty}
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  onClick={() => {
                    setShowConsultationModal(false);
                    setSelectedConsultation(null);
                  }}
                  sx={{ 
                    color: getTextColor('secondary'),
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <XCircle sx={{ fontSize: 28 }} />
                </IconButton>
              </Box>

              {/* Informations de base */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
                gap: 3, 
                mb: 4 
              }}>
                <Box sx={{ ...getCardStyles(), p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Calendar sx={{ fontSize: 20, color: getAccentColor() }} />
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Date et heure
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    color: getTextColor(),
                    fontWeight: 600,
                    fontSize: '18px'
                  }}>
                    {selectedConsultation.date} à {selectedConsultation.time}
                  </Typography>
                </Box>

                <Box sx={{ ...getCardStyles(), p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Stethoscope sx={{ fontSize: 20, color: getAccentColor() }} />
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Mode de consultation
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    color: getTextColor(),
                    fontWeight: 600,
                    fontSize: '18px'
                  }}>
                    {selectedConsultation.mode}
                  </Typography>
                </Box>
              </Box>

              {/* Détails de la consultation */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: getTextColor(),
                  mb: 3,
                  fontSize: '20px'
                }}>
                  Détails de la consultation
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Box sx={{ ...getCardStyles(), p: 3 }}>
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1
                    }}>
                      Symptômes
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor(),
                      fontSize: '16px',
                      lineHeight: 1.6
                    }}>
                      {selectedConsultation.details.symptoms}
                    </Typography>
                  </Box>

                  <Box sx={{ ...getCardStyles(), p: 3 }}>
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1
                    }}>
                      Diagnostic
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor(),
                      fontSize: '16px',
                      fontWeight: 600,
                      lineHeight: 1.6
                    }}>
                      {selectedConsultation.details.diagnosis}
                    </Typography>
                  </Box>

                  <Box sx={{ ...getCardStyles(), p: 3, gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1
                    }}>
                      Observations du médecin
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor(),
                      fontSize: '16px',
                      lineHeight: 1.6
                    }}>
                      {selectedConsultation.details.observations}
                    </Typography>
                  </Box>

                  <Box sx={{ ...getCardStyles(), p: 3 }}>
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1
                    }}>
                      Traitement prescrit
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor(),
                      fontSize: '16px',
                      lineHeight: 1.6
                    }}>
                      {selectedConsultation.details.treatment}
                    </Typography>
                  </Box>

                  <Box sx={{ ...getCardStyles(), p: 3 }}>
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1
                    }}>
                      Suivi recommandé
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor(),
                      fontSize: '16px',
                      lineHeight: 1.6
                    }}>
                      {selectedConsultation.details.followUp}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Ordonnance */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: getTextColor(),
                  mb: 3,
                  fontSize: '20px'
                }}>
                  Ordonnance médicale
                </Typography>

                <Box sx={{ ...getCardStyles(), p: 4 }}>
                  {/* En-tête de l'ordonnance */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 2,
                    borderBottom: `2px solid ${getAccentColor()}`
                  }}>
                    <Box>
                      <Typography sx={{ 
                        color: getTextColor(),
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}>
                        Ordonnance N° {selectedConsultation.prescription.id}
                      </Typography>
                      <Typography sx={{ 
                        color: getTextColor('secondary'),
                        fontSize: '14px'
                      }}>
                        Date: {selectedConsultation.prescription.date}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ 
                        color: getTextColor(),
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>
                        {selectedConsultation.prescription.doctor}
                      </Typography>
                      <Typography sx={{ 
                        color: getTextColor('secondary'),
                        fontSize: '14px'
                      }}>
                        Médecin traitant
                      </Typography>
                    </Box>
                  </Box>

                  {/* Médicaments */}
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      color: getTextColor('secondary'),
                      fontSize: '16px',
                      fontWeight: 600,
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Médicaments prescrits
                    </Typography>
                    
                    {selectedConsultation.prescription.medications.map((medication, index) => (
                      <Box key={medication.id} sx={{ 
                        mb: 3,
                        p: 3,
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: '12px',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Pill sx={{ fontSize: 20, color: getAccentColor() }} />
                          <Typography sx={{ 
                            color: getTextColor(),
                            fontWeight: 'bold',
                            fontSize: '18px'
                          }}>
                            {medication.name}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                          gap: 2 
                        }}>
                          <Box>
                            <Typography sx={{ 
                              color: getTextColor('secondary'),
                              fontSize: '12px',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              mb: 0.5
                            }}>
                              Dosage
                            </Typography>
                            <Typography sx={{ 
                              color: getTextColor(),
                              fontSize: '14px',
                              fontWeight: 600
                            }}>
                              {medication.dosage}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography sx={{ 
                              color: getTextColor('secondary'),
                              fontSize: '12px',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              mb: 0.5
                            }}>
                              Fréquence
                            </Typography>
                            <Typography sx={{ 
                              color: getTextColor(),
                              fontSize: '14px',
                              fontWeight: 600
                            }}>
                              {medication.frequency}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography sx={{ 
                              color: getTextColor('secondary'),
                              fontSize: '12px',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              mb: 0.5
                            }}>
                              Durée
                            </Typography>
                            <Typography sx={{ 
                              color: getTextColor(),
                              fontSize: '14px',
                              fontWeight: 600
                            }}>
                              {medication.duration}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: 'auto' } }}>
                            <Typography sx={{ 
                              color: getTextColor('secondary'),
                              fontSize: '12px',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              mb: 0.5
                            }}>
                              Instructions
                            </Typography>
                            <Typography sx={{ 
                              color: getTextColor(),
                              fontSize: '14px',
                              lineHeight: 1.4
                            }}>
                              {medication.instructions}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: getTextColor('secondary') }}>
                Aucune consultation sélectionnée
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );

  // ===== CHARGEMENT GLOBAL =====
  if (isLoading) {
    return renderLoadingSkeleton();
  }

  return (
    <Box sx={{ p: 2, pt: 10 }}>
      {/* ===== EN-TÊTE DE PAGE AVEC BOUTONS ===== */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 4,
        mt: 4,
        gap: 2
      }}>
        {/* Titre et description */}
        <Box sx={{ flex: 1 }}>
          <HeaderDashboard
            title="Consultations"
            subtitle="Gérez vos rendez-vous et consultations médicales"
          />
        </Box>

        {/* Boutons d'action */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          flexShrink: 0
        }}>
          <MuiButton
            variant="outlined"
            startIcon={<Plus sx={{ fontSize: 16 }} />}
            onClick={() => {
              toast.info('Nouvelle consultation', {
                description: 'Ouverture du formulaire de nouvelle consultation.',
                duration: 3000,
              });
            }}
            sx={{
              borderColor: getAccentColor(),
              color: getAccentColor(),
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                backgroundColor: `${getAccentColor()}20`
              }
            }}
          >
            + Nouveau consultation
          </MuiButton>

          <MuiButton
            variant="contained"
            startIcon={<Video sx={{ fontSize: 16 }} />}
            onClick={() => {
              toast.success('Consultation en ligne', {
                description: 'Redirection vers la plateforme de consultation en ligne.',
                duration: 3000,
              });
            }}
            sx={{
              backgroundColor: getAccentColor(),
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                backgroundColor: '#0088a3'
              }
            }}
          >
            Consultation en ligne
          </MuiButton>
        </Box>
      </Box>

      {/* ===== CONTRÔLES DE RECHERCHE ET FILTRES ===== */}
      <Box sx={{ 
        mb: 4,
        ...getCardStyles()
      }}>
        {/* Ligne principale avec recherche et filtres */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Barre de recherche */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1,
            minWidth: 300,
            position: 'relative'
          }}>
            <Search 
              sx={{ 
                position: 'absolute', 
                left: 12, 
                color: getTextColor('secondary'),
                fontSize: 20
              }} 
            />
            <input
              type="text"
              placeholder="Rechercher un docteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 45px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: getTextColor(),
                fontSize: '14px',
                outline: 'none',
                '&::placeholder': {
                  color: getTextColor('secondary')
                }
              }}
            />
            {searchTerm && (
              <X 
                sx={{ 
                  position: 'absolute', 
                  right: 12, 
                  color: getTextColor('secondary'),
                  fontSize: 18,
                  cursor: 'pointer'
                }}
                onClick={() => setSearchTerm('')}
              />
            )}
          </Box>
          
          {/* Bouton Filtres */}
          <MuiButton
            startIcon={<Filter sx={{ fontSize: 16 }} />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              backgroundColor: showFilters ? getAccentColor() : 'transparent',
              color: showFilters ? 'white' : getAccentColor(),
              border: `1px solid ${getAccentColor()}`,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              '&:hover': {
                backgroundColor: showFilters ? getAccentColor() : `${getAccentColor()}20`
              }
            }}
          >
            Filtres
          </MuiButton>

          {/* Boutons de vue */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <MuiButton
              onClick={() => setConsultationView('cards')}
              startIcon={<Grid3X3 sx={{ fontSize: 16 }} />}
              sx={{
                backgroundColor: consultationView === 'cards' 
                  ? (theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0')
                  : 'transparent',
                color: consultationView === 'cards' 
                  ? 'white' 
                  : (theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]),
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: consultationView === 'cards' 
                    ? (theme.palette.mode === 'dark' ? colors.secondary[600] : '#0088a3')
                    : (theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#f1f5f9')
                }
              }}
            >
              Cartes
            </MuiButton>
            <MuiButton
              onClick={() => setConsultationView('list')}
              startIcon={<List sx={{ fontSize: 16 }} />}
              sx={{
                backgroundColor: consultationView === 'list' 
                  ? (theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0')
                  : 'transparent',
                color: consultationView === 'list' 
                  ? 'white' 
                  : (theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]),
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: consultationView === 'list' 
                    ? (theme.palette.mode === 'dark' ? colors.secondary[600] : '#0088a3')
                    : (theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#f1f5f9')
                }
              }}
            >
              Liste
            </MuiButton>
          </Box>
        </Box>

        {/* Panneau de filtres */}
        {showFilters && (
          <Box sx={{ 
            mt: 3,
            pt: 3,
            borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Filtre par statut */}
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    sx={{ 
                      color: getTextColor(),
                      '&.Mui-focused': {
                        color: getAccentColor()
                      }
                    }}
                  >
                    Statut
                  </InputLabel>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    label="Statut"
                    sx={{
                      color: getTextColor(),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '& .MuiSvgIcon-root': {
                        color: getAccentColor(),
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: '#0096b0',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#0088a3',
                        }
                      },
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: '#0096b0',
                        color: 'white',
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Tous les statuts</em>
                    </MenuItem>
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filtre par mode */}
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    sx={{ 
                      color: getTextColor(),
                      '&.Mui-focused': {
                        color: getAccentColor()
                      }
                    }}
                  >
                    Mode
                  </InputLabel>
                  <Select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    label="Mode"
                    sx={{
                      color: getTextColor(),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '& .MuiSvgIcon-root': {
                        color: getAccentColor(),
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: '#0096b0',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#0088a3',
                        }
                      },
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: '#0096b0',
                        color: 'white',
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Tous les modes</em>
                    </MenuItem>
                    {modeOptions.map(mode => (
                      <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filtre par date */}
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    sx={{ 
                      color: getTextColor(),
                      '&.Mui-focused': {
                        color: getAccentColor()
                      }
                    }}
                  >
                    Période
                  </InputLabel>
                  <Select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    label="Période"
                    sx={{
                      color: getTextColor(),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: getAccentColor(),
                      },
                      '& .MuiSvgIcon-root': {
                        color: getAccentColor(),
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: '#0096b0',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#0088a3',
                        }
                      },
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: '#0096b0',
                        color: 'white',
                      }
                    }}
                  >
                    {dateOptions.map(date => (
                      <MenuItem key={date} value={date}>{date}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Bouton réinitialiser */}
              <Box sx={{ alignSelf: 'flex-end' }}>
                <MuiButton
                  onClick={resetFilters}
                  sx={{
                    color: getTextColor('secondary'),
                    textTransform: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: `${getAccentColor()}20`
                    }
                  }}
                >
                  Réinitialiser
                </MuiButton>
              </Box>
            </Box>
          </Box>
        )}

        {/* Résultats de recherche */}
        {(searchTerm || selectedStatus || selectedMode || selectedDate !== 'Aujourd\'hui') && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: getTextColor('secondary') }}>
              {filteredConsultations.length} consultation(s) trouvée(s)
              {searchTerm && ` pour "${searchTerm}"`}
              {selectedStatus && ` avec le statut "${selectedStatus}"`}
              {selectedMode && ` en mode "${selectedMode}"`}
              {selectedDate !== 'Aujourd\'hui' && ` pour ${selectedDate.toLowerCase()}`}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ===== CONSULTATIONS ===== */}
      {consultationView === 'cards' ? (
        /* Vue Cartes */
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
          gap: 3 
        }}>
          {filteredConsultations.map((consultation) => (
            <Box
              key={consultation.id}
              sx={{
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.4)' // Fond semi-transparent sombre
                  : 'rgba(255, 255, 255, 0.25)', // Fond semi-transparent clair
                backdropFilter: 'blur(16px)', // Effet de flou d'arrière-plan
                WebkitBackdropFilter: 'blur(16px)', // Support WebKit
                borderRadius: '16px', // Coins plus arrondis pour l'effet glass
                p: 3,
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' // Ombre et highlight en mode sombre
                  : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)', // Ombre et highlight en mode clair
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.1)' // Bordure transparente en mode sombre
                  : '1px solid rgba(255, 255, 255, 0.2)', // Bordure transparente en mode clair
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.5)' // Fond plus opaque au hover
                    : 'rgba(255, 255, 255, 0.3)', // Fond plus opaque au hover
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
                    : '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-4px)',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.15)' // Bordure plus visible au hover
                    : '1px solid rgba(255, 255, 255, 0.3)' // Bordure plus visible au hover
                }
              }}
            >
              {/* Avatar docteur */}
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: consultation.doctor.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {consultation.doctor.avatar}
                </Typography>
              </Box>

              {/* Nom du docteur */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
                  mb: 1,
                  pr: 5,
                  textAlign: 'left'
                }}
              >
                {consultation.doctor.name}
              </Typography>

              {/* Date et heure */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Clock sx={{ fontSize: 16, color: getTextColor('secondary') }} />
                <Typography sx={{ 
                  color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                  textAlign: 'left'
                }}>
                  {consultation.date} - {consultation.time}
                </Typography>
              </Box>
              
              {/* Mode et statut */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip
                  label={consultation.mode}
                  size="small"
                  sx={{ 
                    backgroundColor: `${consultation.doctor.color}20`,
                    color: consultation.doctor.color,
                    fontWeight: 500,
                    fontSize: '10px'
                  }}
                />
                <Chip
                  label={consultation.status}
                  size="small"
                  sx={{
                    backgroundColor: consultation.statusColor,
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '10px'
                  }}
                />
              </Box>

              {/* Action */}
              <MuiButton
                variant="outlined"
                size="small"
                startIcon={<Eye sx={{ fontSize: 14 }} />}
                onClick={() => handleViewConsultation(consultation)}
                sx={{
                  width: '100%',
                  borderColor: getAccentColor(),
                  color: getAccentColor(),
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '11px',
                  '&:hover': {
                    backgroundColor: `${getAccentColor()}20`,
                    borderColor: getAccentColor()
                  }
                }}
              >
                Voir la consultation
              </MuiButton>
            </Box>
          ))}
        </Box>
      ) : (
        /* Vue Liste */
        <Box sx={{ 
          ...getCardStyles(),
          overflow: 'hidden'
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.02)'
                }}>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: getTextColor(),
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                  }}>
                    Docteurs
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: getTextColor(),
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                  }}>
                    Date - heure
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: getTextColor(),
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                  }}>
                    Mode
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: getTextColor(),
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                  }}>
                    Statut
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    color: getTextColor(),
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    textAlign: 'center'
                  }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredConsultations.map((consultation) => (
                  <TableRow 
                    key={consultation.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.02)',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          backgroundColor: consultation.doctor.color,
                          color: 'white',
                          fontWeight: 'bold',
                          width: 40,
                          height: 40
                        }}>
                          {consultation.doctor.avatar}
                        </Avatar>
                        <Typography sx={{ 
                          color: getTextColor(),
                          fontWeight: 500
                        }}>
                          {consultation.doctor.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock sx={{ fontSize: 16, color: getTextColor('secondary') }} />
                        <Typography sx={{ color: getTextColor() }}>
                          {consultation.date} - {consultation.time}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                    }}>
                      <Typography sx={{ color: getTextColor() }}>
                        {consultation.mode}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                    }}>
                      <Chip
                        label={consultation.status}
                        size="small"
                        sx={{
                          backgroundColor: consultation.statusColor,
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '12px'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                      textAlign: 'center'
                    }}>
                      <MuiButton
                        variant="outlined"
                        size="small"
                        startIcon={<Eye sx={{ fontSize: 14 }} />}
                        onClick={() => handleViewConsultation(consultation)}
                        sx={{
                          borderColor: getAccentColor(),
                          color: getAccentColor(),
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '11px',
                          minWidth: 'auto',
                          px: 2,
                          '&:hover': {
                            backgroundColor: `${getAccentColor()}20`,
                            borderColor: getAccentColor()
                          }
                        }}
                      >
                        Voir
                      </MuiButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center',
            p: 2,
            gap: 1
          }}>
            <IconButton 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{ color: getTextColor('secondary') }}
            >
              <ChevronLeft sx={{ fontSize: 20 }} />
            </IconButton>
            
            <Box sx={{ 
              backgroundColor: getAccentColor(),
              color: 'white',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {currentPage}
            </Box>
            
            <IconButton 
              disabled={currentPage === 3}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{ color: getTextColor('secondary') }}
            >
              <ChevronRight sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* ===== MODAL DÉTAILS CONSULTATION ===== */}
      {renderConsultationModal()}

      {/* Toaster pour les notifications */}
      <Toaster />
    </Box>
  );
};

export default Consultation;
