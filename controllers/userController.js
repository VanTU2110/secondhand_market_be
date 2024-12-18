// backend/controllers/userController.js

const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
exports.updateUser = async (req, res) => {
  const userId = req.params.id; // Lấy ID người dùng từ params
  const updateData = req.body; // Dữ liệu cập nhật từ request body

  try {
      // Tìm và cập nhật người dùng
      const updatedUser = await User.findByIdAndUpdate(
          userId, 
          { $set: updateData }, 
          { new: true, runValidators: true } // Trả về document mới và kiểm tra validation
      );

      // Nếu không tìm thấy người dùng
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Trả về thông tin người dùng đã được cập nhật
      res.status(200).json({
          message: 'User updated successfully',
          data: updatedUser,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};