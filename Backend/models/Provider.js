const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true // One-to-one relationship
  },
  businessName: { type: String, required: true },
  location: { type: String, required: true }, // Business address / city
  contactInfo: { type: String, required: true }, // Phone, WhatsApp, etc.
  foodTypesOffered: [{ 
    type: String, 
    enum: ['veg', 'pure-veg', 'jain', 'non-veg'], 
    required: true 
  }],
  description: { type: String }, // "We specialize in Jain food..."
  isVerified: { type: Boolean, default: false }, // For trust
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Provider', ProviderSchema);
