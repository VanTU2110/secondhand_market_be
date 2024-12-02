const Product = require('../Models/Product');

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('shop_id', 'shop_name') // Lấy thông tin của shop
      .populate('category_id', 'category_name'); // Lấy thông tin của category
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Lấy sản phẩm theo shop (shop_id)
exports.getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params; // Lấy shopId từ params
    const products = await Product.find({ shop_id: shopId }).populate('category_id');
    
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm cho shop này' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo loại sản phẩm (category_id)
exports.getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category_id: categoryId })
      .populate('shop_id', 'name') // Lấy thông tin của shop
      .populate('category_id', 'name'); // Lấy thông tin của category
    if (!products.length) {
      return res.status(404).json({ message: 'Không có sản phẩm nào thuộc loại này' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Thêm mới sản phẩm
exports.createProduct = async (req, res) => {
  const { shop_id, category_id, title, description, img_url, price, quantity, condition } = req.body;

  try {
    const newProduct = new Product({
      shop_id, // Sử dụng shop_id
      category_id,
      title,
      description,
      img_url,
      price,
      quantity,
      condition,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Sản phẩm đã được thêm thành công', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Sửa thông tin sản phẩm theo ID
exports.updateProductById = async (req, res) => {
  const { id } = req.params;
  const { title, description, img_url, price, quantity, condition } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, img_url, price, quantity, condition },
      { new: true, runValidators: true }
    )
    .populate('category_id', 'name'); // Lấy thông tin của category

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ message: 'Cập nhật sản phẩm thành công', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Tìm kiếm sản phẩm theo tên và giá
exports.searchProducts = async (req, res) => {
  const { title, minPrice, maxPrice } = req.query; // Nhận các tham số từ query
  

  try {
    // Tạo điều kiện tìm kiếm rỗng, sẽ thêm các điều kiện dựa trên query
    let searchConditions = {};

    // Nếu có tham số title, tìm kiếm gần đúng theo tên sản phẩm
    if (title) {
      const normalizedTitle = title.normalize('NFC');
      searchConditions.title = { $regex: normalizedTitle, $options: 'i' }; // 'i' để không phân biệt hoa thường
    }

    // Nếu có tham số minPrice hoặc maxPrice, tìm kiếm theo khoảng giá
    if (minPrice || maxPrice) {
      searchConditions.price = {};
      if (minPrice) {
        searchConditions.price.$gte = parseFloat(minPrice); // Lớn hơn hoặc bằng minPrice
      }
      if (maxPrice) {
        searchConditions.price.$lte = parseFloat(maxPrice); // Nhỏ hơn hoặc bằng maxPrice
      }
    }

    // Thực hiện truy vấn với điều kiện tìm kiếm
    const products = await Product.find(searchConditions)
      .populate('shop_id', 'name') // Lấy thông tin shop
      .populate('category_id', 'name'); // Lấy thông tin category

    if (!products.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params; // Lấy id từ params

  try {
    // Tìm và xóa sản phẩm theo ID
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
