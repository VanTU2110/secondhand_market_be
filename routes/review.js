const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// API tạo mới bình luận
router.post('/createReview', reviewController.createReview);

// API lấy tất cả bình luận của một sản phẩm
router.get('/product/:product_id', reviewController.getReviewsByProduct);

// API xóa bình luận theo ID
router.delete('/deleteReview:id', reviewController.deleteReview);

module.exports = router;
