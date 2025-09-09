# =============================================================================
# FAJMA Backend Dockerfile
# =============================================================================
# Multi-stage build pour optimiser la taille de l'image

# =============================================================================
# STAGE 1: Build Stage
# =============================================================================
FROM python:3.11-slim as builder

# Métadonnées
LABEL maintainer="FAJMA Team <support@fajma.com>"
LABEL description="FAJMA IoT Healthcare System - Backend API"
LABEL version="1.0.0"

# Variables d'environnement pour Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Installer les dépendances système pour la compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Créer un utilisateur non-root
RUN useradd --create-home --shell /bin/bash fajma

# Définir le répertoire de travail
WORKDIR /app

# Copier et installer les dépendances Python
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# =============================================================================
# STAGE 2: Production Stage
# =============================================================================
FROM python:3.11-slim as production

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/home/fajma/.local/bin:$PATH \
    DJANGO_SETTINGS_MODULE=core.settings

# Installer les dépendances système runtime
RUN apt-get update && apt-get install -y \
    libpq5 \
    curl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Créer un utilisateur non-root
RUN useradd --create-home --shell /bin/bash fajma

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances Python depuis le stage builder
COPY --from=builder /home/fajma/.local /home/fajma/.local

# Copier le code de l'application
COPY --chown=fajma:fajma . .

# Créer les répertoires nécessaires
RUN mkdir -p /app/staticfiles /app/media /app/logs && \
    chown -R fajma:fajma /app

# Copier les scripts d'entrée
COPY --chown=fajma:fajma docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Passer à l'utilisateur non-root
USER fajma

# Exposer le port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

# Point d'entrée
ENTRYPOINT ["docker-entrypoint.sh"]

# Commande par défaut
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "core.asgi:application"]

# =============================================================================
# STAGE 3: Development Stage
# =============================================================================
FROM production as development

# Passer temporairement en root pour installer les outils de développement
USER root

# Installer les outils de développement
RUN pip install --no-cache-dir \
    django-debug-toolbar \
    django-extensions \
    ipython \
    pytest \
    pytest-django \
    coverage \
    black \
    flake8 \
    isort

# Repasser à l'utilisateur fajma
USER fajma

# Variables d'environnement pour le développement
ENV DEBUG=True \
    DJANGO_SETTINGS_MODULE=core.settings.development

# Commande par défaut pour le développement
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# =============================================================================
# BUILD INSTRUCTIONS
# =============================================================================
# 
# Build production image:
# docker build --target production -t fajma-backend:latest .
# 
# Build development image:
# docker build --target development -t fajma-backend:dev .
# 
# Run production container:
# docker run -d -p 8000:8000 --name fajma-backend fajma-backend:latest
# 
# Run development container:
# docker run -d -p 8000:8000 -v $(pwd):/app --name fajma-backend-dev fajma-backend:dev
# 
# =============================================================================