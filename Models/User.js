const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  username: { type: String, required: true },
  phone: { type: String, required: true },
  address: {type: String, require: true},
  role :{type: String, enum: ['buyer','seller'], default:'buyer', require:true},
  creatAt: {type: Date, default: Date.now, require: true},
  user: {type: mongoose.Schema.ObjectId, ref :'User'},
});

const User = mongoose.model('User',userSchema);

module.exports = User;