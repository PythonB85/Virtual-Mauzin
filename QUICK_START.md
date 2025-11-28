# 🎙️ Virtual Mauzin - Quick Reference Card

## 🚀 One-Command Start

### Local Development
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch
.\start-app.ps1
```
**Access:** http://localhost:5173

### With ngrok (Internet Access)
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch
.\start-app.ps1 -UseNgrok
```
**Then:** Update config files with ngrok URLs

---

## 📋 Manual Start (If Preferred)

### Terminal 1: PeerJS Server
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
npm start
```

### Terminal 2: Vite Dev Server
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
npm run dev
```

### Terminal 3 & 4: ngrok (Optional)
```powershell
# Terminal 3
ngrok http 9000

# Terminal 4
ngrok http 5173 --host-header="localhost:5173"
```

---

## ⚙️ ngrok Configuration

### 1. Update vite.config.js
```javascript
server: {
  host: true,
  allowedHosts: [
    'localhost',
    'YOUR-VITE-URL.ngrok-free.app',  // Add your Vite ngrok URL
  ]
}
```

### 2. Update src/config/peerConfig.js
```javascript
const MODE = 'ngrok';  // Change from 'local'

const configs = {
  ngrok: {
    host: 'YOUR-PEERJS-URL.ngrok-free.app',  // Your PeerJS ngrok URL
    port: 443,
    path: '/myapp',
    secure: true
  }
};
```

### 3. Restart Vite
```powershell
# Press Ctrl+C in Vite terminal, then:
npm run dev
```

---

## 📱 Mobile Build

```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client

# Build and sync
npm run mobile:build

# Open in Android Studio
npm run mobile:open
```

---

## 🔧 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm start` | Start PeerJS server |
| `npm run mobile:build` | Build mobile app |
| `npm run mobile:open` | Open in Android Studio |

---

## 🌐 Ports

| Service | Port | URL |
|---------|------|-----|
| Vite | 5173 | http://localhost:5173 |
| PeerJS | 9000 | http://localhost:9000 |

---

## 🐛 Quick Troubleshooting

### Build Fails
```powershell
rm -rf node_modules package-lock.json
npm install
```

### Microphone Not Working
- Allow browser permissions
- Use HTTPS (ngrok provides this)

### Can't Connect
- Check both services are running
- Verify ngrok URLs in config
- Check MODE in peerConfig.js

### Invalid Host Header
- Add ngrok URL to vite.config.js
- Use `--host-header="localhost:5173"`

---

## 📚 Documentation

- **FIXES_APPLIED.md** - All fixes made
- **PROJECT_README.md** - Complete setup guide
- **NGROK_QUICKSTART.md** - Quick ngrok guide
- **MOBILE_DEPLOYMENT_GUIDE.md** - Android deployment

---

## ✅ Status

- ✅ All dependencies installed
- ✅ ESLint configuration fixed
- ✅ Build successful
- ✅ Zero vulnerabilities
- ✅ Ready for development

---

**Happy Broadcasting! 🎙️**
