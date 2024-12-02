// backend/controllers/userController.js

const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isValidEmail, isValidPassword, isValidPhone } = require('../utils/utils'); // Đảm bảo đường dẫn đúng

// Đăng ký tài khoản
exports.registerUser = async (req, res) => {
  const { email, password, username, phone, address, role } = req.body;

  try {
 
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Mật khẩu không hợp lệ' });
    }
    // Kiểm tra tính hợp lệ của số điện thoại
    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      phone,
      address,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra tính hợp lệ của email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Đăng nhập thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

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
