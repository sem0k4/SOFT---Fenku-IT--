// Imports React et hooks FENKU-IT
import React, { useState, useEffect, useContext } from 'react';

// Material-UI components FENKU-IT
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button as MuiButton, Chip } from '@mui/material';

// Theme et couleurs FENKU-IT
import { ColorModeContext, tokens } from '../../theme';

// Styles CSS FENKU-IT
import '../../styles/dashboard.css';

// UI components FENKU-IT
import { Skeleton } from '../../components/ui/skeleton';
import { Toaster } from '../../components/ui/sonner';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';

// Composants partagés FENKU-IT
import HeaderDashboard from '../../components/shared/HeaderDashboard';
import ChatbotMedical from '../../components/ChatbotMedical';

// Graphiques FENKU-IT
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Icônes FENKU-IT
import { 
  Calendar, 
  Pill, 
  Stethoscope, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets,
  Clock,
  User,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  Brain,
  Shield,
  Sparkles,
  FileText,
  Calendar as CalendarIcon,
  User as UserIcon,
  HeartHandshake,
  Candy,
  ClipboardList,
  Grid3X3,
  List,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Calendar as CalendarIcon2,
  User as UserIcon2,
  FileText as FileTextIcon
} from 'lucide-react';

const DashboardPatient = () => {
  // Theme et couleurs FENKU-IT
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  
  // State management FENKU-IT
  const [activeTab, setActiveTab] = useState('resume');
  const [isLoading, setIsLoading] = useState(true);
  const [prescriptionView, setPrescriptionView] = useState('cards');

  // AIDE functions pour les styles FENKU-IT 
  const getCardStyles = () => ({
    background: theme.palette.mode === 'dark' 
      ? 'rgba(30, 41, 59, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    border: theme.palette.mode === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.2)',
    p: 3
  });

  const getTextColor = (variant = 'primary') => {
    switch (variant) {
      case 'primary':
        return theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600];
      case 'secondary':
        return theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500];
      case 'muted':
        return theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400];
      default:
        return theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600];
    }
  };

  const getAccentColor = () => theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0';

  // Loading simulation FENKU-IT
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Dashboard chargé avec succès !', {
        description: 'Toutes vos données médicales sont maintenant disponibles.',
        duration: 4000,
      });
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Données statiques FENKU-IT
  const metrics = [
    {
      title: "Prochain rendez-vous",
      value: "24 Aout",
      subtitle: "10:30 avec Dr Mbengue",
      link: "Voir détail >",
      icon: Calendar,
      iconColor: "#0096b0"
    },
    {
      title: "Médicaments",
      value: "4 active",
      subtitle: "prochain dans 8 heures",
      link: "Voir les prescriptions >",
      icon: Pill,
      iconColor: "#0096b0"
    },
    {
      title: "Total consultations",
      value: "13",
      subtitle: "sur les 30 derniers jours",
      link: "Voir les consultations >",
      icon: Stethoscope,
      iconColor: "#0096b0"
    },
    {
      title: "Résultats test",
      value: "2 nouveaux",
      subtitle: "Analyses sanguines du 13/05",
      link: "Voir détail >",
      icon: Activity,
      iconColor: "#0096b0"
    }
  ];
 // Données vitales FENKU-IT
  const healthMetrics = [
    {
      name: "Température corporelle",
      value: "26.8 °C",
      subtitle: "Température moyenne 27 °C",
      icon: Thermometer,
      color: "#0096b0"
    },
    {
      name: "Pression artérielle",
      value: "118/78 mmHg",
      subtitle: "Valeurs normales: inférieures à 120/80 mmHg",
      icon: Heart,
      color: "#0096b0"
    },
    {
      name: "Taux de sucre",
      value: "98 mg/dL",
      subtitle: "Valeur normale: 70-140 mg/dL",
      icon: Droplets,
      color: "#0096b0"
    }
  ];
  // Données rendez-vous FENKU-IT
  const appointments = [
    {
      doctor: "Dr Mbengue",
      date: "24 Aout - 10:30",
      type: "en ligne",
      icon: UserIcon,
      badgeColor: "#10B981", // Vert pour en ligne
      badgeTextColor: "#ffffff"
    },
    {
      doctor: "Dr Diop",
      date: "14 Décembre - 08:00",
      type: "présentielle",
      icon: UserIcon,
      badgeColor: "#3B82F6", // Bleu pour présentiel
      badgeTextColor: "#ffffff"
    },
    {
      doctor: "Dr Mbengue",
      date: "05 Janvier - 10:30",
      type: "en ligne",
      icon: UserIcon,
      badgeColor: "#10B981", // Vert pour en ligne
      badgeTextColor: "#ffffff"
    }
  ];
  // Données prescriptions FENKU-IT
  const medications = [
    {
      name: "Amoxicilline",
      dosage: "500 mg - 2 fois par jour",
      icon: Pill
    },
    {
      name: "Paracétamol (Paracetamol)",
      dosage: "500 mg - 2 fois par jour",
      icon: Pill
    },
    {
      name: "Lorem ipsum",
      dosage: "15 cl - 1 petit cuillère par jour",
      icon: Pill
    }
  ];
  // Données conseils FENKU-IT
  const healthTips = [
    {
      title: "Santé du coeur",
      description: "Essayez de faire 30 minutes d'exercice modéré au moins 5 jours par semaine pour améliorer votre santé cardiovasculaire.",
      icon: HeartHandshake,
      color: "#059669", // Vert foncé pour la santé
      iconColor: "#059669"
    },
    {
      title: "Excès de sucre",
      description: "Une consommation excessive de sucre peut avoir de nombreuses conséquences négatives sur la santé, allant des problèmes dentaires et de poids aux maladies chroniques.",
      icon: Candy,
      color: "#DC2626", // Rouge foncé pour l'excès de sucre
      iconColor: "#DC2626"
    },
    {
      title: "Dormir 8h par jour",
      description: "Il favorise une meilleure régénération du corps et de l'esprit, améliore la concentration et la mémoire, renforce le système immunitaire et aide à réguler l'humeur.",
      icon: Heart,
      color: "#8B5CF6", // Violet pour le sommeil
      iconColor: "#8B5CF6"
    }
  ];

  // Données vitales graphique FENKU-IT
  const vitalData = {
    heartRate: {
      title: "Fréquence cardiaque",
      data: [
        { date: "03/08", systolique: 125, diastolique: 82 },
        { date: "10/08", systolique: 118, diastolique: 78 },
        { date: "15/08", systolique: 122, diastolique: 80 },
        { date: "20/08", systolique: 115, diastolique: 75 },
        { date: "25/08", systolique: 120, diastolique: 78 },
        { date: "30/08", systolique: 119, diastolique: 76 }
      ],
      lastReading: "119/76",
      lastDate: "30 Aout 2025",
      average: "120/80",
      averageStatus: "Normale",
      goal: "<120/80",
      goalStatus: "Sur la bonne voie"
    },
    bloodSugar: {
      title: "Taux de sucre",
      data: [
        { date: "03/08", glucose: 125 },
        { date: "10/08", glucose: 118 },
        { date: "15/08", glucose: 122 },
        { date: "20/08", glucose: 115 },
        { date: "25/08", glucose: 120 },
        { date: "30/08", glucose: 119 }
      ],
      lastReading: "119 mg/dL",
      lastDate: "30 Aout 2025",
      average: "120 mg/dL",
      averageStatus: "Normale",
      goal: "<140 mg/dL",
      goalStatus: "Sur la bonne voie"
    }
  };

  // Données prescriptions FENKU-IT
  const prescriptionsData = {
    active: [
      {
        id: 1,
        medication: "Efferalgan",
        dosage: "500 mg - 2 fois par jour - matin et soir",
        status: "Active",
        statusColor: "#10B981",
        prescriber: "Dr Mbengue",
        startDate: "25 Juillet 2025",
        endDate: "10 Aout 2025",
        icon: Pill,
        iconColor: "#3B82F6",
        canRenew: true
      },
      {
        id: 2,
        medication: "FORLAX",
        dosage: "10 mg - 2 fois par jour - matin et soir",
        status: "Active",
        statusColor: "#10B981",
        prescriber: "Dr Sonko",
        startDate: "13 Juillet 2025",
        endDate: "13 Septembre 2025",
        icon: Pill,
        iconColor: "#8B5CF6",
        canRenew: true
      },
      {
        id: 3,
        medication: "Imodium",
        dosage: "50 mg - 1 fois par jour - matin",
        status: "Active",
        statusColor: "#10B981",
        prescriber: "Dr Mbengue",
        startDate: "25 Juillet 2025",
        endDate: "05 Aout 2025",
        icon: Pill,
        iconColor: "#F59E0B",
        canRenew: false
      }
    ],
    past: [
      {
        id: 4,
        medication: "Voltarene (diclofenac)",
        dosage: "50 mg - 1 fois par jour - uniquement",
        status: "Terminé",
        statusColor: "#6B7280",
        prescriber: "Dr Sall",
        startDate: "05 Mars 2024",
        endDate: "05 Mai 2024",
        icon: Pill,
        iconColor: "#6B7280",
        canRenew: false
      },
      {
        id: 5,
        medication: "Efferalgan",
        dosage: "500 mg - 2 fois par jour - matin et soir",
        status: "Terminé",
        statusColor: "#6B7280",
        prescriber: "Dr Mbengue",
        startDate: "07 Janvier 2025",
        endDate: "08 Février 2025",
        icon: Pill,
        iconColor: "#6B7280",
        canRenew: false
      }
    ]
  };


  // Composant onglet Vitales FENKU-IT
  const VitalesTab = () => (
    <Box sx={{ p: 2 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
            mb: 1,
            textAlign: 'left'
          }}
        >
          Données vitales
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
            textAlign: 'left'
          }}
        >
          Suivez vos paramètres de santé au fil du temps
        </Typography>
      </Box>

      {/* Section Fréquence cardiaque */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
              textAlign: 'left'
            }}
          >
            {vitalData.heartRate.title}
          </Typography>
          <MuiButton
            variant="contained"
            onClick={() => {
              toast.info('Nouveau test de fréquence cardiaque', {
                description: 'Redirection vers le formulaire de test.',
                duration: 3000,
              });
            }}
            sx={{
              backgroundColor: '#0096b0',
              color: '#ffffff',
              borderRadius: '8px',
              px: 3,
              py: 1.5,
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(0, 150, 176, 0.3)',
              '&:hover': {
                backgroundColor: '#0088a3',
                boxShadow: '0 4px 8px rgba(0, 150, 176, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Faire un nouveau test
          </MuiButton>
        </Box>

        {/* Graphique fréquence cardiaque */}
    <Box 
      sx={{ 
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.4)'
              : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            p: 3,
            mb: 3,
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            border: theme.palette.mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600] }}>
              Évolution de la fréquence cardiaque
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#3B82F6', borderRadius: '2px' }} />
                <Typography variant="body2" sx={{ fontSize: '12px', color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}>
                  Systolique
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#EF4444', borderRadius: '2px' }} />
                <Typography variant="body2" sx={{ fontSize: '12px', color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}>
                  Diastolique
                </Typography>
              </Box>
            </Box>
          </Box>

          <ChartContainer
            config={{
              systolique: {
                label: "Systolique (mmHg)",
                color: "#3B82F6",
              },
              diastolique: {
                label: "Diastolique (mmHg)",
                color: "#EF4444",
              },
            }}
            className="h-[300px] w-full"
          >
            <LineChart
              data={vitalData.heartRate.data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
              />
              <Line 
                type="monotone" 
                dataKey="systolique" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="diastolique" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>

          {/* Statistiques du graphique */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#e2e8f0'}` }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[500] }}>
                Période
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600] }}>
                27 jours
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[500] }}>
                Tendance
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>
                ↓ Stable
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[500] }}>
                Variation
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600] }}>
                ±5 mmHg
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Cartes de résumé */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          <Box sx={{ 
            p: 2, 
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
              : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
          }}>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], mb: 1, textAlign: 'left' }}>
              Dernière lecture
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 1, textAlign: 'left' }}>
              {vitalData.heartRate.lastReading}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], textAlign: 'left' }}>
              {vitalData.heartRate.lastDate}
            </Typography>
          </Box>

          {/* Carte 2: Moyenne 30 jours - Calcul de la moyenne sur le dernier mois */}
          <Box sx={{ 
            p: 2, 
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
              : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
          }}>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], mb: 1, textAlign: 'left' }}>
              Moyenne (30jours)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 1, textAlign: 'left' }}>
              {vitalData.heartRate.average}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], textAlign: 'left' }}>
              {vitalData.heartRate.averageStatus}
            </Typography>
          </Box>

          {/* Carte 3: Objectif - Valeur cible recommandée par les médecins */}
          <Box sx={{ 
            p: 2, 
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
              : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
          }}>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], mb: 1, textAlign: 'left' }}>
              Objectif
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 1, textAlign: 'left' }}>
              {vitalData.heartRate.goal}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], textAlign: 'left' }}>
              {vitalData.heartRate.goalStatus}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ===== SECTION TAUX DE SUCRE ===== */}
      {/* Section complète pour le suivi du taux de glucose sanguin */}
      {/* Contient: Titre + Bouton d'action + Graphique + Cartes de résumé */}
      <Box>
        {/* En-tête de section avec titre et bouton d'action */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
              textAlign: 'left'
            }}
          >
            {vitalData.bloodSugar.title}
          </Typography>
          {/* Bouton pour déclencher un nouveau test de taux de sucre */}
          <MuiButton
            variant="contained"
            onClick={() => {
              toast.info('Nouveau test de taux de sucre', {
                description: 'Redirection vers le formulaire de test.',
                duration: 3000,
              });
            }}
            sx={{
              backgroundColor: '#0096b0',
              color: '#ffffff',
              borderRadius: '8px',
              px: 3,
              py: 1.5,
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(0, 150, 176, 0.3)',
              '&:hover': {
                backgroundColor: '#0088a3',
                boxShadow: '0 4px 8px rgba(0, 150, 176, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Faire un nouveau test
          </MuiButton>
        </Box>

        {/* Graphique de taux de sucre avec shadcn/ui */}
      <Box 
        sx={{ 
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.4)' // Fond semi-transparent sombre
              : 'rgba(255, 255, 255, 0.25)', // Fond semi-transparent clair
            backdropFilter: 'blur(16px)', // Effet de flou d'arrière-plan
            WebkitBackdropFilter: 'blur(16px)', // Support WebKit
            borderRadius: '12px',
            p: 3,
            mb: 3,
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: theme.palette.mode === 'dark' 
              ? `1px solid ${colors.blackAccent[500]}` 
              : 'none'
          }}
        >
          {/* En-tête du graphique */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600] }}>
              Évolution du taux de glucose
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#10B981', borderRadius: '2px' }} />
                <Typography variant="body2" sx={{ fontSize: '12px', color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}>
                  Glucose (mg/dL)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#F59E0B', borderRadius: '2px' }} />
                <Typography variant="body2" sx={{ fontSize: '12px', color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}>
                  Seuil normal
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Graphique shadcn/ui avec Recharts - Area Chart */}
          <ChartContainer
            config={{
              glucose: {
                label: "Glucose (mg/dL)",
                color: "#10B981",
              },
              seuil: {
                label: "Seuil normal (140 mg/dL)",
                color: "#F59E0B",
              },
            }}
            className="h-[300px] w-full"
          >
            <AreaChart
              data={vitalData.bloodSugar.data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
              />
              <Area
                type="monotone"
                dataKey="glucose"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
              {/* Ligne de seuil normal */}
              <Line 
                type="monotone" 
                dataKey={() => 140} 
                stroke="#F59E0B" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ChartContainer>

          {/* Statistiques du graphique */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#e2e8f0'}` }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[500] }}>
                Période
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600] }}>
                27 jours
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[500] }}>
                Tendance
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>
                ↓ Stable
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '10px', color: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[500] }}>
                Variation
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600] }}>
                ±7 mg/dL
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ===== CARTES DE RÉSUMÉ TAUX DE SUCRE ===== */}
        {/* Grid responsive avec 3 cartes de métriques clés pour le glucose */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {/* Carte 1: Dernière lecture - Valeur la plus récente de glucose mesurée */}
          <Box sx={{ 
            p: 2, 
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
              : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
          }}>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], mb: 1, textAlign: 'left' }}>
              Dernière lecture
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 1, textAlign: 'left' }}>
              {vitalData.bloodSugar.lastReading}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], textAlign: 'left' }}>
              {vitalData.bloodSugar.lastDate}
            </Typography>
          </Box>

          {/* Carte 2: Moyenne 30 jours - Calcul de la moyenne du glucose sur le dernier mois */}
          <Box sx={{ 
            p: 2, 
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
              : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
          }}>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], mb: 1, textAlign: 'left' }}>
              Moyenne (30jours)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 1, textAlign: 'left' }}>
              {vitalData.bloodSugar.average}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], textAlign: 'left' }}>
              {vitalData.bloodSugar.averageStatus}
            </Typography>
          </Box>

          {/* Carte 3: Objectif - Valeur cible recommandée pour le taux de glucose */}
          <Box sx={{ 
            p: 2, 
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
              : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
          }}>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], mb: 1, textAlign: 'left' }}>
              Objectif
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 1, textAlign: 'left' }}>
              {vitalData.bloodSugar.goal}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], textAlign: 'left' }}>
              {vitalData.bloodSugar.goalStatus}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ===== SECTION GRAPHIQUES COMPARATIFS ===== */}
      {/* Section supplémentaire pour montrer différents types de courbes */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
            mb: 3,
            textAlign: 'left'
          }}
        >
          Comparaison des tendances
        </Typography>

        {/* Grid avec 2 graphiques de comparaison */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {/* Graphique 1: Courbe ascendante (Pression artérielle) - Bar Chart */}
          <Box sx={{ 
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.4)' // Fond semi-transparent sombre
              : 'rgba(255, 255, 255, 0.25)', // Fond semi-transparent clair
            backdropFilter: 'blur(16px)', // Effet de flou d'arrière-plan
            WebkitBackdropFilter: 'blur(16px)', // Support WebKit
            borderRadius: '12px',
            p: 3,
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: theme.palette.mode === 'dark' 
              ? `1px solid ${colors.blackAccent[500]}` 
              : 'none'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 2 }}>
              Pression artérielle (Tendance ascendante)
            </Typography>
            <ChartContainer
              config={{
                pression: {
                  label: "Pression (mmHg)",
                  color: "#8B5CF6",
                },
              }}
              className="h-[200px] w-full"
            >
              <BarChart
                data={[
                  { date: "01/08", pression: 100 },
                  { date: "05/08", pression: 110 },
                  { date: "10/08", pression: 120 },
                  { date: "15/08", pression: 130 },
                  { date: "20/08", pression: 140 },
                  { date: "25/08", pression: 150 },
                  { date: "30/08", pression: 160 },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                  axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                  axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Bar 
                  dataKey="pression" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 600 }}>
                Tendance: ↗ Ascendante | Variation: +15 mmHg
              </Typography>
            </Box>
          </Box>

          {/* Graphique 2: Courbe descendante (Température) - Line Chart */}
          <Box sx={{ 
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.4)' // Fond semi-transparent sombre
              : 'rgba(255, 255, 255, 0.25)', // Fond semi-transparent clair
            backdropFilter: 'blur(16px)', // Effet de flou d'arrière-plan
            WebkitBackdropFilter: 'blur(16px)', // Support WebKit
            borderRadius: '12px',
            p: 3,
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: theme.palette.mode === 'dark' 
              ? `1px solid ${colors.blackAccent[500]}` 
              : 'none'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 2 }}>
              Température corporelle (Tendance descendante)
            </Typography>
            <ChartContainer
              config={{
                temperature: {
                  label: "Température (°C)",
                  color: "#F59E0B",
                },
              }}
              className="h-[200px] w-full"
            >
              <LineChart
                data={[
                  { date: "01/08", temperature: 40 },
                  { date: "05/08", temperature: 38 },
                  { date: "10/08", temperature: 36 },
                  { date: "15/08", temperature: 34 },
                  { date: "20/08", temperature: 32 },
                  { date: "25/08", temperature: 31 },
                  { date: "30/08", temperature: 30 },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                  axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                  axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontSize: '12px', color: '#F59E0B', fontWeight: 600 }}>
                Tendance: ↘ Descendante | Variation: -2.5°C
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Graphique 3: Courbe sinusoïdale (Rythme cardiaque) - Area Chart */}
        <Box sx={{ 
          mt: 3,
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
            : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], mb: 2 }}>
            Rythme cardiaque (Courbe sinusoïdale)
          </Typography>
          <ChartContainer
            config={{
              rythme: {
                label: "Rythme (bpm)",
                color: "#EC4899",
              },
            }}
            className="h-[250px] w-full"
          >
            <AreaChart
              data={[
                { time: "00:00", rythme: 60 },
                { time: "04:00", rythme: 55 },
                { time: "08:00", rythme: 80 },
                { time: "12:00", rythme: 100 },
                { time: "16:00", rythme: 90 },
                { time: "20:00", rythme: 70 },
                { time: "24:00", rythme: 60 },
              ]}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
                axisLine={{ stroke: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400] }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="rythme"
                stroke="#EC4899"
                fill="#EC4899"
                fillOpacity={0.3}
                strokeWidth={3}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EC4899', strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontSize: '12px', color: '#EC4899', fontWeight: 600 }}>
              Tendance: ~ Oscillatoire | Variation: ±20 bpm | Période: 24h (circadien)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Composant onglet Prescriptions FENKU-IT
  const PrescriptionsTab = () => (
    <Box sx={{ p: 2 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
            mb: 1,
            textAlign: 'left'
          }}
        >
          Prescriptions médicales
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
            textAlign: 'left'
          }}
        >
          Prescriptions actuelles et historique des médicaments
        </Typography>
      </Box>

      {/* Contrôles de vue */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
          mb: 4,
        background: theme.palette.mode === 'dark' 
          ? 'rgba(30, 41, 59, 0.4)'
          : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px',
        p: 2,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        border: theme.palette.mode === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <MuiButton
            onClick={() => setPrescriptionView('cards')}
            startIcon={<Grid3X3 sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: prescriptionView === 'cards' 
                ? (theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0')
                : 'transparent',
              color: prescriptionView === 'cards' 
                ? 'white' 
                : (theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]),
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: prescriptionView === 'cards' 
                  ? (theme.palette.mode === 'dark' ? colors.secondary[600] : '#0088a3')
                  : (theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#f1f5f9')
              }
            }}
          >
            Cartes
          </MuiButton>
          <MuiButton
            onClick={() => setPrescriptionView('list')}
            startIcon={<List sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: prescriptionView === 'list' 
                ? (theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0')
                : 'transparent',
              color: prescriptionView === 'list' 
                ? 'white' 
                : (theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]),
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: prescriptionView === 'list' 
                  ? (theme.palette.mode === 'dark' ? colors.secondary[600] : '#0088a3')
                  : (theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#f1f5f9')
              }
            }}
          >
            Liste
          </MuiButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <MuiButton
            startIcon={<Plus sx={{ fontSize: 16 }} />}
            onClick={() => {
              toast.info('Nouvelle prescription', {
                description: 'Redirection vers le formulaire de nouvelle prescription.',
                duration: 3000,
              });
            }}
            sx={{
              backgroundColor: '#0096b0',
              color: '#ffffff',
              borderRadius: '8px',
              px: 3,
              py: 1.5,
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(0, 150, 176, 0.3)',
              '&:hover': {
                backgroundColor: '#0088a3',
                boxShadow: '0 4px 8px rgba(0, 150, 176, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Nouvelle prescription
          </MuiButton>
        </Box>
      </Box>

      {/* Médicaments actifs */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
            mb: 3,
            textAlign: 'left'
          }}
        >
          Médicaments actifs
        </Typography>

        {prescriptionView === 'cards' ? (
          /* Vue Cartes */
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
            gap: 3 
          }}>
            {prescriptionsData.active.map((prescription) => (
              <Box
                key={prescription.id}
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
                {/* Icône médicament */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  right: 16,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: `${prescription.iconColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <prescription.icon sx={{ 
                    color: prescription.iconColor, 
                    fontSize: 20 
                  }} />
                </Box>

                {/* Nom du médicament */}
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
                  {prescription.medication}
                </Typography>

                {/* Dosage */}
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                    mb: 2,
                    textAlign: 'left'
                  }}
                >
                  {prescription.dosage}
                </Typography>

                {/* Statut */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={prescription.status}
                    size="small"
                    sx={{
                      backgroundColor: prescription.statusColor,
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '11px'
                    }}
                  />
                </Box>

                {/* Informations prescripteur */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                      fontSize: '12px',
                      textAlign: 'left'
                    }}
                  >
                    Prescrit par: {prescription.prescriber}
                  </Typography>
                </Box>

                {/* Dates */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                      fontSize: '12px',
                      textAlign: 'left'
                    }}
                  >
                    Du {prescription.startDate} au {prescription.endDate}
                  </Typography>
                </Box>

                {/* Actions */}
                {prescription.canRenew && (
                  <MuiButton
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      toast.info('Demande de réapprovisionnement', {
                        description: `Demande envoyée pour ${prescription.medication}.`,
                        duration: 3000,
                      });
                    }}
                    sx={{
                      borderColor: '#0096b0',
                      color: '#0096b0',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: '#0096b0',
                        color: 'white'
                      }
                    }}
                  >
                    Demande de réapprovisionnement
                  </MuiButton>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          /* Vue Liste */
          <Box sx={{ 
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
            overflow: 'hidden'
          }}>
            {prescriptionsData.active.map((prescription, index) => (
              <Box
                key={prescription.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  borderBottom: index < prescriptionsData.active.length - 1 
                    ? `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}` 
                    : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(30, 41, 59, 0.3)' // Fond semi-transparent au hover
                      : 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent au hover
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transform: 'translateY(-1px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
                      : '0 4px 16px rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                {/* Icône */}
                <Box sx={{ 
                  mr: 3,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: `${prescription.iconColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <prescription.icon sx={{ 
                    color: prescription.iconColor, 
                    fontSize: 20 
                  }} />
                </Box>

                {/* Informations principales */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
                        textAlign: 'left'
                      }}
                    >
                      {prescription.medication}
                    </Typography>
                    <Chip
                      label={prescription.status}
                      size="small"
                      sx={{
                        backgroundColor: prescription.statusColor,
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '11px'
                      }}
                    />
                  </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                      mb: 1,
                      textAlign: 'left'
                    }}
                  >
                    {prescription.dosage}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                fontSize: '12px',
                      textAlign: 'left'
                    }}
                  >
                    Prescrit par {prescription.prescriber} • Du {prescription.startDate} au {prescription.endDate}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {prescription.canRenew && (
                    <MuiButton
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        toast.info('Demande de réapprovisionnement', {
                          description: `Demande envoyée pour ${prescription.medication}.`,
                          duration: 3000,
                        });
                      }}
                      sx={{
                        borderColor: '#0096b0',
                        color: '#0096b0',
                        borderRadius: '8px',
                        textTransform: 'none',
                fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#0096b0',
                          color: 'white'
                        }
                      }}
                    >
                      Renouveler
                    </MuiButton>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Bouton Voir toutes les prescriptions */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <MuiButton
            variant="contained"
            onClick={() => {
              toast.success('Ouverture de toutes les prescriptions', {
                description: 'Affichage de la liste complète de vos prescriptions médicales.',
                duration: 3000,
              });
            }}
            sx={{
              backgroundColor: '#0096b0',
              color: '#ffffff',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(0, 150, 176, 0.3)',
              '&:hover': {
                backgroundColor: '#0088a3',
                boxShadow: '0 4px 8px rgba(0, 150, 176, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Voir tous les prescriptions
          </MuiButton>
        </Box>
      </Box>

      {/* ===== MÉDICAMENTS ANTÉCÉDENTS ===== */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
            mb: 3,
            textAlign: 'left'
          }}
        >
          Médicaments antécédents
            </Typography>
            
        {prescriptionView === 'cards' ? (
          /* Vue Cartes */
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
            gap: 3 
          }}>
            {prescriptionsData.past.map((prescription) => (
              <Box
                key={prescription.id}
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
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 1,
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
                {/* Icône médicament */}
                <Box sx={{ 
                position: 'absolute',
                  top: 16, 
                  right: 16,
                  width: 40,
                  height: 40,
                borderRadius: '50%',
                  backgroundColor: `${prescription.iconColor}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
                }}>
                  <prescription.icon sx={{ 
                    color: prescription.iconColor, 
                    fontSize: 20 
                  }} />
                </Box>

                {/* Nom du médicament */}
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
                  {prescription.medication}
                </Typography>

                {/* Dosage */}
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                    mb: 2,
                    textAlign: 'left'
                  }}
                >
                  {prescription.dosage}
                </Typography>

                {/* Statut */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={prescription.status}
                    size="small"
                    sx={{
                      backgroundColor: prescription.statusColor,
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '11px'
                    }}
                  />
                </Box>

                {/* Informations prescripteur */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                      fontSize: '12px',
                      textAlign: 'left'
                    }}
                  >
                    Prescrit par: {prescription.prescriber}
                  </Typography>
                </Box>

                {/* Dates */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                      fontSize: '12px',
                      textAlign: 'left'
                    }}
                  >
                    Du {prescription.startDate} au {prescription.endDate}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          /* Vue Liste */
          <Box sx={{ 
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
            overflow: 'hidden'
          }}>
            {prescriptionsData.past.map((prescription, index) => (
              <Box
                key={prescription.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  borderBottom: index < prescriptionsData.past.length - 1 
                    ? `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}` 
                    : 'none',
                  opacity: 0.8,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(30, 41, 59, 0.3)' // Fond semi-transparent au hover
                      : 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent au hover
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transform: 'translateY(-1px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
                      : '0 4px 16px rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                {/* Icône */}
                <Box sx={{ 
                  mr: 3,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: `${prescription.iconColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <prescription.icon sx={{ 
                    color: prescription.iconColor, 
                    fontSize: 20 
              }} />
            </Box>

                {/* Informations principales */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
                        textAlign: 'left'
                      }}
                    >
                      {prescription.medication}
                    </Typography>
                    <Chip
                      label={prescription.status}
                      size="small"
                      sx={{
                        backgroundColor: prescription.statusColor,
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '11px'
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                      mb: 1,
                      textAlign: 'left'
                    }}
                  >
                    {prescription.dosage}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                      fontSize: '12px',
                      textAlign: 'left'
                    }}
                  >
                    Prescrit par {prescription.prescriber} • Du {prescription.startDate} au {prescription.endDate}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );


  // Composant de chargement FENKU-IT
  const LoadingSkeleton = () => (
      <Box 
        sx={{ 
        position: 'relative',
        zIndex: 0,
        pt: 10,
        minHeight: '100vh',
        backgroundColor: 'transparent',
        p: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 1.5, mb: 3 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index} sx={{ 
            p: 2, 
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
              : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
          }}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-px w-full mb-1" />
            <Skeleton className="h-3 w-20" />
          </Box>
        ))}
      </Box>

      <Box sx={{ 
          display: 'flex',
          gap: 1,
        mb: 3, 
        background: theme.palette.mode === 'dark' 
          ? 'rgba(30, 41, 59, 0.4)'
          : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px',
        p: 1, 
        mx: 2,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        border: theme.palette.mode === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 flex-1" />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2, px: 2 }}>
        <Box sx={{ 
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.4)' // Fond semi-transparent sombre
            : 'rgba(255, 255, 255, 0.25)', // Fond semi-transparent clair
          backdropFilter: 'blur(16px)', // Effet de flou d'arrière-plan
          WebkitBackdropFilter: 'blur(16px)', // Support WebKit
          borderRadius: '16px', // Coins plus arrondis pour l'effet glass
          p: 2, 
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' // Ombre et highlight en mode sombre
            : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)', // Ombre et highlight en mode clair
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' // Bordure transparente en mode sombre
            : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
        }}>
          <Skeleton className="h-6 w-48 mb-4" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              p: 2, 
              background: theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.3)' // Fond semi-transparent sombre
                : 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent clair
              backdropFilter: 'blur(8px)', // Effet de flou d'arrière-plan
              WebkitBackdropFilter: 'blur(8px)', // Support WebKit
              borderRadius: '12px', // Coins plus arrondis pour l'effet glass
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)' // Ombre et highlight en mode sombre
                : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Ombre et highlight en mode clair
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.05)' // Bordure transparente en mode sombre
                : '1px solid rgba(255, 255, 255, 0.1)', // Bordure transparente en mode clair
              mb: 2 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton className="h-8 w-8 rounded" />
                <Box>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </Box>
              </Box>
              <Skeleton className="h-5 w-16" />
            </Box>
          ))}
        </Box>
        
        <Box sx={{ 
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.4)' // Fond semi-transparent sombre
            : 'rgba(255, 255, 255, 0.25)', // Fond semi-transparent clair
          backdropFilter: 'blur(16px)', // Effet de flou d'arrière-plan
          WebkitBackdropFilter: 'blur(16px)', // Support WebKit
          borderRadius: '16px', // Coins plus arrondis pour l'effet glass
          p: 2, 
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' // Ombre et highlight en mode sombre
            : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)', // Ombre et highlight en mode clair
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' // Bordure transparente en mode sombre
            : '1px solid rgba(255, 255, 255, 0.2)' // Bordure transparente en mode clair
        }}>
          <Skeleton className="h-6 w-40 mb-4" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              p: 2, 
              background: theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.3)' // Fond semi-transparent sombre
                : 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent clair
              backdropFilter: 'blur(8px)', // Effet de flou d'arrière-plan
              WebkitBackdropFilter: 'blur(8px)', // Support WebKit
              borderRadius: '12px', // Coins plus arrondis pour l'effet glass
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)' // Ombre et highlight en mode sombre
                : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Ombre et highlight en mode clair
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.05)' // Bordure transparente en mode sombre
                : '1px solid rgba(255, 255, 255, 0.1)', // Bordure transparente en mode clair
              mb: 2 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton className="h-8 w-8 rounded" />
                <Box>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-28" />
                </Box>
              </Box>
              <Skeleton className="h-5 w-12" />
            </Box>
          ))}
          <Skeleton className="h-10 w-full mt-2" />
        </Box>
      </Box>
    </Box>
  );
  if (isLoading) {
    return (
      <>
        <LoadingSkeleton />
        <Toaster />
      </>
    );
  }

  // Rendu principal FENKU-IT
  return (
    <Box 
      sx={{ 
        position: 'relative',
        zIndex: 0,
        pt: 10,
        minHeight: '100vh',
        backgroundColor: 'transparent'
      }}
    >
     {/* En-tête FENKU-IT */}
      <Box 
        /* En-tête FENKU-IT */
        sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
          px: 2,
          py: 1,
          gap: 2
        }}
      >
        {/* En-tête FENKU-IT */}
        <HeaderDashboard
          title="Bienvenue"
          span="Oumar"
          subtitle="Votre tableau de bord médical personnel"
        />
        {/* Bouton Nouveau rendez-vous FENKU-IT */}
        <Box sx={{ flexShrink: 0, alignSelf: 'flex-start' }}>
          <MuiButton
            variant="contained"
            startIcon={<Calendar sx={{ fontSize: 20 }} />}
            onClick={() => {
              toast.info('Redirection vers la page de réservation...', {
                description: 'Vous allez être redirigé vers le formulaire de prise de rendez-vous.',
                duration: 3000,
              });
            }}
            sx={{
              backgroundColor: '#0096b0',
              color: '#ffffff',
              borderRadius: '8px',
              px: 3,
              py: 1.5,
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(0, 150, 176, 0.3)',
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: '#0088a3',
                boxShadow: '0 4px 8px rgba(0, 150, 176, 0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Nouveau rendez-vous
          </MuiButton>
        </Box>
      </Box>

      {/* Métriques principales FENKU-IT */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 1.5,
          mb: 3,
          p: 2
        }}
      >
        {metrics.map((metric, index) => (
          <Box
            key={index}
            sx={{
              background: theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.3)'
                : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '16px',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              p: 2,
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.4)'
                  : 'rgba(255, 255, 255, 0.3)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                transform: 'translateY(-4px)',
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.15)'
                  : '1px solid rgba(255, 255, 255, 0.4)'
              }
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '12px',
                fontWeight: 500,
                color: theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500],
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1,
                textAlign: 'left'
              }}
            >
              {metric.title}
            </Typography>
            
            <Box 
              sx={{ 
                position: 'absolute',
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: theme.palette.mode === 'dark' 
                  ? colors.secondary[500] 
                  : '#e6f7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <metric.icon sx={{ 
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#0096b0',
                fontSize: 20
              }} />
            </Box>

            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 'bold',
                color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
                mb: 0.5,
                lineHeight: 1.2,
                textAlign: 'left'
              }}
            >
              {metric.value}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                fontSize: '12px',
                mb: 2,
                lineHeight: 1.4,
                textAlign: 'left'
              }}
            >
              {metric.subtitle}
            </Typography>
            
            <Box 
              sx={{ 
                height: '1px',
                backgroundColor: theme.palette.mode === 'dark' 
                  ? colors.blackAccent[500] 
                  : '#e2e8f0',
                mb: 1
              }} 
            />
            
            <Typography 
              variant="body2" 
              onClick={() => {
                toast.info(`Ouverture des détails: ${metric.title}`, {
                  description: `Affichage des informations détaillées pour ${metric.title.toLowerCase()}.`,
                  duration: 3000,
                });
              }}
              sx={{ 
                color: theme.palette.mode === 'dark' 
                  ? colors.secondary[500] 
                  : '#0096b0',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {metric.link}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Navigation par onglets FENKU-IT */}
      <Box 
        sx={{ 
          display: 'flex',
          gap: 1,
          mb: 3,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.4)'
            : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          p: 1,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          mx: 2
        }}
      >
        {[
          { value: 'resume', label: 'Résumé' },
          { value: 'vitales', label: 'Vitales' },
          { value: 'prescriptions', label: 'Prescriptions' }
        ].map((tab) => (
          <MuiButton
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              toast.info(`Onglet ${tab.label} sélectionné`, {
                description: `Affichage du contenu de la section ${tab.label.toLowerCase()}.`,
                duration: 2000,
              });
            }}
            sx={{
              flex: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              minHeight: '40px',
              backgroundColor: activeTab === tab.value 
                ? (theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0')
                : 'transparent',
              color: activeTab === tab.value 
                ? 'white' 
                : (theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]),
              '&:hover': {
                backgroundColor: activeTab === tab.value 
                  ? (theme.palette.mode === 'dark' ? colors.secondary[600] : '#0088a3')
                  : (theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#f1f5f9')
              }
            }}
          >
            {tab.label}
          </MuiButton>
        ))}
      </Box>

       {/* Contenu principal FENKU-IT */}
       {activeTab === 'vitales' ? (
         <VitalesTab />
       ) : activeTab === 'prescriptions' ? (
         <PrescriptionsTab />
       ) : (
         <>
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 2,
          px: 2
        }}
      >
        <Box
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.4)'
              : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            border: theme.palette.mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.2)',
            p: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(255, 255, 255, 0.3)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
                : '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : '#1e293b',
              mb: 2,
              textAlign: 'left'
            }}
          >
            Vos paramètres de santé
          </Typography>
          
          {healthMetrics.map((metric, index) => (
            <Box 
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.3)' // Fond semi-transparent sombre
                  : 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent clair
                backdropFilter: 'blur(8px)', // Effet de flou d'arrière-plan
                WebkitBackdropFilter: 'blur(8px)', // Support WebKit
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)' // Ombre et highlight en mode sombre
                  : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Ombre et highlight en mode clair
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.05)' // Bordure transparente en mode sombre
                  : '1px solid rgba(255, 255, 255, 0.1)', // Bordure transparente en mode clair
                mb: 2,
                transition: 'all 0.2s ease',
                '&:last-child': { mb: 0 },
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.4)' // Fond plus opaque au hover
                    : 'rgba(255, 255, 255, 0.3)', // Fond plus opaque au hover
                  transform: 'translateY(-1px)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: '6px', 
                backgroundColor: theme.palette.mode === 'dark' 
                  ? colors.secondary[500] 
                  : '#e6f7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <metric.icon sx={{ 
                    fontSize: 20, 
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#0096b0' 
                  }} />
                </Box>
                <Box>
                  <Typography sx={{ 
                    fontWeight: 500, 
                    color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], 
                    fontSize: '14px',
                    textAlign: 'left'
                  }}>
                    {metric.name}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '12px', 
                    color: theme.palette.mode === 'dark' ? colors.blackAccent[300] : '#64748b',
                    textAlign: 'left'
                  }}>
                    {metric.subtitle}
                  </Typography>
                </Box>
              </Box>
              <Typography 
                sx={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0',
                  textAlign: 'left'
                }}
              >
                {metric.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Colonne droite - Rendez-vous à venir */}
        <Box
          sx={{
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
            p: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.5)' // Fond plus opaque au hover
                : 'rgba(255, 255, 255, 0.3)', // Fond plus opaque au hover
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
                : '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
              mb: 2,
              textAlign: 'left'
            }}
          >
            Rendez-vous à venir
          </Typography>
          
          {appointments.map((appointment, index) => (
            <Box 
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.3)' // Fond semi-transparent sombre
                  : 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent clair
                backdropFilter: 'blur(8px)', // Effet de flou d'arrière-plan
                WebkitBackdropFilter: 'blur(8px)', // Support WebKit
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)' // Ombre et highlight en mode sombre
                  : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Ombre et highlight en mode clair
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.05)' // Bordure transparente en mode sombre
                  : '1px solid rgba(255, 255, 255, 0.1)', // Bordure transparente en mode clair
                mb: 2,
                transition: 'all 0.2s ease',
                '&:last-child': { mb: 0 },
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.4)' // Fond plus opaque au hover
                    : 'rgba(255, 255, 255, 0.3)', // Fond plus opaque au hover
                  transform: 'translateY(-1px)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: '6px', 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? colors.secondary[500] 
                      : '#e6f7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                  <appointment.icon sx={{ fontSize: 20, color: theme.palette.mode === 'dark' ? '#ffffff' : '#0096b0' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                  <Typography sx={{ 
                    fontWeight: 500, 
                    color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], 
                    fontSize: '14px',
                    textAlign: 'left'
                  }}>
                  {appointment.doctor}
                </Typography>
                  <Typography sx={{ 
                    fontSize: '12px', 
                    color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                    textAlign: 'left'
                  }}>
                  {appointment.date}
                </Typography>
              </Box>
              </Box>
              
              {/* Badge pour le type de rendez-vous */}
              <Chip
                label={appointment.type}
                size="small"
                variant="outlined"
                sx={{ 
                  backgroundColor: `${appointment.badgeColor}20`, // 20% d'opacité
                  color: appointment.badgeColor,
                  borderColor: appointment.badgeColor,
                  fontWeight: 500,
                  fontSize: '11px',
                  height: '24px',
                  '& .MuiChip-label': {
                    px: 1.5,
                    py: 0.5
                  },
                  '&:hover': {
                    backgroundColor: `${appointment.badgeColor}30`, // 30% d'opacité au hover
                  }
                }}
              />
            </Box>
          ))}
          
          <MuiButton
            variant="contained"
            onClick={() => {
              toast.success('Ouverture des détails des rendez-vous', {
                description: 'Affichage de la liste complète de vos rendez-vous médicaux.',
                duration: 3000,
              });
            }}
            sx={{
              width: '100%',
              mt: 2,
              backgroundColor: '#0096b0',
              '&:hover': {
                  backgroundColor: '#0088a3'
              }
            }}
          >
            Voir plus de détails
          </MuiButton>
        </Box>
      </Box>

      {/* Section du bas - 2 colonnes */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 2,
          mt: 2,
          px: 2,
          pb: 2
        }}
      >
        {/* Colonne gauche - Rappels de médicaments */}
        <Box
          sx={{
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
            p: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.5)' // Fond plus opaque au hover
                : 'rgba(255, 255, 255, 0.3)', // Fond plus opaque au hover
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
                : '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
              mb: 2,
              textAlign: 'left'
            }}
          >
            Rappels de prise de médicaments
          </Typography>
          
          {medications.map((medication, index) => (
            <Box 
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.3)' // Fond semi-transparent sombre
                  : 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent clair
                backdropFilter: 'blur(8px)', // Effet de flou d'arrière-plan
                WebkitBackdropFilter: 'blur(8px)', // Support WebKit
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)' // Ombre et highlight en mode sombre
                  : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Ombre et highlight en mode clair
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.05)' // Bordure transparente en mode sombre
                  : '1px solid rgba(255, 255, 255, 0.1)', // Bordure transparente en mode clair
                mb: 2,
                transition: 'all 0.2s ease',
                '&:last-child': { mb: 0 },
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.4)' // Fond plus opaque au hover
                    : 'rgba(255, 255, 255, 0.3)', // Fond plus opaque au hover
                  transform: 'translateY(-1px)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: '6px', 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? colors.secondary[500] 
                      : '#e6f7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                  <medication.icon sx={{ fontSize: 20, color: theme.palette.mode === 'dark' ? '#ffffff' : '#0096b0' }} />
              </Box>
                <Box>
                  <Typography sx={{ 
                    fontWeight: 500, 
                    color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], 
                    fontSize: '14px',
                    textAlign: 'left'
                  }}>
                  {medication.name}
                </Typography>
                  <Typography sx={{ 
                    fontSize: '12px', 
                    color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                    textAlign: 'left'
                  }}>
                  {medication.dosage}
                </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          
          <MuiButton
            variant="contained"
            onClick={() => {
              toast.info('Ouverture des prescriptions', {
                description: 'Affichage de la liste complète de vos médicaments prescrits.',
                duration: 3000,
              });
            }}
            sx={{
              width: '100%',
              mt: 2,
              backgroundColor: '#0096b0',
              '&:hover': {
                  backgroundColor: '#0088a3'
              }
            }}
          >
            Voir les prescriptions
          </MuiButton>
        </Box>

        {/* Colonne droite - Conseils santé */}
        <Box
          sx={{
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
            p: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.5)' // Fond plus opaque au hover
                : 'rgba(255, 255, 255, 0.3)', // Fond plus opaque au hover
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
                : '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
              mb: 2,
              textAlign: 'left'
            }}
          >
            Conseils santé
          </Typography>
          
          {healthTips.map((tip, index) => (
            <Box 
              key={index}
              sx={{
                p: 2,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(30, 41, 59, 0.3)' // Fond semi-transparent sombre
                  : 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent clair
                backdropFilter: 'blur(8px)', // Effet de flou d'arrière-plan
                WebkitBackdropFilter: 'blur(8px)', // Support WebKit
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)' // Ombre et highlight en mode sombre
                  : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Ombre et highlight en mode clair
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.05)' // Bordure transparente en mode sombre
                  : '1px solid rgba(255, 255, 255, 0.1)', // Bordure transparente en mode clair
                mb: 2,
                transition: 'all 0.2s ease',
                '&:last-child': { mb: 0 },
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.4)' // Fond plus opaque au hover
                    : 'rgba(255, 255, 255, 0.3)', // Fond plus opaque au hover
                  transform: 'translateY(-1px)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: '6px', 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? `${tip.iconColor}20` // 20% d'opacité en mode sombre
                      : `${tip.iconColor}15`, // 15% d'opacité en mode clair
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 0.5
                  }}
                >
                  <tip.icon sx={{ fontSize: 20, color: tip.iconColor }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ 
                    fontWeight: 500, 
                    color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600], 
                    fontSize: '14px', 
                    mb: 0.5,
                    textAlign: 'left'
                  }}>
                    {tip.title}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '12px', 
                    color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400], 
                    lineHeight: 1.4,
                    textAlign: 'left'
                  }}>
                    {tip.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      </>
      )}
      
      <Toaster />
      
      {/* Chatbot médical IA flottant FENKU-IT */}
      <ChatbotMedical />
    </Box>
  );
};

export default DashboardPatient;
