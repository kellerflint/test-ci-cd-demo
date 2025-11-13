# Quick Setup Checklist

## ✅ What You Need to Do

### 1. Set Up GitHub Secrets (5 minutes)

This project uses **Repository Secrets** (Settings -> Secrets and variables -> Actions -> Secrets tab) for sensitive deployment credentials. 

Note: Repository Variables are for non-sensitive config, and Environment Secrets are for multi-stage deployments (staging/prod).

Click **"New repository secret"** and add these 3 secrets:

| Secret Name | Value | 
|------------|-------|
| `VM_HOST` | Your VM's IP |
| `VM_USERNAME` | Your VM's user |
| `VM_PASSWORD` | Your VM's password |


### 2. Prepare Your VM (10 minutes)

SSH into your VM and run:

```bash
# Ensure Docker is installed
docker --version
docker compose version

# Create project directory
mkdir -p /home/projects/test-ci-cd-demo
cd /home/projects/test-ci-cd-demo

# Clone repository
git clone https://github.com/kellerflint/test-ci-cd-demo.git .

# Test it works
docker compose up -d
docker compose ps
```

### 3. Test Deployment

```bash
# On your local machine
git add .
git commit -m "Add CD pipeline"
git push origin main
```

Watch it deploy at: `https://github.com/kellerflint/test-ci-cd-demo/actions`

### 4. Verify

Visit: `http://147.182.200.65:3000`

## 🎯 What Happens on Push to Main

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

## 📝 Files Added

- `.github/workflows/ci.yml` - Updated with deploy job
- `deploy.sh` - Deployment script (optional, inline in workflow)
- `DEPLOYMENT.md` - Complete deployment guide
- `SETUP.md` - This quick checklist

## 🔒 Security Note

You're using password auth for simplicity. For production:
- Use SSH keys instead
- See DEPLOYMENT.md for SSH key setup
- Consider using GitHub's deployment environments

## 🐛 Troubleshooting

**Deployment fails?**
- Check GitHub Actions logs
- Verify secrets are set correctly
- Ensure VM has Docker installed
- Check VM has enough disk space: `df -h`

**Can't access the site?**
- Check firewall: `ufw status`
- Allow ports: `ufw allow 3000` and `ufw allow 3001`
- Check containers: `docker compose ps`
- Check logs: `docker compose logs`

## 📚 Next Steps

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- SSH key setup
- Domain configuration
- SSL/TLS setup
- Monitoring setup
