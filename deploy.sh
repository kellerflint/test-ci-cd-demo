#!/bin/bash

# Deployment script for Digital Ocean VM
# This script is run automatically by GitHub Actions

set -e  # Exit on any error

echo "=== Starting Deployment ==="

# Navigate to project directory
PROJECT_DIR="/home/projects/test-ci-cd-demo"
cd $PROJECT_DIR

echo "Current directory: $(pwd)"

# Pull latest changes
echo "Pulling latest code from main branch..."
git pull origin main

# Stop existing containers
echo "Stopping existing containers..."
docker compose down

# Build and start containers
echo "Building and starting containers..."
docker compose up -d --build

# Wait for services
echo "Waiting for services to start..."
sleep 10

# Check service health
echo "Checking service status..."
docker compose ps

# Test backend health endpoint
echo "Testing backend health..."
curl -f http://localhost:3001/health || echo "Warning: Backend health check failed"

# Cleanup
echo "Cleaning up old Docker images..."
docker image prune -f

echo "=== Deployment Complete ==="
