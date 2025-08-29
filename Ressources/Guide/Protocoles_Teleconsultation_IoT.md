# Protocoles de Communication pour Téléconsultations IoT - FAJMA

## Vue d'ensemble

Ce document définit les protocoles de communication spécifiques pour intégrer les données IoT dans les téléconsultations, garantissant une transmission fiable, sécurisée et en temps réel des données vitales.

## 1. Architecture de Communication Globale

```
Capteur IoT → Gateway → Internet → Load Balancer → API Gateway → Microservices
     ↓                                    ↓              ↓
Patient App ←→ WebRTC ←→ Médecin Dashboard ←→ WebSocket ←→ IoT Data Stream
```

## 2. Protocoles par Couche

### 2.1 Couche Physique et Liaison

#### A. Capteurs Domicile (Fixes)
**Protocole Principal : WiFi + HTTPS/2**
```json
{
  "protocol": "HTTPS/2",
  "encryption": "TLS 1.3",
  "compression": "gzip",
  "keepalive": 30,
  "timeout": 5000,
  "retry_policy": {
    "max_retries": 3,
    "backoff": "exponential",
    "base_delay": 1000
  }
}
```

**Protocole Backup : 4G + MQTT**
```json
{
  "protocol": "MQTT 5.0",
  "broker": "mqtts://iot.fajma.com:8883",
  "qos_levels": {
    "vital_signs": 1,
    "alerts": 2,
    "status": 0
  },
  "keep_alive": 60,
  "clean_session": false
}
```

#### B. Capteurs Mobiles
**Protocole : BLE → Smartphone → API**
```json
{
  "ble_config": {
    "service_uuid": "0000180D-0000-1000-8000-00805F9B34FB",
    "characteristic_uuid": "00002A37-0000-1000-8000-00805F9B34FB",
    "connection_interval": 100,
    "supervision_timeout": 4000
  },
  "smartphone_relay": {
    "protocol": "HTTPS",
    "endpoint": "/api/v1/iot/mobile-data",
    "batch_size": 10,
    "flush_interval": 5000
  }
}
```

### 2.2 Couche Réseau et Transport

#### A. Format des Messages IoT

**Message Standard :**
```json
{
  "header": {
    "message_id": "uuid-v4",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "device_id": "FAJMA-IOT-001",
    "patient_id": 12345,
    "message_type": "VITAL_SIGNS",
    "protocol_version": "1.0",
    "checksum": "sha256-hash"
  },
  "payload": {
    "measurements": [
      {
        "type": "heart_rate",
        "value": 72,
        "unit": "bpm",
        "quality": 95,
        "timestamp": "2024-01-15T10:30:00.000Z"
      },
      {
        "type": "blood_pressure",
        "value": {
          "systolic": 120,
          "diastolic": 80
        },
        "unit": "mmHg",
        "quality": 98,
        "timestamp": "2024-01-15T10:30:00.000Z"
      }
    ],
    "device_status": {
      "battery_level": 85,
      "signal_strength": -45,
      "last_calibration": "2024-01-14T08:00:00.000Z"
    }
  },
  "signature": "digital-signature"
}
```

**Message d'Alerte Critique :**
```json
{
  "header": {
    "message_id": "uuid-v4",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "device_id": "FAJMA-IOT-001",
    "patient_id": 12345,
    "message_type": "CRITICAL_ALERT",
    "priority": "URGENT",
    "protocol_version": "1.0"
  },
  "payload": {
    "alert_type": "CARDIAC_ARRHYTHMIA",
    "severity": "HIGH",
    "description": "Rythme cardiaque irrégulier détecté",
    "measurements": {
      "heart_rate": 180,
      "heart_rate_variability": 0.02,
      "confidence": 0.95
    },
    "recommended_action": "IMMEDIATE_MEDICAL_ATTENTION",
    "auto_emergency_call": false
  }
}
```

#### B. Endpoints API Spécialisés

```python
# Extension des URLs Django
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# URLs IoT spécifiques téléconsultation
iot_patterns = [
    # Réception données temps réel
    path('realtime-data/', views.RealtimeDataView.as_view(), name='realtime-data'),
    
    # Stream WebSocket pour consultation
    path('consultation/<int:consultation_id>/stream/', 
         views.ConsultationStreamView.as_view(), name='consultation-stream'),
    
    # Alertes critiques
    path('alerts/critical/', views.CriticalAlertView.as_view(), name='critical-alerts'),
    
    # Contrôle à distance capteurs
    path('sensors/<int:sensor_id>/control/', 
         views.SensorControlView.as_view(), name='sensor-control'),
    
    # Calibrage automatique
    path('sensors/<int:sensor_id>/calibrate/', 
         views.SensorCalibrateView.as_view(), name='sensor-calibrate'),
]

urlpatterns = [
    path('api/v1/iot/', include(iot_patterns)),
    # ... autres URLs
]
```

### 2.3 Couche Application - Téléconsultation

#### A. Protocole WebRTC + IoT Sync

**Configuration WebRTC enrichie :**
```javascript
class TelemedicineSession {
    constructor(consultationId, patientId) {
        this.consultationId = consultationId;
        this.patientId = patientId;
        this.iotSocket = null;
        this.webrtcConnection = null;
        this.vitalSignsBuffer = [];
    }
    
    async initializeSession() {
        // 1. Établir connexion WebRTC
        await this.setupWebRTC();
        
        // 2. Connecter flux IoT
        await this.connectIoTStream();
        
        // 3. Synchroniser les flux
        this.synchronizeStreams();
    }
    
    async connectIoTStream() {
        this.iotSocket = new WebSocket(
            `wss://api.fajma.com/ws/consultation/${this.consultationId}/iot/`
        );
        
        this.iotSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleIoTData(data);
        };
    }
    
    handleIoTData(data) {
        // Traitement données IoT en temps réel
        switch(data.type) {
            case 'VITAL_SIGNS':
                this.updateVitalSignsDisplay(data.payload);
                this.checkAlertThresholds(data.payload);
                break;
            case 'ALERT':
                this.displayAlert(data.payload);
                this.notifyMedecin(data.payload);
                break;
            case 'DEVICE_STATUS':
                this.updateDeviceStatus(data.payload);
                break;
        }
    }
}
```

#### B. Synchronisation Temporelle

**Protocole NTP pour synchronisation :**
```python
import ntplib
from datetime import datetime, timezone

class TimeSynchronizer:
    def __init__(self):
        self.ntp_servers = [
            'pool.ntp.org',
            'time.google.com',
            'time.cloudflare.com'
        ]
        self.max_drift = 100  # ms
    
    def get_synchronized_time(self):
        """Obtient l'heure synchronisée NTP"""
        for server in self.ntp_servers:
            try:
                client = ntplib.NTPClient()
                response = client.request(server, version=3)
                return datetime.fromtimestamp(response.tx_time, timezone.utc)
            except:
                continue
        return datetime.now(timezone.utc)  # Fallback
    
    def validate_timestamp(self, device_timestamp, tolerance_ms=1000):
        """Valide la cohérence temporelle des données IoT"""
        server_time = self.get_synchronized_time()
        device_time = datetime.fromisoformat(device_timestamp)
        drift = abs((server_time - device_time).total_seconds() * 1000)
        return drift <= tolerance_ms
```

## 3. Gestion des Sessions de Téléconsultation

### 3.1 États de Session

```python
from enum import Enum

class ConsultationState(Enum):
    SCHEDULED = "scheduled"
    CONNECTING = "connecting"
    IOT_SYNC = "iot_sync"
    ACTIVE = "active"
    PAUSED = "paused"
    RECORDING = "recording"
    ENDING = "ending"
    COMPLETED = "completed"
    FAILED = "failed"

class ConsultationSession:
    def __init__(self, consultation_id):
        self.consultation_id = consultation_id
        self.state = ConsultationState.SCHEDULED
        self.connected_devices = []
        self.data_quality_score = 0
        self.alerts_count = 0
    
    async def transition_to(self, new_state):
        """Gère les transitions d'état avec validation"""
        valid_transitions = {
            ConsultationState.SCHEDULED: [ConsultationState.CONNECTING],
            ConsultationState.CONNECTING: [ConsultationState.IOT_SYNC, ConsultationState.FAILED],
            ConsultationState.IOT_SYNC: [ConsultationState.ACTIVE, ConsultationState.FAILED],
            ConsultationState.ACTIVE: [ConsultationState.PAUSED, ConsultationState.RECORDING, ConsultationState.ENDING],
            # ... autres transitions
        }
        
        if new_state in valid_transitions.get(self.state, []):
            await self.execute_transition(new_state)
            self.state = new_state
        else:
            raise ValueError(f"Transition invalide: {self.state} → {new_state}")
```

### 3.2 Protocole de Handshake IoT-Consultation

**Séquence d'initialisation :**
```
1. Médecin → Serveur : START_CONSULTATION
2. Serveur → Patient : CONSULTATION_INVITE
3. Patient → Serveur : ACCEPT_CONSULTATION
4. Serveur → IoT Devices : ACTIVATE_MONITORING
5. IoT Devices → Serveur : DEVICE_READY
6. Serveur → Médecin : IOT_SYNC_COMPLETE
7. Médecin → Serveur : BEGIN_CONSULTATION
```

**Implémentation WebSocket :**
```python
import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ConsultationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.consultation_id = self.scope['url_route']['kwargs']['consultation_id']
        self.consultation_group = f'consultation_{self.consultation_id}'
        
        # Rejoindre le groupe de consultation
        await self.channel_layer.group_add(
            self.consultation_group,
            self.channel_name
        )
        await self.accept()
        
        # Initialiser la synchronisation IoT
        await self.initialize_iot_sync()
    
    async def initialize_iot_sync(self):
        """Initialise la synchronisation avec les capteurs IoT"""
        # Récupérer les capteurs du patient
        sensors = await self.get_patient_sensors()
        
        # Activer le monitoring
        for sensor in sensors:
            await self.activate_sensor_monitoring(sensor)
        
        # Notifier le médecin que l'IoT est prêt
        await self.send(text_data=json.dumps({
            'type': 'iot_sync_complete',
            'sensors_count': len(sensors),
            'timestamp': datetime.now().isoformat()
        }))
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'start_consultation':
            await self.start_consultation(data)
        elif message_type == 'request_sensor_data':
            await self.request_sensor_data(data)
        elif message_type == 'set_alert_threshold':
            await self.set_alert_threshold(data)
    
    async def iot_data_received(self, event):
        """Transmet les données IoT au médecin"""
        await self.send(text_data=json.dumps({
            'type': 'iot_data',
            'sensor_id': event['sensor_id'],
            'data': event['data'],
            'timestamp': event['timestamp'],
            'quality_score': event['quality_score']
        }))
```

## 4. Gestion de la Qualité de Service (QoS)

### 4.1 Priorités de Trafic

```python
class TrafficPriority(Enum):
    CRITICAL_ALERT = 1      # Alertes vitales (< 100ms)
    VITAL_SIGNS = 2         # Signes vitaux (< 500ms)
    VIDEO_AUDIO = 3         # Flux WebRTC (< 150ms)
    DEVICE_STATUS = 4       # État capteurs (< 2s)
    HISTORICAL_DATA = 5     # Données historiques (< 10s)

class QoSManager:
    def __init__(self):
        self.priority_queues = {
            priority: asyncio.Queue() for priority in TrafficPriority
        }
        self.bandwidth_limits = {
            TrafficPriority.CRITICAL_ALERT: float('inf'),  # Pas de limite
            TrafficPriority.VITAL_SIGNS: 1024 * 1024,     # 1 MB/s
            TrafficPriority.VIDEO_AUDIO: 5 * 1024 * 1024, # 5 MB/s
            TrafficPriority.DEVICE_STATUS: 64 * 1024,     # 64 KB/s
            TrafficPriority.HISTORICAL_DATA: 256 * 1024   # 256 KB/s
        }
    
    async def enqueue_message(self, message, priority):
        """Ajoute un message à la queue appropriée"""
        await self.priority_queues[priority].put(message)
    
    async def process_queues(self):
        """Traite les messages par ordre de priorité"""
        while True:
            for priority in TrafficPriority:
                queue = self.priority_queues[priority]
                if not queue.empty():
                    message = await queue.get()
                    await self.transmit_message(message, priority)
            await asyncio.sleep(0.001)  # 1ms
```

### 4.2 Adaptation Dynamique de la Bande Passante

```python
class BandwidthAdapter:
    def __init__(self):
        self.current_bandwidth = 0
        self.target_bandwidth = 0
        self.congestion_threshold = 0.8
        self.adaptation_history = []
    
    def measure_bandwidth(self):
        """Mesure la bande passante disponible"""
        # Implémentation de mesure réseau
        pass
    
    def adapt_quality(self, available_bandwidth):
        """Adapte la qualité selon la bande passante"""
        if available_bandwidth < 1024 * 1024:  # < 1 Mbps
            return {
                'video_quality': 'low',
                'iot_sampling_rate': 0.5,  # Réduire fréquence
                'compression': 'high'
            }
        elif available_bandwidth < 5 * 1024 * 1024:  # < 5 Mbps
            return {
                'video_quality': 'medium',
                'iot_sampling_rate': 1.0,
                'compression': 'medium'
            }
        else:
            return {
                'video_quality': 'high',
                'iot_sampling_rate': 2.0,  # Augmenter fréquence
                'compression': 'low'
            }
```

## 5. Protocoles de Sécurité Spécifiques

### 5.1 Authentification Multi-Facteurs pour IoT

```python
class IoTAuthenticator:
    def __init__(self):
        self.device_certificates = {}
        self.session_tokens = {}
        self.biometric_validators = {}
    
    async def authenticate_device(self, device_id, certificate, biometric_data=None):
        """Authentification multi-facteurs pour capteurs IoT"""
        # 1. Validation certificat X.509
        if not self.validate_certificate(certificate):
            raise AuthenticationError("Certificat invalide")
        
        # 2. Validation biométrique (optionnelle)
        if biometric_data:
            if not await self.validate_biometric(device_id, biometric_data):
                raise AuthenticationError("Validation biométrique échouée")
        
        # 3. Génération token de session
        session_token = self.generate_session_token(device_id)
        self.session_tokens[device_id] = session_token
        
        return session_token
    
    def validate_certificate(self, certificate):
        """Valide le certificat X.509 du capteur"""
        # Implémentation validation certificat
        return True
    
    async def validate_biometric(self, device_id, biometric_data):
        """Valide les données biométriques (empreinte, rythme cardiaque)"""
        # Implémentation validation biométrique
        return True
```

### 5.2 Chiffrement End-to-End pour Données Critiques

```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class E2EEncryption:
    def __init__(self, patient_id, consultation_id):
        self.patient_id = patient_id
        self.consultation_id = consultation_id
        self.session_key = self.derive_session_key()
        self.cipher = Fernet(self.session_key)
    
    def derive_session_key(self):
        """Dérive une clé de session unique"""
        password = f"{self.patient_id}:{self.consultation_id}".encode()
        salt = b'fajma_iot_salt_2024'  # En production, utiliser un salt aléatoire
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        return base64.urlsafe_b64encode(kdf.derive(password))
    
    def encrypt_vital_data(self, data):
        """Chiffre les données vitales critiques"""
        json_data = json.dumps(data).encode()
        encrypted_data = self.cipher.encrypt(json_data)
        return base64.b64encode(encrypted_data).decode()
    
    def decrypt_vital_data(self, encrypted_data):
        """Déchiffre les données vitales"""
        encrypted_bytes = base64.b64decode(encrypted_data.encode())
        decrypted_data = self.cipher.decrypt(encrypted_bytes)
        return json.loads(decrypted_data.decode())
```

## 6. Gestion des Erreurs et Récupération

### 6.1 Stratégies de Retry et Fallback

```python
import asyncio
from typing import Callable, Any

class ResilientCommunication:
    def __init__(self):
        self.max_retries = 3
        self.base_delay = 1.0
        self.max_delay = 30.0
        self.backoff_factor = 2.0
    
    async def execute_with_retry(self, func: Callable, *args, **kwargs) -> Any:
        """Exécute une fonction avec retry automatique"""
        last_exception = None
        
        for attempt in range(self.max_retries + 1):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                
                if attempt < self.max_retries:
                    delay = min(
                        self.base_delay * (self.backoff_factor ** attempt),
                        self.max_delay
                    )
                    await asyncio.sleep(delay)
                    continue
                else:
                    # Dernier essai échoué, déclencher fallback
                    await self.trigger_fallback(func.__name__, e)
                    raise e
    
    async def trigger_fallback(self, operation_name: str, error: Exception):
        """Déclenche les mécanismes de fallback"""
        if operation_name == 'send_vital_data':
            # Sauvegarder en local pour transmission ultérieure
            await self.store_offline_data()
        elif operation_name == 'establish_video_connection':
            # Basculer en mode audio uniquement
            await self.switch_to_audio_only()
        elif operation_name == 'sync_iot_devices':
            # Utiliser les dernières données connues
            await self.use_cached_data()
```

### 6.2 Monitoring et Alertes Système

```python
class SystemMonitor:
    def __init__(self):
        self.metrics = {
            'connection_quality': 0,
            'data_loss_rate': 0,
            'latency_avg': 0,
            'device_failures': 0
        }
        self.alert_thresholds = {
            'connection_quality': 0.7,
            'data_loss_rate': 0.05,
            'latency_avg': 1000,  # ms
            'device_failures': 2
        }
    
    async def check_system_health(self):
        """Vérifie la santé globale du système"""
        alerts = []
        
        for metric, value in self.metrics.items():
            threshold = self.alert_thresholds[metric]
            
            if metric in ['data_loss_rate', 'latency_avg', 'device_failures']:
                if value > threshold:
                    alerts.append(f"{metric} dépasse le seuil: {value} > {threshold}")
            else:  # connection_quality
                if value < threshold:
                    alerts.append(f"{metric} en dessous du seuil: {value} < {threshold}")
        
        if alerts:
            await self.send_system_alerts(alerts)
        
        return len(alerts) == 0
    
    async def send_system_alerts(self, alerts):
        """Envoie les alertes système aux administrateurs"""
        # Implémentation notification administrateurs
        pass
```

## 7. Tests et Validation

### 7.1 Tests de Charge IoT

```python
import asyncio
import aiohttp
import time
from concurrent.futures import ThreadPoolExecutor

class IoTLoadTester:
    def __init__(self, base_url, concurrent_devices=100):
        self.base_url = base_url
        self.concurrent_devices = concurrent_devices
        self.results = []
    
    async def simulate_device(self, device_id, duration_seconds=300):
        """Simule un capteur IoT pendant une durée donnée"""
        async with aiohttp.ClientSession() as session:
            start_time = time.time()
            
            while time.time() - start_time < duration_seconds:
                # Générer données vitales simulées
                vital_data = self.generate_vital_data(device_id)
                
                try:
                    async with session.post(
                        f"{self.base_url}/api/v1/iot/realtime-data/",
                        json=vital_data,
                        timeout=5
                    ) as response:
                        if response.status == 200:
                            self.results.append({
                                'device_id': device_id,
                                'timestamp': time.time(),
                                'status': 'success',
                                'latency': response.headers.get('X-Response-Time')
                            })
                        else:
                            self.results.append({
                                'device_id': device_id,
                                'timestamp': time.time(),
                                'status': 'error',
                                'error_code': response.status
                            })
                except Exception as e:
                    self.results.append({
                        'device_id': device_id,
                        'timestamp': time.time(),
                        'status': 'exception',
                        'error': str(e)
                    })
                
                # Attendre avant la prochaine mesure (1 Hz)
                await asyncio.sleep(1)
    
    async def run_load_test(self, duration_seconds=300):
        """Lance le test de charge avec plusieurs capteurs simulés"""
        tasks = []
        
        for device_id in range(self.concurrent_devices):
            task = asyncio.create_task(
                self.simulate_device(f"TEST-DEVICE-{device_id:03d}", duration_seconds)
            )
            tasks.append(task)
        
        await asyncio.gather(*tasks)
        return self.analyze_results()
    
    def analyze_results(self):
        """Analyse les résultats du test de charge"""
        total_requests = len(self.results)
        successful_requests = len([r for r in self.results if r['status'] == 'success'])
        error_rate = (total_requests - successful_requests) / total_requests
        
        return {
            'total_requests': total_requests,
            'successful_requests': successful_requests,
            'error_rate': error_rate,
            'concurrent_devices': self.concurrent_devices
        }
```

## 8. Métriques et KPIs

### 8.1 Indicateurs de Performance

```python
class PerformanceMetrics:
    def __init__(self):
        self.metrics = {
            # Latence
            'iot_to_server_latency': [],
            'server_to_medecin_latency': [],
            'end_to_end_latency': [],
            
            # Fiabilité
            'data_delivery_rate': 0,
            'connection_uptime': 0,
            'device_availability': {},
            
            # Qualité
            'data_quality_score': [],
            'alert_accuracy': 0,
            'false_positive_rate': 0,
            
            # Utilisation
            'bandwidth_usage': [],
            'concurrent_consultations': 0,
            'active_devices': 0
        }
    
    def calculate_kpis(self):
        """Calcule les KPIs principaux"""
        return {
            'avg_end_to_end_latency': np.mean(self.metrics['end_to_end_latency']),
            'p95_latency': np.percentile(self.metrics['end_to_end_latency'], 95),
            'data_delivery_rate': self.metrics['data_delivery_rate'],
            'system_availability': self.metrics['connection_uptime'],
            'avg_data_quality': np.mean(self.metrics['data_quality_score']),
            'alert_precision': 1 - self.metrics['false_positive_rate']
        }
```

## Conclusion

Ces protocoles de communication définissent un framework complet pour intégrer les données IoT dans les téléconsultations FAJMA. Ils garantissent :

- **Fiabilité** : Mécanismes de retry et fallback
- **Sécurité** : Chiffrement end-to-end et authentification multi-facteurs
- **Performance** : QoS adaptatif et optimisation bande passante
- **Scalabilité** : Architecture microservices et load balancing
- **Monitoring** : Métriques temps réel et alertes proactives

L'implémentation progressive de ces protocoles permettra d'assurer une téléconsultation enrichie et fiable avec intégration IoT complète.