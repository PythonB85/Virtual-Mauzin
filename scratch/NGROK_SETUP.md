# 🌐 ngrok Setup Guide for Virtual Mauzin

## Overview
This guide helps you expose your Virtual Mauzin app over the internet using ngrok, allowing you to test on mobile devices or share with others.

## Prerequisites
- Your app should be running locally (both client and server)
- You need an ngrok account (free tier works fine)

## Installation

### Windows (PowerShell)

**Option 1: Using Chocolatey (Recommended)**
```powershell
choco install ngrok
```

**Option 2: Using Scoop**
```powershell
scoop install ngrok
```

**Option 3: Manual Installation**
1. Download from: https://ngrok.com/download
2. Extract the zip file to a folder (e.g., `C:\ngrok`)
3. Add the folder to your PATH, or run from that directory

## Authentication

1. Sign up at: https://dashboard.ngrok.com/signup
2. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Authenticate ngrok:
```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

## Running ngrok

You need to expose **TWO services**:

### Service 1: PeerJS Server (Port 9000)
Open a new terminal and run:
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
ngrok http 9000
```

**Copy the forwarding URL** (e.g., `https://abc123.ngrok-free.app`)

### Service 2: Vite Dev Server (Port 5173)
Open another terminal and run:
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
ngrok http 5173 --host-header="localhost:5173"
```

**Copy the forwarding URL** (e.g., `https://xyz789.ngrok-free.app`)

## Configuration Updates

After starting ngrok, you'll need to update your configuration:

### 1. Update `vite.config.js`

Replace the current ngrok domain in `allowedHosts`:
```javascript
server: {
  allowedHosts: [
    'YOUR_VITE_NGROK_URL.ngrok-free.app',  // e.g., 'xyz789.ngrok-free.app'
  ]
}
```

### 2. Update Client Code (PeerJS Configuration)

Find where you initialize PeerJS in your client code and update the host:
```javascript
const peer = new Peer({
  host: 'YOUR_PEERJS_NGROK_URL.ngrok-free.app',  // e.g., 'abc123.ngrok-free.app'
  port: 443,
  path: '/myapp',
  secure: true
});
```

## Testing

1. Make sure both services are running:
   - `npm start` in `scratch/server`
   - `npm run dev` in `scratch/client`

2. Start both ngrok tunnels (as shown above)

3. Open the Vite ngrok URL in your mobile browser

4. The app should now work over the internet!

## Troubleshooting

### "ERR_NGROK_3200" or "Visit Site" Button
- This is normal for free ngrok accounts
- Click "Visit Site" to proceed

### WebRTC Connection Issues
- Make sure both ngrok tunnels are running
- Verify the PeerJS server URL is correct in your client code
- Check browser console for errors

### CORS Issues
- The `--host-header` flag should handle this for Vite
- If issues persist, you may need to configure CORS in your server

## Using a Static Domain (Paid Feature)

If you want to keep the same URL (like `unsplendid-ofelia-ponderously.ngrok-free.dev`), you need:
1. ngrok Pro account or higher
2. Reserve a static domain in the ngrok dashboard
3. Use: `ngrok http 5173 --domain=your-static-domain.ngrok-free.app`

## Alternative: ngrok Configuration File

For easier management, create `ngrok.yml`:

```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN

tunnels:
  vite:
    proto: http
    addr: 5173
    host_header: "localhost:5173"
  
  peerjs:
    proto: http
    addr: 9000
```

Then run both tunnels at once:
```powershell
ngrok start --all
```

## Notes

- Free ngrok URLs change every time you restart ngrok
- ngrok free tier has bandwidth limits
- For production, consider deploying to a proper hosting service
- Keep your ngrok auth token private!

## Quick Reference

| Service | Port | Purpose |
|---------|------|---------|
| Vite Dev Server | 5173 | Frontend application |
| PeerJS Server | 9000 | WebRTC signaling server |
