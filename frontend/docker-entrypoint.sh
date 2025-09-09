#!/bin/bash
# =============================================================================
# FAJMA Frontend Docker Entrypoint Script
# =============================================================================

set -e

# =============================================================================
# COLORS AND LOGGING
# =============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Function to wait for a service to be available
wait_for_service() {
    local host="$1"
    local port="$2"
    local service_name="$3"
    local timeout="${4:-30}"
    
    log_info "Waiting for $service_name at $host:$port..."
    
    for i in $(seq 1 $timeout); do
        if nc -z "$host" "$port" 2>/dev/null; then
            log_success "$service_name is available!"
            return 0
        fi
        log_info "Waiting for $service_name... ($i/$timeout)"
        sleep 1
    done
    
    log_error "$service_name is not available after ${timeout}s"
    return 1
}

# Function to check if backend API is healthy
check_backend_health() {
    local backend_url="${REACT_APP_API_URL:-http://backend:8000}"
    local timeout="${1:-30}"
    
    log_info "Checking backend health at $backend_url..."
    
    for i in $(seq 1 $timeout); do
        if curl -f -s "$backend_url/api/health/" >/dev/null 2>&1; then
            log_success "Backend API is healthy!"
            return 0
        fi
        log_info "Waiting for backend API... ($i/$timeout)"
        sleep 2
    done
    
    log_warning "Backend API health check failed after ${timeout}s, continuing anyway..."
    return 1
}

# Function to validate environment variables
validate_environment() {
    log_info "Validating environment variables..."
    
    # Check required environment variables
    local required_vars=(
        "NODE_ENV"
    )
    
    local missing_vars=()
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        log_error "Please check your .env file or Docker environment variables"
        return 1
    fi
    
    # Log current environment
    log_info "Environment: $NODE_ENV"
    log_info "API URL: ${REACT_APP_API_URL:-'Not set'}"
    log_info "WebSocket URL: ${REACT_APP_WS_URL:-'Not set'}"
    
    log_success "Environment validation completed"
}

# Function to setup development environment
setup_development() {
    log_info "Setting up development environment..."
    
    # Install dependencies if node_modules doesn't exist or package.json is newer
    if [[ ! -d "node_modules" ]] || [[ "package.json" -nt "node_modules" ]]; then
        log_info "Installing dependencies..."
        npm ci --silent
        log_success "Dependencies installed"
    else
        log_info "Dependencies already installed"
    fi
    
    # Create necessary directories
    mkdir -p /app/public/uploads
    mkdir -p /app/src/assets/temp
    
    log_success "Development environment setup completed"
}

# Function to setup production environment
setup_production() {
    log_info "Setting up production environment..."
    
    # Ensure nginx user exists
    if ! id "fajma" &>/dev/null; then
        log_info "Creating fajma user..."
        adduser --system --no-create-home --shell /bin/false --group fajma
    fi
    
    # Set proper permissions
    chown -R fajma:fajma /usr/share/nginx/html
    chown -R fajma:fajma /var/log/nginx
    chown -R fajma:fajma /var/cache/nginx
    
    # Create nginx directories if they don't exist
    mkdir -p /var/log/nginx
    mkdir -p /var/cache/nginx
    mkdir -p /var/run
    
    # Test nginx configuration
    log_info "Testing nginx configuration..."
    if nginx -t; then
        log_success "Nginx configuration is valid"
    else
        log_error "Nginx configuration is invalid"
        return 1
    fi
    
    log_success "Production environment setup completed"
}

# Function to run health checks
run_health_checks() {
    log_info "Running health checks..."
    
    # Check if we're in production mode
    if [[ "$NODE_ENV" == "production" ]]; then
        # Check if static files exist
        if [[ ! -f "/usr/share/nginx/html/index.html" ]]; then
            log_error "Static files not found. Build may have failed."
            return 1
        fi
        
        # Check nginx configuration
        if ! nginx -t >/dev/null 2>&1; then
            log_error "Nginx configuration test failed"
            return 1
        fi
    fi
    
    log_success "Health checks passed"
}

# Function to handle graceful shutdown
handle_shutdown() {
    log_info "Received shutdown signal, stopping services..."
    
    if [[ "$NODE_ENV" == "production" ]]; then
        # Stop nginx gracefully
        if pgrep nginx >/dev/null; then
            log_info "Stopping nginx..."
            nginx -s quit
            
            # Wait for nginx to stop
            for i in {1..10}; do
                if ! pgrep nginx >/dev/null; then
                    break
                fi
                sleep 1
            done
        fi
    else
        # Stop development server
        if [[ -n "$DEV_PID" ]]; then
            log_info "Stopping development server..."
            kill -TERM "$DEV_PID" 2>/dev/null || true
            wait "$DEV_PID" 2>/dev/null || true
        fi
    fi
    
    log_success "Shutdown completed"
    exit 0
}

# =============================================================================
# SIGNAL HANDLERS
# =============================================================================
trap handle_shutdown SIGTERM SIGINT SIGQUIT

# =============================================================================
# MAIN EXECUTION
# =============================================================================

log_info "Starting FAJMA Frontend Container..."
log_info "Node Environment: ${NODE_ENV:-development}"
log_info "Container User: $(whoami)"
log_info "Working Directory: $(pwd)"

# Validate environment
validate_environment

# Setup environment based on NODE_ENV
if [[ "$NODE_ENV" == "production" ]]; then
    setup_production
    
    # Wait for backend if configured
    if [[ -n "$REACT_APP_API_URL" ]]; then
        # Extract host and port from API URL
        backend_host=$(echo "$REACT_APP_API_URL" | sed -E 's|https?://([^:/]+).*|\1|')
        backend_port=$(echo "$REACT_APP_API_URL" | sed -E 's|https?://[^:]+:([0-9]+).*|\1|')
        
        if [[ "$backend_port" =~ ^[0-9]+$ ]]; then
            wait_for_service "$backend_host" "$backend_port" "Backend API" 60
        fi
        
        check_backend_health 30
    fi
else
    setup_development
    
    # Wait for backend in development
    if [[ -n "$REACT_APP_API_URL" ]] && [[ "$REACT_APP_API_URL" == *"backend"* ]]; then
        wait_for_service "backend" "8000" "Backend API" 60
        check_backend_health 30
    fi
fi

# Run health checks
run_health_checks

# Execute the main command
if [[ $# -eq 0 ]]; then
    # Default command based on environment
    if [[ "$NODE_ENV" == "production" ]]; then
        log_info "Starting nginx in production mode..."
        exec nginx -g "daemon off;"
    else
        log_info "Starting development server..."
        exec npm run dev -- --host 0.0.0.0 --port 5173
    fi
else
    # Execute provided command
    log_info "Executing command: $*"
    
    if [[ "$1" == "nginx" ]]; then
        exec "$@"
    elif [[ "$1" == "npm" ]] || [[ "$1" == "node" ]] || [[ "$1" == "yarn" ]]; then
        exec "$@"
    elif [[ "$1" == "dev" ]]; then
        exec npm run dev -- --host 0.0.0.0 --port 5173
    elif [[ "$1" == "build" ]]; then
        exec npm run build
    elif [[ "$1" == "test" ]]; then
        exec npm run test
    elif [[ "$1" == "bash" ]] || [[ "$1" == "sh" ]]; then
        exec "$@"
    else
        log_warning "Unknown command: $1"
        exec "$@"
    fi
fi