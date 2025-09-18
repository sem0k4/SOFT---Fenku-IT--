// ===== IMPORTS =====
// React - Bibliothèque principale pour la création d'interfaces utilisateur
import React, { useState, useContext, useEffect } from 'react';

// Material-UI - Bibliothèque de composants UI pour React
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button as MuiButton, Chip, IconButton, Badge, Tooltip, Fade, Modal, Backdrop } from '@mui/material';

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
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Search,
  Bell,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  CalendarDays,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

const RDV = () => {
  // ===== HOOKS =====
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // ===== ÉTATS =====
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 21)); // Août 2025
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // ===== DONNÉES RENDEZ-VOUS =====
  const appointments = [
    {
      id: 1,
      date: 21,
      time: '09:00',
      doctor: 'Dr Mbengue',
      patient: 'Mme Diallo',
      type: 'Consultation',
      status: 'confirmed',
      color: '#10B981',
      description: 'Consultation générale',
      duration: 30,
      location: 'Cabinet médical',
      phone: '+221 77 123 45 67',
      email: 'dr.mbengue@clinic.sn',
      notes: 'Première consultation, vérifier les antécédents',
      priority: 'high'
    },
    {
      id: 2,
      date: 21,
      time: '11:30',
      doctor: 'Mr Sarr',
      patient: 'Mme Diallo',
      type: 'Contrôle',
      status: 'pending',
      color: '#EC4899',
      description: 'Contrôle de routine',
      duration: 20,
      location: 'Laboratoire',
      phone: '+221 77 234 56 78',
      email: 'lab@clinic.sn',
      notes: 'Contrôle post-traitement',
      priority: 'medium'
    },
    {
      id: 3,
      date: 21,
      time: '13:00',
      doctor: 'Mme Diallo',
      patient: 'Mme Diallo',
      type: 'Suivi',
      status: 'confirmed',
      color: '#3B82F6',
      description: 'Suivi médical',
      duration: 45,
      location: 'Cabinet médical',
      phone: '+221 77 345 67 89',
      email: 'suivi@clinic.sn',
      notes: 'Suivi mensuel',
      priority: 'low'
    },
    {
      id: 4,
      date: 30,
      time: '08:30',
      doctor: 'Dr Diallo',
      patient: 'Mme Diallo',
      type: 'Analyse',
      status: 'confirmed',
      color: '#EC4899',
      description: 'Analyse de sang',
      duration: 15,
      location: 'Laboratoire',
      phone: '+221 77 456 78 90',
      email: 'lab@clinic.sn',
      notes: 'Analyses complètes',
      priority: 'high'
    },
    {
      id: 5,
      date: 30,
      time: '13:00',
      doctor: 'Dr Diallo',
      patient: 'Mme Diallo',
      type: 'Rendez-vous',
      status: 'cancelled',
      color: '#3B82F6',
      description: 'Rendez-vous de suivi',
      duration: 30,
      location: 'Cabinet médical',
      phone: '+221 77 567 89 01',
      email: 'rdv@clinic.sn',
      notes: 'Annulé par le patient',
      priority: 'medium'
    },
    {
      id: 6,
      date: 15,
      time: '10:00',
      doctor: 'Dr Ndiaye',
      patient: 'Mme Diallo',
      type: 'Consultation',
      status: 'confirmed',
      color: '#8B5CF6',
      description: 'Consultation spécialisée',
      duration: 60,
      location: 'Cabinet spécialisé',
      phone: '+221 77 678 90 12',
      email: 'specialiste@clinic.sn',
      notes: 'Consultation cardiologie',
      priority: 'high'
    }
  ];

  // ===== EFFET DE CHARGEMENT =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Calendrier chargé', {
        description: 'Vos rendez-vous sont maintenant disponibles.',
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

  // ===== FONCTIONS CALENDRIER =====
  const getMonthName = (date) => {
    const months = [
      'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
      'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
    ];
    return months[date.getMonth()];
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysInPreviousMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForDate = (date) => {
    let filteredAppointments = appointments.filter(appointment => appointment.date === date);
    
    // Filtrage par recherche
    if (searchTerm) {
      filteredAppointments = filteredAppointments.filter(appointment =>
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrage par statut
    if (filterStatus !== 'all') {
      filteredAppointments = filteredAppointments.filter(appointment => appointment.status === filterStatus);
    }
    
    return filteredAppointments;
  };

  // ===== STATISTIQUES =====
  const getStats = () => {
    const totalAppointments = appointments.length;
    const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed').length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;
    
    return {
      total: totalAppointments,
      confirmed: confirmedAppointments,
      pending: pendingAppointments,
      cancelled: cancelledAppointments
    };
  };

  const stats = getStats();

  // ===== MODAL DÉTAILS RENDEZ-VOUS =====
  const renderAppointmentModal = () => (
    <Modal
      open={showAppointmentModal}
      onClose={() => {
        setShowAppointmentModal(false);
        setSelectedAppointment(null);
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
        zIndex: 999999 // Z-index très élevé pour être au-dessus du topbar (99999)
      }}
    >
      <Fade in={showAppointmentModal}>
         <Box sx={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           width: { xs: '90%', sm: 500 },
           height: { xs: 'auto', sm: 'auto' },
           maxHeight: '90vh',
           overflow: 'visible',
           backgroundColor: theme.palette.mode === 'dark' 
             ? 'rgba(30, 41, 59, 0.95)' // Fond opaque sombre
             : 'rgba(255, 255, 255, 0.95)', // Fond opaque clair
           backdropFilter: 'blur(20px)',
           WebkitBackdropFilter: 'blur(20px)',
           borderRadius: '12px',
           boxShadow: theme.palette.mode === 'dark' 
             ? '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
             : '0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
           border: theme.palette.mode === 'dark' 
             ? '1px solid rgba(255, 255, 255, 0.1)'
             : '1px solid rgba(255, 255, 255, 0.2)',
           p: 3,
           outline: 'none',
           zIndex: 1000000 // Z-index très élevé pour le contenu du modal
         }}>
          {selectedAppointment ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold', 
                  color: getTextColor(),
                  fontSize: '20px'
                }}>
                  Détails du rendez-vous
                </Typography>
                <IconButton 
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setSelectedAppointment(null);
                  }}
                  sx={{ 
                    color: getTextColor('secondary'),
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <XCircle sx={{ fontSize: 24 }} />
                </IconButton>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: selectedAppointment.color
                  }} />
                  <Typography variant="h6" sx={{ 
                    color: getTextColor(),
                    fontWeight: 600,
                    fontSize: '18px'
                  }}>
                    {selectedAppointment.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: getTextColor('secondary'), 
                      mb: 1,
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Médecin
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor(), 
                      fontWeight: 600,
                      fontSize: '16px'
                    }}>
                      {selectedAppointment.doctor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: getTextColor('secondary'), 
                      mb: 1,
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Heure
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor(), 
                      fontWeight: 600,
                      fontSize: '16px'
                    }}>
                      {selectedAppointment.time}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: getTextColor('secondary'), 
                      mb: 1,
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Durée
                    </Typography>
                    <Typography sx={{ 
                      color: getTextColor(), 
                      fontWeight: 600,
                      fontSize: '16px'
                    }}>
                      {selectedAppointment.duration} min
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: getTextColor('secondary'), 
                      mb: 1,
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Statut
                    </Typography>
                    <Chip
                      label={selectedAppointment.status === 'confirmed' ? 'confirmé' : 
                             selectedAppointment.status === 'pending' ? 'en attente' : 'annulé'}
                      size="small"
                      sx={{
                        backgroundColor: selectedAppointment.status === 'confirmed' ? '#10B981' : 
                                       selectedAppointment.status === 'pending' ? '#F59E0B' : '#EF4444',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        height: 24,
                        borderRadius: '12px'
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ 
                    color: getTextColor('secondary'), 
                    mb: 1,
                    fontSize: '12px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Lieu
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <MapPin sx={{ fontSize: 18, color: getTextColor('secondary') }} />
                    <Typography sx={{ 
                      color: getTextColor(), 
                      fontWeight: 500,
                      fontSize: '15px'
                    }}>
                      {selectedAppointment.location}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ 
                    color: getTextColor('secondary'), 
                    mb: 2,
                    fontSize: '12px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Contact
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Phone sx={{ fontSize: 18, color: getTextColor('secondary') }} />
                      <Typography sx={{ 
                        color: getTextColor(), 
                        fontSize: '15px',
                        fontWeight: 500
                      }}>
                        {selectedAppointment.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Mail sx={{ fontSize: 18, color: getTextColor('secondary') }} />
                      <Typography sx={{ 
                        color: getTextColor(), 
                        fontSize: '15px',
                        fontWeight: 500
                      }}>
                        {selectedAppointment.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ 
                    color: getTextColor('secondary'), 
                    mb: 1,
                    fontSize: '12px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Notes
                  </Typography>
                  <Typography sx={{ 
                    color: getTextColor(), 
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: 1.5
                  }}>
                    {selectedAppointment.notes}
                  </Typography>
                </Box>

              </Box>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: getTextColor('secondary') }}>
                Aucun rendez-vous sélectionné
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );

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
        <Skeleton height={40} width={200} />
      </Box>

      {/* Skeleton pour les statistiques */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 2, 
        mb: 3 
      }}>
        {[...Array(4)].map((_, index) => (
          <Box key={index} sx={{ ...getCardStyles(), p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box>
                <Skeleton height={32} width={40} sx={{ mb: 1 }} />
                <Skeleton height={16} width={60} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Skeleton pour les contrôles */}
      <Box sx={{ 
        mb: 3,
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
          <Skeleton height={40} width={100} />
        </Box>
      </Box>

      {/* Skeleton pour la navigation */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton height={40} width={120} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton height={32} width={150} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} height={40} width={80} />
          ))}
        </Box>
      </Box>

      {/* Skeleton pour le calendrier */}
      <Box sx={{ ...getCardStyles() }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height={40} sx={{ m: 1 }} />
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {[...Array(42)].map((_, index) => (
            <Skeleton key={index} height={100} sx={{ m: 0.5 }} />
          ))}
        </Box>
      </Box>
    </Box>
  );

  // ===== RENDU CALENDRIER =====
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInPrevMonth = getDaysInPreviousMonth(currentDate);
    
    const days = [];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    // Jours du mois précédent
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <Box
          key={`prev-${i}`}
          sx={{
            p: 1,
            minHeight: 100,
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            color: getTextColor('secondary'),
            opacity: 0.5
          }}
        >
          {daysInPrevMonth - i}
        </Box>
      );
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDate(day);
      const isToday = day === new Date().getDate() && 
                     currentDate.getMonth() === new Date().getMonth() && 
                     currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <Box
          key={day}
          sx={{
            p: 1,
            minHeight: 100,
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: isToday ? `${getAccentColor()}20` : 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)'
            }
          }}
        >
          <Typography
            sx={{
              fontWeight: isToday ? 'bold' : 'normal',
              color: isToday ? getAccentColor() : getTextColor(),
              mb: 1
            }}
          >
            {day}
          </Typography>
          
          {/* Rendez-vous pour ce jour */}
          {dayAppointments.map((appointment, index) => (
            <Box
              key={appointment.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5,
                p: 0.5,
                borderRadius: '4px',
                backgroundColor: `${appointment.color}20`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: `${appointment.color}30`
                }
              }}
              onClick={() => {
                console.log('Clic sur rendez-vous:', appointment);
                setSelectedAppointment(appointment);
                setShowAppointmentModal(true);
                toast.info('Ouverture des détails', {
                  description: `Détails de ${appointment.doctor} - ${appointment.time}`,
                  duration: 2000,
                });
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: appointment.color
                }}
              />
              <Typography
                sx={{
                  fontSize: '10px',
                  color: getTextColor(),
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {appointment.time} - {appointment.doctor}...
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <Box
          key={`next-${day}`}
          sx={{
            p: 1,
            minHeight: 100,
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            color: getTextColor('secondary'),
            opacity: 0.5
          }}
        >
          {day}
        </Box>
      );
    }

    return (
      <Box sx={{ ...getCardStyles() }}>
        {/* En-têtes des jours de la semaine */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
          {dayNames.map(day => (
            <Box
              key={day}
              sx={{
                p: 2,
                textAlign: 'center',
                fontWeight: 'bold',
                color: getTextColor(),
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.02)'
              }}
            >
              {day}
            </Box>
          ))}
        </Box>

        {/* Grille du calendrier */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days}
        </Box>
      </Box>
    );
  };

  // ===== CHARGEMENT GLOBAL =====
  if (isLoading) {
    return renderLoadingSkeleton();
  }

  return (
    <Box sx={{ p: 2, pt: 10 }}>
      {/* ===== EN-TÊTE DE PAGE ===== */}
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
            title="Calendrier"
            subtitle="Gérez vos rendez-vous et consultations médicales"
          />
        </Box>

        {/* Bouton nouveau RDV */}
        <Box sx={{ flexShrink: 0 }}>
          <MuiButton
            variant="contained"
            startIcon={<Plus sx={{ fontSize: 16 }} />}
            onClick={() => {
              toast.info('Nouveau rendez-vous', {
                description: 'Ouverture du formulaire de demande de rendez-vous.',
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
              py: 1.5,
              '&:hover': {
                backgroundColor: '#0088a3'
              }
            }}
          >
            + Demander un nouveau RDV
          </MuiButton>
        </Box>
      </Box>

      {/* ===== STATISTIQUES ===== */}
      {showStats && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 2, 
          mb: 3 
        }}>
          <Box sx={{ ...getCardStyles(), p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: `${getAccentColor()}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarDays sx={{ color: getAccentColor(), fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: getTextColor() }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: getTextColor('secondary') }}>
                  Total RDV
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ ...getCardStyles(), p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#10B98120',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: getTextColor() }}>
                  {stats.confirmed}
                </Typography>
                <Typography variant="body2" sx={{ color: getTextColor('secondary') }}>
                  Confirmés
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ ...getCardStyles(), p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#F59E0B20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle sx={{ color: '#F59E0B', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: getTextColor() }}>
                  {stats.pending}
                </Typography>
                <Typography variant="body2" sx={{ color: getTextColor('secondary') }}>
                  En attente
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ ...getCardStyles(), p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#EF444420',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <XCircle sx={{ color: '#EF4444', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: getTextColor() }}>
                  {stats.cancelled}
                </Typography>
                <Typography variant="body2" sx={{ color: getTextColor('secondary') }}>
                  Annulés
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* ===== CONTRÔLES DE RECHERCHE ET FILTRES ===== */}
      <Box sx={{ 
        mb: 3,
        ...getCardStyles()
      }}>
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
              placeholder="Rechercher un rendez-vous..."
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
              <XCircle 
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

          {/* Bouton Stats */}
          <MuiButton
            startIcon={<TrendingUp sx={{ fontSize: 16 }} />}
            onClick={() => setShowStats(!showStats)}
            sx={{
              backgroundColor: showStats ? getAccentColor() : 'transparent',
              color: showStats ? 'white' : getAccentColor(),
              border: `1px solid ${getAccentColor()}`,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              '&:hover': {
                backgroundColor: showStats ? getAccentColor() : `${getAccentColor()}20`
              }
            }}
          >
            Stats
          </MuiButton>
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
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${getAccentColor()}`,
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: getTextColor(),
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="confirmed">Confirmés</option>
                  <option value="pending">En attente</option>
                  <option value="cancelled">Annulés</option>
                </select>
              </Box>

              {/* Bouton réinitialiser */}
              <Box sx={{ alignSelf: 'flex-end' }}>
                <MuiButton
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
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
      </Box>

      {/* ===== CONTRÔLES DE NAVIGATION ===== */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        {/* Navigation et date actuelle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MuiButton
            onClick={goToToday}
            sx={{
              backgroundColor: getAccentColor(),
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              '&:hover': {
                backgroundColor: '#0088a3'
              }
            }}
          >
            Aujourd'hui
          </MuiButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => navigateMonth(-1)}
              sx={{ 
                color: getTextColor('secondary'),
                '&:hover': {
                  backgroundColor: `${getAccentColor()}20`
                }
              }}
            >
              <ChevronLeft sx={{ fontSize: 20 }} />
            </IconButton>
            
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: getTextColor(),
                minWidth: 150,
                textAlign: 'center'
              }}
            >
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </Typography>
            
            <IconButton
              onClick={() => navigateMonth(1)}
              sx={{ 
                color: getTextColor('secondary'),
                '&:hover': {
                  backgroundColor: `${getAccentColor()}20`
                }
              }}
            >
              <ChevronRight sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Boutons de vue */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['Mois', 'Semaine', 'Jour'].map((mode) => (
            <MuiButton
              key={mode}
              onClick={() => setViewMode(mode.toLowerCase())}
              sx={{
                backgroundColor: viewMode === mode.toLowerCase() 
                  ? getAccentColor()
                  : 'transparent',
                color: viewMode === mode.toLowerCase() 
                  ? 'white' 
                  : getTextColor(),
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                '&:hover': {
                  backgroundColor: viewMode === mode.toLowerCase() 
                    ? '#0088a3'
                    : `${getAccentColor()}20`
                }
              }}
            >
              {mode}
            </MuiButton>
          ))}
        </Box>
      </Box>

      {/* ===== CALENDRIER ===== */}
      {renderCalendar()}

      {/* ===== MODAL DÉTAILS RENDEZ-VOUS ===== */}
      {renderAppointmentModal()}

      {/* Toaster pour les notifications */}
      <Toaster />
    </Box>
  );
};

export default RDV;
