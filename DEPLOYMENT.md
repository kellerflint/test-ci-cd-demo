# Deployment Setup Guide

This guide walks you through setting up automated deployment to your Digital Ocean VM.

## Quick Start Checklist

### 1. Set Up GitHub Secrets

This project uses **Repository Secrets** (Settings → Secrets and variables → Actions → Secrets tab) for sensitive deployment credentials.

> **Note**: Repository Variables are for non-sensitive config, and Environment Secrets are for multi-stage deployments (staging/prod).

Go to: `https://github.com/kellerflint/test-ci-cd-demo/settings/secrets/actions`

Click **"New repository secret"** and add these 3 secrets:

| Secret Name | Value | 
|------------|-------|
| `VM_HOST` | Your VM's IP address |
| `VM_USERNAME` | Your SSH username |
| `VM_PASSWORD` | Your SSH password |

**Security Note**: For a real production environment, use SSH keys instead of passwords.

### 2. Configure Production Environment

The repository includes a `.env.production` template. Update it with your server's IP:

```bash
REACT_APP_API_URL=http://YOUR_SERVER_IP:3001
```

This file gets copied to `.env` automatically during deployment.

> **Why?** The React app runs in the browser, which needs to access the backend API using your server's public IP, not Docker network hostnames.

### 3. Prepare Your VM

SSH into your Digital Ocean VM and run these commands:

```bash
# Update system packages
apt update
yes | sudo DEBIAN_FRONTEND=noninteractive apt-get -yqq upgrade

# Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose (if not already installed)
apt install docker-compose-plugin -y

# Verify installations
docker --version
docker compose version

# Create project directory
mkdir -p /home/projects/test-ci-cd-demo
cd /home/projects/test-ci-cd-demo

# Clone your repository (first time only)
git clone https://github.com/kellerflint/test-ci-cd-demo.git .

# Test that docker compose works
docker compose up -d
docker compose ps
docker compose down

# Optional: Allow firewall ports
ufw allow 3000
ufw allow 3001
```

### 4. Test Deployment

```bash
# On your local machine
git add .
git commit -m "Test deployment"
git push origin main
```

Watch it deploy at: `https://github.com/kellerflint/test-ci-cd-demo/actions`

### 5. Verify Deployment

Visit your app: `http://your-vm-ip:3000`

SSH into your VM and check:

```bash
cd /home/projects/test-ci-cd-demo
docker compose ps

# Should show all services running:
# - db (mysql)
# - backend (node)
# - frontend (react)
```

Test the endpoints:
```bash
curl http://localhost:3001/health
curl http://localhost:3000
```

## What Happens on Push to Main

```
Push to main
    ↓
Run Tests (Backend, Frontend, E2E)
    ↓ (if all pass)
Build Docker Images
    ↓
Deploy to VM
    ├─ SSH into VM
    ├─ Pull latest code
    ├─ Stop old containers
    ├─ Build new containers
    └─ Start services
```

## Accessing Your Deployed App

- **Frontend**: http://your-vm-ip:3000
- **Backend API**: http://your-vm-ip:3001
- **API Health Check**: http://your-vm-ip:3001/health

---

## Detailed Configuration

### Manual Deployment (if needed)

```bash
# SSH into your VM
ssh root@your-vm-ip

# Navigate to project directory
cd /home/projects/test-ci-cd-demo

# Pull latest changes
git pull origin main

# Set up environment (if not already done)
cp .env.production .env

# Restart services
docker compose down
docker compose up -d --build
```

## Environment Configuration

The project uses different API URLs for different environments:

- **Local development**: `http://localhost:3001` (default when no `.env` file)
- **Production**: Set via `.env` file (copied from `.env.production`)
- **E2E tests**: `http://backend:3001` (Docker network hostname)

Docker Compose automatically reads `.env` files, so just run `docker compose up` - no extra flags needed!

## Troubleshooting

### Deployment fails?
- Check GitHub Actions logs: Repository → Actions → Click failed workflow
- Verify GitHub secrets are set correctly
- Ensure VM has Docker installed: `docker --version`
- Check VM disk space: `df -h`

### Can't access the site?
- Check firewall: `ufw status`
- Allow ports: `ufw allow 3000 && ufw allow 3001`
- Check containers: `docker compose ps`
- View logs: `docker compose logs`

### Check logs on VM:
```bash
cd /home/projects/test-ci-cd-demo
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

### Restart services:
```bash
docker compose down
docker compose up -d --build
```

### Common Issues

**Port already in use:**
```bash
# Find what's using the port
netstat -tulpn | grep 3000
# Kill the process or change the port in docker-compose.yml
```

**Out of disk space:**
```bash
# Clean up old Docker images
docker system prune -a -f
```

**Permission denied:**
```bash
# Ensure Docker can run without sudo
usermod -aG docker $USER
```
