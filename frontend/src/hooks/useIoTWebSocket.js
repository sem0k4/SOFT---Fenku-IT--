import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocketService';
import { useAuth } from '../services/auth';

const useIoTWebSocket = (patientId = null) => {
    const { user } = useAuth();
    const [iotData, setIotData] = useState({
        spo2: null,
        temperature: null,
        heart_rate: null,
        timestamp: null
    });
    const [devices, setDevices] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('CLOSED');
    const [error, setError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    
    const reconnectTimeoutRef = useRef(null);
    const mountedRef = useRef(true);

    // Fonction pour traiter les nouvelles données IoT
    const handleIoTData = useCallback((data) => {
        if (!mountedRef.current) return;
        
        console.log('Nouvelles données IoT reçues:', data);
        
        // Mettre à jour les données selon le type de capteur
        setIotData(prevData => {
            const newData = { ...prevData };
            
            // Traitement des différents types de données
            if (data.type_capteur === 'SPO2' || data.spo2 !== undefined) {
                newData.spo2 = data.valeur || data.spo2;
            }
            if (data.type_capteur === 'TEMPERATURE' || data.temperature !== undefined) {
                newData.temperature = data.valeur || data.temperature;
            }
            if (data.type_capteur === 'HEART_RATE' || data.heart_rate !== undefined) {
                newData.heart_rate = data.valeur || data.heart_rate;
            }
            
            // Mettre à jour le timestamp
            newData.timestamp = data.timestamp || new Date().toISOString();
            
            return newData;
        });
        
        setError(null);
    }, []);

    // Fonction pour traiter les changements de statut des dispositifs
    const handleDeviceStatus = useCallback((data) => {
        if (!mountedRef.current) return;
        
        console.log('Statut dispositif mis à jour:', data);
        
        setDevices(prevDevices => {
            const deviceIndex = prevDevices.findIndex(d => d.id === data.device_id);
            
            if (deviceIndex >= 0) {
                // Mettre à jour le dispositif existant
                const updatedDevices = [...prevDevices];
                updatedDevices[deviceIndex] = {
                    ...updatedDevices[deviceIndex],
                    ...data,
                    last_seen: new Date().toISOString()
                };
                return updatedDevices;
            } else {
                // Ajouter un nouveau dispositif
                return [...prevDevices, {
                    ...data,
                    last_seen: new Date().toISOString()
                }];
            }
        });
    }, []);

    // Fonction pour traiter les alertes
    const handleAlert = useCallback((alertData) => {
        if (!mountedRef.current) return;
        
        console.log('Nouvelle alerte reçue:', alertData);
        
        setAlerts(prevAlerts => {
            // Éviter les doublons
            const existingAlert = prevAlerts.find(a => 
                a.id === alertData.id || 
                (a.type === alertData.type && a.timestamp === alertData.timestamp)
            );
            
            if (!existingAlert) {
                return [alertData, ...prevAlerts].slice(0, 10); // Garder seulement les 10 dernières alertes
            }
            
            return prevAlerts;
        });
    }, []);

    // Fonction pour gérer les événements de connexion
    const handleConnectionEvents = useCallback(() => {
        websocketService.on('connected', () => {
            if (!mountedRef.current) return;
            setConnectionStatus('OPEN');
            setIsConnecting(false);
            setError(null);
            console.log('WebSocket IoT connecté avec succès');
        });

        websocketService.on('disconnected', () => {
            if (!mountedRef.current) return;
            setConnectionStatus('CLOSED');
            setIsConnecting(false);
        });

        websocketService.on('error', (error) => {
            if (!mountedRef.current) return;
            setError(`Erreur de connexion WebSocket: ${error.message || 'Erreur inconnue'}`);
            setIsConnecting(false);
            setConnectionStatus('CLOSED');
        });

        websocketService.on('iot_data', handleIoTData);
        websocketService.on('device_status', handleDeviceStatus);
        websocketService.on('alert', handleAlert);
    }, [handleIoTData, handleDeviceStatus, handleAlert]);

    // Fonction pour se connecter au WebSocket
    const connect = useCallback(async () => {
        if (isConnecting || websocketService.isConnected()) {
            return;
        }

        try {
            setIsConnecting(true);
            setError(null);
            
            const userInfo = user;
            const token = user?.token || 'demo-token';
            
            if (!token) {
                throw new Error('Token d\'authentification manquant');
            }

            const targetPatientId = patientId || userInfo?.id;
            
            if (!targetPatientId) {
                throw new Error('ID patient manquant');
            }

            await websocketService.connectToIoTData(targetPatientId, token);
            
        } catch (error) {
            console.error('Erreur lors de la connexion WebSocket:', error);
            setError(error.message);
            setIsConnecting(false);
        }
    }, [patientId, isConnecting]);

    // Fonction pour se déconnecter
    const disconnect = useCallback(() => {
        websocketService.disconnect();
        setConnectionStatus('CLOSED');
        setIsConnecting(false);
        
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    }, []);

    // Fonction pour envoyer une commande à un dispositif
    const sendDeviceCommand = useCallback((deviceId, command) => {
        if (websocketService.isConnected()) {
            websocketService.sendCommand(deviceId, command);
        } else {
            setError('WebSocket non connecté, impossible d\'envoyer la commande');
        }
    }, []);

    // Fonction pour acquitter une alerte
    const acknowledgeAlert = useCallback((alertId) => {
        setAlerts(prevAlerts => 
            prevAlerts.map(alert => 
                alert.id === alertId 
                    ? { ...alert, acknowledged: true, acknowledged_at: new Date().toISOString() }
                    : alert
            )
        );
    }, []);

    // Effet pour gérer la connexion automatique
    useEffect(() => {
        mountedRef.current = true;
        
        // Configurer les événements WebSocket
        handleConnectionEvents();
        
        // Se connecter automatiquement si un token est disponible
        const token = user?.token || 'demo-token';
        if (token) {
            connect();
        }

        // Nettoyage lors du démontage
        return () => {
            mountedRef.current = false;
            
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            
            // Ne pas déconnecter complètement pour permettre la réutilisation
            // websocketService.disconnect();
        };
    }, [connect, handleConnectionEvents]);

    // Effet pour surveiller les changements de patientId
    useEffect(() => {
        if (patientId && websocketService.isConnected()) {
            // Reconnecter avec le nouveau patientId
            disconnect();
            setTimeout(() => connect(), 1000);
        }
    }, [patientId, connect, disconnect]);

    return {
        // Données
        iotData,
        devices,
        alerts,
        
        // État de la connexion
        connectionStatus,
        isConnected: connectionStatus === 'OPEN',
        isConnecting,
        error,
        
        // Actions
        connect,
        disconnect,
        sendDeviceCommand,
        acknowledgeAlert,
        
        // Utilitaires
        clearError: () => setError(null),
        clearAlerts: () => setAlerts([]),
        
        // Données formatées pour l'affichage
        formattedData: {
            spo2: iotData.spo2 ? `${iotData.spo2}` : '--',
            temperature: iotData.temperature ? `${iotData.temperature}` : '--',
            heart_rate: iotData.heart_rate ? `${iotData.heart_rate}` : '--',
            lastUpdate: iotData.timestamp ? new Date(iotData.timestamp).toLocaleTimeString() : 'Jamais'
        }
    };
};

export default useIoTWebSocket;
