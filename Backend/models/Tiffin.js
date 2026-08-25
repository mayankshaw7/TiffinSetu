const mongoose = require('mongoose');

const TiffinSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  foodType: { 
    type: String, 
    //added one new option for foodType in the enum
    enum: ['veg', 'non-veg', 'jain', 'pure-veg'],
    required: true 
  },
  timing: { 
    type: String, 
    //added one new option for timing in the enum
    enum: ['Breakfast', 'Lunch', 'Dinner'], // ✅ Added 'Breakfast'
    required: true 
  },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Tiffin', TiffinSchema);