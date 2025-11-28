# Virtual Mauzin - Backend (PeerJS Server)

WebRTC signaling server for Virtual Mauzin audio broadcasting app.

## Features

- 🔌 **WebRTC Signaling**: Facilitates peer-to-peer connections
- 🌐 **CORS Support**: Configurable cross-origin requests
- ⚡ **Low Latency**: Optimized for real-time audio streaming
- 🔒 **Secure**: HTTPS support and origin validation

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
npm start
```

Server runs on `http://localhost:9000`

### Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# Port (cloud platforms set this automatically)
PORT=9000

# Environment
NODE_ENV=production

# Allowed origins for CORS (comma-separated)
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## Deployment

See [CLOUD_DEPLOYMENT_GUIDE.md](../../CLOUD_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Click the button above
2. Select this repository
3. Set root directory to `scratch/server`
4. Set environment variables
5. Deploy!

### Quick Deploy to Render

1. Create new Web Service
2. Connect repository
3. Set root directory: `scratch/server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables
7. Deploy

## API Endpoints

### Health Check
```
GET /myapp
```

### WebSocket Connection
```
WS /myapp/peerjs
```

## Configuration

The server accepts the following configuration:

- **PORT**: Server port (default: 9000)
- **PATH**: WebSocket path (default: /myapp)
- **CORS**: Configurable via ALLOWED_ORIGINS env var

## Monitoring

Check server logs for:
- ✅ Client connections
- ❌ Client disconnections
- ⚠️ Errors and warnings

## Tech Stack

- **Node.js** - Runtime
- **peer** - PeerJS server library

## License

ISC
