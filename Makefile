.PHONY: help build up down logs clean shell-backend test

help:
	@echo "🚀 DocuMind Enterprise Automation"
	@echo "================================="
	@echo "make build   : Rebuild all containers (clean build)"
	@echo "make up      : Start the system"
	@echo "make down    : Stop the system"
	@echo "make logs    : View live logs"
	@echo "make clean   : Remove containers, networks, and volumes"

# Force rebuild to ensure dependencies (LangChain/PgVector) are fresh
build:
	docker-compose build --no-cache
	docker-compose up -d
	@echo "✅ Application running at http://localhost:3000"

up:
	docker-compose up -d
	@echo "✅ Application running at http://localhost:3000"

down:
	docker-compose down

logs:
	docker-compose logs -f

# Nuclear option: wipes database data too
clean:
	docker-compose down -v
	docker system prune -f

# Debugging helper
shell-backend:
	docker-compose exec backend /bin/bash

# Run tests inside the running docker container
test:
	docker-compose exec backend python -m pytest tests/test_api.py -v