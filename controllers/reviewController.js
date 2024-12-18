const Review = require('../Models/Review');
const Order = require('../Models/Order');

exports.createReview = async (req, res) => {
  const { user_id, product_id, rating, review } = req.body;

  if (!user_id || !product_id || !rating) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết.' });
  }

  try {

    const hasPurchased = await Order.findOne({
      buyer_id: user_id, // Tìm theo buyer_id
      cart: {
        $elemMatch: { product_id: product_id }  // Kiểm tra nếu product_id nằm trong mảng cart
      },
      status: 'paid' 
    });
    console.log(user_id);
    console.log(product_id);

    
    if (!hasPurchased) {
      return res.status(403).json({ message: 'Bạn cần nhận hàng trước khi đánh giá.' });
    }
    const newReview = new Review({
      user_id,
      product_id,
      rating,
      review
    });
    await newReview.save();

    // Cập nhật trạng thái 'reviewed' của đơn hàng
    await Order.updateOne(
      { buyer_id: user_id, cart: { $elemMatch: { product_id: product_id } }, status: 'paid' },
      { $set: { reviewed: true } }
    );

    res.status(201).json({ message: 'Đánh giá thành công.', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
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
