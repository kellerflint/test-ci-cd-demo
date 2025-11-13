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

### 2. Prepare Your VM

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

### 3. Test Deployment

```bash
# On your local machine
git add .
git commit -m "Test deployment"
git push origin main
```

Watch it deploy at: `https://github.com/kellerflint/test-ci-cd-demo/actions`

### 4. Verify Deployment

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

# Restart services
docker compose down
docker compose up -d --build
```

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
