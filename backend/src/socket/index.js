const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {

    
    // Clients can join market specific rooms
    socket.on('join_market', (marketId) => {
      socket.join(`market:${marketId}`);
    });
    
    socket.on('leave_market', (marketId) => {
      socket.leave(`market:${marketId}`);
    });

    socket.on('disconnect', () => {

    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
