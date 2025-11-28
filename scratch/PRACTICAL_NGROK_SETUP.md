# 🚀 Virtual Mauzin - Practical ngrok Setup Guide

## The Situation

Your ngrok free account has a static domain (`unsplendid-ofelia-ponderously.ngrok-free.dev`) that **automatically gets used** for all tunnels. You cannot get two different URLs on the free plan when a static domain is assigned.

## Best Solution: Use Static Domain for Frontend, Keep Backend Local

This is the most practical approach for development and testing:

### Architecture
- **Frontend (Vite)**: Accessible via ngrok → `https://unsplendid-ofelia-ponderously.ngrok-free.dev`
- **Backend (PeerJS)**: Runs locally → `localhost:9000`
- **Connection**: Frontend connects to PeerJS via localhost (works when testing on the same machine)

### Setup Steps

#### 1. Update `peerConfig.js` to use localhost
```javascript
const MODE = 'local'; // Keep this as 'local'

const configs = {
    local: {
        host: 'localhost',
        port: 9000,
        path: '/myapp',
        secure: false
    },
    // ngrok config not needed for this setup
};

export const PEER_CONFIG = configs[MODE];
```

#### 2. Update `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      'unsplendid-ofelia-ponderously.ngrok-free.dev',
    ]
  }
})
```

#### 3. Start Services

**Terminal 1 - PeerJS Server:**
```powershell
cd e:\\Projects_2743\\MobileApps\\Virtual-Mauzin\\scratch\\server
npm start
```

**Terminal 2 - Vite Dev Server:**
```powershell
cd e:\\Projects_2743\\MobileApps\\Virtual-Mauzin\\scratch\\client
npm run dev
```

**Terminal 3 - ngrok (Frontend only):**
```powershell
cd e:\\Projects_2743\\MobileApps\\Virtual-Mauzin\\scratch
.\\ngrok.exe http 5173 --host-header="localhost:5173"
```

#### 4. Testing

**On your local machine:**
- Open: `http://localhost:5173`
- Everything works because both frontend and backend are local

**On your mobile device (same network):**
- Open: `https://unsplendid-ofelia-ponderously.ngrok-free.dev`
- Click "Visit Site" on ngrok warning
- **Note**: PeerJS connections will only work if your mobile device can reach `localhost:9000` of your computer

### For True Remote Testing (Mobile on Different Network)

If you need to test from a mobile device on a **different network**, you have two options:

#### Option A: Use Your Computer's Local IP for PeerJS

1. Find your computer's local IP:
```powershell
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

2. Update `peerConfig.js`:
```javascript
const MODE = 'custom';

const configs = {
    custom: {
        host: '192.168.1.100',  // Your computer's IP
        port: 9000,
        path: '/myapp',
        secure: false
    }
};
```

3. Make sure your firewall allows port 9000

**Limitation**: Only works on same local network

#### Option B: Upgrade to ngrok Paid Plan ($8-10/month)

With a paid plan, you can:
- Get a second static domain for PeerJS
- Remove the "Visit Site" warning
- Get better performance and reliability

**Setup with paid plan:**
```yaml
tunnels:
  vite:
    domain: unsplendid-ofelia-ponderously.ngrok-free.dev
  peerjs:
    domain: your-second-domain.ngrok-free.dev  # Reserve in dashboard
```

## Quick Start Commands

```powershell
# Start everything at once (3 terminals)

# Terminal 1
cd e:\\Projects_2743\\MobileApps\\Virtual-Mauzin\\scratch\\server && npm start

# Terminal 2
cd e:\\Projects_2743\\MobileApps\\Virtual-Mauzin\\scratch\\client && npm run dev

# Terminal 3
cd e:\\Projects_2743\\MobileApps\\Virtual-Mauzin\\scratch && .\\ngrok.exe http 5173 --host-header="localhost:5173"
```

Then open `https://unsplendid-ofelia-ponderously.ngrok-free.dev` in your browser!

## Summary

✅ **What Works**: Frontend accessible via ngrok URL  
⚠️ **Limitation**: Backend (PeerJS) must be local or on same network  
💡 **Best For**: Local development and testing on your own devices  
🚀 **For Production**: Consider upgrading to ngrok paid plan or deploying to a cloud service
