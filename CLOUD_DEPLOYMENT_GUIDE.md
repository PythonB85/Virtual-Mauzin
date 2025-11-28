# 🚀 Cloud Deployment Guide - Virtual Mauzin

## Overview

Virtual Mauzin consists of two parts that need to be deployed separately:
1. **Frontend (Client)** - React + Vite app
2. **Backend (Server)** - PeerJS signaling server

## Recommended Deployment Strategy

### Option A: Separate Services (Recommended)
- **Frontend**: Vercel or Netlify (Free tier available)
- **Backend**: Railway, Render, or Fly.io (Free tier available)

### Option B: All-in-One
- **Both**: Railway or Render (requires paid plan for multiple services)

---

## 🎯 Quick Start Deployment

### Step 1: Deploy Backend (PeerJS Server)

#### Using Railway (Recommended)

1. **Sign up** at [railway.app](https://railway.app)

2. **Create New Project** → **Deploy from GitHub**

3. **Select** your repository and the `scratch/server` directory

4. **Set Environment Variables**:
   ```
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

5. **Deploy** - Railway will auto-detect Node.js and deploy

6. **Copy the URL** - You'll get something like `your-app.railway.app`

#### Using Render

1. **Sign up** at [render.com](https://render.com)

2. **New** → **Web Service**

3. **Connect** your repository

4. **Configure**:
   - **Root Directory**: `scratch/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Environment Variables**:
   ```
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

6. **Create Web Service**

7. **Copy the URL** - You'll get something like `your-app.onrender.com`

---

### Step 2: Deploy Frontend (React App)

#### Using Vercel (Recommended)

1. **Sign up** at [vercel.com](https://vercel.com)

2. **Import Project** from GitHub

3. **Configure**:
   - **Root Directory**: `scratch/client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_PEER_MODE=production
   VITE_PEERJS_HOST=your-backend.railway.app
   VITE_PEERJS_PORT=443
   VITE_PEERJS_SECURE=true
   ```

5. **Deploy**

6. **Copy the URL** - You'll get something like `your-app.vercel.app`

#### Using Netlify

1. **Sign up** at [netlify.com](https://netlify.com)

2. **New site from Git**

3. **Configure**:
   - **Base directory**: `scratch/client`
   - **Build command**: `npm run build`
   - **Publish directory**: `scratch/client/dist`

4. **Environment Variables** (same as Vercel above)

5. **Deploy site**

---

### Step 3: Update CORS

After deploying the frontend, update your backend's `ALLOWED_ORIGINS`:

**Railway/Render Dashboard** → **Environment Variables**:
```
ALLOWED_ORIGINS=https://your-actual-frontend.vercel.app
```

Redeploy the backend if needed.

---

## 🔧 Detailed Configuration

### Environment Variables Reference

#### Frontend (.env)
```bash
# Required for production
VITE_PEER_MODE=production
VITE_PEERJS_HOST=your-backend.railway.app
VITE_PEERJS_PORT=443
VITE_PEERJS_SECURE=true
```

#### Backend (.env)
```bash
# Usually set automatically by platform
PORT=9000

# Required
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-frontend.vercel.app
```

---

## 🧪 Testing Your Deployment

### 1. Test Backend
Visit: `https://your-backend.railway.app/myapp`

You should see a PeerJS server response (might be empty JSON or error, that's OK).

### 2. Test Frontend
Visit: `https://your-frontend.vercel.app`

The app should load. Click "Start Broadcast" and check if you get a Broadcaster ID.

### 3. Test Full Flow
1. Open broadcaster on one device
2. Copy the Broadcaster ID
3. Open listener on another device
4. Paste the ID and connect
5. Start broadcasting audio

---

## 🐛 Troubleshooting

### Frontend loads but can't connect to PeerJS

**Problem**: CORS error in browser console

**Solution**: 
1. Check `ALLOWED_ORIGINS` in backend includes your frontend URL
2. Make sure URL doesn't have trailing slash
3. Redeploy backend after changing env vars

### "Cannot connect to PeerJS server"

**Problem**: Wrong backend URL

**Solution**:
1. Verify `VITE_PEERJS_HOST` is correct (no `https://`, just domain)
2. Check backend is running (visit backend URL)
3. Rebuild and redeploy frontend

### WebSocket connection fails

**Problem**: Port or secure settings wrong

**Solution**:
1. Set `VITE_PEERJS_PORT=443` for HTTPS backends
2. Set `VITE_PEERJS_SECURE=true` for HTTPS backends
3. Rebuild frontend

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Testing)
- **Frontend (Vercel)**: Free forever
- **Backend (Railway)**: $5/month credit (enough for small apps)
- **Total**: ~$0-5/month

### Paid Tier (For Production)
- **Frontend (Vercel Pro)**: $20/month
- **Backend (Railway)**: ~$5-10/month
- **Total**: ~$25-30/month

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

1. **Push to GitHub** → Automatic deployment
2. **Pull Requests** → Preview deployments
3. **Main branch** → Production deployment

---

## 📱 Custom Domain Setup

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your domain (e.g., `app.yourdomain.com`)
3. Update DNS records as instructed
4. SSL certificate auto-generated

### Backend (Railway)
1. Go to Settings → Networking
2. Add custom domain (e.g., `api.yourdomain.com`)
3. Update DNS records
4. SSL certificate auto-generated

### Update Environment Variables
After adding custom domains, update:
- Backend `ALLOWED_ORIGINS` with new frontend domain
- Frontend `VITE_PEERJS_HOST` with new backend domain

---

## 🔐 Security Checklist

- [ ] Environment variables set correctly
- [ ] CORS configured with specific origins (not `*`)
- [ ] HTTPS enabled on both frontend and backend
- [ ] `.env` files in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Backend only accepts connections from your frontend

---

## 📊 Monitoring

### Railway
- Built-in metrics dashboard
- View logs in real-time
- Set up alerts

### Vercel
- Analytics dashboard
- Performance monitoring
- Error tracking

---

## 🚀 Next Steps

1. ✅ Deploy backend to Railway/Render
2. ✅ Deploy frontend to Vercel/Netlify
3. ✅ Configure environment variables
4. ✅ Test the deployment
5. 🎯 Add custom domain (optional)
6. 📱 Deploy mobile app to Google Play (see MOBILE_DEPLOYMENT_GUIDE.md)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check backend logs in Railway/Render dashboard
4. Verify all environment variables are set correctly

---

**🎉 Your app is ready for the cloud!**

Example live URLs:
- Frontend: `https://virtual-mauzin.vercel.app`
- Backend: `https://virtual-mauzin-server.railway.app`
