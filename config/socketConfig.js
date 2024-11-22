const { Server } = require('socket.io');
const chatSocket = require('../sockets/chatSocket');

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Khởi chạy socket chat
  chatSocket(io);
}

module.exports = { setupSocket };
