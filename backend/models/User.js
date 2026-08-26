const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider'], required: true },
  
  // Customer specific
  foodPreference: { type: String, enum: ['veg', 'jain', 'non-veg'] } 
  
  // ❌ REMOVE these from here (moved to Provider model):
  // contactInfo, foodTypesOffered, location (keep location for customer?)
  // Actually, keep 'location' here for customers, but providers will use Provider.location
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);