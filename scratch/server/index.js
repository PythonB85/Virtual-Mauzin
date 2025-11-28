const { PeerServer } = require('peer');

// Use environment variable for port, fallback to 9000
const PORT = process.env.PORT || 9000;

// CORS configuration for cloud deployment
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*', // Allow all origins in development
  credentials: true
};

const peerServer = PeerServer({
  port: PORT,
  path: '/myapp',
  allow_discovery: true,
  corsOptions: corsOptions,
});

console.log(`🚀 PeerJS server running on port ${PORT}`);
console.log(`📡 WebSocket path: /myapp`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

peerServer.on('connection', (client) => {
  console.log('✅ Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('❌ Client disconnected:', client.getId());
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully...');
  peerServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
