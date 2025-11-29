// PeerJS Configuration
// Switch between local and production modes

// Auto-detect mode based on environment
const MODE = import.meta.env.VITE_PEER_MODE || 'local';

const configs = {
    local: {
        host: 'localhost',
        port: 9000,
        path: '/myapp',
        secure: false
    },
    production: {
        // Use environment variable for production server URL
        host: import.meta.env.VITE_PEERJS_HOST || window.location.hostname,
        port: import.meta.env.VITE_PEERJS_PORT || 443,
        path: '/myapp',
        secure: import.meta.env.VITE_PEERJS_SECURE !== 'false' // Default to true
    }
};

export const PEER_CONFIG = configs[MODE];

// Instructions:
// Local: MODE = 'local' (default)
// Production: Set VITE_PEER_MODE=production and VITE_PEERJS_HOST in .env
