# Projet FAJ MA

Application web pour la gestion des services médicaux, incluant la consultation médicale, la téléconsultation, la prise de rendez-vous et l'analyse de données médicales.

## Structure du projet

Le projet est divisé en deux parties principales :

- **Backend** : API REST développée avec Django et Django REST Framework
- **Frontend** : Interface utilisateur développée avec React et Material-UI

## Prérequis

- Python 3.x
- Node.js et npm
- Base de données (configurée dans les paramètres Django)

## Installation

### Backend

1. Créer et activer un environnement virtuel :

```bash
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
```

2. Installer les dépendances :

```bash
cd backend
pip install -r requirements.txt
```

3. Appliquer les migrations :

```bash
python manage.py migrate
```

4. Lancer le serveur de développement :

```bash
python manage.py runserver
```

### Frontend

1. Installer les dépendances :

```bash
cd frontend
npm install
```

2. Lancer le serveur de développement :

```bash
npm run dev
```

## Fonctionnalités

- Consultation médicale
- Téléconsultation
- Prise de rendez-vous
- Analyse de données médicales
- Intelligence Artificielle médicale

## Déploiement

Pour déployer l'application en production, suivez les meilleures pratiques de déploiement pour Django et React.

## Licence

Ce projet est sous licence privée.
