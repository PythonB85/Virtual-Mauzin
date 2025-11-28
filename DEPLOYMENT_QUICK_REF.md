# 🚀 Virtual Mauzin - Deployment Quick Reference

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLOUD DEPLOYMENT                      │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐                    ┌──────────────────┐
│                  │                    │                  │
│    FRONTEND      │◄──────────────────►│     BACKEND      │
│   (Vercel/       │    WebRTC/WSS     │   (Railway/      │
│    Netlify)      │                    │     Render)      │
│                  │                    │                  │
│  React + Vite    │                    │  PeerJS Server   │
│  Port: 443       │                    │  Port: 443       │
│                  │                    │                  │
└──────────────────┘                    └──────────────────┘
        │                                        │
        │                                        │
        ▼                                        ▼
   Users Access                           Signaling Only
   via Browser                          (No Audio Data)
```

## Environment Variables

### Frontend (.env)
```bash
VITE_PEER_MODE=production
VITE_PEERJS_HOST=your-backend.railway.app
VITE_PEERJS_PORT=443
VITE_PEERJS_SECURE=true
```

### Backend (.env)
```bash
PORT=9000  # Auto-set by platform
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## Deployment Commands

### Build Frontend
```bash
cd scratch/client
npm install
npm run build
```

### Test Backend
```bash
cd scratch/server
npm install
npm start
```

## Platform-Specific Setup

### Vercel (Frontend)
```
Root Directory: scratch/client
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### Railway (Backend)
```
Root Directory: scratch/server
Build Command: npm install
Start Command: npm start
```

## Quick Deploy Links

- **Vercel**: https://vercel.com/new
- **Railway**: https://railway.app/new
- **Netlify**: https://app.netlify.com/start
- **Render**: https://dashboard.render.com/

## Testing URLs

After deployment, test:

1. **Backend Health**: `https://your-backend.railway.app/myapp`
2. **Frontend**: `https://your-frontend.vercel.app`
3. **Full Flow**: Start broadcast → Get ID → Connect listener

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Update `ALLOWED_ORIGINS` in backend |
| Can't connect | Check `VITE_PEERJS_HOST` is correct |
| Build fails | Run `npm install` first |
| 404 on routes | Check platform config files |

## Cost

- **Free Tier**: $0-5/month
- **Paid Tier**: $25-30/month

## Documentation

- 📖 **Full Guide**: [CLOUD_DEPLOYMENT_GUIDE.md](./CLOUD_DEPLOYMENT_GUIDE.md)
- ✅ **Fixes Applied**: [CLOUD_READY.md](./CLOUD_READY.md)
- 🎯 **Setup Success**: [SETUP_SUCCESS.md](./SETUP_SUCCESS.md)
