#!/bin/bash

# =============================================================================
# FAJMA Backend Docker Entrypoint Script
# =============================================================================
# Ce script prépare l'environnement Django avant le démarrage du serveur

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] FAJMA Backend:${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] FAJMA Backend:${NC} ✅ $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] FAJMA Backend:${NC} ⚠️  $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] FAJMA Backend:${NC} ❌ $1"
}

# =============================================================================
# FONCTIONS UTILITAIRES
# =============================================================================

# Attendre qu'un service soit disponible
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local max_attempts=30
    local attempt=1
    
    log "Attente de $service_name ($host:$port)..."
    
    while ! nc -z "$host" "$port" >/dev/null 2>&1; do
        if [ $attempt -eq $max_attempts ]; then
            log_error "$service_name n'est pas disponible après $max_attempts tentatives"
            exit 1
        fi
        
        log "Tentative $attempt/$max_attempts - $service_name non disponible, attente..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_success "$service_name est disponible"
}

# Vérifier les variables d'environnement requises
check_env_vars() {
    local required_vars=("SECRET_KEY")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Variables d'environnement manquantes: ${missing_vars[*]}"
        exit 1
    fi
    
    log_success "Variables d'environnement vérifiées"
}

# Créer les répertoires nécessaires
create_directories() {
    local dirs=("staticfiles" "media" "logs")
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "/app/$dir" ]; then
            mkdir -p "/app/$dir"
            log "Répertoire créé: /app/$dir"
        fi
    done
    
    log_success "Répertoires vérifiés/créés"
}

# =============================================================================
# FONCTIONS DJANGO
# =============================================================================

# Collecter les fichiers statiques
collect_static() {
    log "Collecte des fichiers statiques..."
    python manage.py collectstatic --noinput --clear
    log_success "Fichiers statiques collectés"
}

# Exécuter les migrations
run_migrations() {
    log "Vérification des migrations..."
    
    # Vérifier s'il y a des migrations en attente
    if python manage.py showmigrations --plan | grep -q "\[ \]"; then
        log "Exécution des migrations..."
        python manage.py migrate --noinput
        log_success "Migrations appliquées"
    else
        log_success "Aucune migration en attente"
    fi
}

# Créer un superutilisateur si nécessaire
create_superuser() {
    if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ] && [ "$DJANGO_SUPERUSER_EMAIL" ]; then
        log "Création du superutilisateur..."
        python manage.py createsuperuser --noinput --username "$DJANGO_SUPERUSER_USERNAME" --email "$DJANGO_SUPERUSER_EMAIL" || true
        log_success "Superutilisateur vérifié/créé"
    fi
}

# Charger les données de test
load_fixtures() {
    if [ "$LOAD_FIXTURES" = "true" ] && [ -f "fixtures/initial_data.json" ]; then
        log "Chargement des données de test..."
        python manage.py loaddata fixtures/initial_data.json
        log_success "Données de test chargées"
    fi
}

# Vérifier la santé de Django
check_django_health() {
    log "Vérification de la santé de Django..."
    python manage.py check --deploy
    log_success "Django est prêt"
}

# =============================================================================
# SCRIPT PRINCIPAL
# =============================================================================

main() {
    log "🚀 Démarrage de FAJMA Backend..."
    
    # Vérifications préliminaires
    check_env_vars
    create_directories
    
    # Attendre les services externes
    if [ "$DATABASE_URL" ]; then
        # Extraire host et port de DATABASE_URL si c'est PostgreSQL
        if [[ $DATABASE_URL == postgresql://* ]]; then
            DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
            DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
            wait_for_service "$DB_HOST" "$DB_PORT" "PostgreSQL"
        fi
    fi
    
    if [ "$REDIS_URL" ]; then
        # Extraire host et port de REDIS_URL
        REDIS_HOST=$(echo $REDIS_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
        if [ -z "$REDIS_HOST" ]; then
            REDIS_HOST=$(echo $REDIS_URL | sed -n 's/redis:\/\/\([^:]*\):.*/\1/p')
        fi
        REDIS_PORT=$(echo $REDIS_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
        wait_for_service "$REDIS_HOST" "$REDIS_PORT" "Redis"
    fi
    
    # Préparation Django
    run_migrations
    collect_static
    create_superuser
    load_fixtures
    check_django_health
    
    log_success "🎉 FAJMA Backend prêt à démarrer!"
    
    # Exécuter la commande passée en argument
    exec "$@"
}

# =============================================================================
# GESTION DES SIGNAUX
# =============================================================================

# Fonction de nettoyage
cleanup() {
    log "🛑 Arrêt de FAJMA Backend..."
    # Ajouter ici toute logique de nettoyage nécessaire
    exit 0
}

# Capturer les signaux d'arrêt
trap cleanup SIGTERM SIGINT

# =============================================================================
# POINT D'ENTRÉE
# =============================================================================

# Vérifier si des arguments ont été passés
if [ $# -eq 0 ]; then
    log_error "Aucune commande spécifiée"
    exit 1
fi

# Exécuter le script principal
main "$@"