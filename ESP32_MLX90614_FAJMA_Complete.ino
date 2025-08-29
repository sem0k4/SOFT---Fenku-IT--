/*
 * ESP32 + MLX90614 Temperature Sensor for FAJMA System
 * 
 * Ce code permet à un ESP32 équipé d'un capteur MLX90614 de mesurer
 * la température corporelle et de l'envoyer en temps réel au système FAJMA
 * via WebSocket.
 * 
 * Capteur: MLX90614 (Température infrarouge sans contact)
 * Communication: WebSocket vers serveur Django FAJMA
 * 
 * Connexions:
 * MLX90614 VCC -> ESP32 3.3V
 * MLX90614 GND -> ESP32 GND
 * MLX90614 SDA -> ESP32 GPIO 21
 * MLX90614 SCL -> ESP32 GPIO 22
 * 
 * Auteur: Système FAJMA IoT
 * Version: 1.0
 */

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <esp_sleep.h>
#include <esp_wifi.h>

// ==================== CONFIGURATION ====================

// Configuration WiFi - MODIFIEZ CES VALEURS
const char* WIFI_SSID = "VOTRE_WIFI_SSID";
const char* WIFI_PASSWORD = "VOTRE_WIFI_PASSWORD";

// Configuration Serveur FAJMA - MODIFIEZ L'ADRESSE IP
const char* FAJMA_SERVER_IP = "192.168.1.100";  // IP de votre serveur FAJMA
const int FAJMA_SERVER_PORT = 8000;
const char* WEBSOCKET_PATH = "/ws/iot/ESP32_MLX90614/";

// Configuration Device
const char* DEVICE_ID = "ESP32_MLX90614_001";
const char* DEVICE_TYPE = "Temperature_Sensor";
const char* FIRMWARE_VERSION = "1.0.0";

// Intervalles de mesure (en millisecondes)
const unsigned long MESURE_INTERVAL = 5000;      // 5 secondes
const unsigned long HEARTBEAT_INTERVAL = 300000;  // 5 minutes
const unsigned long RECONNECT_INTERVAL = 10000;   // 10 secondes

// Seuils d'alerte température (en Celsius)
const float TEMP_FEVER_THRESHOLD = 38.0;     // Fièvre
const float TEMP_LOW_THRESHOLD = 35.0;       // Hypothermie
const float TEMP_HIGH_THRESHOLD = 42.0;      // Température dangereuse
const float TEMP_MIN_VALID = 20.0;           // Température minimum valide
const float TEMP_MAX_VALID = 45.0;           // Température maximum valide

// Configuration batterie (si utilisée)
const int BATTERY_PIN = A0;  // Pin analogique pour lecture batterie
const float BATTERY_MAX_VOLTAGE = 4.2;  // Voltage max batterie Li-Ion
const float BATTERY_MIN_VOLTAGE = 3.0;   // Voltage min batterie Li-Ion

// ==================== VARIABLES GLOBALES ====================

// Objets principaux
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
WebSocketsClient webSocket;

// États de connexion
bool wifiConnected = false;
bool wsConnected = false;
bool sensorInitialized = false;

// Variables de mesure
float temperatureAmbiante = 0.0;
float temperatureCorporelle = 0.0;
float batteryLevel = 0.0;
int wifiSignalStrength = 0;

// Gestion du temps
unsigned long lastMeasureTime = 0;
unsigned long lastHeartbeatTime = 0;
unsigned long lastReconnectAttempt = 0;
unsigned long deviceStartTime = 0;

// Compteurs et statistiques
unsigned long totalMeasurements = 0;
unsigned long successfulTransmissions = 0;
unsigned long failedTransmissions = 0;
unsigned long reconnectionAttempts = 0;

// Buffer pour données en cas de déconnexion
struct MeasurementData {
    float tempAmb;
    float tempObj;
    unsigned long timestamp;
    bool sent;
};

const int BUFFER_SIZE = 50;
MeasurementData measurementBuffer[BUFFER_SIZE];
int bufferIndex = 0;
int bufferedCount = 0;

// ==================== SETUP ====================

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("\n" + String('=', 50));
    Serial.println("ESP32 + MLX90614 pour Système FAJMA");
    Serial.println("Version: " + String(FIRMWARE_VERSION));
    Serial.println("Device ID: " + String(DEVICE_ID));
    Serial.println(String('=', 50));
    
    deviceStartTime = millis();
    
    // Initialisation I2C
    Serial.println("[INIT] Initialisation I2C...");
    Wire.begin(21, 22);  // SDA=21, SCL=22
    Wire.setClock(100000);  // 100kHz pour stabilité
    
    // Initialisation du capteur MLX90614
    initializeSensor();
    
    // Initialisation WiFi
    initializeWiFi();
    
    // Configuration WebSocket
    setupWebSocket();
    
    // Initialisation du buffer
    initializeBuffer();
    
    // Configuration des pins
    pinMode(LED_BUILTIN, OUTPUT);
    
    Serial.println("[INIT] Système prêt - Démarrage des mesures");
    Serial.println(String('=', 50) + "\n");
    
    // Première mesure
    performMeasurement();
}

// ==================== LOOP PRINCIPAL ====================

void loop() {
    unsigned long currentTime = millis();
    
    // Maintenir les connexions
    maintainConnections();
    
    // Effectuer des mesures périodiques
    if (currentTime - lastMeasureTime >= MESURE_INTERVAL) {
        performMeasurement();
        lastMeasureTime = currentTime;
    }
    
    // Envoyer heartbeat périodique
    if (currentTime - lastHeartbeatTime >= HEARTBEAT_INTERVAL) {
        sendHeartbeat();
        lastHeartbeatTime = currentTime;
    }
    
    // Envoyer les données en buffer si connecté
    if (wsConnected && bufferedCount > 0) {
        sendBufferedData();
    }
    
    // Gestion LED de statut
    updateStatusLED();
    
    delay(100);  // Petit délai pour éviter la surcharge CPU
}

// ==================== INITIALISATION ====================

void initializeSensor() {
    Serial.print("[SENSOR] Initialisation MLX90614... ");
    
    if (mlx.begin()) {
        sensorInitialized = true;
        Serial.println("✓ Succès");
        
        // Test de lecture
        float testTemp = mlx.readAmbientTempC();
        if (!isnan(testTemp) && testTemp > -40 && testTemp < 85) {
            Serial.println("[SENSOR] Test de lecture: " + String(testTemp) + "°C");
        } else {
            Serial.println("[SENSOR] ⚠️ Lecture de test anormale: " + String(testTemp));
        }
    } else {
        sensorInitialized = false;
        Serial.println("✗ Échec");
        Serial.println("[ERROR] Vérifiez les connexions I2C:");
        Serial.println("        SDA -> GPIO 21");
        Serial.println("        SCL -> GPIO 22");
        Serial.println("        VCC -> 3.3V");
        Serial.println("        GND -> GND");
    }
}

void initializeWiFi() {
    Serial.println("[WIFI] Configuration WiFi...");
    
    WiFi.mode(WIFI_STA);
    WiFi.setAutoReconnect(true);
    WiFi.persistent(true);
    
    connectToWiFi();
}

void setupWebSocket() {
    Serial.println("[WS] Configuration WebSocket...");
    
    webSocket.begin(FAJMA_SERVER_IP, FAJMA_SERVER_PORT, WEBSOCKET_PATH);
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(RECONNECT_INTERVAL);
    webSocket.enableHeartbeat(15000, 3000, 2);  // ping/pong heartbeat
    
    Serial.println("[WS] Serveur: " + String(FAJMA_SERVER_IP) + ":" + String(FAJMA_SERVER_PORT));
    Serial.println("[WS] Path: " + String(WEBSOCKET_PATH));
}

void initializeBuffer() {
    for (int i = 0; i < BUFFER_SIZE; i++) {
        measurementBuffer[i].sent = true;
    }
    bufferIndex = 0;
    bufferedCount = 0;
}

// ==================== GESTION WIFI ====================

void connectToWiFi() {
    if (WiFi.status() == WL_CONNECTED) {
        return;
    }
    
    Serial.print("[WIFI] Connexion à " + String(WIFI_SSID) + "... ");
    
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        wifiConnected = true;
        wifiSignalStrength = WiFi.RSSI();
        
        Serial.println(" ✓ Connecté");
        Serial.println("[WIFI] IP: " + WiFi.localIP().toString());
        Serial.println("[WIFI] Signal: " + String(wifiSignalStrength) + " dBm");
        Serial.println("[WIFI] MAC: " + WiFi.macAddress());
    } else {
        wifiConnected = false;
        Serial.println(" ✗ Échec");
        Serial.println("[ERROR] Vérifiez le SSID et mot de passe WiFi");
    }
}

void maintainConnections() {
    // Vérifier WiFi
    if (WiFi.status() != WL_CONNECTED) {
        if (wifiConnected) {
            Serial.println("[WIFI] Connexion perdue");
            wifiConnected = false;
            wsConnected = false;
        }
        
        unsigned long currentTime = millis();
        if (currentTime - lastReconnectAttempt >= RECONNECT_INTERVAL) {
            reconnectionAttempts++;
            Serial.println("[WIFI] Tentative de reconnexion #" + String(reconnectionAttempts));
            connectToWiFi();
            lastReconnectAttempt = currentTime;
        }
    } else {
        if (!wifiConnected) {
            wifiConnected = true;
            Serial.println("[WIFI] Reconnexion réussie");
        }
        wifiSignalStrength = WiFi.RSSI();
    }
    
    // Maintenir WebSocket
    if (wifiConnected) {
        webSocket.loop();
    }
}

// ==================== GESTION WEBSOCKET ====================

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            wsConnected = false;
            Serial.println("[WS] Déconnecté du serveur FAJMA");
            break;
            
        case WStype_CONNECTED:
            wsConnected = true;
            Serial.println("[WS] ✓ Connecté au serveur FAJMA: " + String((char*)payload));
            sendConnectionMessage();
            break;
            
        case WStype_TEXT:
            Serial.println("[WS] Message reçu: " + String((char*)payload));
            processServerMessage(String((char*)payload));
            break;
            
        case WStype_ERROR:
            Serial.println("[WS] ✗ Erreur: " + String((char*)payload));
            break;
            
        case WStype_PONG:
            Serial.println("[WS] Pong reçu - Connexion active");
            break;
            
        default:
            break;
    }
}

void processServerMessage(String message) {
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);
    
    if (error) {
        Serial.println("[WS] Erreur parsing JSON: " + String(error.c_str()));
        return;
    }
    
    String command = doc["command"];
    
    if (command == "get_status") {
        sendDeviceStatus();
    } else if (command == "set_interval") {
        // Modifier l'intervalle de mesure (non implémenté dans cette version)
        Serial.println("[WS] Commande set_interval reçue");
    } else if (command == "calibrate") {
        // Calibration du capteur (non implémenté dans cette version)
        Serial.println("[WS] Commande calibrate reçue");
    }
}

// ==================== MESURES ET DONNÉES ====================

void performMeasurement() {
    if (!sensorInitialized) {
        Serial.println("[MEASURE] Capteur non initialisé");
        return;
    }
    
    Serial.println("\n[MEASURE] Prise de mesure #" + String(totalMeasurements + 1));
    
    // Lecture des températures
    temperatureAmbiante = mlx.readAmbientTempC();
    temperatureCorporelle = mlx.readObjectTempC();
    
    // Lecture du niveau de batterie
    batteryLevel = readBatteryLevel();
    
    // Validation des données
    bool validData = validateMeasurements();
    
    if (validData) {
        totalMeasurements++;
        
        // Affichage des mesures
        displayMeasurements();
        
        // Vérification des alertes
        checkAlerts();
        
        // Envoi des données
        if (wsConnected) {
            sendMeasurementData();
        } else {
            bufferMeasurement();
        }
    } else {
        Serial.println("[MEASURE] ⚠️ Données invalides - mesure ignorée");
    }
}

bool validateMeasurements() {
    // Vérifier si les lectures sont valides
    if (isnan(temperatureAmbiante) || isnan(temperatureCorporelle)) {
        Serial.println("[VALIDATE] Erreur: Lecture NaN");
        return false;
    }
    
    // Vérifier les plages de température
    if (temperatureAmbiante < -40 || temperatureAmbiante > 85) {
        Serial.println("[VALIDATE] Erreur: Température ambiante hors plage");
        return false;
    }
    
    if (temperatureCorporelle < TEMP_MIN_VALID || temperatureCorporelle > TEMP_MAX_VALID) {
        Serial.println("[VALIDATE] Erreur: Température corporelle hors plage");
        return false;
    }
    
    return true;
}

void displayMeasurements() {
    Serial.println("┌─────────────────────────────────┐");
    Serial.println("│        MESURES MLX90614         │");
    Serial.println("├─────────────────────────────────┤");
    Serial.printf("│ Temp. Ambiante : %6.2f°C     │\n", temperatureAmbiante);
    Serial.printf("│ Temp. Corporelle: %6.2f°C     │\n", temperatureCorporelle);
    Serial.printf("│ Batterie       : %6.1f%%      │\n", batteryLevel);
    Serial.printf("│ Signal WiFi    : %6d dBm    │\n", wifiSignalStrength);
    Serial.println("└─────────────────────────────────┘");
}

void checkAlerts() {
    String alertType = "";
    String alertMessage = "";
    
    if (temperatureCorporelle >= TEMP_HIGH_THRESHOLD) {
        alertType = "temperature_critique";
        alertMessage = "Température critique: " + String(temperatureCorporelle) + "°C";
    } else if (temperatureCorporelle >= TEMP_FEVER_THRESHOLD) {
        alertType = "fievre_detectee";
        alertMessage = "Fièvre détectée: " + String(temperatureCorporelle) + "°C";
    } else if (temperatureCorporelle <= TEMP_LOW_THRESHOLD && temperatureCorporelle >= TEMP_MIN_VALID) {
        alertType = "hypothermie_detectee";
        alertMessage = "Hypothermie détectée: " + String(temperatureCorporelle) + "°C";
    }
    
    if (alertType != "") {
        Serial.println("🚨 [ALERT] " + alertMessage);
        if (wsConnected) {
            sendAlert(alertType, alertMessage);
        }
    }
}

float readBatteryLevel() {
    // Simulation du niveau de batterie
    // Remplacez par votre code de lecture réel si vous utilisez une batterie
    int rawValue = analogRead(BATTERY_PIN);
    float voltage = (rawValue / 4095.0) * 3.3 * 2;  // Diviseur de tension
    
    if (voltage < BATTERY_MIN_VOLTAGE) voltage = BATTERY_MIN_VOLTAGE;
    if (voltage > BATTERY_MAX_VOLTAGE) voltage = BATTERY_MAX_VOLTAGE;
    
    float percentage = ((voltage - BATTERY_MIN_VOLTAGE) / (BATTERY_MAX_VOLTAGE - BATTERY_MIN_VOLTAGE)) * 100.0;
    
    // Si pas de batterie connectée, retourner 100%
    if (rawValue < 100) {
        return 100.0;
    }
    
    return percentage;
}

// ==================== ENVOI DE DONNÉES ====================

void sendMeasurementData() {
    StaticJsonDocument<400> doc;
    
    // Informations de base
    doc["device_id"] = DEVICE_ID;
    doc["type"] = "sensor_data";
    doc["timestamp"] = millis();
    
    // Données du capteur
    doc["temperature_ambiante"] = round(temperatureAmbiante * 100) / 100.0;
    doc["temperature_corporelle"] = round(temperatureCorporelle * 100) / 100.0;
    
    // Informations système
    doc["battery_level"] = round(batteryLevel * 10) / 10.0;
    doc["wifi_rssi"] = wifiSignalStrength;
    doc["uptime"] = (millis() - deviceStartTime) / 1000;
    doc["measurement_count"] = totalMeasurements;
    
    // Statistiques
    doc["success_rate"] = (totalMeasurements > 0) ? (float)successfulTransmissions / totalMeasurements * 100 : 0;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    if (webSocket.sendTXT(jsonString)) {
        successfulTransmissions++;
        Serial.println("[SEND] ✓ Données envoyées");
    } else {
        failedTransmissions++;
        Serial.println("[SEND] ✗ Échec envoi");
        bufferMeasurement();
    }
}

void sendAlert(String alertType, String message) {
    StaticJsonDocument<300> doc;
    
    doc["device_id"] = DEVICE_ID;
    doc["type"] = "alert";
    doc["alert_type"] = alertType;
    doc["message"] = message;
    doc["timestamp"] = millis();
    doc["priority"] = "high";
    doc["temperature"] = temperatureCorporelle;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    webSocket.sendTXT(jsonString);
    Serial.println("[ALERT] 🚨 Alerte envoyée: " + alertType);
}

void sendConnectionMessage() {
    StaticJsonDocument<300> doc;
    
    doc["device_id"] = DEVICE_ID;
    doc["type"] = "connection";
    doc["status"] = "online";
    doc["device_type"] = DEVICE_TYPE;
    doc["firmware_version"] = FIRMWARE_VERSION;
    doc["sensor_type"] = "MLX90614";
    doc["timestamp"] = millis();
    doc["ip_address"] = WiFi.localIP().toString();
    doc["mac_address"] = WiFi.macAddress();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    webSocket.sendTXT(jsonString);
    Serial.println("[CONNECT] Message de connexion envoyé");
}

void sendHeartbeat() {
    if (!wsConnected) return;
    
    StaticJsonDocument<250> doc;
    
    doc["device_id"] = DEVICE_ID;
    doc["type"] = "heartbeat";
    doc["timestamp"] = millis();
    doc["uptime"] = (millis() - deviceStartTime) / 1000;
    doc["free_heap"] = ESP.getFreeHeap();
    doc["wifi_rssi"] = WiFi.RSSI();
    doc["measurement_count"] = totalMeasurements;
    doc["success_rate"] = (totalMeasurements > 0) ? (float)successfulTransmissions / totalMeasurements * 100 : 0;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    webSocket.sendTXT(jsonString);
    Serial.println("[HEARTBEAT] 💓 Heartbeat envoyé");
}

void sendDeviceStatus() {
    StaticJsonDocument<400> doc;
    
    doc["device_id"] = DEVICE_ID;
    doc["type"] = "device_status";
    doc["timestamp"] = millis();
    
    // État général
    doc["status"]["wifi"] = wifiConnected;
    doc["status"]["websocket"] = wsConnected;
    doc["status"]["sensor"] = sensorInitialized;
    
    // Statistiques
    doc["stats"]["uptime"] = (millis() - deviceStartTime) / 1000;
    doc["stats"]["total_measurements"] = totalMeasurements;
    doc["stats"]["successful_transmissions"] = successfulTransmissions;
    doc["stats"]["failed_transmissions"] = failedTransmissions;
    doc["stats"]["reconnection_attempts"] = reconnectionAttempts;
    doc["stats"]["buffered_measurements"] = bufferedCount;
    
    // Informations système
    doc["system"]["free_heap"] = ESP.getFreeHeap();
    doc["system"]["chip_revision"] = ESP.getChipRevision();
    doc["system"]["sdk_version"] = ESP.getSdkVersion();
    doc["system"]["firmware_version"] = FIRMWARE_VERSION;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    webSocket.sendTXT(jsonString);
    Serial.println("[STATUS] État du device envoyé");
}

// ==================== GESTION BUFFER ====================

void bufferMeasurement() {
    if (bufferedCount >= BUFFER_SIZE) {
        Serial.println("[BUFFER] Buffer plein - écrasement de la plus ancienne mesure");
        // Trouver la plus ancienne mesure non envoyée
        int oldestIndex = 0;
        unsigned long oldestTime = measurementBuffer[0].timestamp;
        for (int i = 1; i < BUFFER_SIZE; i++) {
            if (measurementBuffer[i].timestamp < oldestTime) {
                oldestTime = measurementBuffer[i].timestamp;
                oldestIndex = i;
            }
        }
        bufferIndex = oldestIndex;
    } else {
        bufferedCount++;
    }
    
    // Sauvegarder la mesure
    measurementBuffer[bufferIndex].tempAmb = temperatureAmbiante;
    measurementBuffer[bufferIndex].tempObj = temperatureCorporelle;
    measurementBuffer[bufferIndex].timestamp = millis();
    measurementBuffer[bufferIndex].sent = false;
    
    Serial.println("[BUFFER] Mesure sauvegardée (" + String(bufferedCount) + "/" + String(BUFFER_SIZE) + ")");
    
    bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;
}

void sendBufferedData() {
    int sentCount = 0;
    
    for (int i = 0; i < BUFFER_SIZE && sentCount < 5; i++) {  // Limiter à 5 envois par cycle
        if (!measurementBuffer[i].sent) {
            StaticJsonDocument<300> doc;
            
            doc["device_id"] = DEVICE_ID;
            doc["type"] = "buffered_data";
            doc["timestamp"] = measurementBuffer[i].timestamp;
            doc["temperature_ambiante"] = measurementBuffer[i].tempAmb;
            doc["temperature_corporelle"] = measurementBuffer[i].tempObj;
            doc["buffered"] = true;
            
            String jsonString;
            serializeJson(doc, jsonString);
            
            if (webSocket.sendTXT(jsonString)) {
                measurementBuffer[i].sent = true;
                bufferedCount--;
                sentCount++;
                Serial.println("[BUFFER] ✓ Donnée buffer envoyée");
            } else {
                Serial.println("[BUFFER] ✗ Échec envoi buffer");
                break;  // Arrêter si l'envoi échoue
            }
        }
    }
    
    if (sentCount > 0) {
        Serial.println("[BUFFER] " + String(sentCount) + " mesures buffer envoyées, reste: " + String(bufferedCount));
    }
}

// ==================== UTILITAIRES ====================

void updateStatusLED() {
    static unsigned long lastLedUpdate = 0;
    static bool ledState = false;
    
    unsigned long currentTime = millis();
    
    if (wsConnected) {
        // Connecté: LED allumée en permanence
        digitalWrite(LED_BUILTIN, HIGH);
    } else if (wifiConnected) {
        // WiFi connecté mais pas WebSocket: clignotement lent
        if (currentTime - lastLedUpdate >= 1000) {
            ledState = !ledState;
            digitalWrite(LED_BUILTIN, ledState);
            lastLedUpdate = currentTime;
        }
    } else {
        // Pas de WiFi: clignotement rapide
        if (currentTime - lastLedUpdate >= 200) {
            ledState = !ledState;
            digitalWrite(LED_BUILTIN, ledState);
            lastLedUpdate = currentTime;
        }
    }
}

void printSystemInfo() {
    Serial.println("\n" + String('=', 60));
    Serial.println("INFORMATIONS SYSTÈME ESP32");
    Serial.println(String('=', 60));
    Serial.println("Chip Model: " + String(ESP.getChipModel()));
    Serial.println("Chip Revision: " + String(ESP.getChipRevision()));
    Serial.println("CPU Frequency: " + String(ESP.getCpuFreqMHz()) + " MHz");
    Serial.println("Flash Size: " + String(ESP.getFlashChipSize() / 1024 / 1024) + " MB");
    Serial.println("Free Heap: " + String(ESP.getFreeHeap()) + " bytes");
    Serial.println("SDK Version: " + String(ESP.getSdkVersion()));
    Serial.println("MAC Address: " + WiFi.macAddress());
    Serial.println(String('=', 60) + "\n");
}

// ==================== FONCTIONS DE DEBUG ====================

void printStatistics() {
    Serial.println("\n" + String('-', 40));
    Serial.println("STATISTIQUES DE FONCTIONNEMENT");
    Serial.println(String('-', 40));
    Serial.println("Uptime: " + String((millis() - deviceStartTime) / 1000) + " secondes");
    Serial.println("Mesures totales: " + String(totalMeasurements));
    Serial.println("Transmissions réussies: " + String(successfulTransmissions));
    Serial.println("Transmissions échouées: " + String(failedTransmissions));
    Serial.println("Tentatives de reconnexion: " + String(reconnectionAttempts));
    Serial.println("Mesures en buffer: " + String(bufferedCount));
    
    if (totalMeasurements > 0) {
        float successRate = (float)successfulTransmissions / totalMeasurements * 100;
        Serial.println("Taux de succès: " + String(successRate, 1) + "%");
    }
    
    Serial.println("Mémoire libre: " + String(ESP.getFreeHeap()) + " bytes");
    Serial.println(String('-', 40) + "\n");
}

// ==================== GESTION DES COMMANDES SÉRIE ====================

void handleSerialCommands() {
    if (Serial.available()) {
        String command = Serial.readStringUntil('\n');
        command.trim();
        command.toLowerCase();
        
        if (command == "status") {
            printSystemInfo();
            printStatistics();
        } else if (command == "measure") {
            performMeasurement();
        } else if (command == "reconnect") {
            Serial.println("[CMD] Reconnexion forcée...");
            WiFi.disconnect();
            webSocket.disconnect();
        } else if (command == "buffer") {
            Serial.println("[CMD] Contenu du buffer:");
            for (int i = 0; i < BUFFER_SIZE; i++) {
                if (!measurementBuffer[i].sent) {
                    Serial.printf("  [%d] Temp: %.2f°C, Time: %lu\n", 
                                i, measurementBuffer[i].tempObj, measurementBuffer[i].timestamp);
                }
            }
        } else if (command == "help") {
            Serial.println("[CMD] Commandes disponibles:");
            Serial.println("  status   - Afficher l'état du système");
            Serial.println("  measure  - Effectuer une mesure manuelle");
            Serial.println("  reconnect- Forcer la reconnexion");
            Serial.println("  buffer   - Afficher le contenu du buffer");
            Serial.println("  help     - Afficher cette aide");
        } else {
            Serial.println("[CMD] Commande inconnue: " + command);
            Serial.println("[CMD] Tapez 'help' pour voir les commandes disponibles");
        }
    }
}

/*
 * ==================== NOTES D'UTILISATION ====================
 * 
 * 1. CONFIGURATION INITIALE:
 *    - Modifiez WIFI_SSID et WIFI_PASSWORD
 *    - Modifiez FAJMA_SERVER_IP avec l'IP de votre serveur
 *    - Vérifiez les connexions I2C du MLX90614
 * 
 * 2. BIBLIOTHÈQUES REQUISES:
 *    - Adafruit MLX90614 Library
 *    - ArduinoJson (version 6.x)
 *    - WebSockets by Markus Sattler
 * 
 * 3. CONNEXIONS HARDWARE:
 *    MLX90614 VCC -> ESP32 3.3V
 *    MLX90614 GND -> ESP32 GND  
 *    MLX90614 SDA -> ESP32 GPIO 21
 *    MLX90614 SCL -> ESP32 GPIO 22
 * 
 * 4. FONCTIONNALITÉS:
 *    - Mesure de température sans contact
 *    - Envoi temps réel via WebSocket
 *    - Détection automatique d'alertes médicales
 *    - Buffer local en cas de déconnexion
 *    - Reconnexion automatique
 *    - Statistiques de fonctionnement
 *    - Commandes série pour debug
 * 
 * 5. COMMANDES SÉRIE:
 *    Ouvrez le moniteur série (115200 baud) et tapez:
 *    - "status" pour voir l'état du système
 *    - "measure" pour une mesure manuelle
 *    - "help" pour voir toutes les commandes
 * 
 * 6. LED DE STATUT:
 *    - Allumée fixe: Connecté au serveur FAJMA
 *    - Clignotement lent: WiFi connecté, WebSocket déconnecté
 *    - Clignotement rapide: WiFi déconnecté
 * 
 * ==================== FIN DU CODE ====================
 */