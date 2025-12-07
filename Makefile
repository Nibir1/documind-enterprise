# Force rebuild backend and start app
rebuild:
	docker-compose build --no-cache backend && docker-compose up

# Standard run
run:
	docker-compose up

# Stop services
stop:
	docker-compose down

.PHONY: rebuild run stop