import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

const useMQTTDirect = () => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [temperatureData, setTemperatureData] = useState({
    ambient_temperature: null,
    object_temperature: null,
    heart_rate: null,
    spo2: null,
    timestamp: null,
    device_id: null,
    raw_data: null
  });
  const [deviceStatus, setDeviceStatus] = useState({
    status: 'offline',
    sensor_connected: false,
    wifi_rssi: null
  });

  const clientRef = useRef(null);

  // Configuration MQTT EMQX Cloud
  const mqttConfig = {
    host: 'b1d7df11.ala.eu-central-1.emqxsl.com',
    port: 8084,
    protocol: 'wss',
    path: '/mqtt',
    username: 'Fenku_IT',
    password: 'Enus814@001',
    clientId: `react-client-${Math.random().toString(16).substr(2, 8)}`,
    connectTimeout: 5000,
    reconnectPeriod: 1000,
    clean: true,
    rejectUnauthorized: false
  };

  // Topics MQTT
  const topics = {
    main: 'mqx/esp32',
    commands: 'mqx/esp32/commands'
  };

  // Fonction de connexion
  const connect = () => {
    if (isConnecting || isConnected || clientRef.current) {
      console.log('Connexion déjà en cours ou établie');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const mqttUrl = `${mqttConfig.protocol}://${mqttConfig.host}:${mqttConfig.port}${mqttConfig.path}`;
      console.log('Connexion au broker MQTT:', mqttUrl);
      
      const mqttClient = mqtt.connect(mqttUrl, mqttConfig);
      clientRef.current = mqttClient;

      // Événement de connexion
      mqttClient.on('connect', () => {
        console.log('Connecté au broker MQTT EMQX');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        setClient(mqttClient);

        // Souscription au topic principal avec délai
        setTimeout(() => {
          if (mqttClient && !mqttClient.disconnecting && !mqttClient.disconnected) {
            mqttClient.subscribe(topics.main, { qos: 0 }, (err) => {
              if (!err) {
                console.log(`Souscrit au topic: ${topics.main}`);
              } else {
                console.error('Erreur souscription:', err);
              }
            });
          }
        }, 100);
      });

      // Réception des messages
      mqttClient.on('message', (topic, message) => {
        try {
          const messageStr = message.toString();
          console.log(`Message reçu sur ${topic}:`, messageStr);

          if (topic === topics.main) {
            // Essayer de parser en JSON, sinon traiter comme texte brut
            let data;
            try {
              data = JSON.parse(messageStr);
            } catch {
              // Si ce n'est pas du JSON, traiter comme données brutes
              data = { raw_data: messageStr, timestamp: Date.now() };
            }

            setTemperatureData({
              ambient_temperature: data.ambient_temperature || null,
              object_temperature: data.object_temperature || data.temperature || null,
              heart_rate: data.heart_rate || null,
              spo2: data.spo2 || null,
              timestamp: data.timestamp || Date.now(),
              device_id: data.device_id || 'ESP32',
              raw_data: data.raw_data || messageStr
            });

            setDeviceStatus({
              status: 'online',
              sensor_connected: true,
              wifi_rssi: data.wifi_rssi || null
            });
          }
        } catch (err) {
          console.error('Erreur traitement message:', err);
        }
      });

      // Gestion des erreurs
      mqttClient.on('error', (err) => {
        console.error('Erreur MQTT:', err);
        setError(`Erreur de connexion: ${err.message}`);
        setIsConnected(false);
        setIsConnecting(false);
      });

      // Déconnexion
      mqttClient.on('close', () => {
        console.log('Connexion MQTT fermée');
        setIsConnected(false);
        setIsConnecting(false);
      });

      // Reconnexion
      mqttClient.on('reconnect', () => {
        console.log('Tentative de reconnexion MQTT');
        setIsConnecting(true);
        setError(null);
      });

    } catch (err) {
      console.error('Erreur lors de la connexion MQTT:', err);
      setError(`Erreur de connexion: ${err.message}`);
      setIsConnecting(false);
    }
  };

  // Fonction de déconnexion
  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.end();
      clientRef.current = null;
      setClient(null);
      setIsConnected(false);
      setIsConnecting(false);
      console.log('Client MQTT déconnecté');
    }
  };

  // Fonction pour envoyer une commande
  const sendCommand = (command) => {
    if (client && isConnected) {
      const commandData = {
        command: command,
        timestamp: Date.now()
      };
      
      client.publish(topics.commands, JSON.stringify(commandData), { qos: 0 }, (err) => {
        if (!err) {
          console.log(`Commande envoyée: ${command}`);
        } else {
          console.error('Erreur envoi commande:', err);
        }
      });
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  // Connexion automatique au montage du composant
  useEffect(() => {
    if (!clientRef.current) {
      connect();
    }

    // Nettoyage au démontage
    return () => {
      if (clientRef.current) {
        disconnect();
      }
    };
  }, []);

  // Données formatées pour l'affichage
  const formattedData = {
    ambient_temperature: temperatureData.ambient_temperature ? 
      `${temperatureData.ambient_temperature.toFixed(1)}` : '--',
    object_temperature: temperatureData.object_temperature ? 
      `${temperatureData.object_temperature.toFixed(1)}` : temperatureData.raw_data || '--',
    heart_rate: temperatureData.heart_rate ? 
      `${temperatureData.heart_rate}` : '--',
    spo2: temperatureData.spo2 ? 
      `${temperatureData.spo2}` : '--',
    device_status: deviceStatus.status,
    sensor_connected: deviceStatus.sensor_connected,
    wifi_signal: deviceStatus.wifi_rssi ? `${deviceStatus.wifi_rssi} dBm` : '--',
    last_update: temperatureData.timestamp ? 
      new Date(temperatureData.timestamp).toLocaleTimeString() : '--',
    raw_data: temperatureData.raw_data || 'Aucune donnée'
  };

  return {
    // État de connexion
    isConnected,
    isConnecting,
    error,
    
    // Données
    temperatureData,
    deviceStatus,
    formattedData,
    
    // Actions
    connect,
    disconnect,
    sendCommand,
    clearError
  };
};

export default useMQTTDirect;
