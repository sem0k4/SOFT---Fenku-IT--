# Guide de Communication Directe ESP32 vers Serveur

## Vue d'Ensemble

Ce guide détaille les différentes méthodes pour envoyer des données directement depuis un ESP32 vers le serveur FAJMA, sans intermédiaires.

## 1. Communication MQTT (Recommandée)

### 1.1 Configuration ESP32 pour MQTT

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>

// Configuration WiFi
const char* ssid = "VOTRE_WIFI";
const char* password = "VOTRE_MOT_DE_PASSE";

// Configuration MQTT
const char* mqtt_server = "votre-serveur.com";
const int mqtt_port = 8883; // Port sécurisé
const char* mqtt_user = "esp32_device";
const char* mqtt_password = "mot_de_passe_securise";

// Topics MQTT
const char* topic_data = "fajma/esp32/data";
const char* topic_heartbeat = "fajma/esp32/heartbeat";
const char* topic_alert = "fajma/esp32/alert";

WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup() {
    Serial.begin(115200);
    
    // Connexion WiFi
    connectWiFi();
    
    // Configuration MQTT
    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(callback);
    
    // Certificat SSL (optionnel pour développement)
    espClient.setInsecure(); // À remplacer par un vrai certificat en production
}

void connectWiFi() {
    WiFi.begin(ssid, password);
    Serial.print("Connexion WiFi");
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println();
    Serial.println("WiFi connecté!");
    Serial.print("Adresse IP: ");
    Serial.println(WiFi.localIP());
}

void reconnectMQTT() {
    while (!client.connected()) {
        Serial.print("Tentative de connexion MQTT...");
        
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);
        
        if (client.connect(clientId.c_str(), mqtt_user, mqtt_password)) {
            Serial.println("connecté");
            
            // S'abonner aux topics de commande
            client.subscribe("fajma/esp32/commands");
            
            // Envoyer un message de connexion
            sendHeartbeat();
        } else {
            Serial.print("échec, rc=");
            Serial.print(client.state());
            Serial.println(" nouvelle tentative dans 5 secondes");
            delay(5000);
        }
    }
}

void callback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Message reçu [");
    Serial.print(topic);
    Serial.print("] ");
    
    String message;
    for (int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    Serial.println(message);
    
    // Traiter les commandes reçues
    processCommand(message);
}

void sendSensorData(float temperature, float humidity, int heartRate, float spO2) {
    if (!client.connected()) {
        reconnectMQTT();
    }
    
    // Créer le JSON des données
    StaticJsonDocument<200> doc;
    doc["device_id"] = "ESP32_001";
    doc["timestamp"] = millis();
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["heart_rate"] = heartRate;
    doc["spo2"] = spO2;
    doc["battery_level"] = getBatteryLevel();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Publier les données
    if (client.publish(topic_data, jsonString.c_str())) {
        Serial.println("Données envoyées: " + jsonString);
    } else {
        Serial.println("Échec envoi données");
    }
}

void sendAlert(String alertType, String message) {
    if (!client.connected()) {
        reconnectMQTT();
    }
    
    StaticJsonDocument<150> doc;
    doc["device_id"] = "ESP32_001";
    doc["alert_type"] = alertType;
    doc["message"] = message;
    doc["timestamp"] = millis();
    doc["priority"] = "high";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    client.publish(topic_alert, jsonString.c_str());
    Serial.println("Alerte envoyée: " + jsonString);
}

void sendHeartbeat() {
    StaticJsonDocument<100> doc;
    doc["device_id"] = "ESP32_001";
    doc["status"] = "online";
    doc["timestamp"] = millis();
    doc["uptime"] = millis() / 1000;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    client.publish(topic_heartbeat, jsonString.c_str());
}

void loop() {
    if (!client.connected()) {
        reconnectMQTT();
    }
    client.loop();
    
    // Envoyer des données toutes les 30 secondes
    static unsigned long lastSend = 0;
    if (millis() - lastSend > 30000) {
        // Lire les capteurs (exemple)
        float temp = readTemperature();
        float hum = readHumidity();
        int hr = readHeartRate();
        float spo2 = readSpO2();
        
        sendSensorData(temp, hum, hr, spo2);
        lastSend = millis();
    }
    
    // Heartbeat toutes les 5 minutes
    static unsigned long lastHeartbeat = 0;
    if (millis() - lastHeartbeat > 300000) {
        sendHeartbeat();
        lastHeartbeat = millis();
    }
}
```

## 2. Communication HTTP/HTTPS

### 2.1 Envoi de données via HTTP POST

```cpp
#include <HTTPClient.h>
#include <ArduinoJson.h>

void sendDataHTTP(float temperature, float humidity, int heartRate) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        
        // Configuration de la requête
        http.begin("https://votre-serveur.com/api/iot/data");
        http.addHeader("Content-Type", "application/json");
        http.addHeader("Authorization", "Bearer VOTRE_TOKEN_JWT");
        http.addHeader("X-Device-ID", "ESP32_001");
        
        // Créer le payload JSON
        StaticJsonDocument<300> doc;
        doc["device_id"] = "ESP32_001";
        doc["timestamp"] = getUnixTimestamp();
        doc["data"]["temperature"] = temperature;
        doc["data"]["humidity"] = humidity;
        doc["data"]["heart_rate"] = heartRate;
        doc["location"]["latitude"] = getLatitude();
        doc["location"]["longitude"] = getLongitude();
        
        String jsonString;
        serializeJson(doc, jsonString);
        
        // Envoyer la requête POST
        int httpResponseCode = http.POST(jsonString);
        
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println("Réponse HTTP: " + String(httpResponseCode));
            Serial.println("Réponse: " + response);
            
            // Traiter la réponse
            processServerResponse(response);
        } else {
            Serial.println("Erreur HTTP: " + String(httpResponseCode));
        }
        
        http.end();
    } else {
        Serial.println("WiFi non connecté");
    }
}

// Envoi de données par batch (plusieurs mesures)
void sendBatchDataHTTP(JsonArray measurements) {
    HTTPClient http;
    
    http.begin("https://votre-serveur.com/api/iot/batch");
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer VOTRE_TOKEN_JWT");
    
    StaticJsonDocument<1000> doc;
    doc["device_id"] = "ESP32_001";
    doc["batch_timestamp"] = getUnixTimestamp();
    doc["measurements"] = measurements;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode == 200) {
        Serial.println("Batch envoyé avec succès");
    } else {
        Serial.println("Erreur envoi batch: " + String(httpResponseCode));
    }
    
    http.end();
}
```

## 3. Communication WebSocket

### 3.1 WebSocket en temps réel

```cpp
#include <WebSocketsClient.h>

WebSocketsClient webSocket;
bool wsConnected = false;

void setupWebSocket() {
    // Configuration WebSocket
    webSocket.begin("votre-serveur.com", 8000, "/ws/iot/ESP32_001/");
    
    // Événements WebSocket
    webSocket.onEvent(webSocketEvent);
    
    // Authentification
    webSocket.setAuthorization("Bearer", "VOTRE_TOKEN_JWT");
    
    // Reconnexion automatique
    webSocket.setReconnectInterval(5000);
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.println("WebSocket Déconnecté");
            wsConnected = false;
            break;
            
        case WStype_CONNECTED:
            Serial.printf("WebSocket Connecté à: %s\n", payload);
            wsConnected = true;
            
            // Envoyer un message de connexion
            sendWSMessage("connection", "ESP32_001 connecté");
            break;
            
        case WStype_TEXT:
            Serial.printf("Message reçu: %s\n", payload);
            processWSMessage((char*)payload);
            break;
            
        case WStype_ERROR:
            Serial.printf("Erreur WebSocket: %s\n", payload);
            break;
            
        default:
            break;
    }
}

void sendWSMessage(String type, String data) {
    if (wsConnected) {
        StaticJsonDocument<200> doc;
        doc["type"] = type;
        doc["device_id"] = "ESP32_001";
        doc["timestamp"] = millis();
        doc["data"] = data;
        
        String message;
        serializeJson(doc, message);
        
        webSocket.sendTXT(message);
    }
}

void sendRealtimeData(float heartRate, float spO2) {
    if (wsConnected) {
        StaticJsonDocument<150> doc;
        doc["type"] = "realtime_data";
        doc["device_id"] = "ESP32_001";
        doc["timestamp"] = millis();
        doc["heart_rate"] = heartRate;
        doc["spo2"] = spO2;
        
        String message;
        serializeJson(doc, message);
        
        webSocket.sendTXT(message);
    }
}

void loop() {
    webSocket.loop();
    
    // Envoyer des données en temps réel
    static unsigned long lastRealtime = 0;
    if (millis() - lastRealtime > 1000) { // Chaque seconde
        float hr = readHeartRate();
        float spo2 = readSpO2();
        
        sendRealtimeData(hr, spo2);
        lastRealtime = millis();
    }
}
```

## 4. Communication LoRaWAN (Longue Distance)

### 4.1 Configuration LoRaWAN

```cpp
#include <lmic.h>
#include <hal/hal.h>

// Configuration LoRaWAN
static const u1_t PROGMEM APPEUI[8] = { /* Votre App EUI */ };
static const u1_t PROGMEM DEVEUI[8] = { /* Votre Device EUI */ };
static const u1_t PROGMEM APPKEY[16] = { /* Votre App Key */ };

void os_getArtEui (u1_t* buf) { memcpy_P(buf, APPEUI, 8);}
void os_getDevEui (u1_t* buf) { memcpy_P(buf, DEVEUI, 8);}
void os_getDevKey (u1_t* buf) { memcpy_P(buf, APPKEY, 16);}

static osjob_t sendjob;

// Mapping des pins
const lmic_pinmap lmic_pins = {
    .nss = 18,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 14,
    .dio = {26, 33, 32},
};

void sendLoRaData(float temperature, int heartRate) {
    // Préparer les données (format compact)
    uint8_t payload[8];
    
    // Encoder la température (2 bytes)
    int16_t temp_encoded = (int16_t)(temperature * 100);
    payload[0] = temp_encoded >> 8;
    payload[1] = temp_encoded & 0xFF;
    
    // Encoder le rythme cardiaque (2 bytes)
    uint16_t hr_encoded = (uint16_t)heartRate;
    payload[2] = hr_encoded >> 8;
    payload[3] = hr_encoded & 0xFF;
    
    // Timestamp (4 bytes)
    uint32_t timestamp = millis() / 1000;
    payload[4] = timestamp >> 24;
    payload[5] = (timestamp >> 16) & 0xFF;
    payload[6] = (timestamp >> 8) & 0xFF;
    payload[7] = timestamp & 0xFF;
    
    // Envoyer via LoRaWAN
    LMIC_setTxData2(1, payload, sizeof(payload), 0);
    Serial.println("Données LoRaWAN envoyées");
}

void onEvent (ev_t ev) {
    switch(ev) {
        case EV_JOINED:
            Serial.println("LoRaWAN rejoint le réseau");
            break;
            
        case EV_TXCOMPLETE:
            Serial.println("Transmission LoRaWAN terminée");
            
            // Programmer le prochain envoi
            os_setTimedCallback(&sendjob, os_getTime()+sec2osticks(60), do_send);
            break;
            
        default:
            break;
    }
}

void do_send(osjob_t* j) {
    if (LMIC.opmode & OP_TXRXPEND) {
        Serial.println("OP_TXRXPEND, pas d'envoi");
    } else {
        // Lire les capteurs et envoyer
        float temp = readTemperature();
        int hr = readHeartRate();
        
        sendLoRaData(temp, hr);
    }
}
```

## 5. Gestion des Erreurs et Reconnexion

### 5.1 Système de retry et buffer

```cpp
#include <EEPROM.h>

// Structure pour stocker les données en cas d'échec
struct DataBuffer {
    float temperature;
    float humidity;
    int heartRate;
    float spO2;
    unsigned long timestamp;
    bool sent;
};

#define BUFFER_SIZE 50
#define EEPROM_SIZE 4096

DataBuffer dataBuffer[BUFFER_SIZE];
int bufferIndex = 0;

void saveToBuffer(float temp, float hum, int hr, float spo2) {
    dataBuffer[bufferIndex] = {
        temp, hum, hr, spo2, millis(), false
    };
    
    bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;
    
    // Sauvegarder en EEPROM
    saveBufferToEEPROM();
}

void sendBufferedData() {
    for (int i = 0; i < BUFFER_SIZE; i++) {
        if (!dataBuffer[i].sent && dataBuffer[i].timestamp > 0) {
            bool success = false;
            
            // Essayer MQTT d'abord
            if (client.connected()) {
                success = sendSensorDataMQTT(
                    dataBuffer[i].temperature,
                    dataBuffer[i].humidity,
                    dataBuffer[i].heartRate,
                    dataBuffer[i].spO2
                );
            }
            
            // Si MQTT échoue, essayer HTTP
            if (!success && WiFi.status() == WL_CONNECTED) {
                success = sendDataHTTP(
                    dataBuffer[i].temperature,
                    dataBuffer[i].humidity,
                    dataBuffer[i].heartRate
                );
            }
            
            if (success) {
                dataBuffer[i].sent = true;
                Serial.println("Données buffer envoyées: " + String(i));
            }
        }
    }
}

void saveBufferToEEPROM() {
    EEPROM.begin(EEPROM_SIZE);
    EEPROM.put(0, dataBuffer);
    EEPROM.commit();
}

void loadBufferFromEEPROM() {
    EEPROM.begin(EEPROM_SIZE);
    EEPROM.get(0, dataBuffer);
}
```

## 6. Sécurité et Authentification

### 6.1 Authentification JWT

```cpp
#include <mbedtls/md.h>
#include <base64.h>

String deviceToken = "";
unsigned long tokenExpiry = 0;

String generateJWT() {
    // Header JWT
    StaticJsonDocument<100> header;
    header["alg"] = "HS256";
    header["typ"] = "JWT";
    
    String headerStr;
    serializeJson(header, headerStr);
    String encodedHeader = base64::encode(headerStr);
    
    // Payload JWT
    StaticJsonDocument<200> payload;
    payload["device_id"] = "ESP32_001";
    payload["iat"] = getUnixTimestamp();
    payload["exp"] = getUnixTimestamp() + 3600; // 1 heure
    payload["iss"] = "fajma-iot";
    
    String payloadStr;
    serializeJson(payload, payloadStr);
    String encodedPayload = base64::encode(payloadStr);
    
    // Signature
    String message = encodedHeader + "." + encodedPayload;
    String signature = hmacSHA256(message, "VOTRE_SECRET_KEY");
    String encodedSignature = base64::encode(signature);
    
    return message + "." + encodedSignature;
}

void refreshToken() {
    if (millis() > tokenExpiry - 300000) { // Renouveler 5 min avant expiration
        deviceToken = generateJWT();
        tokenExpiry = millis() + 3600000; // 1 heure
        Serial.println("Token JWT renouvelé");
    }
}
```

## 7. Optimisation de la Consommation

### 7.1 Mode Deep Sleep

```cpp
#include <esp_sleep.h>

#define SLEEP_DURATION 30 // secondes

void enterDeepSleep() {
    Serial.println("Entrée en mode Deep Sleep pour " + String(SLEEP_DURATION) + " secondes");
    
    // Sauvegarder l'état si nécessaire
    saveStateToRTC();
    
    // Configurer le réveil
    esp_sleep_enable_timer_wakeup(SLEEP_DURATION * 1000000);
    
    // Entrer en Deep Sleep
    esp_deep_sleep_start();
}

void setup() {
    Serial.begin(115200);
    
    // Vérifier la cause du réveil
    esp_sleep_wakeup_cause_t wakeup_reason = esp_sleep_get_wakeup_cause();
    
    switch(wakeup_reason) {
        case ESP_SLEEP_WAKEUP_TIMER:
            Serial.println("Réveil par timer");
            break;
        case ESP_SLEEP_WAKEUP_EXT0:
            Serial.println("Réveil par signal externe");
            break;
        default:
            Serial.println("Premier démarrage");
            break;
    }
    
    // Configuration normale...
    connectWiFi();
    setupMQTT();
}

void loop() {
    // Lire les capteurs
    float temp = readTemperature();
    int hr = readHeartRate();
    
    // Envoyer les données
    sendSensorData(temp, 0, hr, 0);
    
    // Attendre la confirmation d'envoi
    delay(5000);
    
    // Entrer en Deep Sleep
    enterDeepSleep();
}
```

## 8. Exemple d'Intégration Complète

### 8.1 Code principal avec tous les protocoles

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// Configuration
const char* ssid = "VOTRE_WIFI";
const char* password = "VOTRE_MOT_DE_PASSE";
const char* server_url = "votre-serveur.com";

// Clients de communication
WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);
WebSocketsClient webSocket;
HTTPClient http;

// Variables d'état
bool mqttConnected = false;
bool wsConnected = false;
bool wifiConnected = false;

void setup() {
    Serial.begin(115200);
    
    // Initialisation
    connectWiFi();
    setupMQTT();
    setupWebSocket();
    
    Serial.println("ESP32 prêt pour communication directe");
}

void loop() {
    // Maintenir les connexions
    maintainConnections();
    
    // Lire les capteurs
    SensorData data = readAllSensors();
    
    // Envoyer via le meilleur protocole disponible
    sendDataOptimal(data);
    
    delay(10000); // Attendre 10 secondes
}

void sendDataOptimal(SensorData data) {
    bool sent = false;
    
    // Priorité 1: WebSocket pour temps réel
    if (wsConnected && data.isRealtime) {
        sent = sendViaWebSocket(data);
    }
    
    // Priorité 2: MQTT pour fiabilité
    if (!sent && mqttConnected) {
        sent = sendViaMQTT(data);
    }
    
    // Priorité 3: HTTP en dernier recours
    if (!sent && wifiConnected) {
        sent = sendViaHTTP(data);
    }
    
    // Si tout échoue, sauvegarder en buffer
    if (!sent) {
        saveToBuffer(data);
        Serial.println("Données sauvegardées en buffer");
    }
}

struct SensorData {
    float temperature;
    float humidity;
    int heartRate;
    float spO2;
    float batteryLevel;
    bool isRealtime;
    unsigned long timestamp;
};

SensorData readAllSensors() {
    SensorData data;
    data.temperature = readTemperature();
    data.humidity = readHumidity();
    data.heartRate = readHeartRate();
    data.spO2 = readSpO2();
    data.batteryLevel = getBatteryLevel();
    data.isRealtime = (data.heartRate > 0); // Temps réel si rythme cardiaque détecté
    data.timestamp = millis();
    
    return data;
}
```

## 9. Configuration Serveur Django

### 9.1 Réception des données ESP32

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from datetime import datetime

@csrf_exempt
@api_view(['POST'])
def receive_iot_data(request):
    try:
        data = json.loads(request.body)
        device_id = data.get('device_id')
        
        # Valider les données
        if not device_id:
            return JsonResponse({'error': 'device_id requis'}, status=400)
        
        # Sauvegarder en base de données
        sensor_data = SensorData.objects.create(
            device_id=device_id,
            temperature=data.get('temperature'),
            humidity=data.get('humidity'),
            heart_rate=data.get('heart_rate'),
            spo2=data.get('spo2'),
            battery_level=data.get('battery_level'),
            timestamp=datetime.fromtimestamp(data.get('timestamp', 0) / 1000)
        )
        
        # Envoyer via WebSocket aux clients connectés
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"patient_{device_id}",
            {
                'type': 'sensor_data',
                'data': {
                    'temperature': sensor_data.temperature,
                    'heart_rate': sensor_data.heart_rate,
                    'timestamp': sensor_data.timestamp.isoformat()
                }
            }
        )
        
        return JsonResponse({'status': 'success', 'id': sensor_data.id})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
def receive_batch_data(request):
    try:
        data = json.loads(request.body)
        device_id = data.get('device_id')
        measurements = data.get('measurements', [])
        
        created_records = []
        for measurement in measurements:
            sensor_data = SensorData.objects.create(
                device_id=device_id,
                **measurement
            )
            created_records.append(sensor_data.id)
        
        return JsonResponse({
            'status': 'success',
            'created_count': len(created_records),
            'ids': created_records
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
```

## 10. Surveillance et Debugging

### 10.1 Logs et monitoring

```cpp
void logConnectionStatus() {
    Serial.println("=== État des Connexions ===");
    Serial.println("WiFi: " + String(WiFi.status() == WL_CONNECTED ? "Connecté" : "Déconnecté"));
    Serial.println("MQTT: " + String(mqttClient.connected() ? "Connecté" : "Déconnecté"));
    Serial.println("WebSocket: " + String(wsConnected ? "Connecté" : "Déconnecté"));
    Serial.println("Signal WiFi: " + String(WiFi.RSSI()) + " dBm");
    Serial.println("Mémoire libre: " + String(ESP.getFreeHeap()) + " bytes");
    Serial.println("Uptime: " + String(millis() / 1000) + " secondes");
    Serial.println("==============================");
}

void sendDiagnostics() {
    StaticJsonDocument<300> doc;
    doc["device_id"] = "ESP32_001";
    doc["type"] = "diagnostics";
    doc["wifi_rssi"] = WiFi.RSSI();
    doc["free_heap"] = ESP.getFreeHeap();
    doc["uptime"] = millis() / 1000;
    doc["reset_reason"] = esp_reset_reason();
    doc["chip_revision"] = ESP.getChipRevision();
    doc["sdk_version"] = ESP.getSdkVersion();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Envoyer via le protocole disponible
    if (mqttClient.connected()) {
        mqttClient.publish("fajma/esp32/diagnostics", jsonString.c_str());
    }
}
```

Ce guide couvre toutes les méthodes principales pour envoyer des données directement depuis ESP32 vers votre serveur FAJMA, avec des exemples pratiques et des considérations de sécurité et d'optimisation.