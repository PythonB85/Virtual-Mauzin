# Virtual Mauzin - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Virtual Mauzin System                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Web Browser    │         │  Mobile App      │
│   (Broadcaster)  │         │  (Broadcaster)   │
│                  │         │                  │
│  ┌────────────┐  │         │  ┌────────────┐  │
│  │ React App  │  │         │  │ React App  │  │
│  │  (Vite)    │  │         │  │ (Capacitor)│  │
│  └────────────┘  │         │  └────────────┘  │
│        │         │         │        │         │
│        │ WebRTC  │         │        │ WebRTC  │
│        ▼         │         │        ▼         │
└────────┼─────────┘         └────────┼─────────┘
         │                            │
         │                            │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   PeerJS Server        │
         │   (Signaling Server)   │
         │   Port: 9000           │
         │                        │
         │  - Manages peer IDs    │
         │  - Facilitates WebRTC  │
         │  - No audio storage    │
         └────────────────────────┘
                      │
                      │
         ┌────────────┴───────────┐
         │                        │
         ▼                        ▼
┌──────────────────┐    ┌──────────────────┐
│   Web Browser    │    │  Mobile App      │
│   (Listener)     │    │  (Listener)      │
│                  │    │                  │
│  ┌────────────┐  │    │  ┌────────────┐  │
│  │ React App  │  │    │  │ React App  │  │
│  │  (Vite)    │  │    │  │ (Capacitor)│  │
│  └────────────┘  │    │  └────────────┘  │
└──────────────────┘    └──────────────────┘
```

## Data Flow

### Broadcasting Flow

```
1. Broadcaster starts broadcast
   │
   ▼
2. Request microphone permission
   │
   ▼
3. Capture audio stream
   │
   ▼
4. Connect to PeerJS server
   │
   ▼
5. Receive unique Peer ID
   │
   ▼
6. Share Peer ID with listeners
   │
   ▼
7. Wait for listener connections
   │
   ▼
8. Stream audio via WebRTC (P2P)
```

### Listening Flow

```
1. Listener enters broadcaster's Peer ID
   │
   ▼
2. Connect to PeerJS server
   │
   ▼
3. Request connection to broadcaster
   │
   ▼
4. Establish WebRTC connection
   │
   ▼
5. Receive audio stream
   │
   ▼
6. Play audio in real-time
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────┐
│         User Interface Layer                 │
│  React Components (Broadcaster, Listener)    │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Application Layer                    │
│  React State Management, Event Handlers      │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Communication Layer                  │
│  PeerJS (WebRTC Wrapper)                    │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Real-time Protocol Layer             │
│  WebRTC (Peer-to-Peer Audio Streaming)      │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         Platform Layer                       │
│  Web: Browser APIs                           │
│  Mobile: Capacitor + Android Native APIs    │
└─────────────────────────────────────────────┘
```

## Mobile App Architecture

```
┌─────────────────────────────────────────────────────┐
│              Android Application                     │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │         Capacitor WebView                   │    │
│  │                                             │    │
│  │  ┌────────────────────────────────────┐    │    │
│  │  │      React Application             │    │    │
│  │  │                                     │    │    │
│  │  │  - App.jsx                         │    │    │
│  │  │  - Broadcaster.jsx                 │    │    │
│  │  │  - Listener.jsx                    │    │    │
│  │  │  - WebRTC Logic                    │    │    │
│  │  │  - PeerJS Integration              │    │    │
│  │  └────────────────────────────────────┘    │    │
│  │                                             │    │
│  └────────────────────────────────────────────┘    │
│                       │                             │
│                       ▼                             │
│  ┌────────────────────────────────────────────┐    │
│  │      Capacitor Bridge (JavaScript)         │    │
│  └────────────────────────────────────────────┘    │
│                       │                             │
│                       ▼                             │
│  ┌────────────────────────────────────────────┐    │
│  │      Android Native APIs                   │    │
│  │                                             │    │
│  │  - Microphone Access                       │    │
│  │  - Network Access                          │    │
│  │  - Audio Settings                          │    │
│  │  - Permissions                             │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Build Process

### Web App Build

```
Source Code (src/)
      │
      ▼
   Vite Build
      │
      ▼
Optimized Bundle (dist/)
      │
      ▼
Served by Vite Dev Server
  (localhost:5173)
```

### Mobile App Build

```
Source Code (src/)
      │
      ▼
   Vite Build
      │
      ▼
Optimized Bundle (dist/)
      │
      ▼
Capacitor Sync
      │
      ▼
Copy to Android Project
(android/app/src/main/assets/public/)
      │
      ▼
Gradle Build
      │
      ├─────────────┬─────────────┐
      ▼             ▼             ▼
   Debug APK   Release APK   Release AAB
   (Testing)   (Testing)    (Play Store)
```

## Deployment Architecture

### Current (Development)

```
┌──────────────┐         ┌──────────────┐
│   Browser    │         │  Mobile App  │
│  localhost   │         │   Emulator   │
└──────┬───────┘         └──────┬───────┘
       │                        │
       └────────┬───────────────┘
                │
                ▼
       ┌────────────────┐
       │  PeerJS Server │
       │   localhost    │
       │   Port: 9000   │
       └────────────────┘
```

### Production (After Deployment)

```
┌──────────────┐         ┌──────────────┐
│   Browser    │         │  Mobile App  │
│   Internet   │         │  (Published) │
└──────┬───────┘         └──────┬───────┘
       │                        │
       └────────┬───────────────┘
                │
                ▼
       ┌────────────────────┐
       │  PeerJS Server     │
       │  Cloud Hosted      │
       │  (Heroku/AWS/GCP)  │
       │  HTTPS Enabled     │
       └────────────────────┘
```

## Google Play Deployment Flow

```
1. Development
   ├─ Write code
   ├─ Test locally
   └─ Fix bugs
      │
      ▼
2. Build
   ├─ npm run build
   ├─ npx cap sync
   └─ Verify build
      │
      ▼
3. Signing
   ├─ Generate keystore
   ├─ Configure signing
   └─ Build signed AAB
      │
      ▼
4. Testing
   ├─ Internal testing
   ├─ Collect feedback
   └─ Fix issues
      │
      ▼
5. Play Console
   ├─ Create app listing
   ├─ Upload screenshots
   ├─ Add descriptions
   └─ Upload AAB
      │
      ▼
6. Review
   ├─ Submit for review
   ├─ Wait 1-3 days
   └─ Address feedback
      │
      ▼
7. Published!
   └─ App live on Play Store
```

## File Organization

```
Virtual-Mauzin/
│
├── Documentation (Root Level)
│   ├── README.md                    ← Start here
│   ├── SETUP_COMPLETE.md            ← Setup summary
│   ├── MOBILE_DEPLOYMENT_GUIDE.md   ← Deployment guide
│   ├── DEPLOYMENT_CHECKLIST.md      ← Step-by-step
│   ├── QUICK_REFERENCE.md           ← Quick commands
│   └── PRIVACY_POLICY.md            ← Privacy template
│
├── Scripts
│   └── setup-mobile.ps1             ← Setup automation
│
└── Application Code
    └── scratch/
        ├── server/                  ← PeerJS server
        │   ├── server.js
        │   └── package.json
        │
        └── client/                  ← React app
            ├── MOBILE_README.md     ← Mobile guide
            ├── package.json         ← Dependencies
            ├── capacitor.config.json ← Mobile config
            │
            ├── src/                 ← Source code
            │   ├── App.jsx
            │   ├── components/
            │   └── styles/
            │
            ├── dist/                ← Built files
            │
            └── android/             ← Android project
                ├── app/
                │   ├── build.gradle
                │   └── src/main/
                │       ├── AndroidManifest.xml
                │       └── res/
                └── build/
                    └── outputs/
                        ├── bundle/  ← AAB files
                        └── apk/     ← APK files
```

## Permission Flow (Mobile)

```
App Launch
    │
    ▼
User selects "Start Broadcast"
    │
    ▼
App requests RECORD_AUDIO permission
    │
    ├─── User Grants ───────┐
    │                       │
    │                       ▼
    │              Microphone access enabled
    │              Broadcasting starts
    │
    └─── User Denies ───────┐
                            │
                            ▼
                   Show error message
                   Cannot broadcast
```

## Network Communication

```
Broadcaster                PeerJS Server           Listener
    │                           │                      │
    │──── Connect ─────────────▶│                      │
    │                           │                      │
    │◀──── Peer ID ─────────────│                      │
    │                           │                      │
    │                           │◀──── Connect ────────│
    │                           │                      │
    │                           │──── Peer ID ────────▶│
    │                           │                      │
    │◀──────────── WebRTC Handshake ─────────────────▶│
    │                           │                      │
    │◀══════════ Direct Audio Stream ════════════════▶│
    │              (Peer-to-Peer)                      │
    │                                                  │
```

## Security Model

```
┌─────────────────────────────────────────┐
│         Application Security             │
├─────────────────────────────────────────┤
│                                          │
│  ✓ WebRTC Encryption (DTLS-SRTP)       │
│  ✓ HTTPS for signaling (production)    │
│  ✓ No audio storage                     │
│  ✓ Temporary peer IDs                   │
│  ✓ Permission-based access              │
│  ✓ Signed APK/AAB                       │
│                                          │
│  ✗ No user authentication               │
│  ✗ No access control                    │
│  ✗ Public peer IDs                      │
│                                          │
└─────────────────────────────────────────┘
```

## Scalability Considerations

```
Current Architecture:
- Single PeerJS server
- Peer-to-peer connections
- Limited by broadcaster's bandwidth
- Each listener = separate connection

Limitations:
- Broadcaster bandwidth limits listener count
- Server can become bottleneck for signaling
- No load balancing

Future Improvements:
- Multiple PeerJS servers with load balancing
- CDN for static assets
- Server-side recording (optional)
- WebRTC SFU for better scalability
```

## Development Workflow

```
┌─────────────────────────────────────────┐
│          Development Cycle               │
└─────────────────────────────────────────┘

1. Code Changes
   ├─ Edit React components
   ├─ Update styles
   └─ Add features
      │
      ▼
2. Local Testing
   ├─ npm run dev (web)
   ├─ Test in browser
   └─ Verify functionality
      │
      ▼
3. Mobile Build
   ├─ npm run mobile:build
   └─ npx cap sync
      │
      ▼
4. Mobile Testing
   ├─ npm run mobile:open
   ├─ Run in Android Studio
   └─ Test on emulator/device
      │
      ▼
5. Fix Issues
   └─ Repeat from step 1
      │
      ▼
6. Ready for Release
   ├─ Increment version
   ├─ Build signed AAB
   └─ Upload to Play Store
```

---

This architecture document provides a visual overview of how Virtual Mauzin works, from the user interface down to the network communication layer.
