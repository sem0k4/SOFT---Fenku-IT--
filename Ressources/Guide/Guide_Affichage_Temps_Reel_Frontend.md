# Guide d'Affichage des Données IoT en Temps Réel - Frontend React

## Vue d'Ensemble

Ce guide explique comment intégrer et afficher les données ESP32 en temps réel dans le frontend React du projet FAJMA, une fois la communication établie.

## 1. Architecture de Communication Temps Réel

### 1.1 Flux de Données

```
ESP32 → Serveur Django → WebSocket → Frontend React → Interface Utilisateur
```

### 1.2 Technologies Utilisées

- **Backend**: Django Channels (WebSocket)
- **Frontend**: React + WebSocket API
- **Visualisation**: Chart.js / Recharts
- **État**: React Context / Redux

## 2. Configuration WebSocket Frontend

### 2.1 Service WebSocket React

```javascript
// src/services/websocketService.js
class WebSocketService {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.listeners = new Map();
    }

    connect(deviceId, token) {
        const wsUrl = `ws://localhost:8000/ws/iot/${deviceId}/?token=${token}`;
        
        try {
            this.socket = new WebSocket(wsUrl);
            
            this.socket.onopen = (event) => {
                console.log('WebSocket connecté:', event);
                this.reconnectAttempts = 0;
                this.notifyListeners('connected', { status: 'connected' });
            };
            
            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Erreur parsing WebSocket:', error);
                }
            };
            
            this.socket.onclose = (event) => {
                console.log('WebSocket fermé:', event);
                this.notifyListeners('disconnected', { status: 'disconnected' });
                this.handleReconnect();
            };
            
            this.socket.onerror = (error) => {
                console.error('Erreur WebSocket:', error);
                this.notifyListeners('error', { error });
            };
            
        } catch (error) {
            console.error('Erreur connexion WebSocket:', error);
        }
    }

    handleMessage(data) {
        switch (data.type) {
            case 'sensor_data':
                this.notifyListeners('sensorData', data.data);
                break;
            case 'alert':
                this.notifyListeners('alert', data.data);
                break;
            case 'heartbeat':
                this.notifyListeners('heartbeat', data.data);
                break;
            case 'diagnostics':
                this.notifyListeners('diagnostics', data.data);
                break;
            default:
                console.log('Message WebSocket non géré:', data);
        }
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        
        // Retourner une fonction de désabonnement
        return () => {
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }

    notifyListeners(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval * this.reconnectAttempts);
        }
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket non connecté');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default new WebSocketService();
```

### 2.2 Hook React pour WebSocket

```javascript
// src/hooks/useWebSocket.js
import { useState, useEffect, useCallback } from 'react';
import WebSocketService from '../services/websocketService';

export const useWebSocket = (deviceId, token) => {
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [lastMessage, setLastMessage] = useState(null);
    const [sensorData, setSensorData] = useState({
        temperature: null,
        humidity: null,
        heartRate: null,
        spO2: null,
        timestamp: null
    });
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        if (deviceId && token) {
            // Connexion WebSocket
            WebSocketService.connect(deviceId, token);

            // Abonnements aux événements
            const unsubscribeConnected = WebSocketService.subscribe('connected', () => {
                setConnectionStatus('connected');
            });

            const unsubscribeDisconnected = WebSocketService.subscribe('disconnected', () => {
                setConnectionStatus('disconnected');
            });

            const unsubscribeError = WebSocketService.subscribe('error', (error) => {
                setConnectionStatus('error');
                console.error('Erreur WebSocket:', error);
            });

            const unsubscribeSensorData = WebSocketService.subscribe('sensorData', (data) => {
                setSensorData({
                    temperature: data.temperature,
                    humidity: data.humidity,
                    heartRate: data.heart_rate,
                    spO2: data.spo2,
                    timestamp: new Date(data.timestamp)
                });
                setLastMessage(data);
            });

            const unsubscribeAlert = WebSocketService.subscribe('alert', (alert) => {
                setAlerts(prev => [{
                    id: Date.now(),
                    ...alert,
                    timestamp: new Date()
                }, ...prev.slice(0, 9)]); // Garder seulement les 10 dernières alertes
            });

            // Nettoyage
            return () => {
                unsubscribeConnected();
                unsubscribeDisconnected();
                unsubscribeError();
                unsubscribeSensorData();
                unsubscribeAlert();
                WebSocketService.disconnect();
            };
        }
    }, [deviceId, token]);

    const sendCommand = useCallback((command) => {
        WebSocketService.sendMessage({
            type: 'command',
            data: command
        });
    }, []);

    return {
        connectionStatus,
        sensorData,
        alerts,
        lastMessage,
        sendCommand
    };
};
```

## 3. Composants d'Affichage Temps Réel

### 3.1 Composant Principal de Monitoring

```javascript
// src/components/IoTMonitoring.jsx
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import SensorCard from './SensorCard';
import RealTimeChart from './RealTimeChart';
import AlertPanel from './AlertPanel';
import ConnectionStatus from './ConnectionStatus';

const IoTMonitoring = ({ deviceId, patientId }) => {
    const [authToken, setAuthToken] = useState(null);
    const { connectionStatus, sensorData, alerts, sendCommand } = useWebSocket(deviceId, authToken);
    
    const [historicalData, setHistoricalData] = useState({
        temperature: [],
        heartRate: [],
        spO2: [],
        timestamps: []
    });

    // Récupérer le token d'authentification
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setAuthToken(token);
    }, []);

    // Mettre à jour les données historiques
    useEffect(() => {
        if (sensorData.timestamp) {
            setHistoricalData(prev => {
                const newData = {
                    temperature: [...prev.temperature, sensorData.temperature].slice(-50),
                    heartRate: [...prev.heartRate, sensorData.heartRate].slice(-50),
                    spO2: [...prev.spO2, sensorData.spO2].slice(-50),
                    timestamps: [...prev.timestamps, sensorData.timestamp].slice(-50)
                };
                return newData;
            });
        }
    }, [sensorData]);

    const handleSendCommand = (command) => {
        sendCommand({
            device_id: deviceId,
            command: command,
            timestamp: new Date().toISOString()
        });
    };

    return (
        <div className="iot-monitoring">
            <div className="monitoring-header">
                <h2>Monitoring IoT - Patient {patientId}</h2>
                <ConnectionStatus status={connectionStatus} deviceId={deviceId} />
            </div>

            <div className="sensor-grid">
                <SensorCard
                    title="Température"
                    value={sensorData.temperature}
                    unit="°C"
                    icon="🌡️"
                    status={getSensorStatus('temperature', sensorData.temperature)}
                    lastUpdate={sensorData.timestamp}
                />
                
                <SensorCard
                    title="Rythme Cardiaque"
                    value={sensorData.heartRate}
                    unit="bpm"
                    icon="❤️"
                    status={getSensorStatus('heartRate', sensorData.heartRate)}
                    lastUpdate={sensorData.timestamp}
                />
                
                <SensorCard
                    title="Saturation O2"
                    value={sensorData.spO2}
                    unit="%"
                    icon="🫁"
                    status={getSensorStatus('spO2', sensorData.spO2)}
                    lastUpdate={sensorData.timestamp}
                />
                
                <SensorCard
                    title="Humidité"
                    value={sensorData.humidity}
                    unit="%"
                    icon="💧"
                    status={getSensorStatus('humidity', sensorData.humidity)}
                    lastUpdate={sensorData.timestamp}
                />
            </div>

            <div className="charts-section">
                <RealTimeChart
                    title="Évolution Temps Réel"
                    data={historicalData}
                    height={400}
                />
            </div>

            <div className="alerts-section">
                <AlertPanel alerts={alerts} onDismiss={(id) => {
                    // Gérer la suppression d'alerte
                }} />
            </div>

            <div className="controls-section">
                <button 
                    onClick={() => handleSendCommand('calibrate')}
                    className="btn btn-primary"
                >
                    Calibrer Capteurs
                </button>
                <button 
                    onClick={() => handleSendCommand('reset')}
                    className="btn btn-secondary"
                >
                    Redémarrer ESP32
                </button>
            </div>
        </div>
    );
};

// Fonction utilitaire pour déterminer le statut du capteur
const getSensorStatus = (type, value) => {
    if (value === null || value === undefined) return 'offline';
    
    switch (type) {
        case 'temperature':
            if (value < 35 || value > 39) return 'warning';
            if (value < 34 || value > 40) return 'critical';
            return 'normal';
        case 'heartRate':
            if (value < 60 || value > 100) return 'warning';
            if (value < 40 || value > 120) return 'critical';
            return 'normal';
        case 'spO2':
            if (value < 95) return 'warning';
            if (value < 90) return 'critical';
            return 'normal';
        default:
            return 'normal';
    }
};

export default IoTMonitoring;
```

### 3.2 Composant Carte de Capteur

```javascript
// src/components/SensorCard.jsx
import React from 'react';
import './SensorCard.css';

const SensorCard = ({ title, value, unit, icon, status, lastUpdate }) => {
    const formatValue = (val) => {
        if (val === null || val === undefined) return '--';
        return typeof val === 'number' ? val.toFixed(1) : val;
    };

    const formatLastUpdate = (timestamp) => {
        if (!timestamp) return 'Jamais';
        const now = new Date();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'À l\'instant';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
        return timestamp.toLocaleTimeString();
    };

    return (
        <div className={`sensor-card sensor-card--${status}`}>
            <div className="sensor-card__header">
                <span className="sensor-card__icon">{icon}</span>
                <h3 className="sensor-card__title">{title}</h3>
            </div>
            
            <div className="sensor-card__value">
                <span className="sensor-card__number">{formatValue(value)}</span>
                <span className="sensor-card__unit">{unit}</span>
            </div>
            
            <div className="sensor-card__footer">
                <div className={`sensor-card__status sensor-card__status--${status}`}>
                    {status === 'normal' && '✅ Normal'}
                    {status === 'warning' && '⚠️ Attention'}
                    {status === 'critical' && '🚨 Critique'}
                    {status === 'offline' && '❌ Hors ligne'}
                </div>
                <div className="sensor-card__timestamp">
                    {formatLastUpdate(lastUpdate)}
                </div>
            </div>
        </div>
    );
};

export default SensorCard;
```

### 3.3 Graphique Temps Réel

```javascript
// src/components/RealTimeChart.jsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const RealTimeChart = ({ title, data, height = 300 }) => {
    // Transformer les données pour Recharts
    const chartData = data.timestamps.map((timestamp, index) => ({
        time: timestamp.toLocaleTimeString(),
        temperature: data.temperature[index],
        heartRate: data.heartRate[index],
        spO2: data.spO2[index]
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{`Heure: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value !== null ? entry.value.toFixed(1) : '--'}`}
                            {entry.name === 'temperature' && '°C'}
                            {entry.name === 'heartRate' && ' bpm'}
                            {entry.name === 'spO2' && '%'}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="realtime-chart">
            <h3 className="chart-title">{title}</h3>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#ff6b6b"
                        strokeWidth={2}
                        dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 3 }}
                        name="Température"
                        connectNulls={false}
                    />
                    
                    <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#4ecdc4"
                        strokeWidth={2}
                        dot={{ fill: '#4ecdc4', strokeWidth: 2, r: 3 }}
                        name="Rythme Cardiaque"
                        connectNulls={false}
                    />
                    
                    <Line
                        type="monotone"
                        dataKey="spO2"
                        stroke="#45b7d1"
                        strokeWidth={2}
                        dot={{ fill: '#45b7d1', strokeWidth: 2, r: 3 }}
                        name="SpO2"
                        connectNulls={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RealTimeChart;
```

### 3.4 Panneau d'Alertes

```javascript
// src/components/AlertPanel.jsx
import React from 'react';
import './AlertPanel.css';

const AlertPanel = ({ alerts, onDismiss }) => {
    const getAlertIcon = (type) => {
        switch (type) {
            case 'critical': return '🚨';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '📢';
        }
    };

    const getAlertClass = (type) => {
        switch (type) {
            case 'critical': return 'alert--critical';
            case 'warning': return 'alert--warning';
            case 'info': return 'alert--info';
            default: return 'alert--default';
        }
    };

    if (alerts.length === 0) {
        return (
            <div className="alert-panel">
                <h3>Alertes</h3>
                <div className="no-alerts">
                    <span className="no-alerts__icon">✅</span>
                    <p>Aucune alerte active</p>
                </div>
            </div>
        );
    }

    return (
        <div className="alert-panel">
            <h3>Alertes ({alerts.length})</h3>
            <div className="alerts-list">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`alert ${getAlertClass(alert.alert_type)}`}>
                        <div className="alert__header">
                            <span className="alert__icon">{getAlertIcon(alert.alert_type)}</span>
                            <span className="alert__type">{alert.alert_type?.toUpperCase()}</span>
                            <span className="alert__time">
                                {alert.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                        
                        <div className="alert__message">
                            {alert.message}
                        </div>
                        
                        {alert.device_id && (
                            <div className="alert__device">
                                Dispositif: {alert.device_id}
                            </div>
                        )}
                        
                        <button 
                            className="alert__dismiss"
                            onClick={() => onDismiss(alert.id)}
                            title="Ignorer cette alerte"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertPanel;
```

### 3.5 Statut de Connexion

```javascript
// src/components/ConnectionStatus.jsx
import React from 'react';
import './ConnectionStatus.css';

const ConnectionStatus = ({ status, deviceId }) => {
    const getStatusInfo = (status) => {
        switch (status) {
            case 'connected':
                return {
                    icon: '🟢',
                    text: 'Connecté',
                    class: 'status--connected'
                };
            case 'disconnected':
                return {
                    icon: '🔴',
                    text: 'Déconnecté',
                    class: 'status--disconnected'
                };
            case 'connecting':
                return {
                    icon: '🟡',
                    text: 'Connexion...',
                    class: 'status--connecting'
                };
            case 'error':
                return {
                    icon: '❌',
                    text: 'Erreur',
                    class: 'status--error'
                };
            default:
                return {
                    icon: '⚪',
                    text: 'Inconnu',
                    class: 'status--unknown'
                };
        }
    };

    const statusInfo = getStatusInfo(status);

    return (
        <div className={`connection-status ${statusInfo.class}`}>
            <span className="status__icon">{statusInfo.icon}</span>
            <div className="status__info">
                <span className="status__text">{statusInfo.text}</span>
                <span className="status__device">ESP32: {deviceId}</span>
            </div>
        </div>
    );
};

export default ConnectionStatus;
```

## 4. Styles CSS

### 4.1 SensorCard.css

```css
/* src/components/SensorCard.css */
.sensor-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border-left: 4px solid #e0e0e0;
}

.sensor-card--normal {
    border-left-color: #4caf50;
}

.sensor-card--warning {
    border-left-color: #ff9800;
    background: #fff8e1;
}

.sensor-card--critical {
    border-left-color: #f44336;
    background: #ffebee;
    animation: pulse 2s infinite;
}

.sensor-card--offline {
    border-left-color: #9e9e9e;
    background: #f5f5f5;
    opacity: 0.7;
}

@keyframes pulse {
    0% { box-shadow: 0 2px 10px rgba(244, 67, 54, 0.1); }
    50% { box-shadow: 0 2px 20px rgba(244, 67, 54, 0.3); }
    100% { box-shadow: 0 2px 10px rgba(244, 67, 54, 0.1); }
}

.sensor-card__header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.sensor-card__icon {
    font-size: 24px;
    margin-right: 10px;
}

.sensor-card__title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.sensor-card__value {
    display: flex;
    align-items: baseline;
    margin-bottom: 15px;
}

.sensor-card__number {
    font-size: 32px;
    font-weight: 700;
    color: #2c3e50;
    margin-right: 5px;
}

.sensor-card__unit {
    font-size: 16px;
    color: #7f8c8d;
    font-weight: 500;
}

.sensor-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sensor-card__status {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;
}

.sensor-card__status--normal {
    background: #e8f5e8;
    color: #4caf50;
}

.sensor-card__status--warning {
    background: #fff3e0;
    color: #ff9800;
}

.sensor-card__status--critical {
    background: #ffebee;
    color: #f44336;
}

.sensor-card__status--offline {
    background: #f5f5f5;
    color: #9e9e9e;
}

.sensor-card__timestamp {
    font-size: 11px;
    color: #95a5a6;
}
```

### 4.2 AlertPanel.css

```css
/* src/components/AlertPanel.css */
.alert-panel {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.alert-panel h3 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 18px;
}

.no-alerts {
    text-align: center;
    padding: 40px 20px;
    color: #7f8c8d;
}

.no-alerts__icon {
    font-size: 48px;
    display: block;
    margin-bottom: 10px;
}

.alerts-list {
    max-height: 400px;
    overflow-y: auto;
}

.alert {
    position: relative;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    border-left: 4px solid #e0e0e0;
}

.alert--critical {
    border-left-color: #f44336;
    background: #ffebee;
}

.alert--warning {
    border-left-color: #ff9800;
    background: #fff8e1;
}

.alert--info {
    border-left-color: #2196f3;
    background: #e3f2fd;
}

.alert__header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.alert__icon {
    font-size: 16px;
    margin-right: 8px;
}

.alert__type {
    font-weight: 600;
    font-size: 12px;
    margin-right: auto;
}

.alert__time {
    font-size: 11px;
    color: #7f8c8d;
}

.alert__message {
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 5px;
}

.alert__device {
    font-size: 12px;
    color: #7f8c8d;
}

.alert__dismiss {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #bdc3c7;
    transition: color 0.2s;
}

.alert__dismiss:hover {
    color: #e74c3c;
}
```

## 5. Intégration dans l'Application

### 5.1 Page de Monitoring Patient

```javascript
// src/pages/PatientMonitoring.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import IoTMonitoring from '../components/IoTMonitoring';
import PatientInfo from '../components/PatientInfo';
import { getPatientById } from '../services/patientService';

const PatientMonitoring = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const patientData = await getPatientById(patientId);
                setPatient(patientData);
            } catch (error) {
                console.error('Erreur chargement patient:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [patientId]);

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    if (!patient) {
        return <div className="error">Patient non trouvé</div>;
    }

    return (
        <div className="patient-monitoring-page">
            <div className="page-header">
                <h1>Monitoring Patient</h1>
                <PatientInfo patient={patient} />
            </div>
            
            <IoTMonitoring 
                deviceId={patient.device_id || 'ESP32_001'} 
                patientId={patientId}
            />
        </div>
    );
};

export default PatientMonitoring;
```

### 5.2 Configuration des Routes

```javascript
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientMonitoring from './pages/PatientMonitoring';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/patient/:patientId/monitoring" element={<PatientMonitoring />} />
                {/* Autres routes */}
            </Routes>
        </Router>
    );
}

export default App;
```

## 6. Installation des Dépendances

```bash
# Installer les dépendances nécessaires
npm install recharts
npm install react-router-dom
```

## 7. Configuration Backend Django

### 7.1 Consumer WebSocket

```python
# backend/fajma/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import SensorData, Patient

class IoTConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.device_id = self.scope['url_route']['kwargs']['device_id']
        self.room_group_name = f'iot_{self.device_id}'
        
        # Rejoindre le groupe
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Envoyer un message de confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'device_id': self.device_id
        }))
    
    async def disconnect(self, close_code):
        # Quitter le groupe
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'command':
                # Traiter les commandes envoyées au dispositif
                await self.handle_device_command(data.get('data'))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Format JSON invalide'
            }))
    
    async def handle_device_command(self, command_data):
        # Ici vous pouvez traiter les commandes envoyées au dispositif
        # Par exemple, envoyer via MQTT au dispositif ESP32
        pass
    
    # Méthodes pour recevoir des messages du groupe
    async def sensor_data(self, event):
        # Envoyer les données de capteur au WebSocket
        await self.send(text_data=json.dumps({
            'type': 'sensor_data',
            'data': event['data']
        }))
    
    async def alert_message(self, event):
        # Envoyer une alerte au WebSocket
        await self.send(text_data=json.dumps({
            'type': 'alert',
            'data': event['data']
        }))
```

### 7.2 Routing WebSocket

```python
# backend/core/routing.py
from django.urls import re_path
from fajma import consumers

websocket_urlpatterns = [
    re_path(r'ws/iot/(?P<device_id>\w+)/$', consumers.IoTConsumer.as_asgi()),
]
```

Ce guide complet vous permet d'afficher les données ESP32 en temps réel dans votre frontend React avec une interface moderne et réactive.