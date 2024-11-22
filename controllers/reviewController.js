const Review = require('../Models/Review');
const Order = require('../Models/Order');
// Tạo mới bình luận
exports.createReview = async (req, res) => {
  const { user_id, product_id, rating, review } = req.body;

  if (!user_id || !product_id || !rating) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết.' });
  }

  try {
    // Kiểm tra nếu người dùng đã mua sản phẩm trước khi đánh giá
    const hasPurchased = await Order.findOne({
      user_id,
      product_id,
      status: 'paid' // Chỉ cho phép đánh giá nếu đơn hàng đã được thanh toán
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: 'Bạn cần mua sản phẩm này trước khi đánh giá.' });
    }

    // Tạo đánh giá mới
    const newReview = new Review({
      user_id,
      product_id,
      rating,
      review
    });

    await newReview.save();
    res.status(201).json({ message: 'Đánh giá đã được thêm thành công.', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm đánh giá.' });
  }
};

// Lấy tất cả bình luận cho một sản phẩm
exports.getReviewsByProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const reviews = await Review.find({ product_id })
      .populate('user_id', 'username')  // Nếu bạn muốn lấy thêm thông tin người dùng
      .populate('product_id', 'title'); // Lấy thêm thông tin sản phẩm (nếu cần)

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy bình luận', error });
  }
};

// Xóa bình luận theo ID
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận để xóa' });
    }

    res.status(200).json({ message: 'Bình luận đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa bình luận', error });
  }
};
