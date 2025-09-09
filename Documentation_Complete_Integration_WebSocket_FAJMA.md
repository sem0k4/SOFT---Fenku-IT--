# Documentation Complète : Intégration WebSocket dans FAJMA

## Vue d'ensemble de l'Architecture

Cette documentation détaille toutes les modifications apportées au système FAJMA pour intégrer la communication temps réel via WebSocket, depuis l'installation de Django Channels jusqu'à l'interface utilisateur finale.

## 1. Installation et Configuration Backend

### 1.1 Installation de Django Channels

```bash
pip install channels
pip install channels-redis
```

### 1.2 Configuration dans settings.py

```python
# Ajout dans INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',  # ← NOUVEAU
    'fajma',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
]

# Configuration ASGI
ASGI_APPLICATION = 'core.asgi.application'

# Configuration Redis pour les WebSockets
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

### 1.3 Modification du fichier ASGI

**Fichier : `backend/core/asgi.py`**

```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from fajma.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
```

## 2. Création des Consumers WebSocket

### 2.1 Consumer IoT Principal

**Fichier : `backend/fajma/consumers.py`**

```python
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Patient, DispositivesIoT, DonneesCapteursIoT, AlertesIoT

class IoTConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.patient_id = self.scope['url_route']['kwargs']['patient_id']
        self.room_group_name = f'iot_patient_{self.patient_id}'
        
        # Authentification JWT
        token = self.scope['query_string'].decode().split('token=')[1] if 'token=' in self.scope['query_string'].decode() else None
        
        if not token or not await self.authenticate_token(token):
            await self.close()
            return
        
        # Rejoindre le groupe
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Envoyer les dernières données
        await self.send_latest_data()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'iot_data':
                await self.handle_iot_data(data)
            elif message_type == 'get_latest':
                await self.send_latest_data()
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Format JSON invalide'
            }))
    
    async def handle_iot_data(self, data):
        # Sauvegarder les données IoT
        await self.save_iot_data(data)
        
        # Diffuser aux autres clients
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'iot_data_update',
                'data': data
            }
        )
    
    async def iot_data_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'iot_data',
            'data': event['data']
        }))
```

### 2.2 Routing WebSocket

**Fichier : `backend/fajma/routing.py`**

```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/iot/(?P<patient_id>\w+)/$', consumers.IoTConsumer.as_asgi()),
    re_path(r'ws/alerts/(?P<patient_id>\w+)/$', consumers.AlertConsumer.as_asgi()),
]
```

## 3. Modèles de Données IoT

### 3.1 Modèles Backend

**Fichier : `backend/fajma/models.py` (ajouts)**

```python
class DispositivesIoT(models.Model):
    nom = models.CharField(max_length=100)
    type_dispositif = models.CharField(max_length=50)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    statut = models.CharField(max_length=20, default='actif')
    derniere_connexion = models.DateTimeField(auto_now=True)
    
class DonneesCapteursIoT(models.Model):
    dispositif = models.ForeignKey(DispositivesIoT, on_delete=models.CASCADE)
    type_donnee = models.CharField(max_length=50)  # 'spo2', 'temperature', 'heart_rate'
    valeur = models.FloatField()
    unite = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    
class AlertesIoT(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    type_alerte = models.CharField(max_length=50)
    message = models.TextField()
    niveau_gravite = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    acquittee = models.BooleanField(default=False)
```

## 4. API REST pour IoT

### 4.1 Serializers IoT

**Fichier : `backend/fajma/serializers_iot.py`**

```python
from rest_framework import serializers
from .models import DispositivesIoT, DonneesCapteursIoT, AlertesIoT

class DispositivesIoTSerializer(serializers.ModelSerializer):
    class Meta:
        model = DispositivesIoT
        fields = '__all__'

class DonneesCapteursIoTSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonneesCapteursIoT
        fields = '__all__'

class AlertesIoTSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertesIoT
        fields = '__all__'
```

### 4.2 Vues API IoT

**Fichier : `backend/fajma/views_iot.py`**

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DispositivesIoT, DonneesCapteursIoT, AlertesIoT
from .serializers_iot import *

class DispositivesIoTViewSet(viewsets.ModelViewSet):
    queryset = DispositivesIoT.objects.all()
    serializer_class = DispositivesIoTSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        dispositif = self.get_object()
        dispositif.statut = request.data.get('statut', dispositif.statut)
        dispositif.save()
        return Response({'status': 'Statut mis à jour'})

class DonneesCapteursIoTViewSet(viewsets.ModelViewSet):
    queryset = DonneesCapteursIoT.objects.all()
    serializer_class = DonneesCapteursIoTSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def latest_data(self, request):
        patient_id = request.query_params.get('patient_id')
        if not patient_id:
            return Response({'error': 'patient_id requis'}, status=400)
        
        latest_data = {}
        for type_donnee in ['spo2', 'temperature', 'heart_rate']:
            donnee = DonneesCapteursIoT.objects.filter(
                dispositif__patient_id=patient_id,
                type_donnee=type_donnee
            ).order_by('-timestamp').first()
            
            if donnee:
                latest_data[type_donnee] = {
                    'valeur': donnee.valeur,
                    'unite': donnee.unite,
                    'timestamp': donnee.timestamp
                }
        
        return Response(latest_data)
```

## 5. Frontend React - Services WebSocket

### 5.1 Service WebSocket Principal

**Fichier : `frontend/src/services/websocketService.js`**

```javascript
class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.listeners = new Map();
  }

  connect(patientId, token) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://127.0.0.1:8000/ws/iot/${patientId}/?token=${token}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log('WebSocket connecté');
          this.reconnectAttempts = 0;
          this.notifyListeners('connected', { status: 'connected' });
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.notifyListeners('message', data);
          } catch (error) {
            console.error('Erreur parsing message WebSocket:', error);
          }
        };

        this.socket.onclose = (event) => {
          console.log('WebSocket fermé:', event.code, event.reason);
          this.notifyListeners('disconnected', { status: 'disconnected' });
          
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect(patientId, token);
          }
        };

        this.socket.onerror = (error) => {
          console.error('Erreur WebSocket:', error);
          this.notifyListeners('error', { error });
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket non connecté');
    }
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }

  scheduleReconnect(patientId, token) {
    this.reconnectAttempts++;
    console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      this.connect(patientId, token);
    }, this.reconnectInterval);
  }
}

export default new WebSocketService();
```

### 5.2 Hook React pour WebSocket IoT

**Fichier : `frontend/src/hooks/useIoTWebSocket.js`**

```javascript
import { useState, useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';
import { AuthService } from '../services';

export const useIoTWebSocket = (patientId) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [iotData, setIoTData] = useState({
    spo2: null,
    temperature: null,
    heart_rate: null
  });
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      setConnectionStatus('connecting');
      await websocketService.connect(patientId, token);
    } catch (error) {
      console.error('Erreur connexion WebSocket:', error);
      setError(error.message);
      setConnectionStatus('error');
    }
  }, [patientId]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setConnectionStatus('disconnected');
  }, []);

  const sendIoTData = useCallback((data) => {
    websocketService.sendMessage({
      type: 'iot_data',
      ...data
    });
  }, []);

  const requestLatestData = useCallback(() => {
    websocketService.sendMessage({
      type: 'get_latest'
    });
  }, []);

  useEffect(() => {
    const handleConnection = () => {
      setConnectionStatus('connected');
      setError(null);
    };

    const handleDisconnection = () => {
      setConnectionStatus('disconnected');
    };

    const handleMessage = (data) => {
      if (data.type === 'iot_data') {
        setIoTData(prevData => ({
          ...prevData,
          ...data.data
        }));
      } else if (data.type === 'alert') {
        setAlerts(prevAlerts => [data.data, ...prevAlerts]);
      }
    };

    const handleError = (errorData) => {
      setError(errorData.error?.message || 'Erreur WebSocket');
      setConnectionStatus('error');
    };

    websocketService.addListener('connected', handleConnection);
    websocketService.addListener('disconnected', handleDisconnection);
    websocketService.addListener('message', handleMessage);
    websocketService.addListener('error', handleError);

    return () => {
      websocketService.removeListener('connected', handleConnection);
      websocketService.removeListener('disconnected', handleDisconnection);
      websocketService.removeListener('message', handleMessage);
      websocketService.removeListener('error', handleError);
    };
  }, []);

  return {
    connectionStatus,
    iotData,
    alerts,
    error,
    connect,
    disconnect,
    sendIoTData,
    requestLatestData
  };
};
```

## 6. Interface Utilisateur React

### 6.1 Composant Principal IoT FAJMA

**Fichier : `frontend/src/scenes/iot-fajma/index.jsx`**

```jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { Wifi, WifiOff, Refresh } from '@mui/icons-material';
import { useIoTWebSocket } from '../../hooks/useIoTWebSocket';
import VitalCard from './VitalCard';

const IotFAJMA = () => {
  const patientId = 'patient_123'; // À récupérer dynamiquement
  const {
    connectionStatus,
    iotData,
    alerts,
    error,
    connect,
    disconnect,
    requestLatestData
  } = useIoTWebSocket(patientId);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'disconnected': return 'error';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connecté';
      case 'connecting': return 'Connexion...';
      case 'disconnected': return 'Déconnecté';
      case 'error': return 'Erreur';
      default: return 'Inconnu';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête avec statut de connexion */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          IoT FAJMA - Monitoring Temps Réel
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {connectionStatus === 'connected' ? 
              <Wifi color="success" /> : 
              <WifiOff color="error" />
            }
            <Typography 
              variant="body2" 
              color={getConnectionStatusColor()}
            >
              {getConnectionStatusText()}
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              disconnect();
              setTimeout(connect, 1000);
            }}
            disabled={connectionStatus === 'connecting'}
          >
            Reconnecter
          </Button>
        </Box>
      </Box>

      {/* Alertes d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Cartes de données vitales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 3 }}>
        <VitalCard
          title="SpO2"
          value={iotData.spo2?.valeur}
          unit="%"
          icon="🫁"
          color="#2196F3"
          normalRange="95-100"
          timestamp={iotData.spo2?.timestamp}
        />
        
        <VitalCard
          title="Température Corporelle"
          value={iotData.temperature?.valeur}
          unit="°C"
          icon="🌡️"
          color="#FF9800"
          normalRange="36.1-37.2"
          timestamp={iotData.temperature?.timestamp}
        />
        
        <VitalCard
          title="Fréquence Cardiaque"
          value={iotData.heart_rate?.valeur}
          unit="bpm"
          icon="❤️"
          color="#F44336"
          normalRange="60-100"
          timestamp={iotData.heart_rate?.timestamp}
        />
      </Box>

      {/* Alertes récentes */}
      {alerts.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alertes Récentes
            </Typography>
            {alerts.slice(0, 5).map((alert, index) => (
              <Alert key={index} severity={alert.niveau_gravite} sx={{ mb: 1 }}>
                {alert.message}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default IotFAJMA;
```

### 6.2 Composant Carte Vitale

**Fichier : `frontend/src/scenes/iot-fajma/VitalCard.jsx`**

```jsx
import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const VitalCard = ({ title, value, unit, icon, color, normalRange, timestamp }) => {
  const getValueStatus = () => {
    if (!value || !normalRange) return 'unknown';
    
    const [min, max] = normalRange.split('-').map(Number);
    if (value < min) return 'low';
    if (value > max) return 'high';
    return 'normal';
  };

  const getStatusColor = () => {
    switch (getValueStatus()) {
      case 'normal': return '#4CAF50';
      case 'low': return '#2196F3';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getProgressValue = () => {
    if (!value || !normalRange) return 0;
    
    const [min, max] = normalRange.split('-').map(Number);
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };

  return (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
          <Typography variant="h4" component="span">
            {icon}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" component="div" sx={{ color: getStatusColor(), fontWeight: 'bold' }}>
            {value !== null && value !== undefined ? value : '--'}
            {value !== null && value !== undefined && (
              <Typography component="span" variant="h5" sx={{ ml: 1, color: 'text.secondary' }}>
                {unit}
              </Typography>
            )}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Plage normale: {normalRange} {unit}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={getProgressValue()} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#E0E0E0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getStatusColor()
              }
            }} 
          />
        </Box>
        
        {timestamp && (
          <Typography variant="caption" color="text.secondary">
            Dernière mise à jour: {formatDistanceToNow(new Date(timestamp), { 
              addSuffix: true, 
              locale: fr 
            })}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalCard;
```

## 7. Schéma d'Architecture Complète

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ARCHITECTURE FAJMA IoT                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────────┐
│     ESP32       │    │   BACKEND       │    │           FRONTEND              │
│   + MLX90614    │    │   Django +      │    │         React +                 │
│                 │    │   Channels      │    │        Material-UI              │
└─────────────────┘    └─────────────────┘    └─────────────────────────────────┘
         │                       │                              │
         │ WiFi/HTTP POST        │ WebSocket                    │
         │ JSON Data             │ Real-time                    │
         ▼                       ▼                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────────┐
│  API Endpoint   │◄──►│  WebSocket      │◄──►│     IoT Dashboard               │
│  /api/iot/data  │    │  Consumer       │    │   - Cartes Vitales              │
│                 │    │  (IoTConsumer)  │    │   - Statut Connexion            │
│                 │    │                 │    │   - Alertes Temps Réel          │
└─────────────────┘    └─────────────────┘    └─────────────────────────────────┘
         │                       │                              │
         ▼                       ▼                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────────┐
│   PostgreSQL    │    │     Redis       │    │      Composants React           │
│   Database      │    │   Channel       │    │   - useIoTWebSocket Hook        │
│   - Patients    │    │   Layer         │    │   - VitalCard Component         │
│   - Dispositifs │    │                 │    │   - WebSocketService            │
│   - Données IoT │    │                 │    │                                 │
│   - Alertes     │    │                 │    │                                 │
└─────────────────┘    └─────────────────┘    └─────────────────────────────────┘
```

## 8. Flux de Données Temps Réel

```
1. ESP32 collecte données (SpO2, Température, Fréquence cardiaque)
   ↓
2. Envoi HTTP POST vers /api/iot/data/
   ↓
3. Django sauvegarde en base de données
   ↓
4. Consumer WebSocket diffuse aux clients connectés
   ↓
5. Frontend React reçoit via WebSocket
   ↓
6. Mise à jour automatique de l'interface utilisateur
```

## 9. Sécurité et Authentification

### 9.1 Authentification JWT pour WebSocket

```python
# Dans le Consumer
async def authenticate_token(self, token):
    try:
        UntypedToken(token)
        return True
    except (InvalidToken, TokenError):
        return False
```

### 9.2 Permissions API REST

```python
# Toutes les vues IoT nécessitent une authentification
class DonneesCapteursIoTViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
```

## 10. Gestion des Erreurs et Reconnexion

### 10.1 Reconnexion Automatique WebSocket

```javascript
scheduleReconnect(patientId, token) {
  this.reconnectAttempts++;
  if (this.reconnectAttempts <= this.maxReconnectAttempts) {
    setTimeout(() => {
      this.connect(patientId, token);
    }, this.reconnectInterval);
  }
}
```

### 10.2 Gestion des États de Connexion

- **Connected** : WebSocket actif, données en temps réel
- **Connecting** : Tentative de connexion en cours
- **Disconnected** : Pas de connexion, données statiques
- **Error** : Erreur de connexion, affichage d'alerte

## 11. Déploiement et Configuration

### 11.1 Variables d'Environnement

```bash
# Backend
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost/fajma

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

### 11.2 Commandes de Démarrage

```bash
# Backend
cd backend
python manage.py runserver

# Frontend
cd frontend
npm run dev

# Redis (requis pour WebSocket)
redis-server
```

## Conclusion

Cette intégration complète permet une communication temps réel bidirectionnelle entre les dispositifs ESP32, le backend Django et l'interface React, offrant une expérience utilisateur fluide pour le monitoring médical IoT dans le système FAJMA.

Les principales améliorations apportées :
- Communication WebSocket temps réel
- Interface utilisateur responsive et intuitive
- Gestion robuste des erreurs et reconnexions
- Authentification sécurisée
- Architecture scalable et maintenable