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

router.get('/revenue/:shopId', orderController.getShopRevenue);

router.get('/order-status/:shopId', orderController.getOrderStatusStats);

router.get('/top-products/:shopId', orderController.getTopProducts);

router.get('/order-timeline/:shopId', orderController.getOrderTimeline);

router.get('/reviewed-ratio/:shopId', orderController.getReviewedRatio);

module.exports = router;
