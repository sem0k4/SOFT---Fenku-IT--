// ===== IMPORTS =====
// React - Bibliothèque principale pour la création d'interfaces utilisateur
import React, { useState, useContext, useEffect } from 'react';

// Material-UI - Bibliothèque de composants UI pour React
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button as MuiButton, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Thème personnalisé - Système de thème avec mode sombre/clair
import { ColorModeContext, tokens } from '../../theme';

// CSS personnalisé - Animations et styles pour le dashboard
import '../../styles/dashboard.css';

// shadcn/ui - Composants UI modernes
import { Skeleton } from '../../components/ui/skeleton';
import { Toaster } from '../../components/ui/sonner';
import { toast } from 'sonner';

// Composants partagés
import HeaderDashboard from '../../components/shared/HeaderDashboard';

// Lucide React - Icônes modernes et légères
import { 
  Plus, 
  Grid3X3, 
  List, 
  FileTextIcon, 
  Shield, 
  Activity, 
  Heart, 
  CheckCircle, 
  Download, 
  Eye,
  Search,
  Filter,
  X
} from 'lucide-react';

const Documents = () => {
  // ===== HOOKS =====
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // ===== ÉTATS =====
  const [isLoading, setIsLoading] = useState(true); // État de chargement
  const [dossierView, setDossierView] = useState('list'); // 'cards' ou 'list'
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche
  const [selectedType, setSelectedType] = useState(''); // Type de document sélectionné
  const [selectedStatus, setSelectedStatus] = useState(''); // Statut sélectionné
  const [showFilters, setShowFilters] = useState(false); // Affichage des filtres

  // ===== DONNÉES DOSSIERS MÉDICAUX =====
  // dossiersData - Données des documents médicaux
  const dossiersData = [
    {
      id: 1,
      title: "Résultats des analyses sanguines",
      subtitle: "Analyse complète",
      type: "Analyse",
      date: "08 Février 2025",
      author: "Mme Dieng",
      icon: FileTextIcon,
      iconColor: "#3B82F6",
      canDownload: true,
      canView: true,
      fileSize: "2.3 MB",
      status: "Complet"
    },
    {
      id: 2,
      title: "Vaccin contre l'hépatite B",
      subtitle: "Vaccination pour la lutte contre l'hépatite B",
      type: "Vaccination",
      date: "11 Juin 2024",
      author: "Mr Mbaye",
      icon: Shield,
      iconColor: "#10B981",
      canDownload: true,
      canView: true,
      fileSize: "1.8 MB",
      status: "Valide"
    },
    {
      id: 3,
      title: "Radiographie pulmonaire",
      subtitle: "Examen radiologique du thorax",
      type: "Radiologie",
      date: "15 Janvier 2025",
      author: "Dr Sall",
      icon: Activity,
      iconColor: "#8B5CF6",
      canDownload: true,
      canView: true,
      fileSize: "4.1 MB",
      status: "Disponible"
    },
    {
      id: 4,
      title: "Échographie cardiaque",
      subtitle: "Examen échographique du cœur",
      type: "Échographie",
      date: "22 Décembre 2024",
      author: "Dr Mbengue",
      icon: Heart,
      iconColor: "#EF4444",
      canDownload: true,
      canView: true,
      fileSize: "3.7 MB",
      status: "Complet"
    },
    {
      id: 5,
      title: "Certificat médical",
      subtitle: "Certificat de non-contre-indication",
      type: "Certificat",
      date: "05 Mars 2024",
      author: "Dr Diop",
      icon: CheckCircle,
      iconColor: "#F59E0B",
      canDownload: true,
      canView: true,
      fileSize: "0.5 MB",
      status: "Valide"
    }
  ];

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

  // ===== EFFETS =====
  // useEffect() - Hook pour simuler le chargement des données
  useEffect(() => {
    // Simulation du chargement des données (2 secondes)
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Toast de succès avec sonner
      toast.success('Documents chargés avec succès !', {
        description: 'Tous vos documents médicaux sont maintenant disponibles.',
        duration: 4000,
      });
    }, 2000);

    // Nettoyage du timer si le composant est démonté
    return () => clearTimeout(loadingTimer);
  }, []);

  // ===== LOGIQUE DE FILTRAGE =====
  // Filtrage des documents basé sur la recherche et les filtres
  const filteredDocuments = dossiersData.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || document.type === selectedType;
    const matchesStatus = selectedStatus === '' || document.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Options pour les filtres
  const typeOptions = [...new Set(dossiersData.map(doc => doc.type))];
  const statusOptions = [...new Set(dossiersData.map(doc => doc.status))];

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedStatus('');
  };

  // ===== COMPOSANT DE CHARGEMENT =====
  const LoadingSkeleton = () => (
    <Box sx={{ p: 2, pt: 10 }}>
      {/* En-tête de chargement */}
      <Box sx={{ mb: 4, mt: 4 }}>
        <Skeleton sx={{ height: 40, width: 300, mb: 2 }} />
        <Skeleton sx={{ height: 24, width: 500 }} />
      </Box>

      {/* Contrôles de chargement */}
      <Box sx={{ 
        mb: 4,
        ...getCardStyles()
      }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Skeleton sx={{ height: 40, flex: 1, minWidth: 300 }} />
          <Skeleton sx={{ height: 40, width: 120 }} />
          <Skeleton sx={{ height: 40, width: 100 }} />
          <Skeleton sx={{ height: 40, width: 80 }} />
          <Skeleton sx={{ height: 40, width: 80 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Skeleton sx={{ height: 40, width: 150 }} />
          <Skeleton sx={{ height: 40, width: 180 }} />
        </Box>
      </Box>

      {/* Titre de section de chargement */}
      <Skeleton sx={{ height: 32, width: 200, mb: 3 }} />

      {/* Cartes de chargement */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
        gap: 3 
      }}>
        {[...Array(6)].map((_, index) => (
          <Box
            key={index}
            sx={{
              ...getCardStyles(),
              p: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Skeleton sx={{ height: 24, width: '70%' }} />
              <Skeleton sx={{ height: 40, width: 40, borderRadius: '50%' }} />
            </Box>
            <Skeleton sx={{ height: 20, width: '90%', mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Skeleton sx={{ height: 24, width: 80, borderRadius: '12px' }} />
              <Skeleton sx={{ height: 24, width: 60, borderRadius: '12px' }} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Skeleton sx={{ height: 16, width: '60%', mb: 1 }} />
              <Skeleton sx={{ height: 16, width: '40%' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton sx={{ height: 32, flex: 1 }} />
              <Skeleton sx={{ height: 32, flex: 1 }} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  // ===== RENDU CONDITIONNEL =====
  if (isLoading) {
    return <LoadingSkeleton />;
  }

    return (
    <Box sx={{ p: 2, pt: 10 }}>
      {/* ===== EN-TÊTE DE PAGE ===== */}
            <HeaderDashboard
        title="Documents"
        span="Médicaux"
        subtitle="Gérez et consultez tous vos documents médicaux"
      />

      {/* ===== CONTRÔLES DE VUE ET RECHERCHE ===== */}
      <Box sx={{ 
        mb: 2,
        mt: 4,
        ...getCardStyles()
      }}>
        {/* Ligne principale avec recherche, filtres et vues */}
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
              placeholder="Rechercher un document..."
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
              onClick={() => setDossierView('cards')}
              startIcon={<Grid3X3 sx={{ fontSize: 16 }} />}
              sx={{
                backgroundColor: dossierView === 'cards' 
                  ? (theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0')
                  : 'transparent',
                color: dossierView === 'cards' 
                  ? 'white' 
                  : (theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]),
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: dossierView === 'cards' 
                    ? (theme.palette.mode === 'dark' ? colors.secondary[600] : '#0088a3')
                    : (theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#f1f5f9')
                }
              }}
            >
              Cartes
            </MuiButton>
            <MuiButton
              onClick={() => setDossierView('list')}
              startIcon={<List sx={{ fontSize: 16 }} />}
              sx={{
                backgroundColor: dossierView === 'list' 
                  ? (theme.palette.mode === 'dark' ? colors.secondary[500] : '#0096b0')
                  : 'transparent',
                color: dossierView === 'list' 
                  ? 'white' 
                  : (theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[500]),
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: dossierView === 'list' 
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
              {/* Filtre par type */}
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
                    Type de document
                  </InputLabel>
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    label="Type de document"
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
                      <em>Tous les types</em>
                    </MenuItem>
                    {typeOptions.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

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
        {searchTerm && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: getTextColor('secondary') }}>
              {filteredDocuments.length} document(s) trouvé(s) pour "{searchTerm}"
            </Typography>
          </Box>
        )}
      </Box>

      {/* ===== DERNIERS DOCUMENTS ===== */}
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
          Derniers documents
        </Typography>

        {dossierView === 'cards' ? (
          /* Vue Cartes */
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
            gap: 3 
          }}>
            {filteredDocuments.map((document) => (
              <Box
                key={document.id}
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
                {/* Icône document */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  right: 16,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: `${document.iconColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <document.icon sx={{ 
                    color: document.iconColor, 
                    fontSize: 20 
                  }} />
                </Box>

                {/* Titre du document */}
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
                  {document.title}
                </Typography>

                {/* Sous-titre */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                    mb: 2,
                    textAlign: 'left'
                  }}
                >
                  {document.subtitle}
                </Typography>
                
                {/* Type et statut */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={document.type}
                    size="small"
                    sx={{ 
                      backgroundColor: `${document.iconColor}20`,
                      color: document.iconColor,
                      fontWeight: 500,
                      fontSize: '10px'
                    }}
                  />
                  <Chip
                    label={document.status}
                    size="small"
                    sx={{
                      backgroundColor: document.status === 'Complet' || document.status === 'Valide' ? '#10B981' : '#F59E0B',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '10px'
                    }}
                  />
                </Box>

                {/* Informations date et auteur */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                        fontSize: '12px',
                        textAlign: 'left'
                      }}
                    >
                      Fait le:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
                        fontSize: '12px',
                        fontWeight: 500,
                        textAlign: 'left'
                      }}
                    >
                      {document.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                        fontSize: '12px',
                        textAlign: 'left'
                      }}
                    >
                      Par:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.mode === 'dark' ? colors.primary[100] : colors.primary[600],
                        fontSize: '12px',
                        fontWeight: 500,
                        textAlign: 'left'
                      }}
                    >
                      {document.author}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {document.canDownload && (
                    <MuiButton
                      variant="outlined"
                      size="small"
                      startIcon={<Download sx={{ fontSize: 14 }} />}
                      onClick={() => {
                        toast.success('Téléchargement en cours', {
                          description: `Téléchargement de ${document.title} (${document.fileSize})`,
                          duration: 3000,
                        });
                      }}
                      sx={{
                        flex: 1,
                        borderColor: '#0096b0',
                        color: '#0096b0',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '11px',
                        '&:hover': {
                          backgroundColor: '#0096b0',
                          color: 'white'
                        }
                      }}
                    >
                      Télécharger PDF
                    </MuiButton>
                  )}
                  {document.canView && (
                    <MuiButton
                      variant="outlined"
                      size="small"
                      startIcon={<Eye sx={{ fontSize: 14 }} />}
                      onClick={() => {
                        toast.info('Ouverture du document', {
                          description: `Affichage de ${document.title}`,
                          duration: 3000,
                        });
                      }}
                      sx={{
                        flex: 1,
                        borderColor: '#6B7280',
                        color: '#6B7280',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '11px',
                        '&:hover': {
                          backgroundColor: '#6B7280',
                          color: 'white'
                        }
                      }}
                    >
                      Voir document
                    </MuiButton>
                  )}
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
            {filteredDocuments.map((document, index) => (
              <Box
                key={document.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  borderBottom: index < filteredDocuments.length - 1 
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
                  backgroundColor: `${document.iconColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <document.icon sx={{ 
                    color: document.iconColor, 
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
                      {document.title}
                    </Typography>
                    <Chip
                      label={document.type}
                      size="small"
                      sx={{
                        backgroundColor: `${document.iconColor}20`,
                        color: document.iconColor,
                        fontWeight: 500,
                        fontSize: '10px'
                      }}
                    />
                    <Chip
                      label={document.status}
                      size="small"
                      sx={{
                        backgroundColor: document.status === 'Complet' || document.status === 'Valide' ? '#10B981' : '#F59E0B',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '10px'
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
                    {document.subtitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[400],
                      fontSize: '12px',
                      textAlign: 'left'
                    }}
                  >
                    Fait le {document.date} • Par {document.author} • {document.fileSize}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {document.canDownload && (
                    <MuiButton
                      variant="outlined"
                      size="small"
                      startIcon={<Download sx={{ fontSize: 14 }} />}
                      onClick={() => {
                        toast.success('Téléchargement en cours', {
                          description: `Téléchargement de ${document.title} (${document.fileSize})`,
                          duration: 3000,
                        });
                      }}
                      sx={{
                        borderColor: '#0096b0',
                        color: '#0096b0',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '11px',
                        '&:hover': {
                          backgroundColor: '#0096b0',
                          color: 'white'
                        }
                      }}
                    >
                      PDF
                    </MuiButton>
                  )}
                  {document.canView && (
                    <MuiButton
                      variant="outlined"
                      size="small"
                      startIcon={<Eye sx={{ fontSize: 14 }} />}
                      onClick={() => {
                        toast.info('Ouverture du document', {
                          description: `Affichage de ${document.title}`,
                          duration: 3000,
                        });
                      }}
                      sx={{
                        borderColor: '#6B7280',
                        color: '#6B7280',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '11px',
                        '&:hover': {
                          backgroundColor: '#6B7280',
                          color: 'white'
                        }
                      }}
                    >
                      Voir
                    </MuiButton>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Bouton Voir tous les documents */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <MuiButton
            variant="contained"
            onClick={() => {
              toast.success('Ouverture de tous les documents', {
                description: 'Affichage de la liste complète de vos documents médicaux.',
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
            Voir tous les documents
          </MuiButton>
        </Box>
      </Box>

      {/* Toaster pour les notifications */}
      <Toaster />
    </Box>
  );
};

export default Documents;
