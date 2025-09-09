# 🤝 Guide de Contribution - FAJMA

Merci de votre intérêt pour contribuer au projet FAJMA ! Ce guide vous aidera à comprendre comment participer efficacement au développement.

## 📋 Table des Matières
- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Configuration de l'Environnement](#configuration-de-lenvironnement)
- [Standards de Code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signalement de Bugs](#signalement-de-bugs)
- [Demandes de Fonctionnalités](#demandes-de-fonctionnalités)
- [Tests](#tests)
- [Documentation](#documentation)

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](CODE_OF_CONDUCT.md). Nous nous engageons à maintenir un environnement accueillant et inclusif pour tous.

### Nos Engagements
- 🤝 Respecter tous les contributeurs
- 💬 Communiquer de manière constructive
- 🎯 Se concentrer sur ce qui est le mieux pour la communauté
- 🚀 Encourager l'apprentissage et le partage de connaissances

## 🚀 Comment Contribuer

### Types de Contributions Bienvenues
- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📚 **Amélioration de la documentation**
- 🧪 **Ajout de tests**
- 🎨 **Améliorations UI/UX**
- 🔧 **Optimisations de performance**
- 🔒 **Améliorations de sécurité**

### Workflow de Contribution
1. **Fork** le repository
2. **Cloner** votre fork localement
3. **Créer** une branche pour votre contribution
4. **Développer** et tester vos changements
5. **Commiter** avec des messages clairs
6. **Pousser** vers votre fork
7. **Créer** une Pull Request

## ⚙️ Configuration de l'Environnement

### Prérequis
- Python 3.8+
- Node.js 16+
- Git
- Redis Server
- Arduino IDE (pour ESP32)

### Installation Rapide
```bash
# Cloner le projet
git clone https://github.com/sem0k4/SOFT---Fenku-IT--
cd SOFT---Fenku-IT---bakary

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python manage.py migrate

# Frontend
cd ../frontend
npm install

# Démarrer les services
# Terminal 1: Redis
redis-server

# Terminal 2: Backend
cd backend
python manage.py runserver

# Terminal 3: Frontend
cd frontend
npm run dev
```

### Configuration des Hooks Git
```bash
# Installer pre-commit
pip install pre-commit
pre-commit install
```

## 📏 Standards de Code

### Python (Backend)
- **Style** : PEP 8
- **Linter** : flake8
- **Formatter** : black
- **Type hints** : Recommandé

```python
# Exemple de code Python bien formaté
from typing import List, Optional
from django.db import models

class DispositivesIoT(models.Model):
    """Modèle représentant un dispositif IoT."""
    
    nom: str = models.CharField(max_length=100)
    patient_id: str = models.CharField(max_length=50)
    statut: bool = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f"{self.nom} - {self.patient_id}"
    
    def get_latest_data(self) -> Optional['DonneesCapteursIoT']:
        """Retourne les dernières données du capteur."""
        return self.donnees_capteurs.order_by('-timestamp').first()
```

### JavaScript/React (Frontend)
- **Style** : ESLint + Prettier
- **Conventions** : Airbnb JavaScript Style Guide
- **Hooks** : Utiliser les hooks React modernes

```javascript
// Exemple de composant React bien formaté
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useIoTWebSocket } from '../hooks/useIoTWebSocket';

const VitalSignCard = ({ title, value, unit, color }) => {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Logique de connexion
  }, []);
  
  return (
    <Card sx={{ minWidth: 275, bgcolor: color }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="h3" color="text.secondary">
          {value} {unit}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VitalSignCard;
```

### Arduino (ESP32)
- **Style** : Google C++ Style Guide
- **Conventions** : CamelCase pour les fonctions
- **Commentaires** : Documentation claire

```cpp
// Exemple de code Arduino bien formaté
#include <WiFi.h>
#include <ArduinoJson.h>

class SensorManager {
private:
  float temperature;
  int heartRate;
  int spo2;
  
public:
  SensorManager() : temperature(0.0), heartRate(0), spo2(0) {}
  
  /**
   * Lit les données de tous les capteurs
   * @return true si la lecture est réussie
   */
  bool readAllSensors() {
    temperature = readTemperature();
    heartRate = readHeartRate();
    spo2 = readSpO2();
    
    return (temperature > 0 && heartRate > 0 && spo2 > 0);
  }
  
  String toJson() const {
    StaticJsonDocument<200> doc;
    doc["temperature"] = temperature;
    doc["heart_rate"] = heartRate;
    doc["spo2"] = spo2;
    doc["timestamp"] = millis();
    
    String jsonString;
    serializeJson(doc, jsonString);
    return jsonString;
  }
};
```

## 🔄 Processus de Pull Request

### Avant de Soumettre
- [ ] Tests passent localement
- [ ] Code respecte les standards
- [ ] Documentation mise à jour
- [ ] Changements testés manuellement
- [ ] Commits bien formatés

### Template de Pull Request
```markdown
## 📝 Description
Brève description des changements apportés.

## 🎯 Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## 🧪 Tests
- [ ] Tests unitaires ajoutés/modifiés
- [ ] Tests d'intégration passent
- [ ] Tests manuels effectués

## 📋 Checklist
- [ ] Code respecte les standards
- [ ] Documentation mise à jour
- [ ] Changements testés
- [ ] PR title suit les conventions

## 📸 Screenshots (si applicable)
[Ajouter des captures d'écran pour les changements UI]

## 🔗 Issues Liées
Fixes #123
```

### Conventions de Nommage des Branches
```bash
# Fonctionnalités
feature/nom-de-la-fonctionnalite
feature/iot-sensor-integration

# Corrections de bugs
bugfix/nom-du-bug
bugfix/websocket-connection-error

# Hotfixes
hotfix/nom-du-hotfix
hotfix/security-vulnerability

# Documentation
docs/nom-de-la-doc
docs/api-documentation-update
```

### Messages de Commit
Utiliser la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Format
<type>[optional scope]: <description>

# Exemples
feat(iot): add ESP32 temperature sensor integration
fix(websocket): resolve authentication token validation
docs(readme): update installation instructions
test(api): add unit tests for IoT endpoints
refactor(frontend): optimize React component rendering
```

## 🐛 Signalement de Bugs

### Template d'Issue Bug
```markdown
## 🐛 Description du Bug
Description claire et concise du problème.

## 🔄 Étapes pour Reproduire
1. Aller à '...'
2. Cliquer sur '....'
3. Faire défiler jusqu'à '....'
4. Voir l'erreur

## ✅ Comportement Attendu
Description de ce qui devrait se passer.

## 📸 Screenshots
[Ajouter des captures d'écran si applicable]

## 🖥️ Environnement
- OS: [e.g. Windows 10, Ubuntu 20.04]
- Navigateur: [e.g. Chrome 96, Firefox 95]
- Version Python: [e.g. 3.9.7]
- Version Node.js: [e.g. 16.14.0]

## 📋 Contexte Additionnel
Toute autre information utile sur le problème.
```

## ✨ Demandes de Fonctionnalités

### Template d'Issue Fonctionnalité
```markdown
## 🚀 Fonctionnalité Demandée
Description claire et concise de la fonctionnalité souhaitée.

## 🎯 Problème à Résoudre
Description du problème que cette fonctionnalité résoudrait.

## 💡 Solution Proposée
Description de la solution que vous aimeriez voir implémentée.

## 🔄 Alternatives Considérées
Description des solutions alternatives que vous avez considérées.

## 📋 Contexte Additionnel
Toute autre information ou capture d'écran utile.
```

## 🧪 Tests

### Tests Backend (Django)
```bash
# Exécuter tous les tests
cd backend
python manage.py test

# Tests spécifiques
python manage.py test fajma.tests.test_models
python manage.py test fajma.tests.test_views_iot

# Avec coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Tests Frontend (React)
```bash
# Exécuter tous les tests
cd frontend
npm test

# Tests en mode watch
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Tests d'Intégration
```bash
# Tests WebSocket
python manage.py test fajma.tests.test_consumers

# Tests API
python manage.py test fajma.tests.test_api_integration
```

### Tests ESP32
```cpp
// Tests unitaires dans le code Arduino
void testSensorReading() {
  SensorManager sensor;
  bool result = sensor.readAllSensors();
  
  if (result) {
    Serial.println("✅ Test capteurs: PASS");
  } else {
    Serial.println("❌ Test capteurs: FAIL");
  }
}
```

## 📚 Documentation

### Types de Documentation
- **README.md** : Vue d'ensemble du projet
- **API Documentation** : Endpoints et formats
- **Code Comments** : Documentation inline
- **Wiki** : Guides détaillés
- **Changelog** : Historique des versions

### Standards de Documentation
- **Markdown** pour tous les fichiers de documentation
- **Docstrings** pour les fonctions Python
- **JSDoc** pour les fonctions JavaScript
- **Commentaires** clairs dans le code Arduino

```python
# Exemple de docstring Python
def process_iot_data(data: dict) -> dict:
    """
    Traite les données IoT reçues d'un dispositif ESP32.
    
    Args:
        data (dict): Données brutes du capteur contenant:
            - temperature (float): Température en Celsius
            - heart_rate (int): Fréquence cardiaque en BPM
            - spo2 (int): Saturation en oxygène en pourcentage
    
    Returns:
        dict: Données traitées et validées
    
    Raises:
        ValueError: Si les données sont invalides
        
    Example:
        >>> data = {"temperature": 36.5, "heart_rate": 72, "spo2": 98}
        >>> result = process_iot_data(data)
        >>> print(result["status"])
        "valid"
    """
    # Implementation...
```

## 🏷️ Versioning et Releases

### Semantic Versioning
- **MAJOR** : Changements incompatibles
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs

### Processus de Release
1. **Mise à jour** du CHANGELOG.md
2. **Tag** de la version
3. **Build** et tests automatisés
4. **Publication** sur GitHub Releases
5. **Déploiement** en production

## 🆘 Aide et Support

### Canaux de Communication
- **GitHub Issues** : Bugs et fonctionnalités
- **GitHub Discussions** : Questions générales
- **Email** : support@fajma.com
- **Documentation** : Wiki du projet

### Ressources Utiles
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://reactjs.org/docs/)
- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/)
- [Material-UI Documentation](https://mui.com/)

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet possible !

### Contributeurs Principaux
- [@sem0k4](https://github.com/sem0k4) - Mainteneur principal
- [@Artenus-814](https://github.com/Artenus-814) - Développement IoT

### Comment Être Reconnu
Tous les contributeurs sont automatiquement ajoutés au fichier CONTRIBUTORS.md et mentionnés dans les releases.

---

**Merci de contribuer au projet FAJMA ! 🚀**

*Ensemble, nous construisons l'avenir de la télémédecine IoT.*