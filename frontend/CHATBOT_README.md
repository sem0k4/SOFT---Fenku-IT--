# 🤖 Chatbot Médical Intelligent

## Vue d'ensemble

Le chatbot médical intelligent est un assistant IA avancé intégré à l'application FAJMA qui permet aux patients de :

- **Préconsultation** : Préparer leurs consultations en répondant à des questions ciblées
- **Consultation du dossier** : Accéder à leurs informations médicales (allergies, médicaments, antécédents)
- **Conseils médicaux** : Recevoir des conseils personnalisés sur la santé et le bien-être
- **Détection d'urgences** : Identifier les situations d'urgence et rediriger vers les services appropriés

## 🚀 Fonctionnalités

### 1. Interface Utilisateur Moderne
- Design responsive avec Tailwind CSS et shadcn/ui
- Icônes Lucide React pour une expérience visuelle cohérente
- Mode sombre/clair supporté
- Animations et transitions fluides

### 2. Modes de Conversation
- **Général** : Point d'entrée principal
- **Préconsultation** : Questions structurées sur les symptômes
- **Dossier Médical** : Consultation des données de santé
- **Conseils** : Recommandations personnalisées

### 3. Intelligence Artificielle
- Analyse d'intention des messages utilisateur
- Génération de réponses contextuelles
- Suggestions intelligentes
- Détection automatique d'urgences

### 4. Gestion des Données
- Intégration avec le profil utilisateur
- Historique des conversations
- Export des conversations
- Statistiques d'utilisation

## 🛠️ Architecture Technique

### Composants Principaux

```
src/
├── components/
│   ├── ChatbotMedical.jsx      # Interface principale du chatbot
│   ├── ChatbotButton.jsx       # Bouton flottant d'ouverture
│   └── ChatbotContainer.jsx    # Conteneur principal
├── hooks/
│   └── useChatbot.js          # Hook personnalisé pour la logique
├── services/
│   ├── chatbotService.js      # Service IA et logique métier
│   └── auth.js                # Service d'authentification
└── pages/
    └── ChatbotPage.jsx        # Page de démonstration
```

### Services

#### `chatbotService.js`
- Analyse d'intention des messages
- Génération de réponses contextuelles
- Gestion des données médicales
- Détection d'urgences

#### `useChatbot.js`
- Hook React pour la gestion d'état
- Intégration avec le service chatbot
- Gestion des conversations
- Fonctions utilitaires

## 🎯 Utilisation

### Pour les Développeurs

1. **Intégration** : Le chatbot est automatiquement disponible via `ChatbotContainer`
2. **Personnalisation** : Modifiez `chatbotService.js` pour ajouter de nouvelles fonctionnalités
3. **Styles** : Utilisez les classes Tailwind CSS pour personnaliser l'apparence

### Pour les Utilisateurs

1. **Ouverture** : Cliquez sur le bouton flottant en bas à droite
2. **Sélection du mode** : Choisissez le type d'assistance souhaité
3. **Conversation** : Tapez votre message ou utilisez les suggestions
4. **Actions** : Utilisez les boutons d'action (nouvelle conversation, export, etc.)

## 🔧 Configuration

### Variables d'Environnement
```env
REACT_APP_CHATBOT_API_URL=your_api_url
REACT_APP_CHATBOT_MODEL=your_ai_model
```

### Personnalisation des Réponses
Modifiez les fonctions dans `chatbotService.js` :
- `generatePreconsultationResponse()`
- `generateDossierResponse()`
- `generateConseilsResponse()`
- `handleUrgence()`

## 📊 Données Médicales

Le chatbot accède aux données suivantes :
- **Allergies** : Type, gravité, recommandations
- **Médicaments** : Posologie, fréquence, prochaines prises
- **Antécédents** : Conditions médicales, dates, statut
- **Rendez-vous** : Prochains RDV, médecins, types de consultation

## 🚨 Gestion des Urgences

Le chatbot détecte automatiquement les mots-clés d'urgence :
- "urgent", "grave", "sérieux", "danger"
- "ambulance", "hôpital", "immédiat"

En cas d'urgence détectée :
1. Affichage d'un message d'alerte visuel
2. Instructions pour contacter les services d'urgence
3. Redirection vers les numéros d'urgence appropriés

## 🎨 Personnalisation de l'Interface

### Couleurs
```css
/* Mode préconsultation */
--preconsultation-color: #3b82f6;

/* Mode dossier */
--dossier-color: #10b981;

/* Mode conseils */
--conseils-color: #ef4444;

/* Urgences */
--urgence-color: #f59e0b;
```

### Tailles
- Largeur du chatbot : 384px (w-96)
- Hauteur maximale : 600px
- Bouton flottant : 56px (h-14)

## 🔒 Sécurité et Confidentialité

- Toutes les conversations sont chiffrées
- Aucune donnée médicale n'est stockée côté client
- Conformité RGPD intégrée
- Logs d'audit pour les conversations

## 🚀 Déploiement

1. **Build** : `npm run build`
2. **Test** : `npm run test`
3. **Déploiement** : Le chatbot est inclus dans le build principal

## 📈 Métriques et Analytics

Le chatbot collecte :
- Nombre de conversations
- Types de questions les plus fréquentes
- Temps de réponse moyen
- Taux de satisfaction utilisateur

## 🐛 Dépannage

### Problèmes Courants

1. **Chatbot ne s'ouvre pas** : Vérifiez que `ChatbotContainer` est inclus dans `App.jsx`
2. **Messages non envoyés** : Vérifiez la connexion au service d'authentification
3. **Styles cassés** : Vérifiez que Tailwind CSS est correctement configuré

### Logs de Debug
```javascript
// Activer les logs détaillés
localStorage.setItem('chatbot-debug', 'true');
```

## 🤝 Contribution

Pour contribuer au développement du chatbot :

1. Fork le repository
2. Créez une branche feature
3. Implémentez vos modifications
4. Testez avec `npm test`
5. Soumettez une pull request

## 📞 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Contactez l'équipe de développement
- Consultez la documentation API

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2024  
**Maintenu par** : Équipe FAJMA

