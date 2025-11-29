# 🚀 Fly.io Deployment Guide - Virtual Mauzin

## Overview

This guide will walk you through deploying your Virtual Mauzin application on Fly.io. We'll deploy both the backend (PeerJS server) and frontend (React app) as separate Fly.io applications.

## Prerequisites

Before you begin, make sure you have:

- [ ] A Fly.io account (sign up at [fly.io](https://fly.io))
- [ ] Git installed on your machine
- [ ] Node.js 16+ installed
- [ ] Your project pushed to a Git repository (GitHub, GitLab, etc.)

---

## 📦 Part 1: Install Fly.io CLI

### Windows (PowerShell)

```powershell
# Run this in PowerShell as Administrator
iwr https://fly.io/install.ps1 -useb | iex
```

### Verify Installation

```powershell
fly version
```

### Login to Fly.io

```powershell
fly auth login
```

This will open a browser window for you to authenticate.

---

## 🔧 Part 2: Deploy Backend (PeerJS Server)

### Step 1: Navigate to Server Directory

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
```

### Step 2: Create Fly.io Configuration

Run the following command to initialize Fly.io:

```powershell
fly launch --no-deploy
```

When prompted:
- **App name**: Choose something like `virtual-mauzin-server` (must be globally unique)
- **Region**: Choose the closest region to your users (e.g., `sin` for Singapore, `iad` for US East)
- **Would you like to set up a Postgresql database?**: **No**
- **Would you like to set up an Upstash Redis database?**: **No**
- **Would you like to deploy now?**: **No**

This will create a `fly.toml` file in your server directory.

### Step 3: Configure fly.toml

The generated `fly.toml` should look similar to this (verify and adjust if needed):

```toml
app = "virtual-mauzin-server"
primary_region = "sin"

[build]

[http_service]
  internal_port = 9000
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

### Step 4: Set Environment Variables

```powershell
# Set production environment
fly secrets set NODE_ENV=production

# Set allowed origins (we'll update this after deploying frontend)
fly secrets set ALLOWED_ORIGINS=*
```

### Step 5: Deploy Backend

```powershell
fly deploy
```

### Step 6: Get Backend URL

After deployment, your backend will be available at:
```
https://virtual-mauzin-server.fly.dev
```

Test it by visiting:
```
https://virtual-mauzin-server.fly.dev/myapp
```

You should see a PeerJS server response (might be empty JSON or minimal response).

---

## 🎨 Part 3: Deploy Frontend (React App)

### Step 1: Navigate to Client Directory

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
```

### Step 2: Create Fly.io Configuration

```powershell
fly launch --no-deploy
```

When prompted:
- **App name**: Choose something like `virtual-mauzin` (must be globally unique)
- **Region**: Choose the **same region** as your backend
- **Would you like to set up a Postgresql database?**: **No**
- **Would you like to set up an Upstash Redis database?**: **No**
- **Would you like to deploy now?**: **No**

### Step 3: Configure fly.toml for Frontend

Edit the generated `fly.toml` file to look like this:

```toml
app = "virtual-mauzin"
primary_region = "sin"

[build]
  [build.args]
    VITE_PEER_MODE = "production"
    VITE_PEERJS_HOST = "virtual-mauzin-server.fly.dev"
    VITE_PEERJS_PORT = "443"
    VITE_PEERJS_SECURE = "true"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

### Step 4: Create Dockerfile for Frontend

Create a file named `Dockerfile` in the `scratch/client` directory:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments
ARG VITE_PEER_MODE
ARG VITE_PEERJS_HOST
ARG VITE_PEERJS_PORT
ARG VITE_PEERJS_SECURE

# Set environment variables for build
ENV VITE_PEER_MODE=$VITE_PEER_MODE
ENV VITE_PEERJS_HOST=$VITE_PEERJS_HOST
ENV VITE_PEERJS_PORT=$VITE_PEERJS_PORT
ENV VITE_PEERJS_SECURE=$VITE_PEERJS_SECURE

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Step 5: Create Nginx Configuration

Create a file named `nginx.conf` in the `scratch/client` directory:

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Step 6: Deploy Frontend

```powershell
fly deploy
```

### Step 7: Get Frontend URL

After deployment, your frontend will be available at:
```
https://virtual-mauzin.fly.dev
```

---

## 🔄 Part 4: Update CORS Configuration

Now that both apps are deployed, update the backend's CORS settings:

### Step 1: Navigate to Server Directory

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
```

### Step 2: Update ALLOWED_ORIGINS

```powershell
fly secrets set ALLOWED_ORIGINS=https://virtual-mauzin.fly.dev
```

This will automatically redeploy your backend with the new CORS settings.

---

## 🧪 Testing Your Deployment

### 1. Test Backend

Visit: `https://virtual-mauzin-server.fly.dev/myapp`

You should see a response from the PeerJS server.

### 2. Test Frontend

Visit: `https://virtual-mauzin.fly.dev`

The app should load without errors.

### 3. Test Full Flow

1. **Open broadcaster** on one device:
   - Go to `https://virtual-mauzin.fly.dev`
   - Click "Start Broadcast"
   - Allow microphone permissions
   - You should see "Broadcasting..." status

2. **Open listener** on another device:
   - Go to `https://virtual-mauzin.fly.dev`
   - Click "Join Broadcast"
   - You should hear the audio from the broadcaster

---

## 📊 Monitoring & Logs

### View Backend Logs

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
fly logs
```

### View Frontend Logs

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
fly logs
```

### Check App Status

```powershell
# For backend
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
fly status

# For frontend
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
fly status
```

### Open Fly.io Dashboard

```powershell
fly dashboard
```

---

## 🔧 Common Commands

### Redeploy After Code Changes

```powershell
# Backend
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
fly deploy

# Frontend
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
fly deploy
```

### Scale Your App

```powershell
# Keep at least 1 machine running (no auto-stop)
fly scale count 1

# Allow auto-stop when idle
fly scale count 0
```

### Update Environment Variables

```powershell
# Set a new secret
fly secrets set KEY=value

# List all secrets (values are hidden)
fly secrets list

# Remove a secret
fly secrets unset KEY
```

---

## 💰 Pricing

### Free Tier
- **Included**: 3 shared-cpu-1x VMs with 256MB RAM
- **Bandwidth**: 100GB outbound per month
- **Perfect for**: Testing and small-scale deployments

### Estimated Costs for Virtual Mauzin
- **Backend**: ~$0-5/month (with auto-stop)
- **Frontend**: ~$0-5/month (with auto-stop)
- **Total**: ~$0-10/month

With auto-stop enabled, your apps will stop when idle and start automatically when accessed, keeping costs minimal.

---

## 🌐 Custom Domain Setup

### Step 1: Add Domain to Fly.io

```powershell
# For frontend
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
fly certs add app.yourdomain.com

# For backend
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
fly certs add api.yourdomain.com
```

### Step 2: Configure DNS

Add the following DNS records to your domain:

**For Frontend (app.yourdomain.com):**
```
Type: CNAME
Name: app
Value: virtual-mauzin.fly.dev
```

**For Backend (api.yourdomain.com):**
```
Type: CNAME
Name: api
Value: virtual-mauzin-server.fly.dev
```

### Step 3: Update Environment Variables

```powershell
# Update backend CORS
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
fly secrets set ALLOWED_ORIGINS=https://app.yourdomain.com
```

### Step 4: Update Frontend Configuration

Edit `scratch/client/fly.toml` and update the build args:

```toml
[build.args]
  VITE_PEER_MODE = "production"
  VITE_PEERJS_HOST = "api.yourdomain.com"
  VITE_PEERJS_PORT = "443"
  VITE_PEERJS_SECURE = "true"
```

Then redeploy:

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
fly deploy
```

---

## 🐛 Troubleshooting

### Issue: "Could not find App"

**Solution**: Make sure you're in the correct directory (client or server) when running fly commands.

### Issue: "Error: failed to fetch an image or build from source"

**Solution**: 
1. Make sure `Dockerfile` exists in the client directory
2. Check that all files are committed to git
3. Try running `fly deploy --local-only`

### Issue: Frontend can't connect to backend

**Solution**:
1. Verify backend is running: `fly status` in server directory
2. Check backend logs: `fly logs` in server directory
3. Verify CORS settings: `fly secrets list` in server directory
4. Make sure frontend build args are correct in `fly.toml`

### Issue: "Connection refused" or "WebSocket error"

**Solution**:
1. Ensure `VITE_PEERJS_PORT=443` (not 9000)
2. Ensure `VITE_PEERJS_SECURE=true`
3. Verify backend URL doesn't include `https://` in `VITE_PEERJS_HOST`

### Issue: App is slow to start

**Solution**: This is normal with auto-stop enabled. The first request after idle will take 5-10 seconds to wake up the machine. To keep machines always running:

```powershell
fly scale count 1
```

---

## 🔐 Security Best Practices

- ✅ HTTPS is enforced automatically by Fly.io
- ✅ Set specific CORS origins (not `*`) in production
- ✅ Use `fly secrets` for sensitive data (never commit secrets)
- ✅ Keep dependencies updated
- ✅ Monitor logs regularly for suspicious activity

---

## 📋 Deployment Checklist

### Backend
- [ ] Fly.io CLI installed and authenticated
- [ ] `fly.toml` created in server directory
- [ ] Environment variables set (`NODE_ENV`, `ALLOWED_ORIGINS`)
- [ ] Backend deployed successfully
- [ ] Backend URL accessible

### Frontend
- [ ] `fly.toml` created in client directory
- [ ] `Dockerfile` created with build args
- [ ] `nginx.conf` created
- [ ] Build args configured correctly
- [ ] Frontend deployed successfully
- [ ] Frontend URL accessible

### Testing
- [ ] Backend responds at `/myapp` endpoint
- [ ] Frontend loads without errors
- [ ] Broadcaster can start broadcasting
- [ ] Listener can connect and hear audio
- [ ] No CORS errors in browser console

---

## 🚀 Next Steps

1. ✅ Deploy backend to Fly.io
2. ✅ Deploy frontend to Fly.io
3. ✅ Update CORS configuration
4. ✅ Test the full application
5. 🎯 Add custom domain (optional)
6. 📱 Deploy mobile app to Google Play (see `MOBILE_DEPLOYMENT_GUIDE.md`)
7. 📊 Set up monitoring and alerts
8. 🔄 Configure CI/CD for automatic deployments

---

## 📞 Support Resources

- **Fly.io Documentation**: https://fly.io/docs
- **Fly.io Community**: https://community.fly.io
- **PeerJS Documentation**: https://peerjs.com/docs
- **Project Issues**: Check browser console and Fly.io logs

---

**🎉 Your Virtual Mauzin app is now live on Fly.io!**

Example URLs:
- Frontend: `https://virtual-mauzin.fly.dev`
- Backend: `https://virtual-mauzin-server.fly.dev`
