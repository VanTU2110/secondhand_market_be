const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop_name: { type: String, required: true },
  shop_address: { type: String },
  created_at: { type: Date, default: Date.now }
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
