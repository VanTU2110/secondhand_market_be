const Category = require('../Models/Category');

// Thêm danh mục sản phẩm mới
exports.createCategory = async (req, res) => {
  const { category_name } = req.body;

  try {
    const newCategory = new Category({ category_name });
    await newCategory.save();
    res.status(201).json({ message: 'Danh mục đã được thêm thành công', category: newCategory });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm danh mục', error });
  }
};
// Lấy danh sách các danh mục sản phẩm
exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục', error });
    }
  };
// Cập nhật danh mục sản phẩm theo ID
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;
  
    try {
      const category = await Category.findByIdAndUpdate(id, { category_name }, { new: true });
  
      if (!category) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      }
  
      res.status(200).json({ message: 'Danh mục đã được cập nhật', category });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error });
    }
  };
// Xóa danh mục sản phẩm theo ID
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
  
    try {
      const category = await Category.findByIdAndDelete(id);
  
      if (!category) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      }
  
      res.status(200).json({ message: 'Danh mục đã được xóa' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa danh mục', error });
    }
  };
      