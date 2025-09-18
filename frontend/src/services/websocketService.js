class WebSocketService {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.listeners = new Map();
        this.isConnecting = false;
        this.shouldReconnect = true;
    }

    // Connexion WebSocket pour les données IoT d'un patient
    connectToIoTData(patientId, token) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket déjà connecté');
            return Promise.resolve();
        }

        if (this.isConnecting) {
            console.log('Connexion WebSocket en cours...');
            return Promise.resolve();
        }

        this.isConnecting = true;
        this.shouldReconnect = true;

        return new Promise((resolve, reject) => {
            try {
                // URL WebSocket pour les données IoT
                const wsUrl = `ws://127.0.0.1:8000/ws/iot/${patientId}/?token=${token}`;
                
                this.socket = new WebSocket(wsUrl);

                this.socket.onopen = () => {
                    console.log('WebSocket connecté pour les données IoT');
                    this.isConnecting = false;
                    this.reconnectAttempts = 0;
                    this.emit('connected');
                    resolve();
                };

                this.socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('Données IoT reçues:', data);
                        
                        // Émettre les données selon leur type
                        if (data.type === 'iot_data') {
                            this.emit('iot_data', data.data);
                        } else if (data.type === 'device_status') {
                            this.emit('device_status', data.data);
                        } else if (data.type === 'alert') {
                            this.emit('alert', data.data);
                        }
                    } catch (error) {
                        console.error('Erreur lors du parsing des données WebSocket:', error);
                    }
                };

                this.socket.onclose = (event) => {
                    console.log('WebSocket fermé:', event.code, event.reason);
                    this.isConnecting = false;
                    this.emit('disconnected');
                    
                    if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                        setTimeout(() => {
                            this.connectToIoTData(patientId, token);
                        }, this.reconnectInterval);
                    }
                };

                this.socket.onerror = (error) => {
                    console.error('Erreur WebSocket:', error);
                    this.isConnecting = false;
                    this.emit('error', error);
                    reject(error);
                };

            } catch (error) {
                console.error('Erreur lors de la création du WebSocket:', error);
                this.isConnecting = false;
                reject(error);
            }
        });
    }

    // Connexion WebSocket pour les alertes
    connectToAlerts(token) {
        const wsUrl = `ws://127.0.0.1:8000/ws/alerts/?token=${token}`;
        
        const alertSocket = new WebSocket(wsUrl);
        
        alertSocket.onopen = () => {
            console.log('WebSocket alertes connecté');
        };
        
        alertSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'alert') {
                    this.emit('alert', data.data);
                }
            } catch (error) {
                console.error('Erreur parsing alerte:', error);
            }
        };
        
        return alertSocket;
    }

    // Envoyer une commande à un dispositif IoT
    sendCommand(deviceId, command) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = {
                type: 'device_command',
                device_id: deviceId,
                command: command,
                timestamp: new Date().toISOString()
            };
            
            this.socket.send(JSON.stringify(message));
            console.log('Commande envoyée:', message);
        } else {
            console.error('WebSocket non connecté, impossible d\'envoyer la commande');
        }
    }

    // Système d'événements
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erreur dans le callback ${event}:`, error);
                }
            });
        }
    }

    // Fermer la connexion WebSocket
    disconnect() {
        this.shouldReconnect = false;
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.listeners.clear();
        console.log('WebSocket déconnecté');
    }

    // Vérifier l'état de la connexion
    isConnected() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }

    // Obtenir l'état de la connexion
    getConnectionState() {
        if (!this.socket) return 'CLOSED';
        
        switch (this.socket.readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING';
            case WebSocket.OPEN:
                return 'OPEN';
            case WebSocket.CLOSING:
                return 'CLOSING';
            case WebSocket.CLOSED:
                return 'CLOSED';
            default:
                return 'UNKNOWN';
        }
    }
}

// Instance singleton
const websocketService = new WebSocketService();
export default websocketService;
