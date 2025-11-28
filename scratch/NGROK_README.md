# 🌐 Exposing Virtual Mauzin Over the Internet

This folder contains everything you need to expose your Virtual Mauzin app over the internet using ngrok.

## 📚 Documentation Files

1. **NGROK_QUICKSTART.md** - ⭐ **START HERE** - Step-by-step guide to get ngrok running
2. **NGROK_SETUP.md** - Detailed documentation with troubleshooting
3. **setup-ngrok.ps1** - Helper script to guide you through the process

## 🚀 Quick Start (TL;DR)

1. **Install ngrok**: Download from https://ngrok.com/download
2. **Authenticate**: `ngrok config add-authtoken YOUR_TOKEN`
3. **Start services**: 
   - `npm start` in `scratch/server`
   - `npm run dev` in `scratch/client`
4. **Run ngrok** (2 terminals):
   - `ngrok http 9000` (for PeerJS)
   - `ngrok http 5173 --host-header="localhost:5173"` (for Vite)
5. **Update config**:
   - `src/config/peerConfig.js` - Set MODE to 'ngrok' and add PeerJS URL
   - `vite.config.js` - Add Vite URL to allowedHosts
6. **Restart Vite** and access your app via the ngrok URL!

## 📱 Why Use ngrok?

- **Test on mobile devices** without deploying
- **Share your app** with others instantly
- **Debug** real-world scenarios
- **Demo** your app from anywhere

## 🔧 Configuration Files

### src/config/peerConfig.js
Central configuration for PeerJS. Switch between 'local' and 'ngrok' modes easily.

### vite.config.js
Vite configuration with allowed hosts for ngrok.

## 💡 Tips

- Free ngrok URLs change every time you restart
- You need TWO ngrok tunnels (one for frontend, one for PeerJS server)
- Always update both configuration files when switching modes
- Remember to restart Vite after changing config

## 🆘 Need Help?

1. Read **NGROK_QUICKSTART.md** for step-by-step instructions
2. Check **NGROK_SETUP.md** for troubleshooting
3. Run `.\setup-ngrok.ps1` for an interactive guide

## 📋 Checklist

Before using ngrok, make sure:
- [ ] ngrok is installed
- [ ] ngrok is authenticated with your token
- [ ] PeerJS server is running (port 9000)
- [ ] Vite dev server is running (port 5173)
- [ ] Both ngrok tunnels are active
- [ ] Configuration files are updated with ngrok URLs
- [ ] Vite dev server has been restarted after config changes

---

Happy broadcasting! 🎙️
