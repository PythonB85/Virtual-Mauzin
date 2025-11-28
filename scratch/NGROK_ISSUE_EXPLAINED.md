# 🔍 ngrok Configuration Analysis - Why You're Getting the Same URL

## The Problem

Your `ngrok.yml` file is correctly configured to create **two separate tunnels**:
- `vite` tunnel → Port 5173 (Frontend)
- `peerjs` tunnel → Port 9000 (Backend)

However, **both tunnels are receiving the SAME public URL**: 
`https://unsplendid-ofelia-ponderously.ngrok-free.dev`

## Root Cause

Your ngrok account has been assigned a **free static domain** (`unsplendid-ofelia-ponderously.ngrok-free.dev`). This is a feature ngrok introduced for free accounts - each account gets ONE static domain.

**The Issue:** When you run `ngrok start --all`, ngrok's default behavior is to use your account's static domain for ALL tunnels. Since you only have ONE static domain but are trying to create TWO tunnels, they both try to claim the same URL, causing a conflict.

## Why This Happens

1. **Free Plan Limitation:** Free ngrok accounts get exactly **1 static domain**
2. **Account Default:** Your account is configured to automatically use this domain
3. **No Override:** Even when you don't specify a domain in the config, ngrok defaults to using your static domain
4. **Collision:** Both tunnels compete for the same domain, causing routing issues

## The Solution

You have **three options**:

### Option 1: Use Your Static Domain for ONE Service Only (Recommended)

**Best for:** Testing on mobile devices where you need a stable URL

**Steps:**
1. Choose which service gets the static domain (I recommend Vite/Frontend)
2. Run ONLY that tunnel with your static domain
3. Run the other service locally or with a separate random ngrok URL

**Updated `ngrok.yml`:**
```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN

tunnels:
  vite:
    proto: http
    addr: 5173
    host_header: "localhost:5173"
    domain: unsplendid-ofelia-ponderously.ngrok-free.dev
  
  # Don't start peerjs with ngrok - use local connection
  # Or start it separately with: ngrok http 9000
```

**Then update `peerConfig.js`:**
```javascript
const MODE = 'local'; // Keep PeerJS local
// Or if you run peerjs ngrok separately, update with that random URL
```

### Option 2: Use Two Random URLs (Best for Development)

**Best for:** Quick testing when you don't need stable URLs

**Steps:**
1. Remove the `domain` line from `ngrok.yml` (or use a different config)
2. Start tunnels in **separate terminals** to force random URLs:

**Terminal 1:**
```powershell
.\ngrok.exe http 5173 --host-header="localhost:5173"
```

**Terminal 2:**
```powershell
.\ngrok.exe http 9000
```

3. Copy the TWO DIFFERENT random URLs (e.g., `abc123.ngrok-free.app` and `xyz789.ngrok-free.app`)
4. Update your config files with these URLs
5. Restart Vite dev server

**Downside:** URLs change every time you restart ngrok

### Option 3: Upgrade to ngrok Paid Plan

**Cost:** $8-10/month  
**Benefit:** Get multiple static domains, no "Visit Site" warning, better performance

With a paid plan, you can reserve a second domain and update `ngrok.yml`:
```yaml
tunnels:
  vite:
    domain: unsplendid-ofelia-ponderously.ngrok-free.dev
  peerjs:
    domain: your-second-domain.ngrok-free.dev  # Reserve this in dashboard
```

## Why Your Current `ngrok.yml` Doesn't Work

Your current config:
```yaml
tunnels:
  vite:
    domain: unsplendid-ofelia-ponderously.ngrok-free.dev
  peerjs:
    # No domain specified
```

**What happens:**
- `vite` gets: `unsplendid-ofelia-ponderously.ngrok-free.dev` ✓
- `peerjs` **ALSO** gets: `unsplendid-ofelia-ponderously.ngrok-free.dev` ✗

Because ngrok defaults to using your account's static domain even when not specified.

## Recommended Quick Fix

**For immediate testing, use Option 2:**

1. Stop current ngrok: `Ctrl+C`
2. Start services:
   ```powershell
   # Terminal 1: PeerJS
   cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\server
   npm start
   
   # Terminal 2: Vite
   cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch\client
   npm run dev
   
   # Terminal 3: ngrok for Vite
   cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch
   .\ngrok.exe http 5173 --host-header="localhost:5173"
   
   # Terminal 4: ngrok for PeerJS
   cd e:\Projects_2743\MobileApps\Virtual-Mauzin\scratch
   .\ngrok.exe http 9000
   ```

3. Copy the URLs from Terminal 3 and 4 output
4. Update configs:
   - `vite.config.js`: Add Terminal 3 URL to `allowedHosts`
   - `peerConfig.js`: Set `MODE='ngrok'` and add Terminal 4 URL to `host`
5. Restart Vite (Terminal 2)

## Summary

**The `ngrok.yml` file itself is correct** - the issue is a **limitation of the free plan** where you only get one static domain. You cannot run two simultaneous tunnels with the same domain without conflicts.

Choose Option 1 or 2 above based on your needs.
