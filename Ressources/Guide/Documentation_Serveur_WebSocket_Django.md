# Documentation du Serveur WebSocket Django - Projet FAJMA

## 📋 Vue d'ensemble

Cette documentation détaille l'implémentation complète du serveur WebSocket Django pour le projet FAJMA, permettant la communication temps réel entre les dispositifs IoT (ESP32), le backend Django et le frontend React.

## 🏗️ Architecture du Système

### Composants Principaux

1. **Django Channels** : Framework pour WebSocket et communication asynchrone
2. **Redis** : Serveur de cache pour la gestion des canaux WebSocket
3. **PostgreSQL** : Base de données principale avec nouveaux modèles IoT
4. **API REST** : Endpoints pour la gestion des données IoT
5. **Consommateurs WebSocket** : Gestionnaires de connexions temps réel

### Flux de Données

```
ESP32 Dispositifs → WebSocket → Django Consumers → Base de Données
                                      ↓
Frontend React ← WebSocket ← Notifications/Alertes
```

## 🔧 Configuration du Projet

### 1. Dépendances Installées

```bash
pip install channels channels-redis
```

### 2. Configuration Django (settings.py)

```python
INSTALLED_APPS = [
    'channels',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'fajma',
    # ... autres apps
]

# Configuration ASGI
ASGI_APPLICATION = 'core.asgi.application'

# Configuration Channels avec Redis
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# Paramètres WebSocket
WEBSOCKET_URL = 'ws://localhost:8000/ws/'
WEBSOCKET_HEARTBEAT_INTERVAL = 30
WEBSOCKET_TIMEOUT = 60
```

### 3. Configuration ASGI (asgi.py)

```python
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from fajma.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
```

## 📊 Modèles de Données

### 1. DispositivesIoT

```python
class DispositivesIoT(models.Model):
    TYPES_CHOICES = [
        ('capteur_cardiaque', 'Capteur Cardiaque'),
        ('capteur_temperature', 'Capteur Température'),
        ('capteur_pression', 'Capteur Pression Artérielle'),
        ('capteur_oxygene', 'Capteur Oxygène'),
        ('capteur_glycemie', 'Capteur Glycémie'),
    ]
    
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
        ('maintenance', 'En Maintenance'),
        ('erreur', 'Erreur'),
    ]
    
    nom = models.CharField(max_length=100)
    type_dispositif = models.CharField(max_length=50, choices=TYPES_CHOICES)
    adresse_mac = models.CharField(max_length=17, unique=True)
    adresse_ip = models.GenericIPAddressField(null=True, blank=True)
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inactif')
    derniere_connexion = models.DateTimeField(null=True, blank=True)
    version_firmware = models.CharField(max_length=20, null=True, blank=True)
    niveau_batterie = models.IntegerField(null=True, blank=True)
    qualite_signal = models.IntegerField(null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
```

### 2. DonneesCapteursIoT

```python
class DonneesCapteursIoT(models.Model):
    dispositif = models.ForeignKey(DispositivesIoT, on_delete=models.CASCADE)
    type_donnee = models.CharField(max_length=50)
    valeur = models.FloatField()
    unite = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    qualite_donnee = models.IntegerField(default=100)
    metadata = models.JSONField(default=dict, blank=True)
```

### 3. AlertesIoT

```python
class AlertesIoT(models.Model):
    NIVEAU_CHOICES = [
        ('info', 'Information'),
        ('warning', 'Avertissement'),
        ('critical', 'Critique'),
        ('emergency', 'Urgence'),
    ]
    
    dispositif = models.ForeignKey(DispositivesIoT, on_delete=models.CASCADE)
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE)
    niveau = models.CharField(max_length=20, choices=NIVEAU_CHOICES)
    titre = models.CharField(max_length=200)
    message = models.TextField()
    donnee_declencheur = models.ForeignKey(DonneesCapteursIoT, on_delete=models.SET_NULL, null=True)
    acquittee = models.BooleanField(default=False)
    acquittee_par = models.ForeignKey('Utilisateur', on_delete=models.SET_NULL, null=True)
    date_acquittement = models.DateTimeField(null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
```

### 4. SessionsWebSocket

```python
class SessionsWebSocket(models.Model):
    utilisateur = models.ForeignKey('Utilisateur', on_delete=models.CASCADE)
    channel_name = models.CharField(max_length=255, unique=True)
    room_name = models.CharField(max_length=255)
    type_connexion = models.CharField(max_length=50)
    adresse_ip = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    date_connexion = models.DateTimeField(auto_now_add=True)
    derniere_activite = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)
```

## 🔌 Routage WebSocket

### Configuration des Routes (routing.py)

```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/iot/(?P<patient_id>\w+)/$', consumers.IoTConsumer.as_asgi()),
    re_path(r'ws/monitoring/(?P<room_name>\w+)/$', consumers.MonitoringConsumer.as_asgi()),
    re_path(r'ws/alerts/$', consumers.AlertConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
```

### Endpoints WebSocket Disponibles

1. **`ws/iot/<patient_id>/`** : Données IoT temps réel par patient
2. **`ws/monitoring/<room_name>/`** : Monitoring des salles
3. **`ws/alerts/`** : Système d'alertes global
4. **`ws/chat/<room_name>/`** : Chat temps réel

## 🎯 Consommateurs WebSocket

### 1. IoTConsumer

**Fonctionnalités :**
- Réception des données des dispositifs ESP32
- Validation et stockage des données
- Génération d'alertes automatiques
- Diffusion temps réel aux clients connectés

**Messages supportés :**
```json
{
    "type": "sensor_data",
    "device_mac": "AA:BB:CC:DD:EE:FF",
    "data": {
        "temperature": 36.5,
        "heart_rate": 75,
        "timestamp": "2025-01-20T10:30:00Z"
    }
}
```

### 2. MonitoringConsumer

**Fonctionnalités :**
- Monitoring des salles d'hôpital
- Suivi des dispositifs actifs
- Statistiques temps réel

### 3. AlertConsumer

**Fonctionnalités :**
- Diffusion des alertes critiques
- Gestion des accusés de réception
- Escalade automatique

### 4. ChatConsumer

**Fonctionnalités :**
- Chat temps réel entre utilisateurs
- Historique des messages
- Notifications de présence

## 🔗 API REST

### Endpoints Principaux

#### Dispositifs IoT
```
GET    /api/iot/dispositifs/              # Liste des dispositifs
POST   /api/iot/dispositifs/              # Créer un dispositif
GET    /api/iot/dispositifs/{id}/         # Détails d'un dispositif
PUT    /api/iot/dispositifs/{id}/         # Modifier un dispositif
DELETE /api/iot/dispositifs/{id}/         # Supprimer un dispositif

# Actions spéciales
POST   /api/iot/dispositifs/{id}/status/        # Mettre à jour le statut
GET    /api/iot/dispositifs/{id}/latest-data/   # Dernières données
POST   /api/iot/dispositifs/{id}/send-command/  # Envoyer une commande
```

#### Données des Capteurs
```
GET    /api/iot/donnees/                 # Liste des données
POST   /api/iot/donnees/                 # Ajouter des données
GET    /api/iot/donnees/statistics/      # Statistiques
GET    /api/iot/donnees/real-time/       # Données temps réel
```

#### Alertes
```
GET    /api/iot/alertes/                 # Liste des alertes
POST   /api/iot/alertes/                 # Créer une alerte
POST   /api/iot/alertes/{id}/acknowledge/ # Acquitter une alerte
GET    /api/iot/alertes/active/          # Alertes actives
GET    /api/iot/alertes/critical/        # Alertes critiques
```

#### Sessions WebSocket
```
GET    /api/iot/sessions/                # Sessions actives
GET    /api/iot/sessions/active/         # Sessions en cours
```

## 🚀 Démarrage du Serveur

### Prérequis

1. **Redis Server** : Doit être démarré
```bash
redis-server
```

2. **Base de données** : Migrations appliquées
```bash
python manage.py makemigrations
python manage.py migrate
```

### Lancement

```bash
cd backend
python manage.py runserver
```

Le serveur sera accessible sur : **http://127.0.0.1:8000/**

## 🔒 Sécurité

### Authentification
- JWT tokens pour l'API REST
- Authentification WebSocket via middleware
- Validation des permissions par endpoint

### Validation des Données
- Validation des adresses MAC
- Contrôle des plages de valeurs des capteurs
- Sanitisation des données JSON

## 📱 Intégration Frontend

### Connexion WebSocket (JavaScript)

```javascript
const socket = new WebSocket('ws://localhost:8000/ws/iot/patient123/');

socket.onopen = function(event) {
    console.log('Connexion WebSocket établie');
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Données reçues:', data);
};

socket.onerror = function(error) {
    console.error('Erreur WebSocket:', error);
};
```

### Envoi de Données

```javascript
const sensorData = {
    type: 'sensor_data',
    device_mac: 'AA:BB:CC:DD:EE:FF',
    data: {
        temperature: 36.5,
        heart_rate: 75
    }
};

socket.send(JSON.stringify(sensorData));
```

## 🔧 Configuration ESP32

### Exemple de Code Arduino

```cpp
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

WebSocketsClient webSocket;

void setup() {
    // Configuration WiFi
    WiFi.begin("SSID", "PASSWORD");
    
    // Configuration WebSocket
    webSocket.begin("192.168.1.100", 8000, "/ws/iot/patient123/");
    webSocket.onEvent(webSocketEvent);
}

void loop() {
    webSocket.loop();
    
    // Lecture des capteurs
    float temperature = readTemperature();
    int heartRate = readHeartRate();
    
    // Envoi des données
    sendSensorData(temperature, heartRate);
    
    delay(5000); // Envoi toutes les 5 secondes
}

void sendSensorData(float temp, int hr) {
    DynamicJsonDocument doc(1024);
    doc["type"] = "sensor_data";
    doc["device_mac"] = WiFi.macAddress();
    doc["data"]["temperature"] = temp;
    doc["data"]["heart_rate"] = hr;
    doc["data"]["timestamp"] = millis();
    
    String payload;
    serializeJson(doc, payload);
    webSocket.sendTXT(payload);
}
```

## 📊 Monitoring et Logs

### Logs Django
- Connexions/déconnexions WebSocket
- Erreurs de validation des données
- Alertes générées

### Métriques Disponibles
- Nombre de dispositifs connectés
- Fréquence des données reçues
- Temps de réponse des API
- Alertes par niveau de criticité

## 🐛 Dépannage

### Problèmes Courants

1. **Redis non démarré**
   - Erreur : `Connection refused`
   - Solution : Démarrer Redis avec `redis-server`

2. **Migrations non appliquées**
   - Erreur : `Table doesn't exist`
   - Solution : `python manage.py migrate`

3. **WebSocket ne se connecte pas**
   - Vérifier l'URL et le port
   - Contrôler les paramètres CORS
   - Vérifier l'authentification

### Commandes de Debug

```bash
# Vérifier les migrations
python manage.py showmigrations

# Tester la connexion Redis
redis-cli ping

# Logs en temps réel
python manage.py runserver --verbosity=2
```

## 📈 Évolutions Futures

### Fonctionnalités Prévues
1. **Clustering Redis** pour la haute disponibilité
2. **Compression des données** WebSocket
3. **Authentification par certificats** pour ESP32
4. **Dashboard de monitoring** avancé
5. **API GraphQL** pour les requêtes complexes

### Optimisations
1. **Cache des données** fréquemment accédées
2. **Pagination** des listes d'alertes
3. **Archivage automatique** des anciennes données
4. **Load balancing** pour multiple serveurs

---

## 📞 Support

Pour toute question ou problème :
1. Consulter les logs Django
2. Vérifier la configuration Redis
3. Tester les endpoints API avec Postman
4. Contrôler les connexions WebSocket avec les outils de développement du navigateur

**Date de création :** 29 Août 2025  
**Version :** 1.0  
**Auteur :** Assistant IA - Projet FAJMA