const { Server } = require('socket.io');
const Message = require('../Models/Message'); // Import model Message

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Xử lý khi người dùng tham gia phòng chat
    socket.on('join-shop', (shopId) => {
      console.log(`User joined shop ${shopId}.`);
      socket.join(shopId); // Kết nối người dùng vào phòng riêng biệt của shop
    });

    // Xử lý khi người dùng gửi tin nhắn
    socket.on('send-message', async ({ shopId, senderId, message }) => {
      console.log(`Message received for shop ${shopId}: ${message}`);

      // Lưu tin nhắn vào cơ sở dữ liệu
      try {
        const newMessage = new Message({
          shopId,
          senderId,
          message,
        });

        await newMessage.save();

        // Gửi tin nhắn đến người mua hoặc người bán và shop
        io.to(shopId).emit('receive-message', newMessage); // Gửi tin nhắn đến shop và người tham gia phòng shop

      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Xử lý ngắt kết nối
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = { setupSocket };
