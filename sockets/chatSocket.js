module.exports = function (io) {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  
      socket.on('send_message', (data) => {
        // Xử lý gửi tin nhắn và emit tin nhắn đến người nhận
        io.to(data.receiverId).emit('receive_message', data);
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  };
  