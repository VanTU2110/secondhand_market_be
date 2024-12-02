// backend/controllers/userController.js

const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isValidEmail, isValidPassword, isValidPhone } = require('../utils/utils'); // Đảm bảo đường dẫn đúng

// Lấy thông tin người dùng
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Cập nhật vai trò từ buyer sang seller
exports.upgradeToSeller = async (req, res) => {
  const { id } = req.params;  // Lấy id người dùng từ params

  try {
    // Tìm user theo ID
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Kiểm tra xem người dùng đã là seller hay chưa
    if (user.role === 'seller') {
      return res.status(400).json({ message: 'Người dùng đã là seller' });
    }

    // Cập nhật role thành seller
    user.role = 'seller';
    await user.save();

    res.status(200).json({ message: 'Cập nhật vai trò thành seller thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
