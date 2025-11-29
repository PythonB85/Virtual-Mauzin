# 🚀 Fly.io Deployment - Quick Start

## What I've Created for You

I've set up everything you need to deploy Virtual Mauzin to Fly.io:

### 📁 New Files Created

1. **`FLY_IO_DEPLOYMENT.md`** - Complete deployment guide with detailed instructions
2. **`scratch/client/Dockerfile`** - Docker configuration for frontend
3. **`scratch/client/nginx.conf`** - Nginx web server configuration
4. **`scratch/client/.dockerignore`** - Files to exclude from Docker build
5. **`scratch/client/fly.toml.example`** - Sample Fly.io config for frontend
6. **`scratch/server/fly.toml.example`** - Sample Fly.io config for backend
7. **`.agent/workflows/deploy-flyio.md`** - Quick deployment workflow

### 🎯 Quick Start (3 Steps)

#### Step 1: Install Fly.io CLI

Open PowerShell as Administrator and run:

```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

Then login:

```powershell
fly auth login
```

#### Step 2: Deploy Backend

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
fly launch --no-deploy
fly secrets set NODE_ENV=production ALLOWED_ORIGINS=*
fly deploy
```

#### Step 3: Deploy Frontend

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
fly launch --no-deploy
# Edit fly.toml to update VITE_PEERJS_HOST with your backend URL
fly deploy
```

### 📖 Full Documentation

For complete step-by-step instructions, see **`FLY_IO_DEPLOYMENT.md`**

### 🔧 Key Configuration Points

1. **Backend URL**: After deploying backend, you'll get a URL like `virtual-mauzin-server.fly.dev`
2. **Frontend Config**: Update `fly.toml` build args with your backend URL
3. **CORS**: Update backend's `ALLOWED_ORIGINS` with your frontend URL
4. **Region**: Choose the same region for both apps (e.g., `sin` for Singapore)

### 💡 Important Notes

- **App Names**: Must be globally unique on Fly.io
- **Free Tier**: Includes 3 VMs with 256MB RAM
- **Auto-Stop**: Apps stop when idle to save costs
- **HTTPS**: Automatically enabled by Fly.io

### 🧪 Testing

After deployment:

1. Visit your backend: `https://your-backend.fly.dev/myapp`
2. Visit your frontend: `https://your-frontend.fly.dev`
3. Test broadcasting and listening

### 📊 Monitoring

View logs:
```powershell
fly logs
```

Check status:
```powershell
fly status
```

Open dashboard:
```powershell
fly dashboard
```

### 🆘 Need Help?

- See `FLY_IO_DEPLOYMENT.md` for troubleshooting
- Check Fly.io docs: https://fly.io/docs
- Run `/deploy-flyio` workflow for guided deployment

---

**Ready to deploy? Start with Step 1 above!** 🚀
