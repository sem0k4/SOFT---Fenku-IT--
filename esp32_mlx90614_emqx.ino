#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h>

// Configuration WiFi
const char* ssid = "El";
const char* password = "83796752";

// Configuration MQTT EMQX Cloud
const char* mqtt_broker = "b1d7df11.ala.eu-central-1.emqxsl.com";
const int mqtt_port = 8883;
const char* mqtt_username = "Fenku_IT";
const char* mqtt_password = "Enus814@001";
const char* mqtt_client_id = "esp32-mlx90614-sensor";

// Topics MQTT
const char* topic_temperature_data = "emqx/esp32/mlx90614/temperature";
const char* topic_device_status = "emqx/esp32/mlx90614/status";
const char* topic_commands = "emqx/esp32/mlx90614/commands";

// Configuration du capteur MLX90614
Adafruit_MLX90614 mlx = Adafruit_MLX90614();

// Clients WiFi et MQTT
WiFiClientSecure espClient;
PubSubClient client(espClient);

// Variables globales
unsigned long lastMsg = 0;
const long interval = 3000; // Intervalle de lecture en millisecondes (3 secondes)
bool sensorConnected = false;

void setup() {
  Serial.begin(115200);
  Serial.println("Démarrage du capteur MLX90614 avec EMQX Cloud");
  
  // Initialisation du capteur MLX90614
  if (!mlx.begin()) {
    Serial.println("Erreur: Capteur MLX90614 non trouvé!");
    sensorConnected = false;
  } else {
    Serial.println("Capteur MLX90614 initialisé avec succès");
    sensorConnected = true;
  }
  
  // Configuration WiFi
  setup_wifi();
  
  // Configuration MQTT avec TLS
  espClient.setInsecure(); // Pour les tests, ignore la vérification du certificat
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  
  // Connexion initiale MQTT
  reconnect();
  
  // Publication du statut initial
  publishStatus("online");
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connexion au WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connecté");
  Serial.print("Adresse IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message reçu sur le topic: ");
  Serial.println(topic);
  
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Contenu: ");
  Serial.println(message);
  
  // Traitement des commandes
  if (String(topic) == topic_commands) {
    handleCommand(message);
  }
}

void handleCommand(String command) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, command);
  
  if (error) {
    Serial.print("Erreur de parsing JSON: ");
    Serial.println(error.c_str());
    return;
  }
  
  String cmd = doc["command"];
  
  if (cmd == "read_temperature") {
    // Lecture immédiate de la température
    readAndPublishTemperature();
  } else if (cmd == "status") {
    // Publication du statut
    publishStatus("online");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentative de connexion MQTT...");
    
    if (client.connect(mqtt_client_id, mqtt_username, mqtt_password)) {
      Serial.println(" connecté");
      
      // Souscription aux commandes
      client.subscribe(topic_commands, 2); // QoS 2 pour garantir la livraison
      Serial.print("Souscrit au topic: ");
      Serial.println(topic_commands);
      
    } else {
      Serial.print(" échec, rc=");
      Serial.print(client.state());
      Serial.println(" nouvelle tentative dans 5 secondes");
      delay(5000);
    }
  }
}

void readAndPublishTemperature() {
  if (!sensorConnected) {
    Serial.println("Capteur MLX90614 non disponible");
    return;
  }
  
  // Lecture des températures
  double ambientTemp = mlx.readAmbientTempC();
  double objectTemp = mlx.readObjectTempC();
  
  // Vérification des valeurs
  if (isnan(ambientTemp) || isnan(objectTemp)) {
    Serial.println("Erreur de lecture du capteur MLX90614");
    return;
  }
  
  // Création du message JSON
  StaticJsonDocument<300> doc;
  doc["device_id"] = mqtt_client_id;
  doc["sensor_type"] = "MLX90614";
  doc["timestamp"] = millis();
  doc["ambient_temperature"] = round(ambientTemp * 100.0) / 100.0;
  doc["object_temperature"] = round(objectTemp * 100.0) / 100.0;
  doc["unit"] = "°C";
  
  // Sérialisation JSON
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Publication MQTT avec QoS 2
  if (client.publish(topic_temperature_data, jsonString.c_str(), false)) {
    Serial.println("Données publiées: " + jsonString);
  } else {
    Serial.println("Erreur de publication MQTT");
  }
}

void publishStatus(String status) {
  StaticJsonDocument<200> doc;
  doc["device_id"] = mqtt_client_id;
  doc["status"] = status;
  doc["timestamp"] = millis();
  doc["sensor_connected"] = sensorConnected;
  doc["wifi_rssi"] = WiFi.RSSI();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  if (client.publish(topic_device_status, jsonString.c_str(), true)) { // Retained message
    Serial.println("Statut publié: " + jsonString);
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;
    
    // Lecture et publication des données de température
    readAndPublishTemperature();
  }
  
  delay(100);
}