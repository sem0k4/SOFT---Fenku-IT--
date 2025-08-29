# Guide d'Installation des Outils Nécessaires - Projet FAJMA

## Vue d'Ensemble

Ce guide détaille l'installation de tous les outils et dépendances nécessaires pour le projet FAJMA de télémédecine avec communication temps réel et intégration ESP32.

## 1. Prérequis Système

### Spécifications Minimales
- **OS** : Windows 10/11, Ubuntu 20.04+, macOS 12+
- **CPU** : 4 cœurs (8 recommandés)
- **RAM** : 8 GB (16 GB recommandés)
- **Stockage** : 100 GB SSD disponible
- **Réseau** : Connexion Internet stable

## 2. Installation des Outils de Base

### 2.1 Python 3.11+

**Windows :**
```powershell
# Télécharger depuis python.org ou utiliser winget
winget install Python.Python.3.11

# Vérifier l'installation
python --version
pip --version
```

**Ubuntu/Debian :**
```bash
sudo apt update
sudo apt install python3.11 python3.11-pip python3.11-venv

# Créer un alias (optionnel)
echo "alias python=python3.11" >> ~/.bashrc
source ~/.bashrc
```

**macOS :**
```bash
# Avec Homebrew
brew install python@3.11

# Ou télécharger depuis python.org
```

### 2.2 Node.js 18+ et npm

**Windows :**
```powershell
# Avec winget
winget install OpenJS.NodeJS

# Ou télécharger depuis nodejs.org
```

**Ubuntu/Debian :**
```bash
# Via NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier
node --version
npm --version
```

**macOS :**
```bash
# Avec Homebrew
brew install node@18
```

### 2.3 Git

**Windows :**
```powershell
winget install Git.Git
```

**Ubuntu/Debian :**
```bash
sudo apt install git
```

**macOS :**
```bash
brew install git
```

## 3. Base de Données PostgreSQL

### 3.1 Installation PostgreSQL 14+

**Windows :**
```powershell
# Télécharger l'installeur depuis postgresql.org
# Ou utiliser chocolatey
choco install postgresql14

# Démarrer le service
net start postgresql-x64-14
```

**Ubuntu/Debian :**
```bash
# Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer et activer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurer l'utilisateur
sudo -u postgres createuser --interactive
sudo -u postgres createdb fajma_db
```

**macOS :**
```bash
# Avec Homebrew
brew install postgresql@14
brew services start postgresql@14

# Créer la base de données
createdb fajma_db
```

### 3.2 Configuration PostgreSQL

```sql
-- Se connecter à PostgreSQL
psql -U postgres

-- Créer l'utilisateur et la base de données
CREATE USER fajma_user WITH PASSWORD 'votre_mot_de_passe_securise';
CREATE DATABASE fajma_db OWNER fajma_user;
GRANT ALL PRIVILEGES ON DATABASE fajma_db TO fajma_user;

-- Quitter
\q
```

## 4. Redis (Cache et Message Broker)

### 4.1 Installation Redis 7+

**Windows :**
```powershell
# Télécharger Redis pour Windows depuis GitHub
# Ou utiliser WSL2 avec Ubuntu

# Alternative : Docker
docker run -d --name redis-fajma -p 6379:6379 redis:7-alpine
```

**Ubuntu/Debian :**
```bash
# Installer Redis
sudo apt update
sudo apt install redis-server

# Configurer Redis
sudo nano /etc/redis/redis.conf
# Modifier : supervised systemd

# Redémarrer Redis
sudo systemctl restart redis
sudo systemctl enable redis

# Tester
redis-cli ping
```

**macOS :**
```bash
# Avec Homebrew
brew install redis
brew services start redis

# Tester
redis-cli ping
```

## 5. MQTT Broker (Mosquitto)

### 5.1 Installation Mosquitto

**Windows :**
```powershell
# Télécharger depuis mosquitto.org
# Ou utiliser chocolatey
choco install mosquitto

# Démarrer le service
net start mosquitto
```

**Ubuntu/Debian :**
```bash
# Installer Mosquitto
sudo apt update
sudo apt install mosquitto mosquitto-clients

# Démarrer et activer
sudo systemctl start mosquitto
sudo systemctl enable mosquitto

# Tester
mosquitto_pub -h localhost -t test -m "Hello FAJMA"
mosquitto_sub -h localhost -t test
```

**macOS :**
```bash
# Avec Homebrew
brew install mosquitto
brew services start mosquitto
```

### 5.2 Configuration Mosquitto avec TLS

```bash
# Créer le fichier de configuration
sudo nano /etc/mosquitto/mosquitto.conf
```

```conf
# Configuration Mosquitto pour FAJMA
port 1883
listener 8883
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
ca_file /etc/mosquitto/certs/ca.crt
require_certificate true

# Authentification
allow_anonymous false
password_file /etc/mosquitto/passwd

# Logging
log_dest file /var/log/mosquitto/mosquitto.log
log_type error
log_type warning
log_type notice
log_type information
```

## 6. Serveur Web Nginx

### 6.1 Installation Nginx

**Windows :**
```powershell
# Télécharger depuis nginx.org
# Ou utiliser chocolatey
choco install nginx
```

**Ubuntu/Debian :**
```bash
sudo apt update
sudo apt install nginx

# Démarrer et activer
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérifier le statut
sudo systemctl status nginx
```

**macOS :**
```bash
brew install nginx
brew services start nginx
```

### 6.2 Configuration Nginx pour FAJMA

```bash
# Créer la configuration du site
sudo nano /etc/nginx/sites-available/fajma
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;
    
    # Certificats SSL
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Configuration SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Proxy vers Django
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket pour chat temps réel
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
    
    # Fichiers statiques
    location /static/ {
        alias /path/to/static/files/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/fajma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Environnement de Développement Python

### 7.1 Création de l'environnement virtuel

```bash
# Naviguer vers le dossier du projet
cd /path/to/SOFT---Fenku-IT---bakary

# Créer l'environnement virtuel
python -m venv venv_fajma

# Activer l'environnement
# Windows
venv_fajma\Scripts\activate

# Linux/macOS
source venv_fajma/bin/activate
```

### 7.2 Installation des dépendances Python

```bash
# Installer les dépendances backend
cd backend
pip install -r requirements.txt

# Dépendances supplémentaires pour le développement
pip install black flake8 pytest pytest-django coverage
```

### 7.3 Fichier requirements.txt complet

```txt
# Core Django
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1

# Base de données
psycopg2-binary==2.9.7

# Communication Temps Réel
channels==4.0.0
channels-redis==4.1.0
django-channels-presence==1.0.1
aiortc==1.6.0
websockets==12.0

# IoT et MQTT
paho-mqtt==1.6.1
pyserial==3.5

# Sécurité
cryptography==41.0.7
PyJWT==2.8.0

# Utilitaires
celery==5.3.4
redis==5.0.1
pillow==10.1.0
requests==2.31.0

# Développement
django-debug-toolbar==4.2.0
django-extensions==3.2.3
```

## 8. Environnement Frontend (React)

### 8.1 Installation des dépendances

```bash
# Naviguer vers le frontend
cd frontend

# Installer les dépendances
npm install

# Ou avec yarn
yarn install
```

### 8.2 Dépendances package.json

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5",
    "tailwindcss": "^3.3.0",
    "socket.io-client": "^4.7.2",
    "simple-peer": "^9.11.1",
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0",
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "prettier": "^3.0.0"
  }
}
```

## 9. Outils de Développement ESP32

### 9.1 Arduino IDE

```bash
# Télécharger Arduino IDE 2.x depuis arduino.cc

# Ajouter le support ESP32
# File > Preferences > Additional Board Manager URLs:
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json

# Tools > Board > Boards Manager > Rechercher "ESP32" > Installer
```

### 9.2 Bibliothèques Arduino nécessaires

```cpp
// Dans Arduino IDE : Tools > Manage Libraries
// Installer les bibliothèques suivantes :

// Communication
- PubSubClient (2.8+)     // MQTT
- ArduinoJson (6.21+)     // JSON parsing
- WiFi (ESP32 built-in)   // WiFi connectivity

// Capteurs
- MAX30105lib (1.0+)      // Capteur SpO2/Rythme cardiaque
- OneWire (2.3+)          // Communication capteurs
- DallasTemperature (3.9+) // Capteur température DS18B20
- Adafruit_BME280 (2.2+)  // Capteur environnemental

// Sécurité
- ESP32 Crypto (built-in) // Chiffrement
- ArduinoBearSSL (1.7+)   // SSL/TLS

// Utilitaires
- NTPClient (3.2+)        // Synchronisation temps
- ArduinoOTA (1.0+)       // Mise à jour OTA
```

### 9.3 Configuration ESP32

```cpp
// Configuration dans Arduino IDE
// Tools > Board > ESP32 Arduino > ESP32 Dev Module

// Paramètres recommandés :
// - Upload Speed: 921600
// - CPU Frequency: 240MHz
// - Flash Frequency: 80MHz
// - Flash Mode: QIO
// - Flash Size: 4MB
// - Partition Scheme: Default 4MB with spiffs
```

## 10. Outils de Développement Optionnels

### 10.1 Docker (Recommandé)

**Windows :**
```powershell
# Télécharger Docker Desktop depuis docker.com
winget install Docker.DockerDesktop
```

**Ubuntu :**
```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
```

### 10.2 VS Code avec Extensions

```bash
# Installer VS Code
# Windows
winget install Microsoft.VisualStudioCode

# Ubuntu
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code
```

**Extensions recommandées :**
- Python
- Django
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Arduino
- GitLens
- Prettier
- ESLint

## 11. Certificats SSL/TLS

### 11.1 Génération avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Générer le certificat
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

### 11.2 Certificats auto-signés (Développement)

```bash
# Créer le répertoire
sudo mkdir -p /etc/ssl/fajma

# Générer la clé privée
sudo openssl genrsa -out /etc/ssl/fajma/server.key 2048

# Générer le certificat
sudo openssl req -new -x509 -key /etc/ssl/fajma/server.key -out /etc/ssl/fajma/server.crt -days 365
```

## 12. Scripts de Démarrage

### 12.1 Script de démarrage complet (start_fajma.sh)

```bash
#!/bin/bash

# Script de démarrage FAJMA
echo "🚀 Démarrage de l'environnement FAJMA..."

# Vérifier les services
echo "📋 Vérification des services..."
sudo systemctl status postgresql redis mosquitto nginx

# Activer l'environnement virtuel
echo "🐍 Activation de l'environnement Python..."
source venv_fajma/bin/activate

# Démarrer le backend Django
echo "🔧 Démarrage du backend Django..."
cd backend
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000 &

# Démarrer le frontend React
echo "⚛️ Démarrage du frontend React..."
cd ../frontend
npm run dev &

echo "✅ FAJMA démarré avec succès!"
echo "🌐 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"
```

### 12.2 Script d'arrêt (stop_fajma.sh)

```bash
#!/bin/bash

echo "🛑 Arrêt de l'environnement FAJMA..."

# Arrêter les processus Node.js et Python
pkill -f "npm run dev"
pkill -f "python manage.py runserver"

echo "✅ FAJMA arrêté avec succès!"
```

## 13. Vérification de l'Installation

### 13.1 Script de test complet

```bash
#!/bin/bash

echo "🔍 Vérification de l'installation FAJMA..."

# Tester Python
echo "Testing Python..."
python --version || echo "❌ Python non installé"

# Tester Node.js
echo "Testing Node.js..."
node --version || echo "❌ Node.js non installé"

# Tester PostgreSQL
echo "Testing PostgreSQL..."
psql --version || echo "❌ PostgreSQL non installé"

# Tester Redis
echo "Testing Redis..."
redis-cli ping || echo "❌ Redis non accessible"

# Tester Mosquitto
echo "Testing Mosquitto..."
mosquitto_pub -h localhost -t test -m "test" || echo "❌ Mosquitto non accessible"

# Tester Nginx
echo "Testing Nginx..."
nginx -t || echo "❌ Configuration Nginx invalide"

echo "✅ Vérification terminée!"
```

## 14. Dépannage Courant

### 14.1 Problèmes PostgreSQL

```bash
# Réinitialiser le mot de passe
sudo -u postgres psql
\password postgres

# Vérifier les connexions
sudo netstat -plunt | grep postgres
```

### 14.2 Problèmes Redis

```bash
# Vérifier le statut
sudo systemctl status redis

# Redémarrer Redis
sudo systemctl restart redis

# Vérifier les logs
sudo journalctl -u redis
```

### 14.3 Problèmes MQTT

```bash
# Vérifier la configuration
sudo mosquitto -c /etc/mosquitto/mosquitto.conf -v

# Tester la connectivité
mosquitto_sub -h localhost -t '$SYS/#'
```

---

**Note** : Ce guide couvre l'installation complète de tous les outils nécessaires. Adaptez les chemins et configurations selon votre environnement spécifique.

**Version** : 1.0  
**Auteur** : FENKU-IT  
**Date** : $(date +%Y-%m-%d)