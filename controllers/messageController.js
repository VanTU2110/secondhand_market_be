const Message = require('../Models/Message');

// Gửi tin nhắn
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    global.io.to(receiverId).emit('new-message', newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi gửi tin nhắn' });
  }
};

// Lấy tin nhắn giữa hai người
exports.getMessages = async (req, res) => {
  const { userId, conversationWith } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: conversationWith },
        { senderId: conversationWith, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy tin nhắn' });
  }
};
