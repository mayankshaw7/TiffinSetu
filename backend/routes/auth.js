const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Provider = require('../models/Provider'); // 👈 NEW

// Register
router.post('/register', async (req, res) => {
  try {
    const { 
      name, email, password, phone, role, location, 
      foodPreference, foodTypesOffered, contactInfo, businessName 
    } = req.body;

    // Check if user exists (case-insensitive)
    let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Create the User
    user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role,
      location: role === 'customer' ? location : undefined, // Customers store location
      foodPreference: role === 'customer' ? foodPreference : undefined
    });

    await user.save();

    // 2. If role is provider, create a Provider profile
    if (role === 'provider') {
      const provider = new Provider({
        userId: user._id,
        businessName: businessName || name, // Fallback to user's name
        location: location, // Business location
        contactInfo: contactInfo,
        foodTypesOffered: foodTypesOffered || []
      });
      await provider.save();
    }

    // Generate JWT
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name, 
        email: user.email, 
        role,
        // If customer, include preference
        foodPreference: user.foodPreference 
      } 
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).send('Server error');
  }
});

// Login (no changes needed here - it stays the same)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    console.log('User found:', !!user);

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;