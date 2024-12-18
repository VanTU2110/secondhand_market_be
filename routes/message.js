const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

// Route gửi tin nhắn
router.post('/sendMessage', sendMessage);

// Route lấy tin nhắn giữa hai người
router.get('/getMessage', getMessages);

module.exports = router;
