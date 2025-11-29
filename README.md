# Virtual Mauzin - Real-time Audio Broadcasting

A real-time audio broadcasting application using WebRTC and PeerJS, available as both a web app and native Android mobile app.

## 🎯 Features

- **Real-time Audio Streaming**: High-quality audio broadcasting using WebRTC
- **Broadcaster Mode**: Start broadcasting audio to multiple listeners
- **Listener Mode**: Connect to broadcasters using their Peer ID
- **Cross-Platform**: Available as web app and Android mobile app
- **Low Latency**: Peer-to-peer connections for minimal delay

## 🚀 Quick Start

### Web Application

You need to run both the **server** and **client** in separate terminals.

#### 1. Start the PeerJS Server (Terminal 1)

```bash
cd .\scratch\server\
npm start
```

The server will start on port 9000 and handle peer connections.

#### 2. Start the Client App (Terminal 2)

```bash
cd .\scratch\client\
npm run dev
```

The client will start on http://localhost:5173/

### 📱 Mobile Application (Android)

#### Build and Run Mobile App

```bash
cd .\scratch\client\

# Build web app and sync with Android
npm run mobile:build

# Open in Android Studio
npm run mobile:open
```

Then run the app from Android Studio on an emulator or real device.

## 📖 Documentation

### For Cloud Deployment

- **[FLY_IO_QUICK_START.md](FLY_IO_QUICK_START.md)** - Quick start guide for Fly.io deployment
- **[FLY_IO_DEPLOYMENT.md](FLY_IO_DEPLOYMENT.md)** - Complete Fly.io deployment guide
- **[FLY_IO_ARCHITECTURE.md](FLY_IO_ARCHITECTURE.md)** - Architecture and technical details
- **[CLOUD_DEPLOYMENT_GUIDE.md](CLOUD_DEPLOYMENT_GUIDE.md)** - General cloud deployment guide (Vercel, Railway, Render)

### For Mobile App Development & Deployment

- **[MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md)** - Complete guide for deploying to Google Play Store
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist for deployment
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick reference for common commands and tasks
- **[PRIVACY_POLICY.md](PRIVACY_POLICY.md)** - Privacy policy template for Google Play
- **[scratch/client/MOBILE_README.md](scratch/client/MOBILE_README.md)** - Mobile app specific README

### For Setup

- **[setup-mobile.ps1](setup-mobile.ps1)** - Automated setup script for mobile development

## 💻 Usage

### Web App

1. Open the client in your browser
2. Choose "Start Broadcast" to become a broadcaster
3. Share your Peer ID with listeners
4. Listeners can join by entering your Peer ID and clicking "Connect"

### Mobile App

1. Launch the Virtual Mauzin app
2. Choose "Start Broadcast" or "Join Broadcast"
3. For broadcasting: Grant microphone permission and share your Peer ID
4. For listening: Enter the broadcaster's Peer ID and connect

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite
- **Real-time Communication**: WebRTC, PeerJS
- **Mobile Framework**: Capacitor
- **Platform**: Web, Android (iOS coming soon)

## 📦 Project Structure

```
Virtual-Mauzin/
├── scratch/
│   ├── client/              # React web app
│   │   ├── src/            # React source code
│   │   ├── android/        # Native Android project
│   │   └── dist/           # Built web assets
│   └── server/             # PeerJS signaling server
├── MOBILE_DEPLOYMENT_GUIDE.md
├── DEPLOYMENT_CHECKLIST.md
├── QUICK_REFERENCE.md
├── PRIVACY_POLICY.md
└── setup-mobile.ps1
```

## 🎨 Available Commands

### Web Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Mobile Development
```bash
npm run mobile:build # Build and sync with Android
npm run mobile:open  # Open in Android Studio
npm run mobile:sync  # Sync web assets to Android
npm run mobile:run   # Build and open in one command
```

## 🔐 Permissions (Mobile App)

The mobile app requires the following permissions:
- **Microphone** - For broadcasting audio
- **Internet** - For peer-to-peer connections
- **Network State** - For monitoring connectivity

## 🚀 Deploying to Google Play

See the comprehensive [MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md) for detailed instructions on:
- Setting up Android development environment
- Building signed APK/AAB files
- Creating Google Play Console account
- Uploading and publishing your app
- Managing updates and releases

## ☁️ Deploying to Cloud (Fly.io)

Deploy your Virtual Mauzin app to the cloud for global access:

### Quick Deploy to Fly.io

1. **Install Fly.io CLI** (PowerShell as Administrator):
   ```powershell
   iwr https://fly.io/install.ps1 -useb | iex
   fly auth login
   ```

2. **Deploy Backend**:
   ```powershell
   cd .\scratch\server\
   fly launch --no-deploy
   fly secrets set NODE_ENV=production ALLOWED_ORIGINS=*
   fly deploy
   ```

3. **Deploy Frontend**:
   ```powershell
   cd .\scratch\client\
   fly launch --no-deploy
   fly deploy
   ```

See [FLY_IO_QUICK_START.md](FLY_IO_QUICK_START.md) for detailed instructions.

### Alternative Cloud Platforms

- **Vercel** (Frontend) + **Railway** (Backend) - See [CLOUD_DEPLOYMENT_GUIDE.md](CLOUD_DEPLOYMENT_GUIDE.md)
- **Netlify** (Frontend) + **Render** (Backend) - See [CLOUD_DEPLOYMENT_GUIDE.md](CLOUD_DEPLOYMENT_GUIDE.md)

## 📱 App Information

- **App Name**: Virtual Mauzin
- **Package ID**: com.virtualmauzin.app
- **Platform**: Android (iOS support planned)
- **Category**: Music & Audio / Communication

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

[Add your license here]

## 📞 Support

For questions or support:
- Check the documentation in the guides above
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Ready to broadcast!** 🎙️ Start with the web app or build the mobile version for Google Play.

