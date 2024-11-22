const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Lấy danh sách sản phẩm
router.get('/getAll', productController.getAllProducts);

// Lấy sản phẩm theo shop (shop_id)
router.get('/shop/:shopId', productController.getProductsByShop);

// Lấy sản phẩm theo loại sản phẩm (category_id)
router.get('/category/:categoryId', productController.getProductsByCategory);

// Thêm mới sản phẩm
router.post('/createProduct', productController.createProduct);

// Sửa thông tin sản phẩm theo id
router.put('/updateProductbyId/:id', productController.updateProductById);

// tìm kiếm sản phẩm theo tên và giá
router.get('/search', productController.searchProducts);

//Xóa sản phẩm theo id
router.delete('/deletebyId/:id', productController.deleteProduct);

module.exports = router;

