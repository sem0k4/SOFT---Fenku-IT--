# Guide de Connexion Bluetooth Ordinateur-IoT pour FAJMA

## Vue d'ensemble

Ce document présente les différentes méthodes pour connecter un ordinateur aux objets IoT de santé via Bluetooth, en complément de l'application mobile React Native développée pour le système FAJMA.

## 🔧 Technologies et Protocoles

### Bluetooth Low Energy (BLE)

**Avantages :**
- Faible consommation d'énergie
- Portée jusqu'à 100 mètres
- Support natif sur la plupart des ordinateurs modernes
- Protocoles standardisés pour les dispositifs de santé

**Inconvénients :**
- Débit de données limité
- Complexité de développement
- Gestion des connexions multiples

## 💻 Solutions par Plateforme

### Windows

#### 1. API Windows Bluetooth

**Technologies :**
- Windows Runtime (WinRT) API
- Universal Windows Platform (UWP)
- Win32 Bluetooth API

**Exemple d'implémentation C# :**

```csharp
using Windows.Devices.Bluetooth;
using Windows.Devices.Bluetooth.Advertisement;
using Windows.Devices.Bluetooth.GenericAttributeProfile;

public class BluetoothManager
{
    private BluetoothLEAdvertisementWatcher watcher;
    
    public async Task StartScanAsync()
    {
        watcher = new BluetoothLEAdvertisementWatcher();
        watcher.ScanningMode = BluetoothLEScanningMode.Active;
        
        watcher.Received += OnAdvertisementReceived;
        watcher.Start();
    }
    
    private async void OnAdvertisementReceived(BluetoothLEAdvertisementWatcher sender, BluetoothLEAdvertisementReceivedEventArgs args)
    {
        var device = await BluetoothLEDevice.FromBluetoothAddressAsync(args.BluetoothAddress);
        if (device != null)
        {
            await ConnectToDevice(device);
        }
    }
    
    private async Task ConnectToDevice(BluetoothLEDevice device)
    {
        var gattResult = await device.GetGattServicesAsync();
        if (gattResult.Status == GattCommunicationStatus.Success)
        {
            foreach (var service in gattResult.Services)
            {
                await ProcessService(service);
            }
        }
    }
}
```

#### 2. Application Electron avec Node.js

**Avantages :**
- Cross-platform
- Utilisation de JavaScript/TypeScript
- Intégration facile avec l'écosystème web

**Dépendances :**
```json
{
  "dependencies": {
    "electron": "^22.0.0",
    "@abandonware/noble": "^1.9.2-15",
    "serialport": "^10.4.0"
  }
}
```

**Exemple d'implémentation :**

```javascript
const noble = require('@abandonware/noble');

class BluetoothService {
  constructor() {
    this.connectedDevices = new Map();
    this.setupNoble();
  }
  
  setupNoble() {
    noble.on('stateChange', (state) => {
      if (state === 'poweredOn') {
        this.startScanning();
      }
    });
    
    noble.on('discover', (peripheral) => {
      this.handleDeviceDiscovered(peripheral);
    });
  }
  
  startScanning() {
    const serviceUUIDs = [
      '180d', // Heart Rate
      '1810', // Blood Pressure
      '1809', // Health Thermometer
      '1808'  // Glucose
    ];
    
    noble.startScanning(serviceUUIDs, false);
  }
  
  async handleDeviceDiscovered(peripheral) {
    console.log(`Dispositif trouvé: ${peripheral.advertisement.localName}`);
    
    await this.connectToPeripheral(peripheral);
  }
  
  async connectToPeripheral(peripheral) {
    return new Promise((resolve, reject) => {
      peripheral.connect((error) => {
        if (error) {
          reject(error);
          return;
        }
        
        this.connectedDevices.set(peripheral.id, peripheral);
        this.discoverServices(peripheral);
        resolve(peripheral);
      });
    });
  }
  
  discoverServices(peripheral) {
    peripheral.discoverServices([], (error, services) => {
      if (error) {
        console.error('Erreur de découverte des services:', error);
        return;
      }
      
      services.forEach(service => {
        this.discoverCharacteristics(service);
      });
    });
  }
  
  discoverCharacteristics(service) {
    service.discoverCharacteristics([], (error, characteristics) => {
      if (error) {
        console.error('Erreur de découverte des caractéristiques:', error);
        return;
      }
      
      characteristics.forEach(characteristic => {
        if (characteristic.properties.includes('notify')) {
          this.subscribeToCharacteristic(characteristic);
        }
      });
    });
  }
  
  subscribeToCharacteristic(characteristic) {
    characteristic.subscribe((error) => {
      if (error) {
        console.error('Erreur d\'abonnement:', error);
        return;
      }
      
      characteristic.on('data', (data, isNotification) => {
        this.handleDataReceived(characteristic, data);
      });
    });
  }
  
  handleDataReceived(characteristic, data) {
    const parsedData = this.parseHealthData(characteristic.uuid, data);
    this.sendDataToFAJMA(parsedData);
  }
  
  parseHealthData(uuid, data) {
    switch (uuid) {
      case '2a37': // Heart Rate Measurement
        return this.parseHeartRateData(data);
      case '2a35': // Blood Pressure Measurement
        return this.parseBloodPressureData(data);
      case '2a1c': // Temperature Measurement
        return this.parseTemperatureData(data);
      default:
        return { raw: data.toString('hex') };
    }
  }
  
  parseHeartRateData(data) {
    const flags = data[0];
    let heartRate;
    
    if (flags & 0x01) {
      heartRate = data.readUInt16LE(1);
    } else {
      heartRate = data[1];
    }
    
    return {
      type: 'heart_rate',
      value: heartRate,
      unit: 'bpm',
      timestamp: new Date().toISOString()
    };
  }
  
  async sendDataToFAJMA(data) {
    try {
      const response = await fetch('http://localhost:8000/api/capteurs-iot/data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        console.log('Données envoyées avec succès à FAJMA');
      }
    } catch (error) {
      console.error('Erreur d\'envoi des données:', error);
    }
  }
}
```

### macOS

#### Core Bluetooth Framework

**Exemple Swift :**

```swift
import CoreBluetooth

class BluetoothManager: NSObject, CBCentralManagerDelegate, CBPeripheralDelegate {
    private var centralManager: CBCentralManager!
    private var connectedPeripherals: [CBPeripheral] = []
    
    override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil)
    }
    
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        if central.state == .poweredOn {
            startScanning()
        }
    }
    
    func startScanning() {
        let serviceUUIDs = [
            CBUUID(string: "180D"), // Heart Rate
            CBUUID(string: "1810"), // Blood Pressure
        ]
        
        centralManager.scanForPeripherals(withServices: serviceUUIDs, options: nil)
    }
    
    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        
        peripheral.delegate = self
        connectedPeripherals.append(peripheral)
        centralManager.connect(peripheral, options: nil)
    }
    
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        peripheral.discoverServices(nil)
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        guard let services = peripheral.services else { return }
        
        for service in services {
            peripheral.discoverCharacteristics(nil, for: service)
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        guard let characteristics = service.characteristics else { return }
        
        for characteristic in characteristics {
            if characteristic.properties.contains(.notify) {
                peripheral.setNotifyValue(true, for: characteristic)
            }
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        guard let data = characteristic.value else { return }
        
        let parsedData = parseHealthData(uuid: characteristic.uuid.uuidString, data: data)
        sendDataToFAJMA(data: parsedData)
    }
}
```

### Linux

#### BlueZ avec Python

**Installation :**
```bash
sudo apt-get install bluetooth bluez bluez-tools
pip install bleak pygatt
```

**Exemple Python :**

```python
import asyncio
from bleak import BleakScanner, BleakClient
import requests
import json
from datetime import datetime

class BluetoothHealthMonitor:
    def __init__(self):
        self.connected_devices = {}
        self.fajma_api_url = "http://localhost:8000/api/capteurs-iot/data/"
        self.auth_token = None
    
    async def scan_devices(self):
        """Scanner les dispositifs BLE de santé"""
        print("Scan des dispositifs Bluetooth...")
        
        devices = await BleakScanner.discover(timeout=10.0)
        health_devices = []
        
        for device in devices:
            if device.name and any(keyword in device.name.lower() 
                                 for keyword in ['heart', 'blood', 'glucose', 'temp']):
                health_devices.append(device)
                print(f"Dispositif de santé trouvé: {device.name} ({device.address})")
        
        return health_devices
    
    async def connect_to_device(self, device):
        """Se connecter à un dispositif BLE"""
        try:
            async with BleakClient(device.address) as client:
                print(f"Connecté à {device.name}")
                
                # Découvrir les services
                services = await client.get_services()
                
                for service in services:
                    print(f"Service: {service.uuid}")
                    
                    for char in service.characteristics:
                        if "notify" in char.properties:
                            await self.subscribe_to_characteristic(client, char)
                
                # Maintenir la connexion
                await asyncio.sleep(60)  # Connexion pendant 1 minute
                
        except Exception as e:
            print(f"Erreur de connexion à {device.name}: {e}")
    
    async def subscribe_to_characteristic(self, client, characteristic):
        """S'abonner aux notifications d'une caractéristique"""
        def notification_handler(sender, data):
            parsed_data = self.parse_health_data(characteristic.uuid, data)
            asyncio.create_task(self.send_to_fajma(parsed_data))
        
        await client.start_notify(characteristic, notification_handler)
        print(f"Abonné aux notifications de {characteristic.uuid}")
    
    def parse_health_data(self, uuid, data):
        """Parser les données de santé selon le type"""
        uuid_str = str(uuid).lower()
        
        if "2a37" in uuid_str:  # Heart Rate Measurement
            return self.parse_heart_rate(data)
        elif "2a35" in uuid_str:  # Blood Pressure Measurement
            return self.parse_blood_pressure(data)
        elif "2a1c" in uuid_str:  # Temperature Measurement
            return self.parse_temperature(data)
        else:
            return {
                "type": "unknown",
                "raw_data": data.hex(),
                "timestamp": datetime.now().isoformat()
            }
    
    def parse_heart_rate(self, data):
        """Parser les données de fréquence cardiaque"""
        flags = data[0]
        
        if flags & 0x01:
            heart_rate = int.from_bytes(data[1:3], byteorder='little')
        else:
            heart_rate = data[1]
        
        return {
            "type": "heart_rate",
            "value": heart_rate,
            "unit": "bpm",
            "timestamp": datetime.now().isoformat()
        }
    
    def parse_blood_pressure(self, data):
        """Parser les données de tension artérielle"""
        systolic = int.from_bytes(data[1:3], byteorder='little')
        diastolic = int.from_bytes(data[3:5], byteorder='little')
        
        return {
            "type": "blood_pressure",
            "systolic": systolic,
            "diastolic": diastolic,
            "unit": "mmHg",
            "timestamp": datetime.now().isoformat()
        }
    
    def parse_temperature(self, data):
        """Parser les données de température"""
        # Format IEEE-11073 32-bit FLOAT
        temp_raw = int.from_bytes(data[1:5], byteorder='little')
        temperature = temp_raw / 100.0  # Conversion selon le format
        
        return {
            "type": "temperature",
            "value": temperature,
            "unit": "°C",
            "timestamp": datetime.now().isoformat()
        }
    
    async def send_to_fajma(self, data):
        """Envoyer les données au serveur FAJMA"""
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.auth_token}"
            }
            
            response = requests.post(
                self.fajma_api_url,
                json=data,
                headers=headers
            )
            
            if response.status_code == 200:
                print(f"Données envoyées avec succès: {data['type']}")
            else:
                print(f"Erreur d'envoi: {response.status_code}")
                
        except Exception as e:
            print(f"Erreur d'envoi des données: {e}")
    
    async def run(self):
        """Fonction principale"""
        devices = await self.scan_devices()
        
        if not devices:
            print("Aucun dispositif de santé trouvé")
            return
        
        # Connecter au premier dispositif trouvé
        await self.connect_to_device(devices[0])

# Utilisation
if __name__ == "__main__":
    monitor = BluetoothHealthMonitor()
    asyncio.run(monitor.run())
```

## 🔧 Application Desktop Intégrée

### Architecture Recommandée

```
FAJMA Desktop Bluetooth Bridge/
├── src/
│   ├── bluetooth/
│   │   ├── scanner.js
│   │   ├── connection.js
│   │   └── parser.js
│   ├── api/
│   │   ├── fajma-client.js
│   │   └── auth.js
│   ├── ui/
│   │   ├── main-window.js
│   │   ├── device-list.js
│   │   └── data-monitor.js
│   └── utils/
│       ├── logger.js
│       └── config.js
├── main.js
├── package.json
└── README.md
```

### Interface Utilisateur

**Fonctionnalités principales :**

1. **Scanner de dispositifs**
   - Liste des dispositifs BLE détectés
   - Filtrage par type de capteur
   - Indicateur de force du signal

2. **Gestionnaire de connexions**
   - État de connexion en temps réel
   - Reconnexion automatique
   - Gestion des erreurs

3. **Moniteur de données**
   - Affichage des données en temps réel
   - Graphiques de tendance
   - Historique des mesures

4. **Configuration**
   - Paramètres de connexion FAJMA
   - Seuils d'alerte
   - Préférences utilisateur

## 🔐 Sécurité et Authentification

### Chiffrement Bluetooth

```javascript
// Exemple de configuration sécurisée
const securityOptions = {
  bondable: true,
  mitm: true,
  sc: true,
  keypress: false,
  oob: false,
  le_secure_connections: true
};
```

### Authentification FAJMA

```javascript
class FajmaAuth {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.token = null;
  }
  
  async login(username, password) {
    const response = await fetch(`${this.apiUrl}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      this.token = data.access;
      return true;
    }
    
    return false;
  }
  
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}
```

## 📊 Monitoring et Logging

### Système de Logs

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'bluetooth-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'bluetooth-combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Utilisation
logger.info('Dispositif connecté', { deviceId: 'ABC123', deviceName: 'Heart Monitor' });
logger.error('Erreur de connexion', { error: error.message, deviceId: 'ABC123' });
```

## 🚀 Déploiement et Distribution

### Package Electron

```json
{
  "build": {
    "appId": "com.fajma.bluetooth-bridge",
    "productName": "FAJMA Bluetooth Bridge",
    "directories": {
      "output": "dist"
    },
    "files": [
      "src/**/*",
      "node_modules/**/*",
      "main.js",
      "package.json"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icon.png"
    }
  }
}
```

### Scripts de Build

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build pour toutes les plateformes
npm run build

# Build spécifique
npm run build:win
npm run build:mac
npm run build:linux
```

## 🔧 Configuration et Maintenance

### Fichier de Configuration

```json
{
  "fajma": {
    "apiUrl": "http://localhost:8000/api",
    "timeout": 30000,
    "retryAttempts": 3
  },
  "bluetooth": {
    "scanDuration": 10000,
    "connectionTimeout": 15000,
    "autoReconnect": true,
    "supportedServices": [
      "180d",
      "1810",
      "1809",
      "1808"
    ]
  },
  "logging": {
    "level": "info",
    "maxFiles": 5,
    "maxSize": "10m"
  }
}
```

### Maintenance Automatique

```javascript
class MaintenanceManager {
  constructor() {
    this.setupPeriodicTasks();
  }
  
  setupPeriodicTasks() {
    // Nettoyage des logs tous les jours
    setInterval(() => {
      this.cleanupLogs();
    }, 24 * 60 * 60 * 1000);
    
    // Vérification de la connectivité toutes les 5 minutes
    setInterval(() => {
      this.checkConnectivity();
    }, 5 * 60 * 1000);
  }
  
  async cleanupLogs() {
    // Supprimer les logs anciens
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const logDir = path.join(__dirname, 'logs');
      const files = await fs.readdir(logDir);
      
      for (const file of files) {
        const filePath = path.join(logDir, file);
        const stats = await fs.stat(filePath);
        
        // Supprimer les fichiers de plus de 30 jours
        if (Date.now() - stats.mtime.getTime() > 30 * 24 * 60 * 60 * 1000) {
          await fs.unlink(filePath);
          logger.info(`Log supprimé: ${file}`);
        }
      }
    } catch (error) {
      logger.error('Erreur de nettoyage des logs:', error);
    }
  }
  
  async checkConnectivity() {
    try {
      const response = await fetch(`${config.fajma.apiUrl}/health/`);
      if (!response.ok) {
        logger.warn('Serveur FAJMA non accessible');
      }
    } catch (error) {
      logger.error('Erreur de connectivité FAJMA:', error);
    }
  }
}
```

## 📈 Performance et Optimisation

### Gestion de la Mémoire

```javascript
class MemoryManager {
  constructor() {
    this.dataBuffer = new Map();
    this.maxBufferSize = 1000;
    this.setupMemoryMonitoring();
  }
  
  addData(deviceId, data) {
    if (!this.dataBuffer.has(deviceId)) {
      this.dataBuffer.set(deviceId, []);
    }
    
    const deviceData = this.dataBuffer.get(deviceId);
    deviceData.push(data);
    
    // Limiter la taille du buffer
    if (deviceData.length > this.maxBufferSize) {
      deviceData.shift();
    }
  }
  
  setupMemoryMonitoring() {
    setInterval(() => {
      const usage = process.memoryUsage();
      if (usage.heapUsed > 100 * 1024 * 1024) { // 100MB
        logger.warn('Utilisation mémoire élevée:', usage);
        this.cleanup();
      }
    }, 60000);
  }
  
  cleanup() {
    // Nettoyer les anciennes données
    for (const [deviceId, data] of this.dataBuffer) {
      if (data.length > this.maxBufferSize / 2) {
        data.splice(0, data.length - this.maxBufferSize / 2);
      }
    }
    
    // Forcer le garbage collection si disponible
    if (global.gc) {
      global.gc();
    }
  }
}
```

## 🎯 Recommandations

### Pour le Développement

1. **Utiliser Electron** pour une solution cross-platform
2. **Implémenter la reconnexion automatique** pour la robustesse
3. **Ajouter des logs détaillés** pour le débogage
4. **Tester sur différents dispositifs** IoT de santé
5. **Implémenter la gestion d'erreurs** robuste

### Pour la Production

1. **Chiffrer les communications** avec le serveur FAJMA
2. **Implémenter l'authentification** utilisateur
3. **Ajouter la surveillance** des performances
4. **Créer un installateur** pour chaque plateforme
5. **Documenter l'API** et les protocoles

### Pour la Maintenance

1. **Mettre en place des logs** rotatifs
2. **Surveiller l'utilisation** des ressources
3. **Implémenter des alertes** pour les erreurs critiques
4. **Créer des sauvegardes** des configurations
5. **Planifier les mises à jour** régulières

## 📞 Support et Dépannage

### Problèmes Courants

1. **Dispositif non détecté**
   - Vérifier que Bluetooth est activé
   - S'assurer que le dispositif est en mode appairage
   - Vérifier la compatibilité BLE

2. **Connexion instable**
   - Réduire la distance entre l'ordinateur et le dispositif
   - Éliminer les interférences (WiFi, autres dispositifs Bluetooth)
   - Vérifier l'état de la batterie du dispositif

3. **Données corrompues**
   - Vérifier le parsing des données selon le protocole
   - Valider les checksums si disponibles
   - Implémenter la validation des données

### Outils de Diagnostic

```bash
# Linux - Vérifier l'état Bluetooth
hciconfig
hcitool scan

# Windows - PowerShell
Get-PnpDevice -Class Bluetooth

# macOS - Terminal
system_profiler SPBluetoothDataType
```

---

**Note :** Cette documentation fournit une base complète pour implémenter la connexion Bluetooth ordinateur-IoT. L'implémentation spécifique dépendra des dispositifs IoT utilisés et des exigences particulières du système FAJMA.