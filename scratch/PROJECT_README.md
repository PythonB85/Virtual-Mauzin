# 🚀 Virtual Mauzin - Quick Start Guide

## Overview
Virtual Mauzin (AudioCast) is a real-time audio broadcasting application that allows one broadcaster to stream audio to multiple listeners using WebRTC technology.

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
4. Copy your Broadcaster ID
5. Open another browser tab/window
6. Click "Join Broadcast"
7. Paste the Broadcaster ID and connect

## 🌐 Internet Access with ngrok

### Why ngrok?
ngrok creates secure tunnels to your localhost, allowing you to:
- Test on mobile devices
- Share with remote users
- Test across different networks

### Setup ngrok

#### 1. Install ngrok

**Option A: Manual (Recommended)**
1. Download from: https://ngrok.com/download
2. Extract to a folder (e.g., `C:\ngrok`)
3. Add to PATH or run from that directory

**Option B: Using Chocolatey**
```powershell
choco install ngrok
```

#### 2. Authenticate ngrok
1. Sign up at: https://dashboard.ngrok.com/signup
2. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Run:
```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

#### 3. Configure ngrok.yml

Copy the `ngrok.yml` file to your ngrok directory and update the auth token:
```powershell
# Copy the config file
cp e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\ngrok.yml C:\ngrok\ngrok.yml

# Edit and add your auth token
notepad C:\ngrok\ngrok.yml
```

#### 4. Start ngrok Tunnels

**Option A: Start Both Tunnels at Once (Recommended)**
```powershell
cd C:\ngrok
ngrok start --all --config ngrok.yml
```

**Option B: Start Individually**

Terminal 3 - PeerJS Tunnel:
```powershell
ngrok http 9000
```

Terminal 4 - Vite Tunnel:
```powershell
ngrok http 5173 --host-header="localhost:5173"
```

#### 5. Update Configuration

After starting ngrok, you'll see URLs like:
- Vite: `https://abc123.ngrok-free.app`
- PeerJS: `https://xyz789.ngrok-free.app`

**Update `vite.config.js`:**
```javascript
server: {
  host: true,
  allowedHosts: [
    'localhost',
    'abc123.ngrok-free.app',  // Add your Vite ngrok URL
  ]
}
```

**Update `src/config/peerConfig.js`:**
```javascript
const MODE = 'ngrok'; // Change from 'local' to 'ngrok'

const configs = {
  // ...
  ngrok: {
    host: 'xyz789.ngrok-free.app',  // Your PeerJS ngrok URL
    port: 443,
    path: '/myapp',
    secure: true
  }
};
```

#### 6. Restart Vite
After updating the config, restart the Vite dev server:
```powershell
# Press Ctrl+C in Terminal 2, then:
npm run dev
```

#### 7. Access Your App
Open the Vite ngrok URL in any browser: `https://abc123.ngrok-free.app`

**Note:** Free ngrok accounts show a "Visit Site" warning - just click through it.

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

### ngrok Issues

**"Invalid Host Header"**
- Add `--host-header="localhost:5173"` when starting Vite tunnel
- Update `allowedHosts` in `vite.config.js`

**"ERR_NGROK_3200"**
- Normal for free accounts
- Click "Visit Site" to continue

**URLs Keep Changing**
- Free ngrok URLs change on restart
- Consider upgrading to ngrok Pro for static domains

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

- **NGROK_QUICKSTART.md** - Quick ngrok setup guide
- **NGROK_SETUP.md** - Detailed ngrok configuration
- **MOBILE_DEPLOYMENT_GUIDE.md** - Publishing to Google Play
- **ARCHITECTURE.md** - Technical architecture details
- **FAQ.md** - Frequently asked questions

## 🎯 Quick Reference

| Component | Port | URL (Local) | Purpose |
|-----------|------|-------------|---------|
| Vite Dev Server | 5173 | http://localhost:5173 | Frontend application |
| PeerJS Server | 9000 | http://localhost:9000 | WebRTC signaling |

## 🔐 Security Notes

- Keep your ngrok auth token private
- Don't commit `ngrok.yml` with your token to git
- Use environment variables for sensitive data in production

## 🚀 Next Steps

1. ✅ Fix all configuration issues (DONE)
2. ✅ Install dependencies (DONE)
3. 🔄 Test locally
4. 🔄 Set up ngrok for internet access
5. 🔄 Test on mobile devices
6. 🔄 Deploy to production (optional)

## 💡 Tips

- Use `MODE = 'local'` for local development
- Switch to `MODE = 'ngrok'` when testing over internet
- Keep both terminals (server + client) running
- Check browser console for errors
- Test with different browsers and devices

## 📞 Support

For issues or questions:
1. Check the FAQ.md
2. Review browser console errors
3. Verify all services are running
4. Check ngrok tunnel status

---

**Happy Broadcasting! 🎙️**
