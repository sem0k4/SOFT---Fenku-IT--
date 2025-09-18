import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Alert,
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  User,
  Calendar,
  Heart,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import { medicalRecordService, consultationService } from '../services/medicalApi';

/**
 * Composant de consultation structurée de première ligne
 * Technologies: React, Material-UI, Axios
 * Gère un questionnaire médical structuré avec validation et sauvegarde
 */
const StructuredConsultation = ({ 
  onComplete, 
  onClose, 
  patientId, 
  initialSymptom = null 
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Informations personnelles FENKU-IT
    age: '',
    gender: '',
    
    // Symptômes principaux FENKU-IT
    mainSymptom: initialSymptom || '',
    symptomDuration: '',
    symptomIntensity: '',
    symptomDescription: '',
    
    // Antécédents FENKU-IT
    medicalHistory: [],
    currentMedications: [],
    allergies: [],
    
    // Évaluation FENKU-IT
    painLevel: '',
    associatedSymptoms: [],
    triggers: '',
    
    // Conclusion FENKU-IT
    preliminaryAssessment: '',
    recommendations: [],
    urgencyLevel: 'low'
  });
  
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Étapes de la consultation FENKU-IT
  const steps = [
    'Informations personnelles',
    'Symptômes principaux',
    'Antécédents médicaux',
    'Évaluation détaillée',
    'Conclusion et recommandations'
  ];

  // Chargement des données patient au montage FENKU-IT
  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  // Chargement des données du patient via l'API FENKU-IT
  const loadPatientData = async () => {
    setIsLoading(true);
    try {
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

      // Pré-remplir les données connues FENKU-IT
      setFormData(prev => ({
        ...prev,
        allergies: allergies?.map(a => a.name) || [],
        currentMedications: medications?.map(m => m.name) || [],
        medicalHistory: history?.map(h => h.condition) || []
      }));
    } catch (error) {
      console.error('Erreur chargement données patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Styles cohérents avec le chatbot FENKU-IT
  const getCardStyles = () => ({
    background: theme.palette.mode === 'dark' 
      ? colors.blackAccent[600]
      : '#fcfcfc',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)'
      : '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
  });

  // Gestion des changements de formulaire FENKU-IT
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Nettoyer les erreurs FENKU-IT
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Validation des étapes FENKU-IT
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Informations personnelles
        if (!formData.age || formData.age < 0 || formData.age > 120) {
          newErrors.age = 'Âge requis (0-120 ans)';
        }
        if (!formData.gender) {
          newErrors.gender = 'Genre requis';
        }
        break;
        
      case 1: // Symptômes principaux
        if (!formData.mainSymptom) {
          newErrors.mainSymptom = 'Symptôme principal requis';
        }
        if (!formData.symptomDuration) {
          newErrors.symptomDuration = 'Durée des symptômes requise';
        }
        if (!formData.symptomIntensity) {
          newErrors.symptomIntensity = 'Intensité des symptômes requise';
        }
        break;
        
      case 2: // Antécédents (optionnel)
        // Pas de validation stricte pour les antécédents FENKU-IT
        break;
        
      case 3: // Évaluation détaillée
        if (!formData.painLevel) {
          newErrors.painLevel = 'Niveau de douleur requis';
        }
        break;
        
      case 4: // Conclusion
        if (!formData.preliminaryAssessment) {
          newErrors.preliminaryAssessment = 'Évaluation préliminaire requise';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation entre les étapes FENKU-IT
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Finalisation de la consultation FENKU-IT
  const handleComplete = async () => {
    if (!validateStep(activeStep)) return;

    setIsLoading(true);
    try {
      // Génération de l'évaluation préliminaire FENKU-IT
      const assessment = generatePreliminaryAssessment();
      
      // Sauvegarde via l'API FENKU-IT
      const consultationData = {
        ...formData,
        preliminaryAssessment: assessment,
        timestamp: new Date().toISOString(),
        patientId: patientId
      };

      await consultationService.saveConsultation(patientId, consultationData);
      
      // Callback de completion FENKU-IT
      if (onComplete) {
        onComplete(consultationData);
      }
      
    } catch (error) {
      console.error('Erreur sauvegarde consultation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Génération de l'évaluation préliminaire FENKU-IT
  const generatePreliminaryAssessment = () => {
    let assessment = `CONSULTATION DE PREMIÈRE LIGNE\n\n`;
    assessment += `Patient: ${formData.age} ans, ${formData.gender}\n`;
    assessment += `Symptôme principal: ${formData.mainSymptom}\n`;
    assessment += `Durée: ${formData.symptomDuration}\n`;
    assessment += `Intensité: ${formData.symptomIntensity}/10\n\n`;
    
    // Évaluation de l'urgence FENKU-IT
    const urgentSymptoms = ['douleur thoracique', 'difficulté respiratoire', 'perte de conscience'];
    const isUrgent = urgentSymptoms.some(symptom => 
      formData.mainSymptom.toLowerCase().includes(symptom)
    ) || formData.painLevel >= 8;
    
    if (isUrgent) {
      assessment += `🚨 URGENCE MÉDICALE DÉTECTÉE\n`;
      assessment += `Recommandation: Consultation immédiate ou appel du 15\n\n`;
    } else if (formData.painLevel >= 6) {
      assessment += `⚠️ CONSULTATION RECOMMANDÉE\n`;
      assessment += `Recommandation: Consultation dans les 24-48h\n\n`;
    } else {
      assessment += `✅ SURVEILLANCE À DOMICILE\n`;
      assessment += `Recommandation: Surveillance et consultation si aggravation\n\n`;
    }
    
    assessment += `⚠️ IMPORTANT: Ceci n'est pas un diagnostic médical.`;
    assessment += ` Consultez un professionnel de santé pour un diagnostic précis.`;
    
    return assessment;
  };

  // Rendu des étapes FENKU-IT
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <User size={20} color="#0096b0" />
              Informations personnelles
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Âge"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                error={!!errors.age}
                helperText={errors.age}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }} error={!!errors.gender}>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  label="Genre"
                >
                  <MenuItem value="male">Homme</MenuItem>
                  <MenuItem value="female">Femme</MenuItem>
                  <MenuItem value="other">Autre</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Heart size={20} color="#0096b0" />
              Symptômes principaux
            </Typography>
            
            <TextField
              label="Symptôme principal"
              value={formData.mainSymptom}
              onChange={(e) => handleInputChange('mainSymptom', e.target.value)}
              error={!!errors.mainSymptom}
              helperText={errors.mainSymptom}
              fullWidth
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormControl sx={{ flex: 1 }} error={!!errors.symptomDuration}>
                <InputLabel>Durée</InputLabel>
                <Select
                  value={formData.symptomDuration}
                  onChange={(e) => handleInputChange('symptomDuration', e.target.value)}
                  label="Durée"
                >
                  <MenuItem value="< 1h">Moins d'1 heure</MenuItem>
                  <MenuItem value="1-6h">1-6 heures</MenuItem>
                  <MenuItem value="6-24h">6-24 heures</MenuItem>
                  <MenuItem value="1-3 jours">1-3 jours</MenuItem>
                  <MenuItem value="3-7 jours">3-7 jours</MenuItem>
                  <MenuItem value="> 7 jours">Plus de 7 jours</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: 1 }} error={!!errors.symptomIntensity}>
                <InputLabel>Intensité</InputLabel>
                <Select
                  value={formData.symptomIntensity}
                  onChange={(e) => handleInputChange('symptomIntensity', e.target.value)}
                  label="Intensité"
                >
                  <MenuItem value="1">1 - Très faible</MenuItem>
                  <MenuItem value="2">2 - Faible</MenuItem>
                  <MenuItem value="3">3 - Légère</MenuItem>
                  <MenuItem value="4">4 - Modérée</MenuItem>
                  <MenuItem value="5">5 - Moyenne</MenuItem>
                  <MenuItem value="6">6 - Élevée</MenuItem>
                  <MenuItem value="7">7 - Forte</MenuItem>
                  <MenuItem value="8">8 - Très forte</MenuItem>
                  <MenuItem value="9">9 - Intense</MenuItem>
                  <MenuItem value="10">10 - Insupportable</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="Description détaillée"
              multiline
              rows={3}
              value={formData.symptomDescription}
              onChange={(e) => handleInputChange('symptomDescription', e.target.value)}
              fullWidth
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={20} color="#0096b0" />
              Antécédents médicaux
            </Typography>
            
            {patientData && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Données connues du dossier médical:
                </Typography>
                
                {patientData.allergies.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Allergies:</Typography>
                    {patientData.allergies.map((allergy, index) => (
                      <Chip
                        key={index}
                        label={allergy.name}
                        color="warning"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
                
                {patientData.medications.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Médicaments en cours:</Typography>
                    {patientData.medications.map((med, index) => (
                      <Chip
                        key={index}
                        label={`${med.name} (${med.dosage})`}
                        color="info"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Ces informations sont pré-remplies depuis votre dossier médical. 
              Vous pouvez les modifier si nécessaire.
            </Alert>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlertTriangle size={20} color="#0096b0" />
              Évaluation détaillée
            </Typography>
            
            <FormControl error={!!errors.painLevel} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Niveau de douleur (0-10):
              </Typography>
              <RadioGroup
                value={formData.painLevel}
                onChange={(e) => handleInputChange('painLevel', e.target.value)}
                row
              >
                {[0,1,2,3,4,5,6,7,8,9,10].map(value => (
                  <FormControlLabel
                    key={value}
                    value={value.toString()}
                    control={<Radio size="small" />}
                    label={value}
                    sx={{ mr: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <TextField
              label="Facteurs déclencheurs ou aggravants"
              multiline
              rows={2}
              value={formData.triggers}
              onChange={(e) => handleInputChange('triggers', e.target.value)}
              fullWidth
            />
          </Box>
        );

      case 4:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle size={20} color="#0096b0" />
              Conclusion et recommandations
            </Typography>
            
            <TextField
              label="Évaluation préliminaire"
              multiline
              rows={4}
              value={formData.preliminaryAssessment}
              onChange={(e) => handleInputChange('preliminaryAssessment', e.target.value)}
              error={!!errors.preliminaryAssessment}
              helperText={errors.preliminaryAssessment}
              fullWidth
              sx={{ mb: 3 }}
            />
            
            <Alert severity="warning" sx={{ mb: 2 }}>
              ⚠️ Cette évaluation est préliminaire et ne remplace pas un diagnostic médical professionnel.
            </Alert>
            
            <Alert severity="info">
              💡 Les données de cette consultation seront sauvegardées dans votre dossier médical.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <Box
        sx={{
          width: { xs: '95%', sm: 600 },
          maxHeight: '90vh',
          overflow: 'auto',
          ...getCardStyles()
        }}
      >
        {/* Header FENKU-IT */}
        <Box
          sx={{
            p: 2,
            background: '#0096b0',
            borderRadius: '16px 16px 0 0',
            color: 'white'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            🔍 Consultation de Première Ligne
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Étape {activeStep + 1} sur {steps.length}
          </Typography>
        </Box>

        {/* Progress Bar FENKU-IT */}
        <Box sx={{ p: 2 }}>
          <LinearProgress
            variant="determinate"
            value={(activeStep / (steps.length - 1)) * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#0096b0'
              }
            }}
          />
        </Box>

        {/* Stepper FENKU-IT */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Contenu de l'étape FENKU-IT */}
        {renderStepContent(activeStep)}

        {/* Navigation FENKU-IT */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            background: theme.palette.mode === 'dark' 
              ? colors.blackAccent[500]
              : '#fcfcfc80'
          }}
        >
          <Button
            onClick={activeStep === 0 ? onClose : handleBack}
            startIcon={<ArrowLeft size={16} />}
            disabled={isLoading}
          >
            {activeStep === 0 ? 'Annuler' : 'Précédent'}
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleComplete}
              variant="contained"
              endIcon={<CheckCircle size={16} />}
              disabled={isLoading}
              sx={{
                background: '#0096b0',
                '&:hover': { background: '#0088a3' }
              }}
            >
              {isLoading ? 'Finalisation...' : 'Terminer'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowRight size={16} />}
              disabled={isLoading}
              sx={{
                background: '#0096b0',
                '&:hover': { background: '#0088a3' }
              }}
            >
              Suivant
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StructuredConsultation;
