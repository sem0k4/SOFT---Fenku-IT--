# 🔧 Guide de Dépannage - Chatbot Médical

## Problèmes Courants et Solutions

### 1. Erreur 500 - Internal Server Error

**Symptôme :** `auth.js:1 Failed to load resource: the server responded with a status of 500`

**Causes possibles :**
- Service d'authentification non initialisé
- Appels API vers des endpoints inexistants
- Erreurs de configuration

**Solutions :**

#### Solution 1 : Vérifier les services
```bash
# Vérifier que le frontend fonctionne
cd frontend
npm run dev

# Vérifier que le backend fonctionne (optionnel)
cd backend
python manage.py runserver
```

#### Solution 2 : Utiliser le mode développement
Le chatbot est configuré pour fonctionner en mode développement avec des données simulées. Aucune connexion backend n'est requise.

#### Solution 3 : Vérifier la console
Ouvrez les outils de développement (F12) et vérifiez la console pour d'autres erreurs.

### 2. Chatbot ne s'affiche pas

**Symptômes :**
- Pas de bouton flottant visible
- Erreurs dans la console
- Page blanche

**Solutions :**

#### Vérifier l'intégration
```jsx
// Dans App.jsx, vérifier que ChatbotContainer est inclus
<ErrorBoundary>
  <ChatbotContainer />
</ErrorBoundary>
```

#### Vérifier les imports
```jsx
// Vérifier que tous les imports sont corrects
import ChatbotContainer from './components/ChatbotContainer';
import ErrorBoundary from './components/ErrorBoundary';
```

#### Vérifier les dépendances
```bash
# Réinstaller les dépendances
npm install

# Vérifier les dépendances manquantes
npm list lucide-react
npm list @radix-ui/react-scroll-area
```

### 3. Erreurs de composants UI

**Symptômes :**
- Composants shadcn/ui non trouvés
- Erreurs de style
- Composants cassés

**Solutions :**

#### Vérifier les composants UI
```bash
# Vérifier que tous les composants UI sont présents
ls frontend/src/components/ui/
```

#### Réinstaller les dépendances Radix UI
```bash
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-avatar
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-progress
npm install @radix-ui/react-separator
npm install @radix-ui/react-slot
npm install @radix-ui/react-tabs
npm install @radix-ui/react-tooltip
```

### 4. Problèmes de styles Tailwind

**Symptômes :**
- Styles non appliqués
- Classes CSS non reconnues
- Interface cassée

**Solutions :**

#### Vérifier la configuration Tailwind
```javascript
// Vérifier tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

#### Vérifier les imports CSS
```jsx
// Dans main.jsx ou App.jsx
import './index.css'
```

### 5. Problèmes de performance

**Symptômes :**
- Chargement lent
- Interface qui se fige
- Erreurs de mémoire

**Solutions :**

#### Optimiser les re-renders
```jsx
// Utiliser useMemo et useCallback
const memoizedValue = useMemo(() => expensiveCalculation(), [deps]);
const memoizedCallback = useCallback(() => doSomething(), [deps]);
```

#### Réduire la taille du bundle
```bash
# Analyser la taille du bundle
npm run build
npx vite-bundle-analyzer dist
```

### 6. Problèmes de données

**Symptômes :**
- Données médicales non chargées
- Messages d'erreur dans la console
- Fonctionnalités non disponibles

**Solutions :**

#### Vérifier le service d'authentification
```javascript
// Vérifier que useAuth fonctionne
const { user, loading } = useAuth();
console.log('User:', user);
console.log('Loading:', loading);
```

#### Utiliser les données par défaut
Le chatbot utilise des données simulées par défaut, même sans utilisateur connecté.

### 7. Problèmes de déploiement

**Symptômes :**
- Erreurs en production
- Fonctionnalités manquantes
- Problèmes de build

**Solutions :**

#### Vérifier les variables d'environnement
```bash
# Créer un fichier .env.production
REACT_APP_API_URL=https://your-api-url.com
NODE_ENV=production
```

#### Optimiser le build
```bash
# Build optimisé
npm run build

# Vérifier le build
npm run preview
```

## 🚀 Tests et Validation

### Test des composants
```bash
# Lancer les tests
npm test

# Test du chatbot spécifiquement
npm test -- --testNamePattern="Chatbot"
```

### Test manuel
1. Ouvrir l'application
2. Vérifier que le bouton flottant est visible
3. Cliquer sur le bouton pour ouvrir le chatbot
4. Tester les différents modes
5. Vérifier les réponses

### Test de la page dédiée
Visitez `/chatbot` pour une démonstration complète du chatbot.

## 📞 Support

### Logs de debug
```javascript
// Activer les logs détaillés
localStorage.setItem('chatbot-debug', 'true');

// Voir les logs dans la console
console.log('Chatbot debug mode enabled');
```

### Informations système
```javascript
// Obtenir les informations de debug
const debugInfo = {
  userAgent: navigator.userAgent,
  url: window.location.href,
  timestamp: new Date().toISOString(),
  chatbotVersion: '1.0.0'
};
console.log('Debug info:', debugInfo);
```

### Contact
- Créer une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation API

## 🔄 Mise à jour

### Mise à jour des dépendances
```bash
# Mettre à jour toutes les dépendances
npm update

# Mettre à jour une dépendance spécifique
npm update lucide-react
```

### Mise à jour du chatbot
```bash
# Récupérer les dernières modifications
git pull origin main

# Réinstaller les dépendances
npm install

# Redémarrer l'application
npm run dev
```

---

**Version du guide :** 1.0.0  
**Dernière mise à jour :** Janvier 2024  
**Maintenu par :** Équipe FAJMA

