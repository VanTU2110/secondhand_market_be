const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Đăng ký tài khoản
router.post('/register', userController.registerUser);

// Đăng nhập
router.post('/login', userController.loginUser);

// Lấy thông tin tài khoản (yêu cầu xác thực)
router.get('/profile', authMiddleware, userController.getUserProfile);

// Cập nhật role từ buyer sang seller
router.put('/upgrade-to-seller/:id', userController.upgradeToSeller);

module.exports = router;
