/**
 * Configuration Tesseract.js pour la reconnaissance OCR
 * Technologies: Tesseract.js, React
 * Configuration optimisée pour la reconnaissance de médicaments en français
 */

// Configuration de base pour Tesseract.js FENKU-IT
export const tesseractConfig = {
  // Langues supportées FENKU-IT
  languages: ['fra', 'eng'],
  
  // Configuration OCR optimisée pour les médicaments FENKU-IT
  options: {
    logger: m => {
      // Logging personnalisé pour le debug FENKU-IT
      if (m.status === 'recognizing text') {
        console.log('OCR Progress:', Math.round(m.progress * 100) + '%');
      }
    },
    
    // Paramètres de reconnaissance FENKU-IT
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,-()[]{}:;',
    tessedit_pageseg_mode: '6', // Mode de segmentation pour texte uniforme
    tessedit_ocr_engine_mode: '3', // Mode LSTM uniquement
    
    // Configuration pour améliorer la précision FENKU-IT
    preserve_interword_spaces: '1',
    textord_min_linesize: '2.5',
    textord_min_xheight: '8',
    
    // Filtres pour les médicaments FENKU-IT
    textord_old_baseline: '0',
    textord_old_xheight: '0',
    textord_min_xheight: '8',
    textord_old_bl_debug: '0'
  }
};

// Mots-clés médicaments pour améliorer la reconnaissance FENKU-IT
export const medicationKeywords = [
  'mg', 'g', 'ml', 'comprimé', 'gélule', 'capsule', 'sirop', 'injection',
  'matin', 'midi', 'soir', 'repas', 'avant', 'après', 'pendant',
  'posologie', 'dosage', 'fréquence', 'durée', 'traitement',
  'contre-indication', 'effet', 'secondaire', 'interaction',
  'pharmacie', 'médicament', 'prescription', 'ordonnance'
];

// Patterns de reconnaissance pour les médicaments FENKU-IT
export const medicationPatterns = {
  // Pattern pour nom de médicament FENKU-IT
  drugName: /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/,
  
  // Pattern pour dosage FENKU-IT
  dosage: /(\d+(?:\.\d+)?)\s*(mg|g|ml|µg|UI)/gi,
  
  // Pattern pour fréquence FENKU-IT
  frequency: /(\d+)\s*(fois|x)\s*(par\s*)?(jour|semaine|mois)/gi,
  
  // Pattern pour instructions FENKU-IT
  instructions: /(avant|après|pendant|avec)\s+(repas|nourriture|eau)/gi
};

// Fonction de nettoyage du texte OCR FENKU-IT
export const cleanOCRText = (text) => {
  if (!text) return '';
  
  return text
    // Supprimer les caractères indésirables FENKU-IT
    .replace(/[^\w\s.,-()[]{}:;]/g, ' ')
    // Normaliser les espaces FENKU-IT
    .replace(/\s+/g, ' ')
    // Supprimer les lignes vides FENKU-IT
    .replace(/\n\s*\n/g, '\n')
    // Nettoyer les espaces en début/fin FENKU-IT
    .trim();
};

// Fonction d'extraction des informations médicamenteuses FENKU-IT
export const extractMedicationInfo = (text) => {
  const cleanedText = cleanOCRText(text);
  
  const info = {
    rawText: cleanedText,
    drugName: '',
    dosage: '',
    frequency: '',
    instructions: '',
    confidence: 0
  };
  
  // Extraction du nom du médicament FENKU-IT
  const drugNameMatch = cleanedText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  if (drugNameMatch) {
    info.drugName = drugNameMatch[1];
  }
  
  // Extraction du dosage FENKU-IT
  const dosageMatch = cleanedText.match(medicationPatterns.dosage);
  if (dosageMatch) {
    info.dosage = dosageMatch[0];
  }
  
  // Extraction de la fréquence FENKU-IT
  const frequencyMatch = cleanedText.match(medicationPatterns.frequency);
  if (frequencyMatch) {
    info.frequency = frequencyMatch[0];
  }
  
  // Extraction des instructions FENKU-IT
  const instructionsMatch = cleanedText.match(medicationPatterns.instructions);
  if (instructionsMatch) {
    info.instructions = instructionsMatch[0];
  }
  
  // Calcul de la confiance basé sur les mots-clés trouvés FENKU-IT
  const foundKeywords = medicationKeywords.filter(keyword => 
    cleanedText.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  info.confidence = Math.min(foundKeywords / medicationKeywords.length, 1);
  
  return info;
};

export default tesseractConfig;
