# 🚀 Mode Démonstration - Assistant Médicale de Fajma

## 📋 Vue d'ensemble

L'application fonctionne actuellement en **mode démonstration** avec des données simulées. Toutes les fonctionnalités du chatbot médical sont disponibles et fonctionnelles, mais utilisent des données de test au lieu de l'API backend.

## ✅ Fonctionnalités Disponibles en Mode Démonstration

### 🤖 Chatbot Médical Intelligent
- **Conversation naturelle** avec l'IA médicale
- **Détection d'urgence** automatique
- **Analyse de symptômes** intelligente
- **Recommandations personnalisées**

### 📸 Reconnaissance de Médicaments
- **Upload de photos** de médicaments
- **Reconnaissance simulée** (Paracétamol 500mg)
- **Vérification des contre-indications** locale
- **Instructions détaillées** de prise

### 🔍 Consultation Structurée
- **Questionnaire médical** en 5 étapes
- **Validation des données** à chaque étape
- **Évaluation préliminaire** automatique
- **Sauvegarde locale** des consultations

### 📊 Suivi des Symptômes
- **Enregistrement des symptômes** avec intensité
- **Programmation de rappels** de médicaments
- **Historique des symptômes** avec évolution
- **Calcul des prochains rappels**

## 🔧 Données de Démonstration

### 👤 Profil Patient
```json
{
  "name": "Oumar",
  "age": 35,
  "allergies": [
    { "name": "Pénicilline", "severity": "sévère" },
    { "name": "Pollens", "severity": "modérée" }
  ],
  "medications": [
    { "name": "Metformine", "dosage": "500mg", "frequency": "2x/jour" },
    { "name": "Lisinopril", "dosage": "10mg", "frequency": "1x/jour" }
  ],
  "history": [
    { "condition": "Diabète type 2", "date": "2020", "status": "En cours" },
    { "condition": "Hypertension", "date": "2019", "status": "Contrôlée" }
  ]
}
```

### 💊 Médicaments Simulés
- **Paracétamol 500mg** : Reconnaissance par photo
- **Instructions** : Prendre 1 comprimé toutes les 6-8 heures
- **Avertissements** : Ne pas dépasser 4g par jour

## 🚀 Comment Tester

### 1. **Chatbot Principal**
- Cliquez sur le bouton flottant en bas à droite
- Posez des questions médicales
- Testez les suggestions rapides

### 2. **Reconnaissance de Médicaments**
- Cliquez sur "Photo Médicament"
- Uploadez n'importe quelle image
- Voir la reconnaissance simulée du Paracétamol

### 3. **Consultation Structurée**
- Cliquez sur "Consultation"
- Suivez le questionnaire en 5 étapes
- Voir l'évaluation préliminaire

### 4. **Suivi des Symptômes**
- Cliquez sur "Suivi"
- Ajoutez des symptômes et rappels
- Consultez l'historique

## 🔗 Intégration avec l'API Backend

### Configuration Actuelle
```javascript
// Configuration API (frontend/src/config/api.js)
baseURL: 'http://localhost:8000/api'
```

### Pour Activer l'API Réelle
1. **Démarrez votre serveur backend** sur le port 8000
2. **Les appels API** se feront automatiquement
3. **Les données simulées** seront remplacées par les vraies données

### Endpoints Attendus
- `GET /patients/{id}/allergies` - Allergies du patient
- `GET /patients/{id}/medications` - Médicaments en cours
- `GET /patients/{id}/history` - Antécédents médicaux
- `POST /medications/recognize` - Reconnaissance de médicament
- `POST /patients/{id}/consultations` - Sauvegarde consultation
- `POST /patients/{id}/reminders` - Programmation rappels

## 🎯 Avantages du Mode Démonstration

### ✅ **Développement**
- Test rapide des fonctionnalités
- Pas besoin de backend pour développer
- Interface complètement fonctionnelle

### ✅ **Démonstration**
- Présentation des capacités
- Tests utilisateur
- Validation des concepts

### ✅ **Formation**
- Apprentissage des fonctionnalités
- Tests de scénarios
- Formation des utilisateurs

## 🔄 Passage en Mode Production

### 1. **Démarrage du Backend**
```bash
# Dans le répertoire backend
python manage.py runserver
```

### 2. **Configuration des Variables**
```env
# frontend/.env
VITE_API_URL=http://localhost:8000/api
```

### 3. **Redémarrage du Frontend**
```bash
# Dans le répertoire frontend
npm run dev
```

## 📊 Monitoring et Logs

### Console du Navigateur
- **Logs d'erreur API** : `ERR_CONNECTION_REFUSED`
- **Mode démonstration** : `API non disponible, utilisation des données de démonstration`
- **Vérifications locales** : `Vérification locale des contre-indications`

### Indicateurs Visuels
- **Message d'information** : "Mode démonstration" dans le chatbot
- **Notes dans les réponses** : "*Note: Mode démonstration*"
- **Alertes** : Indication du mode de fonctionnement

## 🚨 Limitations du Mode Démonstration

### ❌ **Données Réelles**
- Pas de vraies données patient
- Pas de sauvegarde persistante
- Pas de synchronisation

### ❌ **Fonctionnalités Avancées**
- Pas de reconnaissance OCR réelle
- Pas de vraies vérifications médicales
- Pas d'intégration avec les systèmes hospitaliers

### ❌ **Sécurité**
- Pas de vraie authentification
- Pas de chiffrement des données
- Pas de conformité RGPD

## 🎉 Conclusion

Le mode démonstration permet de **tester toutes les fonctionnalités** du chatbot médical sans avoir besoin d'un backend fonctionnel. C'est parfait pour :

- **Développement** et tests
- **Démonstrations** clients
- **Formation** utilisateurs
- **Validation** des concepts

**L'application est prête pour la production dès que le backend sera disponible !** 🚀

---

**Développé par FENKU-IT** 🚀
*Assistant Médicale de Fajma - Version 2.0*
