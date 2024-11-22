// controllers/messageController.js
const Message = require('../Models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body;
    const message = new Message({ sender_id, receiver_id, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }]
    }).populate('sender_id receiver_id', 'name email');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
