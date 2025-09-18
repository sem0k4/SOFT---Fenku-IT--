import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Alert, AlertDescription } from './ui/Alert';
import { Activity, Thermometer, Heart, Droplets, Wifi, WifiOff } from 'lucide-react';

const IoTMonitor = ({ patientId = 'patient_001' }) => {
  const [sensorData, setSensorData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Configuration WebSocket
  const WS_URL = `ws://localhost:8000/ws/iot/monitoring/`;
  const RECONNECT_INTERVAL = 5000;
  const HEARTBEAT_INTERVAL = 30000;

  // Connexion WebSocket
  const connectWebSocket = () => {
    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log('WebSocket IoT connecté');
        setConnectionStatus('connected');
        setError(null);
        
        // S'abonner aux données du patient
        if (patientId) {
          wsRef.current.send(JSON.stringify({
            command: 'subscribe_patient',
            patient_id: patientId
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (err) {
          console.error('Erreur parsing WebSocket:', err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket fermé:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Reconnexion automatique
        if (event.code !== 1000) { // Pas une fermeture normale
          scheduleReconnect();
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        setError('Erreur de connexion WebSocket');
        setConnectionStatus('error');
      };

    } catch (err) {
      console.error('Erreur création WebSocket:', err);
      setError('Impossible de créer la connexion WebSocket');
    }
  };

  // Programmer une reconnexion
  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log('Tentative de reconnexion WebSocket...');
      connectWebSocket();
    }, RECONNECT_INTERVAL);
  };

  // Gérer les messages WebSocket
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'sensor_update':
      case 'sensor_data':
        setSensorData(data.data);
        setLastUpdate(new Date());
        break;
        
      case 'subscription_confirmed':
        console.log('Abonnement confirmé pour patient:', data.patient_id);
        break;
        
      case 'connection_established':
        console.log('Connexion établie:', data.message);
        break;
        
      case 'error':
        setError(data.message);
        break;
        
      default:
        console.log('Message WebSocket non géré:', data);
    }
  };

  // Envoyer un heartbeat
  const sendHeartbeat = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        command: 'heartbeat',
        timestamp: new Date().toISOString()
      }));
    }
  };

  // Effets
  useEffect(() => {
    connectWebSocket();

    // Heartbeat périodique
    const heartbeatInterval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(heartbeatInterval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Composant démonté');
      }
    };
  }, [patientId]);

  // Formater la température
  const formatTemperature = (temp) => {
    if (temp === null || temp === undefined) return 'N/A';
    return `${parseFloat(temp).toFixed(1)}°C`;
  };

  // Déterminer la couleur selon la valeur
  const getTemperatureColor = (temp) => {
    if (!temp) return 'text-gray-500';
    if (temp < 36.0) return 'text-blue-500';
    if (temp > 37.5) return 'text-red-500';
    return 'text-green-500';
  };

  const getHeartRateColor = (hr) => {
    if (!hr) return 'text-gray-500';
    if (hr < 60 || hr > 100) return 'text-orange-500';
    return 'text-green-500';
  };

  const getSpo2Color = (spo2) => {
    if (!spo2) return 'text-gray-500';
    if (spo2 < 95) return 'text-red-500';
    return 'text-green-500';
  };

  // Icône de statut de connexion
  const ConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'disconnected':
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec statut */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monitoring IoT - Patient {patientId}
            </CardTitle>
            <div className="flex items-center gap-2">
              <ConnectionIcon />
              <Badge 
                variant={connectionStatus === 'connected' ? 'success' : 'destructive'}
              >
                {connectionStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
              </Badge>
            </div>
          </div>
          {lastUpdate && (
            <p className="text-sm text-gray-500">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Alertes d'erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Données des capteurs */}
      {sensorData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Température corporelle */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Température
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTemperatureColor(sensorData.temperature)}`}>
                {formatTemperature(sensorData.temperature)}
              </div>
              {sensorData.temperature_ambient && (
                <p className="text-xs text-gray-500 mt-1">
                  Ambiante: {formatTemperature(sensorData.temperature_ambient)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Fréquence cardiaque */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Fréquence cardiaque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHeartRateColor(sensorData.heart_rate)}`}>
                {sensorData.heart_rate || 'N/A'}
                {sensorData.heart_rate && <span className="text-sm font-normal"> bpm</span>}
              </div>
            </CardContent>
          </Card>

          {/* SpO2 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Saturation O2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getSpo2Color(sensorData.spo2)}`}>
                {sensorData.spo2 || 'N/A'}
                {sensorData.spo2 && <span className="text-sm font-normal">%</span>}
              </div>
            </CardContent>
          </Card>

          {/* Informations dispositif */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Dispositif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {sensorData.sensor_type || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">ID:</span> {sensorData.device_id || 'N/A'}
                </p>
                <Badge 
                  variant={sensorData.sensor_status === 'active' ? 'success' : 'secondary'}
                  className="text-xs"
                >
                  {sensorData.sensor_status || 'unknown'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 animate-pulse" />
              <p>En attente de données des capteurs...</p>
              {connectionStatus !== 'connected' && (
                <p className="text-sm mt-1">Vérifiez la connexion WebSocket</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Données brutes (pour debug) */}
      {sensorData && process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Données brutes (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(sensorData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IoTMonitor;
