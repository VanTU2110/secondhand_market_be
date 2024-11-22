const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  title: { type: String, required: true },
  description: { type: String },
  img_url :{type : [String], require:  true},
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  condition: { type: String, enum: ['new', 'used'], required: true },
  created_at: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

