# =============================================================================
# FAJMA Frontend Dockerfile
# =============================================================================
# Multi-stage build pour optimiser la taille de l'image

# =============================================================================
# STAGE 1: Build Stage
# =============================================================================
FROM node:18-alpine as builder

# Métadonnées
LABEL maintainer="FAJMA Team <support@fajma.com>"
LABEL description="FAJMA IoT Healthcare System - Frontend React App"
LABEL version="1.0.0"

# Installer les dépendances système
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production --silent

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ARG VITE_API_BASE_URL=http://localhost:8000/api
ARG VITE_WS_BASE_URL=ws://localhost:8000/ws
ARG NODE_ENV=production

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL
ENV NODE_ENV=$NODE_ENV

# Build de l'application
RUN npm run build

# =============================================================================
# STAGE 2: Production Stage avec Nginx
# =============================================================================
FROM nginx:alpine as production

# Installer curl pour les health checks
RUN apk add --no-cache curl

# Copier les fichiers buildés depuis le stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S fajma && \
    adduser -S fajma -u 1001 -G fajma

# Ajuster les permissions
RUN chown -R fajma:fajma /usr/share/nginx/html && \
    chown -R fajma:fajma /var/cache/nginx && \
    chown -R fajma:fajma /var/log/nginx && \
    chown -R fajma:fajma /etc/nginx/conf.d

# Créer les répertoires pour les PID files
RUN touch /var/run/nginx.pid && \
    chown -R fajma:fajma /var/run/nginx.pid

# Passer à l'utilisateur non-root
USER fajma

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Commande par défaut
CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# STAGE 3: Development Stage
# =============================================================================
FROM node:18-alpine as development

# Installer les dépendances système
RUN apk add --no-cache \
    git \
    curl

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S fajma && \
    adduser -S fajma -u 1001 -G fajma

# Définir le répertoire de travail
WORKDIR /app

# Changer le propriétaire du répertoire
RUN chown -R fajma:fajma /app

# Passer à l'utilisateur non-root
USER fajma

# Copier les fichiers de configuration des dépendances
COPY --chown=fajma:fajma package*.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm install

# Copier le code source
COPY --chown=fajma:fajma . .

# Variables d'environnement pour le développement
ENV NODE_ENV=development
ENV VITE_API_BASE_URL=http://localhost:8000/api
ENV VITE_WS_BASE_URL=ws://localhost:8000/ws

# Exposer le port de développement
EXPOSE 5173

# Health check pour le développement
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5173 || exit 1

# Commande par défaut pour le développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# =============================================================================
# STAGE 4: Testing Stage
# =============================================================================
FROM development as testing

# Variables d'environnement pour les tests
ENV NODE_ENV=test
ENV CI=true

# Commande par défaut pour les tests
CMD ["npm", "run", "test"]

# =============================================================================
# BUILD INSTRUCTIONS
# =============================================================================
# 
# Build production image:
# docker build --target production -t fajma-frontend:latest .
# 
# Build development image:
# docker build --target development -t fajma-frontend:dev .
# 
# Build testing image:
# docker build --target testing -t fajma-frontend:test .
# 
# Run production container:
# docker run -d -p 3000:3000 --name fajma-frontend fajma-frontend:latest
# 
# Run development container:
# docker run -d -p 5173:5173 -v $(pwd):/app --name fajma-frontend-dev fajma-frontend:dev
# 
# Run tests:
# docker run --rm fajma-frontend:test
# 
# Build with custom API URL:
# docker build --target production --build-arg VITE_API_BASE_URL=https://api.fajma.com/api -t fajma-frontend:prod .
# 
# =============================================================================