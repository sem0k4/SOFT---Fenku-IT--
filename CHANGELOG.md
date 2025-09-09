# 📝 Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

### À venir
- Intégration de nouveaux capteurs IoT
- Amélioration de l'interface utilisateur
- Optimisation des performances WebSocket

## [1.0.0] - 2024-01-15

### ✨ Ajouté
- **Système IoT complet** avec ESP32 et capteurs MLX90614/MAX30102
- **Interface web React** avec Material-UI pour la visualisation des données
- **API REST Django** avec authentification JWT
- **Communication WebSocket** en temps réel via Django Channels
- **Surveillance des signes vitaux** : SpO2, température corporelle, fréquence cardiaque
- **Système d'alertes** automatique pour les valeurs critiques
- **Dashboard temps réel** avec indicateurs de statut de connexion
- **Authentification sécurisée** avec tokens JWT
- **Documentation complète** du projet et de l'intégration

### 🏗️ Architecture
- **Backend Django** avec Django REST Framework
- **Frontend React** avec hooks personnalisés
- **Base de données** SQLite/PostgreSQL
- **Cache Redis** pour les WebSockets
- **ESP32** avec communication WiFi

### 🔧 Configuration
- **Docker** support pour le déploiement
- **Environment variables** pour la configuration
- **CORS** configuration pour le développement
- **WebSocket routing** avec authentification

### 📚 Documentation
- Guide d'installation complet
- Documentation API REST
- Guide de configuration ESP32
- Schémas d'architecture système
- Guide de déploiement production

### 🔒 Sécurité
- **JWT Authentication** pour l'API et WebSocket
- **Permissions** basées sur les rôles utilisateur
- **HTTPS** support en production
- **Rate limiting** pour les endpoints critiques

### 🧪 Tests
- Tests unitaires backend Django
- Tests d'intégration WebSocket
- Tests de connectivité ESP32
- Validation des données IoT

## [0.9.0] - 2024-01-10

### ✨ Ajouté
- **Prototype ESP32** avec capteurs de base
- **API REST** endpoints principaux
- **Interface React** basique
- **Modèles de données** IoT

### 🔧 Modifié
- Structure du projet réorganisée
- Configuration Django optimisée
- Amélioration des performances frontend

## [0.8.0] - 2024-01-05

### ✨ Ajouté
- **Django Channels** intégration
- **WebSocket** support basique
- **Redis** configuration
- **Consumer** WebSocket pour IoT

### 🐛 Corrigé
- Problèmes de connexion WebSocket
- Erreurs d'authentification JWT
- Bugs d'affichage frontend

## [0.7.0] - 2024-01-01

### ✨ Ajouté
- **Authentification JWT** complète
- **Permissions** système
- **Serializers** IoT
- **Views** API REST

### 🔧 Modifié
- Amélioration de la sécurité API
- Optimisation des requêtes base de données
- Refactoring du code frontend

## [0.6.0] - 2023-12-25

### ✨ Ajouté
- **Modèles Django** pour IoT
- **Base de données** structure
- **Migrations** initiales
- **Admin interface** Django

### 🔧 Modifié
- Structure des modèles optimisée
- Relations base de données améliorées

## [0.5.0] - 2023-12-20

### ✨ Ajouté
- **React frontend** structure de base
- **Material-UI** intégration
- **Routing** React Router
- **State management** hooks

### 🔧 Modifié
- Interface utilisateur modernisée
- Composants réutilisables créés

## [0.4.0] - 2023-12-15

### ✨ Ajouté
- **Django backend** configuration initiale
- **Settings** environnement
- **URLs** routing
- **CORS** configuration

### 🔧 Modifié
- Structure du projet backend
- Configuration de développement

## [0.3.0] - 2023-12-10

### ✨ Ajouté
- **ESP32** code Arduino complet
- **Capteurs** MLX90614 et MAX30102
- **WiFi** communication
- **JSON** data formatting

### 🔧 Modifié
- Optimisation du code ESP32
- Amélioration de la stabilité WiFi

## [0.2.0] - 2023-12-05

### ✨ Ajouté
- **Prototype** ESP32 basique
- **Capteur** température MLX90614
- **Communication** série
- **Tests** hardware

### 🐛 Corrigé
- Problèmes de lecture capteur
- Instabilité de connexion

## [0.1.0] - 2023-12-01

### ✨ Ajouté
- **Projet initial** FAJMA
- **Conception** architecture système
- **Planification** fonctionnalités
- **Documentation** préliminaire

### 🏗️ Infrastructure
- **Git** repository setup
- **Project** structure
- **Development** environment

---

## Types de Changements

- `✨ Ajouté` pour les nouvelles fonctionnalités
- `🔧 Modifié` pour les changements dans les fonctionnalités existantes
- `🐛 Corrigé` pour les corrections de bugs
- `🗑️ Supprimé` pour les fonctionnalités supprimées
- `🔒 Sécurité` pour les corrections de vulnérabilités
- `📚 Documentation` pour les changements de documentation
- `🏗️ Infrastructure` pour les changements d'infrastructure
- `🧪 Tests` pour les ajouts ou modifications de tests

## Liens

- [Repository GitHub](https://github.com/sem0k4/SOFT---Fenku-IT--)
- [Issues](https://github.com/sem0k4/SOFT---Fenku-IT--/issues)
- [Pull Requests](https://github.com/sem0k4/SOFT---Fenku-IT--/pulls)
- [Releases](https://github.com/sem0k4/SOFT---Fenku-IT--/releases)

---

**Note** : Les versions antérieures à 1.0.0 sont considérées comme des versions de développement et peuvent contenir des changements non rétrocompatibles.