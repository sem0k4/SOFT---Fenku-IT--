# =============================================================================
# FAJMA IoT Healthcare System - Makefile
# =============================================================================

# Variables
PROJECT_NAME := fajma
DOCKER_COMPOSE := docker-compose
DOCKER_COMPOSE_DEV := docker-compose -f docker-compose.yml -f docker-compose.dev.yml
DOCKER_COMPOSE_PROD := docker-compose -f docker-compose.yml -f docker-compose.prod.yml
PYTHON := python3
NODE := node
NPM := npm
PIP := pip3

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# =============================================================================
# HELP
# =============================================================================

.PHONY: help
help: ## Show this help message
	@echo "$(BLUE)FAJMA IoT Healthcare System - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Usage: make <command>$(NC)"

# =============================================================================
# DEVELOPMENT SETUP
# =============================================================================

.PHONY: setup
setup: ## Setup development environment
	@echo "$(BLUE)Setting up development environment...$(NC)"
	@make setup-backend
	@make setup-frontend
	@make setup-env
	@echo "$(GREEN)Development environment setup complete!$(NC)"

.PHONY: setup-backend
setup-backend: ## Setup backend development environment
	@echo "$(BLUE)Setting up backend...$(NC)"
	cd backend && $(PYTHON) -m venv venv
	cd backend && source venv/bin/activate && $(PIP) install -r requirements.txt
	cd backend && source venv/bin/activate && $(PIP) install -r requirements-dev.txt
	@echo "$(GREEN)Backend setup complete!$(NC)"

.PHONY: setup-frontend
setup-frontend: ## Setup frontend development environment
	@echo "$(BLUE)Setting up frontend...$(NC)"
	cd frontend && $(NPM) install
	@echo "$(GREEN)Frontend setup complete!$(NC)"

.PHONY: setup-env
setup-env: ## Copy environment files
	@echo "$(BLUE)Setting up environment files...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env; echo "$(YELLOW)Created .env file. Please update it with your settings.$(NC)"; fi
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env; echo "$(YELLOW)Created backend/.env file.$(NC)"; fi
	@if [ ! -f frontend/.env ]; then cp frontend/.env.example frontend/.env; echo "$(YELLOW)Created frontend/.env file.$(NC)"; fi

# =============================================================================
# DEVELOPMENT COMMANDS
# =============================================================================

.PHONY: dev
dev: ## Start development environment with Docker
	@echo "$(BLUE)Starting development environment...$(NC)"
	$(DOCKER_COMPOSE_DEV) up --build

.PHONY: dev-detached
dev-detached: ## Start development environment in background
	@echo "$(BLUE)Starting development environment in background...$(NC)"
	$(DOCKER_COMPOSE_DEV) up -d --build

.PHONY: dev-backend
dev-backend: ## Start only backend services
	@echo "$(BLUE)Starting backend services...$(NC)"
	$(DOCKER_COMPOSE_DEV) up backend postgres redis -d

.PHONY: dev-frontend
dev-frontend: ## Start only frontend service
	@echo "$(BLUE)Starting frontend service...$(NC)"
	$(DOCKER_COMPOSE_DEV) up frontend -d

.PHONY: dev-local-backend
dev-local-backend: ## Run backend locally (without Docker)
	@echo "$(BLUE)Starting backend locally...$(NC)"
	cd backend && source venv/bin/activate && python manage.py runserver 0.0.0.0:8000

.PHONY: dev-local-frontend
dev-local-frontend: ## Run frontend locally (without Docker)
	@echo "$(BLUE)Starting frontend locally...$(NC)"
	cd frontend && $(NPM) run dev

# =============================================================================
# PRODUCTION COMMANDS
# =============================================================================

.PHONY: prod
prod: ## Start production environment
	@echo "$(BLUE)Starting production environment...$(NC)"
	$(DOCKER_COMPOSE_PROD) up -d --build

.PHONY: prod-build
prod-build: ## Build production images
	@echo "$(BLUE)Building production images...$(NC)"
	$(DOCKER_COMPOSE_PROD) build

.PHONY: prod-deploy
prod-deploy: ## Deploy to production (build and start)
	@echo "$(BLUE)Deploying to production...$(NC)"
	@make prod-build
	@make prod
	@echo "$(GREEN)Production deployment complete!$(NC)"

# =============================================================================
# DATABASE COMMANDS
# =============================================================================

.PHONY: migrate
migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py migrate

.PHONY: makemigrations
makemigrations: ## Create new database migrations
	@echo "$(BLUE)Creating database migrations...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py makemigrations

.PHONY: migrate-local
migrate-local: ## Run migrations locally
	@echo "$(BLUE)Running migrations locally...$(NC)"
	cd backend && source venv/bin/activate && python manage.py migrate

.PHONY: makemigrations-local
makemigrations-local: ## Create migrations locally
	@echo "$(BLUE)Creating migrations locally...$(NC)"
	cd backend && source venv/bin/activate && python manage.py makemigrations

.PHONY: db-reset
db-reset: ## Reset database (WARNING: This will delete all data)
	@echo "$(RED)WARNING: This will delete all database data!$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up -d postgres redis
	@sleep 5
	@make migrate
	@make createsuperuser

.PHONY: createsuperuser
createsuperuser: ## Create Django superuser
	@echo "$(BLUE)Creating Django superuser...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py createsuperuser

.PHONY: loaddata
loaddata: ## Load sample data
	@echo "$(BLUE)Loading sample data...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py loaddata fixtures/sample_data.json

# =============================================================================
# TESTING COMMANDS
# =============================================================================

.PHONY: test
test: ## Run all tests
	@echo "$(BLUE)Running all tests...$(NC)"
	@make test-backend
	@make test-frontend

.PHONY: test-backend
test-backend: ## Run backend tests
	@echo "$(BLUE)Running backend tests...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py test

.PHONY: test-frontend
test-frontend: ## Run frontend tests
	@echo "$(BLUE)Running frontend tests...$(NC)"
	$(DOCKER_COMPOSE) exec frontend npm test

.PHONY: test-coverage
test-coverage: ## Run tests with coverage
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	$(DOCKER_COMPOSE) exec backend coverage run --source='.' manage.py test
	$(DOCKER_COMPOSE) exec backend coverage report
	$(DOCKER_COMPOSE) exec backend coverage html

.PHONY: test-local
test-local: ## Run tests locally
	@echo "$(BLUE)Running tests locally...$(NC)"
	cd backend && source venv/bin/activate && python manage.py test
	cd frontend && $(NPM) test

# =============================================================================
# CODE QUALITY COMMANDS
# =============================================================================

.PHONY: lint
lint: ## Run linting for all code
	@echo "$(BLUE)Running linting...$(NC)"
	@make lint-backend
	@make lint-frontend

.PHONY: lint-backend
lint-backend: ## Run backend linting
	@echo "$(BLUE)Running backend linting...$(NC)"
	$(DOCKER_COMPOSE) exec backend flake8 .
	$(DOCKER_COMPOSE) exec backend black --check .
	$(DOCKER_COMPOSE) exec backend isort --check-only .

.PHONY: lint-frontend
lint-frontend: ## Run frontend linting
	@echo "$(BLUE)Running frontend linting...$(NC)"
	$(DOCKER_COMPOSE) exec frontend npm run lint

.PHONY: format
format: ## Format all code
	@echo "$(BLUE)Formatting code...$(NC)"
	@make format-backend
	@make format-frontend

.PHONY: format-backend
format-backend: ## Format backend code
	@echo "$(BLUE)Formatting backend code...$(NC)"
	$(DOCKER_COMPOSE) exec backend black .
	$(DOCKER_COMPOSE) exec backend isort .

.PHONY: format-frontend
format-frontend: ## Format frontend code
	@echo "$(BLUE)Formatting frontend code...$(NC)"
	$(DOCKER_COMPOSE) exec frontend npm run format

# =============================================================================
# DOCKER COMMANDS
# =============================================================================

.PHONY: build
build: ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) build

.PHONY: up
up: ## Start all services
	@echo "$(BLUE)Starting all services...$(NC)"
	$(DOCKER_COMPOSE) up -d

.PHONY: down
down: ## Stop all services
	@echo "$(BLUE)Stopping all services...$(NC)"
	$(DOCKER_COMPOSE) down

.PHONY: restart
restart: ## Restart all services
	@echo "$(BLUE)Restarting all services...$(NC)"
	$(DOCKER_COMPOSE) restart

.PHONY: logs
logs: ## Show logs for all services
	$(DOCKER_COMPOSE) logs -f

.PHONY: logs-backend
logs-backend: ## Show backend logs
	$(DOCKER_COMPOSE) logs -f backend

.PHONY: logs-frontend
logs-frontend: ## Show frontend logs
	$(DOCKER_COMPOSE) logs -f frontend

.PHONY: shell-backend
shell-backend: ## Open shell in backend container
	$(DOCKER_COMPOSE) exec backend bash

.PHONY: shell-frontend
shell-frontend: ## Open shell in frontend container
	$(DOCKER_COMPOSE) exec frontend sh

.PHONY: shell-db
shell-db: ## Open PostgreSQL shell
	$(DOCKER_COMPOSE) exec postgres psql -U fajma -d fajma

# =============================================================================
# MAINTENANCE COMMANDS
# =============================================================================

.PHONY: clean
clean: ## Clean up Docker resources
	@echo "$(BLUE)Cleaning up Docker resources...$(NC)"
	$(DOCKER_COMPOSE) down -v --remove-orphans
	docker system prune -f
	docker volume prune -f

.PHONY: clean-all
clean-all: ## Clean up everything (including images)
	@echo "$(RED)WARNING: This will remove all Docker images and volumes!$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	$(DOCKER_COMPOSE) down -v --remove-orphans
	docker system prune -af
	docker volume prune -f
	docker image prune -af

.PHONY: backup-db
backup-db: ## Backup database
	@echo "$(BLUE)Creating database backup...$(NC)"
	mkdir -p backups
	$(DOCKER_COMPOSE) exec postgres pg_dump -U fajma fajma > backups/db_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Database backup created in backups/ directory$(NC)"

.PHONY: restore-db
restore-db: ## Restore database from backup
	@echo "$(BLUE)Restoring database from backup...$(NC)"
	@read -p "Enter backup file path: " backup_file && \
	$(DOCKER_COMPOSE) exec -T postgres psql -U fajma -d fajma < "$$backup_file"

.PHONY: collectstatic
collectstatic: ## Collect Django static files
	@echo "$(BLUE)Collecting static files...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py collectstatic --noinput

# =============================================================================
# MONITORING COMMANDS
# =============================================================================

.PHONY: monitor
monitor: ## Start monitoring services (Prometheus, Grafana)
	@echo "$(BLUE)Starting monitoring services...$(NC)"
	$(DOCKER_COMPOSE) --profile monitoring up -d

.PHONY: monitor-down
monitor-down: ## Stop monitoring services
	@echo "$(BLUE)Stopping monitoring services...$(NC)"
	$(DOCKER_COMPOSE) --profile monitoring down

.PHONY: status
status: ## Show status of all services
	@echo "$(BLUE)Service Status:$(NC)"
	$(DOCKER_COMPOSE) ps

# =============================================================================
# SECURITY COMMANDS
# =============================================================================

.PHONY: security-check
security-check: ## Run security checks
	@echo "$(BLUE)Running security checks...$(NC)"
	$(DOCKER_COMPOSE) exec backend safety check
	$(DOCKER_COMPOSE) exec backend bandit -r .
	$(DOCKER_COMPOSE) exec frontend npm audit

.PHONY: update-deps
update-deps: ## Update dependencies
	@echo "$(BLUE)Updating dependencies...$(NC)"
	cd backend && $(PIP) list --outdated
	cd frontend && $(NPM) outdated
	@echo "$(YELLOW)Please review and update dependencies manually$(NC)"

# =============================================================================
# ESP32 DEVELOPMENT
# =============================================================================

.PHONY: esp32-setup
esp32-setup: ## Setup ESP32 development environment
	@echo "$(BLUE)Setting up ESP32 development environment...$(NC)"
	@echo "$(YELLOW)Please install Arduino IDE and ESP32 board package manually$(NC)"
	@echo "$(YELLOW)Required libraries: WiFi, ArduinoJson, WebSocketsClient$(NC)"

.PHONY: esp32-flash
esp32-flash: ## Flash ESP32 firmware (requires Arduino CLI)
	@echo "$(BLUE)Flashing ESP32 firmware...$(NC)"
	@if command -v arduino-cli >/dev/null 2>&1; then \
		arduino-cli compile --fqbn esp32:esp32:esp32 esp32/fajma_sensor/; \
		arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 esp32/fajma_sensor/; \
	else \
		echo "$(RED)Arduino CLI not found. Please install it first.$(NC)"; \
	fi

# =============================================================================
# DOCUMENTATION
# =============================================================================

.PHONY: docs
docs: ## Generate documentation
	@echo "$(BLUE)Generating documentation...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py generate_api_docs
	cd frontend && $(NPM) run docs

.PHONY: docs-serve
docs-serve: ## Serve documentation locally
	@echo "$(BLUE)Serving documentation...$(NC)"
	@echo "$(YELLOW)Documentation will be available at http://localhost:8080$(NC)"
	cd docs && python -m http.server 8080

# =============================================================================
# UTILITY COMMANDS
# =============================================================================

.PHONY: install-hooks
install-hooks: ## Install git hooks
	@echo "$(BLUE)Installing git hooks...$(NC)"
	pre-commit install
	@echo "$(GREEN)Git hooks installed!$(NC)"

.PHONY: check-env
check-env: ## Check environment configuration
	@echo "$(BLUE)Checking environment configuration...$(NC)"
	@echo "Docker version: $$(docker --version)"
	@echo "Docker Compose version: $$(docker-compose --version)"
	@echo "Python version: $$($(PYTHON) --version)"
	@echo "Node version: $$($(NODE) --version)"
	@echo "NPM version: $$($(NPM) --version)"

.PHONY: init
init: ## Initialize project (first time setup)
	@echo "$(BLUE)Initializing FAJMA project...$(NC)"
	@make setup
	@make build
	@make migrate
	@make createsuperuser
	@echo "$(GREEN)Project initialization complete!$(NC)"
	@echo "$(YELLOW)Run 'make dev' to start development environment$(NC)"

# =============================================================================
# QUICK COMMANDS
# =============================================================================

.PHONY: quick-start
quick-start: ## Quick start for development
	@echo "$(BLUE)Quick starting development environment...$(NC)"
	@make dev-detached
	@sleep 10
	@make migrate
	@echo "$(GREEN)Development environment is ready!$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Backend API: http://localhost:8000/api/$(NC)"
	@echo "$(YELLOW)Admin: http://localhost:8000/admin/$(NC)"

.PHONY: quick-stop
quick-stop: ## Quick stop all services
	@echo "$(BLUE)Stopping all services...$(NC)"
	@make down
	@echo "$(GREEN)All services stopped!$(NC)"

# =============================================================================
# ALIASES
# =============================================================================

.PHONY: start
start: dev ## Alias for dev

.PHONY: stop
stop: down ## Alias for down

.PHONY: install
install: setup ## Alias for setup