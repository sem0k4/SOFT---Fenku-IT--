# Architecture de Connexion IoT Distante pour FAJMA

## Vue d'ensemble

Ce document propose une architecture complète pour connecter les objets IoT de santé distants au serveur FAJMA, permettant la téléconsultation et le monitoring en temps réel des patients.

## 1. Architecture Actuelle Analysée

### Modèles de données existants :
- **CapteurIoT** : Gestion des capteurs avec statut (actif/inactif/en panne)
- **Consultation** : Liaison capteur-patient-médecin avec session vidéo
- **Patient** : Informations complètes du patient
- **Medecin** : Gestion des praticiens

### API REST existante :
- ViewSet pour CapteurIoT avec permissions IsOwnerOrMedecin
- Service IoT frontend avec méthodes CRUD
- Authentification JWT sécurisée

## 2. Architecture Proposée pour IoT Distant

### 2.1 Couche de Communication

#### A. Protocoles de Communication

**Pour objets IoT fixes (domicile) :**
- **WiFi + HTTPS** : Connexion directe via API REST
- **4G/5G + MQTT** : Pour zones avec WiFi instable
- **LoRaWAN** : Pour zones rurales (longue portée, faible consommation)

**Pour objets IoT mobiles :**
- **Bluetooth Low Energy (BLE)** → Smartphone → API
- **4G/5G intégré** : Connexion directe pour objets autonomes
- **NB-IoT** : Pour capteurs à très faible consommation

#### B. Gateway IoT

```
Capteurs IoT → Gateway Local → Internet → Serveur FAJMA
                    ↓
            - Agrégation données
            - Chiffrement local
            - Cache offline
            - Compression
```

### 2.2 Architecture Serveur

#### A. Microservices proposés

1. **IoT Data Collector Service**
   - Réception données temps réel
   - Validation et normalisation
   - Routage vers base de données

2. **Real-time Processing Service**
   - Analyse des seuils critiques
   - Génération d'alertes automatiques
   - Notifications push médecins

3. **Telemedicine Gateway**
   - Gestion sessions vidéo
   - Synchronisation données IoT/consultation
   - Enregistrement consultations

#### B. Base de données étendue

```sql
-- Extension du modèle CapteurIoT
ALTER TABLE capteuriot ADD COLUMN (
    mac_address VARCHAR(17) UNIQUE,
    protocol_type ENUM('HTTPS', 'MQTT', 'LoRaWAN', 'BLE'),
    last_heartbeat TIMESTAMP,
    battery_level INT,
    firmware_version VARCHAR(20),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8)
);

-- Nouvelle table pour données temps réel
CREATE TABLE sensor_data (
    data_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    capteur_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_type VARCHAR(50), -- 'heart_rate', 'blood_pressure', 'spo2', etc.
    value DECIMAL(10,3),
    unit VARCHAR(10),
    quality_score TINYINT, -- 0-100 qualité du signal
    FOREIGN KEY (capteur_id) REFERENCES capteuriot(capteur_id)
);

-- Table pour alertes automatiques
CREATE TABLE iot_alerts (
    alert_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    capteur_id INT,
    patient_id INT,
    alert_type ENUM('CRITICAL', 'WARNING', 'INFO'),
    message TEXT,
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capteur_id) REFERENCES capteuriot(capteur_id),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);
```

### 2.3 Sécurité et Authentification

#### A. Authentification des objets IoT

1. **Certificats X.509** pour objets fixes
2. **Clés API rotatives** pour objets mobiles
3. **Device fingerprinting** pour validation

#### B. Chiffrement des données

- **TLS 1.3** pour transport
- **AES-256** pour stockage
- **End-to-end encryption** pour données critiques

### 2.4 Gestion de la Distance et Connectivité

#### A. Stratégies par zone géographique

**Zone urbaine (< 10km hôpital) :**
- WiFi domestique + 4G backup
- Latence < 100ms
- Monitoring temps réel

**Zone semi-urbaine (10-50km) :**
- 4G/5G principal
- LoRaWAN backup
- Synchronisation périodique

**Zone rurale (> 50km) :**
- LoRaWAN + satellite backup
- Store-and-forward
- Alertes critiques prioritaires

#### B. Gestion de la connectivité intermittente

```javascript
// Exemple de logique de reconnexion
class IoTConnectivityManager {
    constructor() {
        this.retryIntervals = [1000, 5000, 15000, 60000]; // ms
        this.maxRetries = 4;
        this.offlineBuffer = [];
    }
    
    async sendData(data) {
        if (this.isOnline()) {
            await this.transmitData(data);
            await this.flushOfflineBuffer();
        } else {
            this.bufferData(data);
            this.attemptReconnection();
        }
    }
}
```

## 3. Intégration Téléconsultation

### 3.1 Flux de données en temps réel

```
Capteur IoT → WebSocket → Dashboard Médecin
     ↓              ↓
Base données ← Enregistrement consultation
```

### 3.2 Interface médecin enrichie

- **Dashboard temps réel** : Graphiques vitaux live
- **Alertes contextuelles** : Seuils personnalisés par patient
- **Historique comparatif** : Évolution sur 7/30 jours
- **Contrôle à distance** : Calibrage capteurs

### 3.3 Synchronisation consultation

```python
# Extension du modèle Consultation
class ConsultationIoT(models.Model):
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE)
    real_time_data = models.JSONField()  # Données IoT pendant consultation
    data_quality_score = models.IntegerField()  # Score qualité globale
    anomalies_detected = models.JSONField(default=list)  # Anomalies détectées
    
    class Meta:
        db_table = 'consultation_iot'
```

## 4. Protocoles de Communication Détaillés

### 4.1 MQTT pour IoT Médical

**Topics structure :**
```
fajma/patient/{patient_id}/sensor/{sensor_id}/data
fajma/patient/{patient_id}/sensor/{sensor_id}/status
fajma/patient/{patient_id}/alerts/critical
fajma/consultation/{consultation_id}/realtime
```

**QoS Levels :**
- QoS 0 : Données non critiques (température ambiante)
- QoS 1 : Données vitales (rythme cardiaque)
- QoS 2 : Alertes critiques (arrêt cardiaque)

### 4.2 WebSocket pour temps réel

```javascript
// Client médecin
const consultationSocket = new WebSocket(
    `wss://api.fajma.com/ws/consultation/${consultationId}/`
);

consultationSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateVitalSigns(data.sensor_data);
    checkAlerts(data.alerts);
};
```

## 5. Gestion des Pannes et Redondance

### 5.1 Détection de pannes

- **Heartbeat** : Signal toutes les 30 secondes
- **Watchdog** : Redémarrage automatique
- **Health checks** : Validation données cohérentes

### 5.2 Stratégies de backup

1. **Capteur principal + backup** : Redondance matérielle
2. **Multi-protocoles** : WiFi + 4G simultanés
3. **Edge computing** : Traitement local critique

## 6. Monitoring et Maintenance

### 6.1 Dashboard administrateur

- **État réseau IoT** : Carte des capteurs actifs
- **Statistiques trafic** : Bande passante utilisée
- **Alertes système** : Pannes détectées
- **Maintenance prédictive** : Batterie faible, calibrage

### 6.2 Mise à jour OTA (Over-The-Air)

```python
# Service de mise à jour firmware
class FirmwareUpdateService:
    def schedule_update(self, sensor_id, firmware_version):
        # Planifier mise à jour pendant maintenance
        pass
    
    def rollback_firmware(self, sensor_id):
        # Retour version précédente en cas d'échec
        pass
```

## 7. Conformité et Réglementation

### 7.1 Standards médicaux

- **ISO 27799** : Sécurité informatique santé
- **IEC 62304** : Logiciels dispositifs médicaux
- **DICOM** : Imagerie médicale numérique

### 7.2 Protection des données

- **RGPD** : Consentement explicite patients
- **Anonymisation** : Données recherche
- **Audit trail** : Traçabilité accès données

## 8. Coûts et ROI

### 8.1 Estimation coûts infrastructure

- **Serveurs cloud** : 500€/mois (auto-scaling)
- **Connectivité IoT** : 2€/capteur/mois
- **Certificats SSL** : 200€/an
- **Développement** : 3 mois développeur senior

### 8.2 Bénéfices attendus

- **Réduction hospitalisations** : -30% urgences évitables
- **Détection précoce** : +50% pathologies chroniques
- **Satisfaction patients** : +40% suivi domicile
- **Efficacité médecins** : +25% patients suivis

## Conclusion

Cette architecture propose une solution complète et évolutive pour connecter les objets IoT de santé distants au système FAJMA. Elle prend en compte les contraintes techniques, sécuritaires et réglementaires tout en optimisant l'expérience utilisateur pour les patients et médecins.

La mise en œuvre progressive permettra de valider chaque composant avant déploiement complet, garantissant la fiabilité du système de téléconsultation enrichi.