# 🚀 Quick Start: Using ngrok with Virtual Mauzin

## Step 1: Install ngrok

### Manual Installation (Recommended)
1. Go to: https://ngrok.com/download
2. Download the Windows version
3. Extract the zip file to a folder (e.g., `C:\ngrok` or `C:\Users\YourName\ngrok`)
4. (Optional) Add the folder to your system PATH

## Step 2: Sign Up and Authenticate

1. Sign up for free at: https://dashboard.ngrok.com/signup
2. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Open PowerShell and run:
   ```powershell
   cd C:\ngrok  # or wherever you extracted ngrok
   .\ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
   ```

## Step 3: Start Your Local Services

Make sure both services are running:

**Terminal 1 - Start PeerJS Server:**
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
npm start
```

**Terminal 2 - Start Vite Dev Server:**
```powershell
cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
npm run dev
```

## Step 4: Start ngrok Tunnels

You need TWO ngrok tunnels running simultaneously.

**Terminal 3 - Expose PeerJS Server (Port 9000):**
```powershell
cd C:\ngrok  # or wherever you extracted ngrok
.\ngrok http 9000
```

You'll see output like:
```
Forwarding   https://abc123xyz.ngrok-free.app -> http://localhost:9000
```

**COPY THIS URL** (just the domain part: `abc123xyz.ngrok-free.app`)

**Terminal 4 - Expose Vite Dev Server (Port 5173):**
```powershell
cd C:\ngrok  # or wherever you extracted ngrok
.\ngrok http 5173 --host-header="localhost:5173"
```

You'll see output like:
```
Forwarding   https://def456uvw.ngrok-free.app -> http://localhost:5173
```

**COPY THIS URL** (just the domain part: `def456uvw.ngrok-free.app`)

## Step 5: Update Your Configuration

### 5a. Update PeerJS Configuration

Open: `e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client\src\config\peerConfig.js`

Change:
```javascript
const MODE = 'local'; // Change this to 'ngrok'
```
to:
```javascript
const MODE = 'ngrok';
```

And replace:
```javascript
host: 'YOUR-NGROK-URL.ngrok-free.app',
```
with your PeerJS ngrok URL (from Terminal 3):
```javascript
host: 'abc123xyz.ngrok-free.app',  // Your actual URL
```

### 5b. Update Vite Configuration

Open: `e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client\vite.config.js`

Replace:
```javascript
allowedHosts: [
  'unsplendid-ofelia-ponderously.ngrok-free.dev',
]
```
with your Vite ngrok URL (from Terminal 4):
```javascript
allowedHosts: [
  'def456uvw.ngrok-free.app',  // Your actual URL
]
```

## Step 6: Restart Vite Dev Server

After updating the configuration, restart your Vite dev server:

1. Go to Terminal 2 (where Vite is running)
2. Press `Ctrl+C` to stop it
3. Run `npm run dev` again

## Step 7: Test Your App

1. Open your Vite ngrok URL in a browser: `https://def456uvw.ngrok-free.app`
2. Click "Visit Site" if you see the ngrok warning (this is normal for free accounts)
3. Your app should now be accessible from anywhere on the internet!
4. Test on your mobile device by opening the same URL

## 📱 Testing on Mobile

1. Open your mobile browser
2. Go to: `https://def456uvw.ngrok-free.app` (your Vite ngrok URL)
3. Click "Visit Site" on the ngrok warning page
4. The app should load and work just like on your computer!

## 🔄 When to Update URLs

You need to update the ngrok URLs in your configuration whenever:
- You restart ngrok (free tier gives you new random URLs each time)
- You want to use a different ngrok tunnel

## 💡 Pro Tips

### Keep the Same URL (Paid Feature)
If you upgrade to ngrok Pro, you can get a static domain that doesn't change:
```powershell
.\ngrok http 9000 --domain=your-static-domain.ngrok-free.app
```

### Run Both Tunnels at Once
Create a file `ngrok.yml` in your ngrok folder:
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

Then run:
```powershell
.\ngrok start --all
```

## 🐛 Troubleshooting

### "Visit Site" Button Appears
- This is normal for free ngrok accounts
- Just click "Visit Site" to continue

### Can't Connect to Broadcaster
- Make sure both ngrok tunnels are running
- Verify the PeerJS ngrok URL is correct in `peerConfig.js`
- Check that MODE is set to 'ngrok'

### Vite Shows "Invalid Host Header"
- Make sure you used `--host-header="localhost:5173"` when starting the Vite ngrok tunnel
- Verify the Vite ngrok URL is in `allowedHosts` in `vite.config.js`

### Audio Not Working
- Make sure microphone permissions are granted
- Check browser console for errors
- Verify both services (PeerJS and Vite) are running

## 📋 Quick Reference

| What | Port | ngrok Command |
|------|------|---------------|
| PeerJS Server | 9000 | `.\ngrok http 9000` |
| Vite Dev Server | 5173 | `.\ngrok http 5173 --host-header="localhost:5173"` |

## 🔙 Switching Back to Local

To switch back to local development:

1. Open `src/config/peerConfig.js`
2. Change `const MODE = 'ngrok'` to `const MODE = 'local'`
3. Restart Vite dev server
4. Access the app at `http://localhost:5173`

---

**Need Help?** Check the detailed guide at `NGROK_SETUP.md`
