const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Thêm mới danh mục
router.post('/createCategory', categoryController.createCategory);

// Lấy danh sách danh mục
router.get('/getall', categoryController.getCategories);

// Cập nhật danh mục
router.put('/updatebyid/:id', categoryController.updateCategory);

// Xóa danh mục
router.delete('/deletebyid/:id', categoryController.deleteCategory);

module.exports = router;
