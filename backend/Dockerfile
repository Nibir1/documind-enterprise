# File: documind-enterprise/backend/Dockerfile 
# Purpose: Container definition for the Python environment.

# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables to prevent Python from writing pyc files to disc
# and buffering stdout and stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (needed for some python packages like asyncpg build)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy only requirements to cache them in docker layer
COPY pyproject.toml poetry.lock* /app/

# Configure poetry to not create a virtual environment inside the container
RUN poetry config virtualenvs.create false

# --- FIX IS HERE ---
# Added --no-root to prevent Poetry from trying to install the project itself
# before the source code is copied.
RUN poetry install --no-interaction --no-ansi --no-root

# Copy the rest of the application code
COPY . /app

# The command to run the app is handled by docker-compose