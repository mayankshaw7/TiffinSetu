const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Tiffin = require('../models/Tiffin');

// ✅ Get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Only customers can have a cart' });
    }
    let cart = await Cart.findOne({ customerId: req.user.id })
      .populate('items.tiffinId', 'name price description foodType timing location');
    if (!cart) {
      // Create empty cart if none exists
      cart = new Cart({ customerId: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error('Get cart error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Only customers can add to cart' });
    }
    const { tiffinId, quantity = 1 } = req.body;
    const tiffin = await Tiffin.findById(tiffinId);
    if (!tiffin) return res.status(404).json({ msg: 'Tiffin not found' });
    if (!tiffin.isAvailable) return res.status(400).json({ msg: 'Tiffin not available' });

    let cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) {
      cart = new Cart({ customerId: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.tiffinId.toString() === tiffinId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ tiffinId, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Update item quantity
router.put('/update', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Only customers can update cart' });
    }
    const { tiffinId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ msg: 'Quantity must be at least 1' });

    let cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const item = cart.items.find(item => item.tiffinId.toString() === tiffinId);
    if (!item) return res.status(404).json({ msg: 'Item not in cart' });

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Update cart error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Remove item from cart
router.delete('/remove/:tiffinId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Only customers can remove from cart' });
    }
    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    cart.items = cart.items.filter(item => item.tiffinId.toString() !== req.params.tiffinId);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Remove from cart error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Only customers can clear cart' });
    }
    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ msg: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;