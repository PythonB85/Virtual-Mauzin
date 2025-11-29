---
description: Deploy Virtual Mauzin to Fly.io
---

# Deploy Virtual Mauzin to Fly.io

Follow these steps to deploy your Virtual Mauzin application to Fly.io.

## Prerequisites

1. Install Fly.io CLI (run in PowerShell as Administrator):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

2. Login to Fly.io:
```powershell
fly auth login
```

## Deploy Backend (PeerJS Server)

1. Navigate to server directory:
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
```

// turbo
2. Initialize Fly.io (if not already done):
```powershell
fly launch --no-deploy
```

// turbo
3. Set environment variables:
```powershell
fly secrets set NODE_ENV=production ALLOWED_ORIGINS=*
```

// turbo
4. Deploy backend:
```powershell
fly deploy
```

// turbo
5. Check backend status:
```powershell
fly status
```

## Deploy Frontend (React App)

6. Navigate to client directory:
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
```

// turbo
7. Initialize Fly.io (if not already done):
```powershell
fly launch --no-deploy
```

// turbo
8. Deploy frontend:
```powershell
fly deploy
```

// turbo
9. Check frontend status:
```powershell
fly status
```

## Update CORS Configuration

10. Navigate back to server directory:
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
```

11. Update ALLOWED_ORIGINS with your actual frontend URL:
```powershell
fly secrets set ALLOWED_ORIGINS=https://your-app-name.fly.dev
```

## Test Deployment

12. Open your frontend URL in a browser
13. Test broadcaster functionality
14. Test listener functionality on another device

## View Logs

To view backend logs:
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
fly logs
```

To view frontend logs:
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
fly logs
```

## Useful Commands

- `fly status` - Check app status
- `fly logs` - View real-time logs
- `fly dashboard` - Open Fly.io dashboard
- `fly deploy` - Redeploy after changes
- `fly secrets list` - List environment variables

For detailed instructions, see `FLY_IO_DEPLOYMENT.md`
