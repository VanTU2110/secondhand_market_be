const Message = require('../Models/Message');

// Lấy danh sách các cuộc trò chuyện
exports.getConversations = async (req, res) => {
  const { userId } = req.query;

  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            conversationWith: {
              $cond: [
                { $eq: ['$senderId', userId] },
                '$receiverId',
                '$senderId',
              ],
            },
          },
          lastMessage: { $first: '$message' },
          timestamp: { $first: '$createdAt' },
        },
      },
      {
        $project: {
          conversationWith: '$_id.conversationWith',
          lastMessage: 1,
          timestamp: 1,
        },
      },
      { $sort: { timestamp: -1 } },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách cuộc trò chuyện' });
  }
};
