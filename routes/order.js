const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route tạo đơn hàng (Cash on Delivery)
router.post('/create', orderController.createOrder);

// Thay đổi trạng thái đơn hàng
router.put('/complete-order/:orderId/status', orderController.updateOrderStatus);

// Lấy danh sách đơn hàng của người mua
router.get('/buyer/:buyerId', orderController.getOrdersByBuyer);

// Lấy danh sách đơn hàng theo shop
router.get('/shop/:shopId', orderController.getOrdersByShop);

router.get('/getOrderbyID/:orderId', orderController.getOrderById);
module.exports = router;
