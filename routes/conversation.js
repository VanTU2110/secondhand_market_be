const express = require('express');
const { getConversations } = require('../controllers/conversationController');
const router = express.Router();

// Route lấy danh sách các cuộc trò chuyện
router.get('/getConversations', getConversations);

module.exports = router;
