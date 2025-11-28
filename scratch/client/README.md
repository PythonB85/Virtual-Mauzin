# Virtual Mauzin - Frontend

Real-time audio broadcasting application built with React and PeerJS.

## Features

- 🎙️ **Broadcast Audio**: Stream your microphone to multiple listeners
- 👂 **Listen to Broadcasts**: Connect to any broadcaster using their ID
- 🌐 **WebRTC**: Peer-to-peer audio streaming for low latency
- 📱 **Mobile Ready**: PWA support and Capacitor integration

## Development

### Prerequisites
- Node.js 16+
- npm 8+

### Setup
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# Peer configuration mode
VITE_PEER_MODE=local  # or 'production'

# Production PeerJS server (when VITE_PEER_MODE=production)
VITE_PEERJS_HOST=your-backend.railway.app
VITE_PEERJS_PORT=443
VITE_PEERJS_SECURE=true
```

## Deployment

See [CLOUD_DEPLOYMENT_GUIDE.md](../../CLOUD_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Click the button above
2. Set environment variables
3. Deploy!

## Mobile App

Build Android app:
```bash
npm run mobile:build
npm run mobile:open
```

See [MOBILE_README.md](./MOBILE_README.md) for details.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **PeerJS** - WebRTC wrapper
- **Lucide React** - Icons
- **Capacitor** - Mobile app wrapper

## License

ISC
