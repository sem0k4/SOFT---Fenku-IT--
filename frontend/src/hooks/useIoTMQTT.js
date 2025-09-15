import { useState, useEffect, useCallback, useRef } from 'react';
import AuthService from '../services/auth';

const useIoTMQTT = (patientId = null) => {
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
    
    const pollingIntervalRef = useRef(null);
    const mountedRef = useRef(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Fonction pour récupérer les données IoT depuis l'API Django
    const fetchIoTData = useCallback(async () => {
        if (!mountedRef.current) return;
        
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw new Error('Token d\'authentification manquant');
            }

            const response = await fetch(`${API_BASE_URL}/api/iot/latest-data/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            if (data && mountedRef.current) {
                setIotData({
                    spo2: data.spo2 || null,
                    temperature: data.temperature || null,
                    heart_rate: data.heart_rate || null,
                    timestamp: data.timestamp || new Date().toISOString()
                });
                
                setError(null);
                setConnectionStatus('OPEN');
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des données IoT:', err);
            if (mountedRef.current) {
                setError(`Erreur de connexion: ${err.message}`);
                setConnectionStatus('CLOSED');
            }
        }
    }, [API_BASE_URL]);

    // Fonction pour récupérer le statut des dispositifs
    const fetchDeviceStatus = useCallback(async () => {
        if (!mountedRef.current) return;
        
        try {
            const token = AuthService.getToken();
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/iot/devices/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const devicesData = await response.json();
                if (mountedRef.current) {
                    setDevices(devicesData || []);
                }
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des dispositifs:', err);
        }
    }, [API_BASE_URL]);

    // Fonction pour récupérer les alertes
    const fetchAlerts = useCallback(async () => {
        if (!mountedRef.current) return;
        
        try {
            const token = AuthService.getToken();
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/iot/alerts/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const alertsData = await response.json();
                if (mountedRef.current) {
                    setAlerts(alertsData || []);
                }
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des alertes:', err);
        }
    }, [API_BASE_URL]);

    // Fonction pour se connecter (démarrer le polling)
    const connect = useCallback(async () => {
        if (isConnecting || pollingIntervalRef.current) {
            return;
        }

        try {
            setIsConnecting(true);
            setError(null);
            
            const userInfo = AuthService.getUserInfo();
            const token = AuthService.getToken();
            
            if (!token) {
                throw new Error('Token d\'authentification manquant');
            }

            const targetPatientId = patientId || userInfo?.id;
            
            if (!targetPatientId) {
                throw new Error('ID patient manquant');
            }

            // Première récupération des données
            await fetchIoTData();
            await fetchDeviceStatus();
            await fetchAlerts();

            // Démarrer le polling toutes les 2 secondes pour les données en temps réel
            pollingIntervalRef.current = setInterval(() => {
                fetchIoTData();
                fetchDeviceStatus();
                fetchAlerts();
            }, 2000);

            setIsConnecting(false);
            setConnectionStatus('OPEN');
            console.log('Connexion MQTT IoT établie via polling API');
            
        } catch (err) {
            console.error('Erreur de connexion IoT:', err);
            if (mountedRef.current) {
                setError(err.message);
                setIsConnecting(false);
                setConnectionStatus('CLOSED');
            }
        }
    }, [isConnecting, patientId, fetchIoTData, fetchDeviceStatus, fetchAlerts]);

    // Fonction pour se déconnecter
    const disconnect = useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        
        if (mountedRef.current) {
            setConnectionStatus('CLOSED');
            setIsConnecting(false);
        }
        
        console.log('Connexion IoT fermée');
    }, []);

    // Fonction pour acquitter une alerte
    const acknowledgeAlert = useCallback(async (alertId) => {
        try {
            const token = AuthService.getToken();
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/iot/alerts/${alertId}/acknowledge/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok && mountedRef.current) {
                setAlerts(prevAlerts => 
                    prevAlerts.filter(alert => alert.id !== alertId)
                );
            }
        } catch (err) {
            console.error('Erreur lors de l\'acquittement de l\'alerte:', err);
        }
    }, [API_BASE_URL]);

    // Fonction pour effacer les erreurs
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Données formatées pour l'affichage
    const formattedData = {
        spo2: iotData.spo2 ? `${iotData.spo2}` : '--',
        temperature: iotData.temperature ? `${iotData.temperature}` : '--',
        heart_rate: iotData.heart_rate ? `${iotData.heart_rate}` : '--',
        ambient_temperature: iotData.ambient_temperature ? `${iotData.ambient_temperature}` : '--',
        object_temperature: iotData.object_temperature ? `${iotData.object_temperature}` : '--'
    };

    // État de connexion
    const isConnected = connectionStatus === 'OPEN' && !error;

    // Effet pour la connexion automatique
    useEffect(() => {
        const token = AuthService.getToken();
        if (token && mountedRef.current) {
            connect();
        }

        return () => {
            mountedRef.current = false;
            disconnect();
        };
    }, [connect, disconnect]);

    // Nettoyage lors du démontage du composant
    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    return {
        iotData,
        devices,
        alerts,
        connectionStatus,
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect,
        acknowledgeAlert,
        clearError,
        formattedData
    };
};

export default useIoTMQTT;