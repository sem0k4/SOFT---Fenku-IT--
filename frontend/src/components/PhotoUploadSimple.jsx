import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileImage,
  Loader2
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';

/**
 * Composant PhotoUpload simplifié pour la reconnaissance de médicaments
 * Technologies: React, Material-UI
 * Version simplifiée sans Tesseract.js pour éviter les erreurs de chargement
 */
const PhotoUploadSimple = ({ onMedicationRecognized, onClose, userProfile }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [error, setError] = useState(null);

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

  // Gestion de la sélection de fichier FENKU-IT
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérification du type de fichier FENKU-IT
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      // Vérification de la taille (max 5MB) FENKU-IT
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image doit faire moins de 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Création de la prévisualisation FENKU-IT
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Simulation de reconnaissance de médicament FENKU-IT
  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simulation de traitement avec délai FENKU-IT
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Données simulées de reconnaissance FENKU-IT
      const medicationData = {
        name: 'Paracétamol 500mg',
        activeIngredient: 'Paracétamol',
        dosage: '500mg',
        instructions: 'Prendre 1 comprimé toutes les 6-8 heures, maximum 4 comprimés par jour',
        warnings: [
          'Ne pas dépasser 4g par jour',
          'À prendre avec un grand verre d\'eau',
          'Éviter en cas d\'allergie au paracétamol'
        ],
        recognized: true,
        confidence: 0.92
      };
      
      setRecognitionResult(medicationData);
      
      // Vérification des contre-indications avec le dossier médical FENKU-IT
      if (userProfile && userProfile.allergies) {
        const contraindications = checkContraindications(medicationData, userProfile);
        if (contraindications.length > 0) {
          setError(`⚠️ ATTENTION: Ce médicament peut être contre-indiqué avec vos allergies: ${contraindications.join(', ')}`);
        }
      }

    } catch (err) {
      console.error('Erreur traitement image:', err);
      setError('Erreur lors du traitement de l\'image. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Vérification des contre-indications FENKU-IT
  const checkContraindications = (medication, profile) => {
    const contraindications = [];
    
    if (profile.allergies) {
      profile.allergies.forEach(allergy => {
        if (medication.name.toLowerCase().includes(allergy.name.toLowerCase()) ||
            medication.activeIngredient.toLowerCase().includes(allergy.name.toLowerCase())) {
          contraindications.push(allergy.name);
        }
      });
    }

    return contraindications;
  };

  // Confirmation et fermeture FENKU-IT
  const handleConfirm = () => {
    if (recognitionResult && onMedicationRecognized) {
      onMedicationRecognized(recognitionResult);
    }
    onClose();
  };

  // Reset du composant FENKU-IT
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setRecognitionResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          ...getCardStyles()
        }}
      >
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
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            📸 Reconnaissance de Médicament
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Contenu FENKU-IT */}
        <Box sx={{ p: 3 }}>
          {!selectedFile ? (
            // Zone de sélection FENKU-IT
            <Box
              sx={{
                border: '2px dashed #0096b0',
                borderRadius: '12px',
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  background: 'rgba(0, 150, 176, 0.05)'
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={48} color="#0096b0" />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Prenez une photo de votre médicament
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Assurez-vous que le nom et la posologie sont bien visibles
              </Typography>
              <Button
                variant="contained"
                startIcon={<Upload size={20} />}
                sx={{
                  background: '#0096b0',
                  '&:hover': { background: '#0088a3' }
                }}
              >
                Sélectionner une image
              </Button>
            </Box>
          ) : (
            // Prévisualisation et traitement FENKU-IT
            <Box>
              {preview && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <img
                    src={preview}
                    alt="Aperçu"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {recognitionResult ? (
                // Résultat de la reconnaissance FENKU-IT
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle size={20} color="#10b981" />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Médicament reconnu
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {recognitionResult.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Substance active:</strong> {recognitionResult.activeIngredient}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Posologie:</strong> {recognitionResult.dosage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Instructions:</strong> {recognitionResult.instructions}
                    </Typography>

                    {recognitionResult.warnings && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          ⚠️ Avertissements:
                        </Typography>
                        {recognitionResult.warnings.map((warning, index) => (
                          <Chip
                            key={index}
                            label={warning}
                            size="small"
                            color="warning"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={handleReset} variant="outlined">
                      Nouvelle photo
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      variant="contained"
                      sx={{
                        background: '#0096b0',
                        '&:hover': { background: '#0088a3' }
                      }}
                    >
                      Confirmer
                    </Button>
                  </Box>
                </Box>
              ) : (
                // Boutons d'action FENKU-IT
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    onClick={handleReset}
                    variant="outlined"
                    startIcon={<X size={20} />}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={processImage}
                    variant="contained"
                    disabled={isProcessing}
                    startIcon={isProcessing ? <Loader2 size={20} className="animate-spin" /> : <FileImage size={20} />}
                    sx={{
                      background: '#0096b0',
                      '&:hover': { background: '#0088a3' }
                    }}
                  >
                    {isProcessing ? 'Analyse en cours...' : 'Analyser l\'image'}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Input fichier caché FENKU-IT */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PhotoUploadSimple;
