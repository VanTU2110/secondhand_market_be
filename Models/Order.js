const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  cart: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      title: String,
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
      img_url : { type: [String] },
    }
  ],
  total_price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'paid'], default: 'pending' },
  order_date: { type: Date, default: Date.now },
  reviewed: { type: Boolean, default: false },
  payment_status: { type: String, enum: ['pending', 'completed'], default: 'pending' }, 
  payment_date: { type: Date } 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
