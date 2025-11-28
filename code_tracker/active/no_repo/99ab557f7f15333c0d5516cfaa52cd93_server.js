÷const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('join', (role) => {
    console.log(`User ${socket.id} joined as ${role}`);
    socket.join(role);
  });

  socket.on('audio-chunk', (chunk) => {
    const size = chunk ? chunk.length : 0;
    console.log(`[${socket.id}] Received chunk: ${size} bytes`);
    socket.to('listener').emit('audio-chunk', chunk);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
À *cascade08ÀÀ*cascade08À÷ *cascade08÷ù*cascade08ùü *cascade08üý*cascade08ýþ *cascade08þ‚*cascade08‚‰ *cascade08‰Š*cascade08Š‹ *cascade08‹‘*cascade08‘” *cascade08”œ*cascade08œ¯ *cascade08¯¾*cascade08¾Ì *cascade08ÌÍ*cascade08ÍÎ *cascade08ÎÐ*cascade08ÐÔ *cascade08ÔÕ*cascade08ÕÖ *cascade08ÖÙ*cascade08ÙÚ *cascade08ÚÛ*cascade08Û÷ *cascade082Afile:///e:/Projects_2743/MobileApps/Live_Muazin/backend/server.js