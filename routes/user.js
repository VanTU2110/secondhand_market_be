const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


// Lấy thông tin tài khoản (yêu cầu xác thực)
router.get('/profile', authMiddleware, userController.getUserProfile);

// Cập nhật role từ buyer sang seller
router.put('/upgrade-to-seller/:id', userController.upgradeToSeller);

// Cập nhật thông tin người dùng
router.put('/update/update-infor-user/:id', authMiddleware, userController.updateUser);

module.exports = router;
