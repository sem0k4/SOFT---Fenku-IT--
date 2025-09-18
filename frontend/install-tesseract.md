# Installation de Tesseract.js pour la reconnaissance OCR

## 📦 Installation

Pour activer la reconnaissance OCR complète des médicaments, installez Tesseract.js :

```bash
npm install tesseract.js
```

## 🔄 Migration vers la version complète

Une fois Tesseract.js installé, vous pouvez remplacer `PhotoUploadSimple.jsx` par `PhotoUpload.jsx` :

1. Renommez `PhotoUploadSimple.jsx` en `PhotoUpload.jsx`
2. Remplacez l'import dans `ChatbotMedical.jsx` :
   ```javascript
   import PhotoUpload from './PhotoUpload';
   ```
3. Mettez à jour l'utilisation du composant :
   ```javascript
   <PhotoUpload
     onMedicationRecognized={handleMedicationRecognized}
     onClose={() => setShowPhotoUpload(false)}
     userProfile={userProfile}
   />
   ```

## ⚠️ Note

La version simplifiée (`PhotoUploadSimple.jsx`) fonctionne parfaitement sans Tesseract.js et utilise des données simulées pour la démonstration. Elle est idéale pour le développement et les tests.

## 🚀 Fonctionnalités

- **Version Simple** : Données simulées, pas de dépendances externes
- **Version Complète** : OCR réel avec Tesseract.js, reconnaissance de texte avancée

---

**FENKU-IT** 🚀
