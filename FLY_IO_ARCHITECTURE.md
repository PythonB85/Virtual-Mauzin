# Virtual Mauzin - Fly.io Architecture

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Fly.io Cloud                            │
│                                                              │
│  ┌────────────────────────┐    ┌─────────────────────────┐  │
│  │   Frontend App         │    │   Backend Server        │  │
│  │   (React + Vite)       │    │   (PeerJS Server)       │  │
│  │                        │    │                         │  │
│  │  virtual-mauzin        │◄───┤  virtual-mauzin-server  │  │
│  │  .fly.dev              │    │  .fly.dev               │  │
│  │                        │    │                         │  │
│  │  Port: 8080 (Nginx)    │    │  Port: 9000 (Node.js)   │  │
│  │  Auto-HTTPS ✓          │    │  Auto-HTTPS ✓           │  │
│  └────────────────────────┘    └─────────────────────────┘  │
│           │                              │                   │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            │ HTTPS                        │ WebSocket (WSS)
            │                              │
    ┌───────▼──────────┐          ┌────────▼─────────┐
    │   Broadcaster    │          │   Listeners      │
    │   (Device 1)     │          │   (Devices 2-N)  │
    │                  │          │                  │
    │  🎤 Microphone   │──────────┤  🔊 Speakers     │
    │                  │  WebRTC  │                  │
    └──────────────────┘  P2P     └──────────────────┘
```

## Data Flow

### 1. Initial Connection

```
Broadcaster                Frontend App              Backend Server
    │                           │                          │
    │  1. Load App              │                          │
    ├──────────────────────────►│                          │
    │                           │                          │
    │                           │  2. Connect to PeerJS    │
    │                           ├─────────────────────────►│
    │                           │                          │
    │                           │  3. Get Peer ID          │
    │                           │◄─────────────────────────┤
    │                           │  (main-broadcast)        │
    │  4. Start Broadcast       │                          │
    ├──────────────────────────►│                          │
    │                           │                          │
```

### 2. Listener Joins

```
Listener                   Frontend App              Backend Server
    │                           │                          │
    │  1. Load App              │                          │
    ├──────────────────────────►│                          │
    │                           │                          │
    │                           │  2. Connect to PeerJS    │
    │                           ├─────────────────────────►│
    │                           │                          │
    │  3. Join Broadcast        │                          │
    ├──────────────────────────►│                          │
    │                           │                          │
    │                           │  4. Connect to           │
    │                           │     main-broadcast       │
    │                           ├─────────────────────────►│
    │                           │                          │
    │                           │  5. Establish WebRTC     │
    │                           │◄─────────────────────────┤
    │                           │                          │
```

### 3. Audio Streaming

```
Broadcaster                                          Listener
    │                                                    │
    │  Microphone Input                                 │
    ├──► Capture Audio                                  │
    │                                                    │
    │  WebRTC P2P Connection                            │
    ├───────────────────────────────────────────────────►│
    │  (Direct, no server relay)                        │
    │                                                    │
    │                                                    │  Play Audio
    │                                                    ├──► Speakers
    │                                                    │
```

## Environment Variables

### Backend (PeerJS Server)

```bash
NODE_ENV=production
ALLOWED_ORIGINS=https://virtual-mauzin.fly.dev
PORT=9000  # Set automatically by Fly.io
```

### Frontend (React App)

```bash
VITE_PEER_MODE=production
VITE_PEERJS_HOST=virtual-mauzin-server.fly.dev
VITE_PEERJS_PORT=443
VITE_PEERJS_SECURE=true
```

## Security

### HTTPS/WSS
- All connections encrypted with TLS
- Fly.io provides automatic SSL certificates
- Force HTTPS enabled on both apps

### CORS
- Backend only accepts connections from frontend domain
- Configured via `ALLOWED_ORIGINS` environment variable

### WebRTC
- Peer-to-peer encryption
- No audio data passes through server
- Only signaling goes through PeerJS server

## Scaling

### Current Setup (Free Tier)
- **Frontend**: 1 VM, 256MB RAM, auto-stop
- **Backend**: 1 VM, 256MB RAM, auto-stop
- **Cost**: ~$0-5/month

### Production Setup
- **Frontend**: 2+ VMs for redundancy
- **Backend**: 2+ VMs for high availability
- **Cost**: ~$10-20/month

### Scaling Commands

```powershell
# Keep 1 machine always running
fly scale count 1

# Scale to 2 machines for redundancy
fly scale count 2

# Increase memory
fly scale memory 512

# Scale to zero (auto-stop)
fly scale count 0
```

## Regions

### Available Regions
- `sin` - Singapore (Asia)
- `iad` - Ashburn, VA (US East)
- `lhr` - London (Europe)
- `syd` - Sydney (Australia)
- `gru` - São Paulo (South America)

### Best Practices
- Deploy both apps in the same region
- Choose region closest to your users
- Can deploy multiple instances in different regions

## Monitoring

### Metrics Available
- Request count
- Response time
- Memory usage
- CPU usage
- Network bandwidth

### Logging
```powershell
# Real-time logs
fly logs

# Follow logs
fly logs -f

# Filter by app
fly logs -a virtual-mauzin
```

## Backup & Recovery

### Configuration Backup
- `fly.toml` files (in git)
- Environment variables (documented)
- Dockerfile and nginx.conf (in git)

### Disaster Recovery
1. Redeploy from git repository
2. Restore environment variables
3. Test deployment

### Rollback
```powershell
# List releases
fly releases

# Rollback to previous version
fly releases rollback
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        working-directory: ./scratch/server
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        working-directory: ./scratch/client
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## Performance Optimization

### Frontend
- Gzip compression enabled (nginx)
- Static asset caching (1 year)
- Minified JavaScript/CSS
- Code splitting with Vite

### Backend
- WebSocket keep-alive
- Graceful shutdown handling
- Connection pooling

### Network
- CDN-like edge network (Fly.io)
- Auto-scaling based on load
- Geographic distribution

---

For implementation details, see `FLY_IO_DEPLOYMENT.md`
