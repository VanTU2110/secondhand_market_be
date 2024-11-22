const Shop = require('../Models/Shop');
const User = require('../Models/User');


// Tạo mới shop sau khi kiểm tra role
exports.createShop = async (req, res) => {
    const { user_id, shop_name, shop_address } = req.body;
  
    try {
      // Tìm người dùng theo user_id
      const user = await User.findById(user_id);
  
      // Kiểm tra nếu người dùng không tồn tại
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
  
      // Kiểm tra nếu người dùng chưa phải là seller
      if (user.role !== 'seller') {
        return res.status(403).json({ message: 'Người dùng chưa phải là seller, không thể tạo shop' });
      }
  
      // Kiểm tra nếu người dùng đã có shop
      const existingShop = await Shop.findOne({ user_id });
      if (existingShop) {
        return res.status(400).json({ message: 'Người dùng đã có shop' });
      }
  
      // Tạo mới shop
      const newShop = new Shop({
        user_id,
        shop_name,
        shop_address
      });
      await newShop.save();
      
      res.status(201).json(newShop);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
  };
// Lấy thông tin shop theo ID
exports.getShopByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Tìm shop dựa trên user_id
    const shop = await Shop.findOne({ user_id });

    if (!shop) {
      return res.status(404).json({ message: 'Người dùng chưa tạo shop' });
    }

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Controller lấy thông tin shop theo _id
exports.getShopById = async (req, res) => {
  try {
    const shopId = req.params.id;

    // Tìm shop theo _id
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    return res.json(shop);
  } catch (error) {
    console.error('Error getting shop:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật thông tin shop
exports.updateShop = async (req, res) => {
  const { id } = req.params;
  const { shop_name, shop_address } = req.body;

  try {
    const updatedShop = await Shop.findByIdAndUpdate(id, { shop_name, shop_address }, { new: true });
    if (!updatedShop) {
      return res.status(404).json({ message: 'Không tìm thấy shop' });
    }
    res.status(200).json(updatedShop);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật shop', error });
  }
};

// Xóa shop
exports.deleteShop = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedShop = await Shop.findByIdAndDelete(id);
    if (!deletedShop) {
      return res.status(404).json({ message: 'Không tìm thấy shop để xóa' });
    }
    res.status(200).json({ message: 'Shop đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa shop', error });
  }
};
