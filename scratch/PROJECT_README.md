# 🚀 Virtual Mauzin - Quick Start Guide

## Overview
Virtual Mauzin is a real-time audio broadcasting application that allows one broadcaster to stream audio to multiple listeners using WebRTC technology.

## Architecture
- **Frontend**: React + Vite (Port 5173)
- **Backend**: PeerJS Server (Port 9000)
- **Technology**: WebRTC for peer-to-peer audio streaming

## 📋 Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with microphone support

## 🛠️ Local Development Setup

### 1. Install Dependencies

**Server (PeerJS):**
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
npm install
```

**Client (React App):**
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
npm install
```

### 2. Start the Services

**Option A: Automated Script (Recommended)**
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch
.\start-app.ps1
```

**Option B: Manual Start**

**Terminal 1 - Start PeerJS Server:**
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
npm start
```
You should see: `PeerJS server running on port 9000`

**Terminal 2 - Start Vite Dev Server:**
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
npm run dev
```
You should see: `Local: http://localhost:5173/`

### 3. Test Locally

1. Open `http://localhost:5173` in your browser
2. Click "Start Broadcast" to become a broadcaster
3. Allow microphone permissions
4. Open another browser tab/window
5. Click "Join Broadcast" (Auto-connects to broadcaster)

## ☁️ Cloud Deployment

See [CLOUD_DEPLOYMENT_GUIDE.md](../CLOUD_DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Vercel and Railway.

## 📱 Mobile App (Android)

### Build and Run

**Build for Android:**
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
npm run mobile:build
```

**Open in Android Studio:**
```powershell
npm run mobile:open
```

**Sync Capacitor:**
```powershell
npm run mobile:sync
```

See `MOBILE_DEPLOYMENT_GUIDE.md` for detailed instructions on publishing to Google Play.

## 🐛 Troubleshooting

### Linting Errors
If you encounter linting errors, they've been fixed. Run:
```powershell
npm install
npm run lint
```

### Microphone Not Working
- Check browser permissions
- Ensure HTTPS (required for microphone access)
- Try a different browser

### Connection Issues
- Verify both services are running (PeerJS and Vite)
- Check firewall settings
- Ensure correct configuration in `peerConfig.js`

### Build Errors
```powershell
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 🔧 Development Commands

### Client
```powershell
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Server
```powershell
npm start            # Start PeerJS server
```

### Mobile
```powershell
npm run mobile:build # Build and sync with Capacitor
npm run mobile:open  # Open in Android Studio
npm run mobile:sync  # Sync web assets to native project
npm run mobile:run   # Build and open in one command
```

## 📚 Additional Documentation

- **CLOUD_DEPLOYMENT_GUIDE.md** - Cloud deployment instructions
- **MOBILE_DEPLOYMENT_GUIDE.md** - Publishing to Google Play
- **ARCHITECTURE.md** - Technical architecture details
- **FAQ.md** - Frequently asked questions

## 🎯 Quick Reference

| Component | Port | URL (Local) | Purpose |
|-----------|------|-------------|---------|
| Vite Dev Server | 5173 | http://localhost:5173 | Frontend application |
| PeerJS Server | 9000 | http://localhost:9000 | WebRTC signaling |

## 🚀 Next Steps

1. ✅ Fix all configuration issues (DONE)
2. ✅ Install dependencies (DONE)
3. 🔄 Test locally
4. 🔄 Deploy to production (optional)

## 💡 Tips

- Use `MODE = 'local'` for local development
- Keep both terminals (server + client) running
- Check browser console for errors
- Test with different browsers and devices

## 📞 Support

For issues or questions:
1. Check the FAQ.md
2. Review browser console errors
3. Verify all services are running

---

**Happy Broadcasting! 🎙️**
