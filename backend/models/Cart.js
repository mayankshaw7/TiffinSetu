// const mongoose = require('mongoose');

// const CartItemSchema = new mongoose.Schema({
//   tiffinId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Tiffin', 
//     required: true 
//   },
//   quantity: { 
//     type: Number, 
//     required: true, 
//     min: 1 
//   }
// });

// const CartSchema = new mongoose.Schema({
//   customerId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true, 
//     unique: true 
//   },
//   items: [CartItemSchema],
//   updatedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Cart', CartSchema);
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  tiffinId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tiffin', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const CartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', CartSchema);