# 🏥 FAJMA IoT Healthcare System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-FF6B6B.svg)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

> **Système de santé IoT en temps réel** - Une plateforme complète pour la surveillance des patients avec des capteurs ESP32, communication temps réel, et interface web moderne.

## 📋 Table des Matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation Rapide](#-installation-rapide)
- [🐳 Déploiement Docker](#-déploiement-docker)
- [📱 Utilisation](#-utilisation)
- [🔧 Configuration](#-configuration)
- [📊 Monitoring IoT](#-monitoring-iot)
- [🔒 Sécurité](#-sécurité)
- [🧪 Tests](#-tests)
- [📚 Documentation API](#-documentation-api)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

## 🎯 Vue d'ensemble

FAJMA IoT Healthcare System est une plateforme de surveillance médicale en temps réel qui combine :

- **Capteurs IoT ESP32** pour la collecte de données biométriques
- **Backend Django** avec API REST et WebSocket
- **Frontend React/TypeScript** avec interface moderne
- **Communication temps réel** pour le monitoring continu
- **Architecture microservices** avec Docker
- **Sécurité avancée** et chiffrement des données

### 🎯 Objectifs du Projet

- Surveillance continue des patients à distance
- Alertes automatiques en cas d'anomalies
- Interface intuitive pour le personnel médical
- Intégration facile avec les systèmes hospitaliers existants
- Évolutivité et haute disponibilité

## ✨ Fonctionnalités

### 🏥 Monitoring Médical
- **SpO2** - Saturation en oxygène du sang
- **Température corporelle** - Surveillance thermique continue
- **Fréquence cardiaque** - Monitoring cardiaque en temps réel
- **Alertes intelligentes** - Notifications automatiques
- **Historique des données** - Stockage et analyse des tendances

### 💬 Communication Temps Réel
- **WebSocket** - Données IoT en temps réel
- **Chat médical** - Communication entre équipes
- **Notifications push** - Alertes instantanées
- **Appels vidéo** - Téléconsultation (WebRTC)

### 🔐 Sécurité & Conformité
- **Authentification JWT** - Sécurité des sessions
- **Chiffrement TLS/SSL** - Protection des données
- **RBAC** - Contrôle d'accès basé sur les rôles
- **Audit logs** - Traçabilité complète
- **Conformité HIPAA** - Standards médicaux

### 📊 Analytics & Reporting
- **Tableaux de bord** - Visualisation en temps réel
- **Rapports médicaux** - Génération automatique
- **Analyses prédictives** - IA pour la détection d'anomalies
- **Export de données** - Formats multiples (PDF, CSV, JSON)

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App] --> B[WebSocket Client]
        A --> C[REST API Client]
        A --> D[Video Call UI]
    end
    
    subgraph "Reverse Proxy"
        E[Nginx]
    end
    
    subgraph "Backend Layer"
        F[Django API] --> G[WebSocket Server]
        F --> H[Authentication]
        F --> I[Business Logic]
    end
    
    subgraph "Data Layer"
        J[PostgreSQL] --> K[Patient Data]
        J --> L[IoT Measurements]
        M[Redis] --> N[Real-time Cache]
        M --> O[Session Store]
    end
    
    subgraph "IoT Layer"
        P[ESP32 Sensors] --> Q[WiFi/MQTT]
        P --> R[SpO2 Sensor]
        P --> S[Temperature Sensor]
        P --> T[Heart Rate Sensor]
    end
    
    A --> E
    E --> F
    F --> J
    F --> M
    Q --> F
```

### 🔧 Stack Technologique

#### Backend
- **Django 4.2+** - Framework web Python
- **Django REST Framework** - API REST
- **Django Channels** - WebSocket support
- **PostgreSQL** - Base de données principale
- **Redis** - Cache et sessions
- **Celery** - Tâches asynchrones
- **Gunicorn** - Serveur WSGI

#### Frontend
- **React 18+** - Interface utilisateur
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne
- **Tailwind CSS** - Framework CSS
- **React Query** - Gestion d'état serveur
- **Socket.io Client** - WebSocket client

#### Infrastructure
- **Docker & Docker Compose** - Conteneurisation
- **Nginx** - Reverse proxy et load balancer
- **Let's Encrypt** - Certificats SSL automatiques
- **Prometheus & Grafana** - Monitoring
- **ELK Stack** - Logging centralisé

#### IoT & Capteurs
- **ESP32** - Microcontrôleur principal
- **MAX30102** - Capteur SpO2 et fréquence cardiaque
- **DS18B20** - Capteur de température
- **WiFi/MQTT** - Communication sans fil
- **JSON** - Format d'échange de données

## 🚀 Installation Rapide

### Prérequis

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Node.js** 18+ (pour le développement)
- **Python** 3.9+ (pour le développement)
- **Git** 2.30+

### 🐳 Installation avec Docker (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/votre-org/fajma-iot-healthcare.git
cd fajma-iot-healthcare

# Copier les fichiers d'environnement
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Démarrer tous les services
make dev-up

# Ou manuellement
docker-compose -f docker-compose.dev.yml up -d
```

### 🛠️ Installation pour le Développement

#### Backend Setup

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements/development.txt

# Configurer la base de données
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic

# Démarrer le serveur de développement
python manage.py runserver
```

#### Frontend Setup

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### 🔧 Configuration des Variables d'Environnement

#### Backend (.env)
```env
# Django
DJANGO_SECRET_KEY=your-super-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database
DATABASE_URL=postgresql://fajma_user:fajma_password@localhost:5432/fajma_db

# Redis
REDIS_URL=redis://localhost:6379/0

# MQTT
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
MQTT_USERNAME=fajma_mqtt
MQTT_PASSWORD=mqtt_password

# Security
JWT_SECRET_KEY=your-jwt-secret-key
ENCRYPTION_KEY=your-32-byte-encryption-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

#### Frontend (.env)
```env
# API
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Features
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_IOT_MONITORING=true

# Monitoring
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ANALYTICS_ID=your-analytics-id
```

## 🐳 Déploiement Docker

### Développement

```bash
# Démarrer l'environnement de développement
make dev-up

# Voir les logs
make dev-logs

# Arrêter les services
make dev-down

# Rebuild et restart
make dev-restart
```

### Production

```bash
# Build des images de production
make prod-build

# Déployer en production
make prod-deploy

# Monitoring
make prod-status

# Backup de la base de données
make db-backup
```

### Services Disponibles

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface React |
| Backend API | http://localhost:8000/api | API REST Django |
| Admin Django | http://localhost:8000/admin | Interface d'administration |
| WebSocket | ws://localhost:8000/ws | Communication temps réel |
| PostgreSQL | localhost:5432 | Base de données |
| Redis | localhost:6379 | Cache et sessions |
| Nginx | http://localhost:80 | Reverse proxy |
| Grafana | http://localhost:3001 | Monitoring |
| Prometheus | http://localhost:9090 | Métriques |

## 📱 Utilisation

### 👨‍⚕️ Interface Médecin

1. **Connexion** - Authentification sécurisée
2. **Tableau de bord** - Vue d'ensemble des patients
3. **Monitoring temps réel** - Données IoT en direct
4. **Alertes** - Notifications d'anomalies
5. **Historique** - Consultation des données passées
6. **Rapports** - Génération de rapports médicaux

### 👩‍⚕️ Interface Infirmière

1. **Surveillance patients** - Monitoring continu
2. **Prise de mesures** - Saisie manuelle de données
3. **Communication** - Chat avec l'équipe médicale
4. **Alertes** - Gestion des urgences

### 🔧 Configuration ESP32

```cpp
// Configuration WiFi
const char* ssid = "VotreWiFi";
const char* password = "VotreMotDePasse";

// Configuration MQTT
const char* mqtt_server = "votre-serveur.com";
const int mqtt_port = 1883;
const char* mqtt_user = "fajma_esp32";
const char* mqtt_password = "esp32_password";

// Topics MQTT
const char* topic_spo2 = "fajma/patient/123/spo2";
const char* topic_temp = "fajma/patient/123/temperature";
const char* topic_hr = "fajma/patient/123/heartrate";
```

### 📊 Format des Données IoT

```json
{
  "patient_id": "123",
  "device_id": "ESP32_001",
  "timestamp": "2024-01-15T10:30:00Z",
  "measurements": {
    "spo2": {
      "value": 98.5,
      "unit": "%",
      "status": "normal"
    },
    "temperature": {
      "value": 36.8,
      "unit": "°C",
      "status": "normal"
    },
    "heart_rate": {
      "value": 72,
      "unit": "bpm",
      "status": "normal"
    }
  },
  "battery_level": 85,
  "signal_strength": -45
}
```

## 🔧 Configuration

### 🏥 Configuration Médicale

```python
# backend/config/medical_settings.py

# Seuils d'alerte
ALERT_THRESHOLDS = {
    'spo2': {
        'critical_low': 90,
        'warning_low': 95,
        'normal_range': (95, 100)
    },
    'temperature': {
        'critical_low': 35.0,
        'critical_high': 39.0,
        'warning_low': 36.0,
        'warning_high': 37.5,
        'normal_range': (36.0, 37.5)
    },
    'heart_rate': {
        'critical_low': 50,
        'critical_high': 120,
        'warning_low': 60,
        'warning_high': 100,
        'normal_range': (60, 100)
    }
}

# Intervalles de mesure
MEASUREMENT_INTERVALS = {
    'normal': 60,      # 1 minute
    'monitoring': 30,  # 30 secondes
    'critical': 10     # 10 secondes
}
```

### 🔔 Configuration des Alertes

```python
# backend/config/alert_settings.py

ALERT_CHANNELS = {
    'email': {
        'enabled': True,
        'recipients': ['medecin@hopital.com', 'infirmiere@hopital.com']
    },
    'sms': {
        'enabled': True,
        'provider': 'twilio',
        'numbers': ['+33123456789']
    },
    'websocket': {
        'enabled': True,
        'rooms': ['medical_staff', 'emergency']
    },
    'push': {
        'enabled': True,
        'service': 'firebase'
    }
}
```

## 📊 Monitoring IoT

### 📈 Métriques Collectées

- **Données biométriques** - SpO2, température, fréquence cardiaque
- **État des capteurs** - Batterie, signal, statut de connexion
- **Performance système** - Latence, débit, erreurs
- **Utilisation** - Nombre de patients, sessions actives

### 🔍 Surveillance en Temps Réel

```bash
# Voir les métriques en temps réel
make monitoring-dashboard

# Logs des capteurs IoT
make iot-logs

# État des services
make health-check

# Alertes actives
make alerts-status
```

### 📊 Dashboards Grafana

1. **Vue d'ensemble système** - Métriques générales
2. **Monitoring patients** - Données biométriques
3. **Performance IoT** - État des capteurs
4. **Alertes et incidents** - Suivi des anomalies

## 🔒 Sécurité

### 🛡️ Mesures de Sécurité

- **Authentification multi-facteurs (MFA)**
- **Chiffrement AES-256** pour les données sensibles
- **TLS 1.3** pour toutes les communications
- **Validation et sanitisation** des données d'entrée
- **Rate limiting** et protection DDoS
- **Audit logs** complets
- **Sauvegarde chiffrée** des données

### 🔐 Gestion des Accès

```python
# Rôles et permissions
ROLES = {
    'admin': ['*'],
    'doctor': [
        'view_patients',
        'view_measurements',
        'create_prescriptions',
        'manage_alerts'
    ],
    'nurse': [
        'view_patients',
        'view_measurements',
        'create_measurements',
        'view_alerts'
    ],
    'technician': [
        'view_devices',
        'manage_devices',
        'view_system_logs'
    ]
}
```

### 🔍 Audit et Conformité

- **Logs d'audit** - Toutes les actions utilisateur
- **Traçabilité** - Historique complet des modifications
- **Conformité RGPD** - Gestion des données personnelles
- **Standards HIPAA** - Sécurité des données médicales
- **Certification ISO 27001** - Gestion de la sécurité

## 🧪 Tests

### 🔬 Tests Backend

```bash
# Tests unitaires
cd backend
python -m pytest tests/unit/

# Tests d'intégration
python -m pytest tests/integration/

# Tests API
python -m pytest tests/api/

# Tests WebSocket
python -m pytest tests/websocket/

# Couverture de code
python -m pytest --cov=. --cov-report=html
```

### 🧪 Tests Frontend

```bash
# Tests unitaires
cd frontend
npm run test

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e

# Couverture de code
npm run test:coverage
```

### 🤖 Tests Automatisés

```bash
# Tous les tests
make test-all

# Tests de performance
make test-performance

# Tests de sécurité
make test-security

# Tests IoT (simulation)
make test-iot
```

### 📊 Couverture de Code

- **Backend** : > 90% de couverture
- **Frontend** : > 85% de couverture
- **API** : > 95% de couverture
- **WebSocket** : > 80% de couverture

## 📚 Documentation API

### 🔗 Endpoints Principaux

#### Authentification
```http
POST /api/auth/login/
POST /api/auth/logout/
POST /api/auth/refresh/
POST /api/auth/register/
```

#### Patients
```http
GET    /api/patients/
POST   /api/patients/
GET    /api/patients/{id}/
PUT    /api/patients/{id}/
DELETE /api/patients/{id}/
```

#### Mesures IoT
```http
GET  /api/measurements/
POST /api/measurements/
GET  /api/measurements/{id}/
GET  /api/measurements/patient/{patient_id}/
GET  /api/measurements/realtime/{patient_id}/
```

#### WebSocket Events
```javascript
// Connexion
socket.emit('join_room', {room: 'patient_123'});

// Écoute des données
socket.on('measurement_update', (data) => {
  console.log('Nouvelle mesure:', data);
});

// Alertes
socket.on('alert', (alert) => {
  console.log('Alerte:', alert);
});
```

### 📖 Documentation Interactive

- **Swagger UI** : http://localhost:8000/api/docs/
- **ReDoc** : http://localhost:8000/api/redoc/
- **Postman Collection** : `docs/postman/FAJMA_API.json`

## 🤝 Contribution

### 🛠️ Guide de Contribution

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### 📝 Standards de Code

- **Python** : PEP 8, Black formatter
- **JavaScript/TypeScript** : ESLint, Prettier
- **Git** : Conventional Commits
- **Documentation** : Docstrings, JSDoc
- **Tests** : Minimum 80% de couverture

### 🔍 Code Review

- **2 reviewers** minimum pour les PR importantes
- **Tests automatisés** doivent passer
- **Sécurité** vérifiée par Bandit/ESLint Security
- **Performance** analysée si nécessaire

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🆘 Support

### 📞 Contact

- **Email** : support@fajma-healthcare.com
- **Documentation** : https://docs.fajma-healthcare.com
- **Issues** : https://github.com/votre-org/fajma-iot-healthcare/issues
- **Discussions** : https://github.com/votre-org/fajma-iot-healthcare/discussions

### 🐛 Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une issue avec le template "Bug Report"
3. Incluez les logs et étapes de reproduction
4. Ajoutez les labels appropriés

### 💡 Demander une Fonctionnalité

1. Créez une issue avec le template "Feature Request"
2. Décrivez le besoin et la solution proposée
3. Ajoutez des maquettes si possible
4. Discutez avec la communauté

---

<div align="center">

**Fait avec ❤️ pour améliorer les soins de santé**

[⬆ Retour en haut](#-fajma-iot-healthcare-system)

</div>