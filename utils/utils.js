// utils.js

// Kiểm tra tính hợp lệ của email
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }
  
  // Kiểm tra tính hợp lệ của mật khẩu
  function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
    return passwordRegex.test(password);
  }
  
  // Kiểm tra tính hợp lệ của số điện thoại (ví dụ: định dạng quốc tế)
  function isValidPhone(phone) {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    // Số điện thoại phải có từ 10 đến 15 chữ số, có thể bắt đầu với dấu "+"
    return phoneRegex.test(phone);
  }
  
  module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhone
  };
  