const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');


// Tạo mới shop
router.post('/createShop', shopController.createShop);

// Lấy thông tin shop theo ID
router.get('/user/:user_id', shopController.getShopByUserId);

// Route để lấy thông tin shop theo _id
router.get('/shop/:id', shopController.getShopById);
// Cập nhật shop theo ID
router.put('/updateshopbyid/:id', shopController.updateShop);

// Xóa shop theo ID
router.delete('/deleteshopbyid/:id', shopController.deleteShop);

module.exports = router;
