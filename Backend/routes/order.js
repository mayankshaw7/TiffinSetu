// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const Order = require('../models/Order');
// const Tiffin = require('../models/Tiffin');
// const Cart = require('../models/Cart');

// // ---------- SINGLE ORDER ----------

// // POST /api/order – Create a single order (from "Order Now")
// router.post('/', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'customer') {
//       return res.status(403).json({ msg: 'Access denied' });
//     }
//     const { tiffinId, quantity } = req.body;
//     const tiffin = await Tiffin.findById(tiffinId);
//     if (!tiffin) return res.status(404).json({ msg: 'Tiffin not found' });

//     const totalPrice = tiffin.price * quantity;
//     const order = new Order({
//       customerId: req.user.id,
//       tiffinId,
//       providerId: tiffin.providerId,
//       quantity,
//       totalPrice,
//       status: 'Pending',
//       paymentStatus: 'Pending'
//     });
//     await order.save();
//     res.status(201).json({ msg: 'Order created', order });
//   } catch (err) {
//     console.error('Create order error:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // GET /api/order – Get all orders for the logged-in customer
// router.get('/', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'customer') {
//       return res.status(403).json({ msg: 'Access denied' });
//     }
//     const orders = await Order.find({ customerId: req.user.id })
//       .populate('tiffinId')
//       .populate('providerId', 'name contactInfo');
//     res.json(orders);
//   } catch (err) {
//     console.error('Get orders error:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // GET /api/order/:orderId – Get a single order
// router.get('/:orderId', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'customer') {
//       return res.status(403).json({ msg: 'Access denied' });
//     }
//     const order = await Order.findById(req.params.orderId)
//       .populate('tiffinId')
//       .populate('providerId', 'name contactInfo');
//     if (!order) return res.status(404).json({ msg: 'Order not found' });
//     if (order.customerId.toString() !== req.user.id) {
//       return res.status(403).json({ msg: 'Unauthorized' });
//     }
//     res.json(order);
//   } catch (err) {
//     console.error('Get order error:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // POST /api/order/confirm-payment/:orderId – Simulate payment for a single order
// router.post('/confirm-payment/:orderId', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'customer') {
//       return res.status(403).json({ msg: 'Access denied' });
//     }
//     const order = await Order.findById(req.params.orderId);
//     if (!order) return res.status(404).json({ msg: 'Order not found' });
//     if (order.customerId.toString() !== req.user.id) {
//       return res.status(403).json({ msg: 'Unauthorized' });
//     }
//     if (order.status !== 'Pending') {
//       return res.status(400).json({ msg: 'Order already processed' });
//     }
//     order.status = 'Confirmed';
//     order.paymentStatus = 'Paid';
//     await order.save();
//     res.json({ msg: 'Payment confirmed', order });
//   } catch (err) {
//     console.error('Confirm payment error:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // DELETE /api/order/:orderId – Cancel an order (only if pending)
// router.delete('/:orderId', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'customer') {
//       return res.status(403).json({ msg: 'Access denied' });
//     }
//     const order = await Order.findById(req.params.orderId);
//     if (!order) return res.status(404).json({ msg: 'Order not found' });
//     if (order.customerId.toString() !== req.user.id) {
//       return res.status(403).json({ msg: 'Unauthorized' });
//     }
//     if (order.status !== 'Pending') {
//       return res.status(400).json({ msg: 'Only pending orders can be cancelled' });
//     }
//     order.status = 'Cancelled';
//     await order.save();
//     res.json({ msg: 'Order cancelled' });
//   } catch (err) {
//     console.error('Cancel order error:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // ---------- CART CHECKOUT ----------

// // POST /api/order/checkout – Create orders from cart (bulk)
// router.post('/checkout', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'customer') {
//       return res.status(403).json({ msg: 'Access denied' });
//     }

//     // Get user's cart with populated tiffin details
//     const cart = await Cart.findOne({ customerId: req.user.id }).populate('items.tiffinId');
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ msg: 'Cart is empty' });
//     }

//     const orders = [];
//     // Create an order for each cart item
//     for (const item of cart.items) {
//       const tiffin = item.tiffinId;
//       const totalPrice = tiffin.price * item.quantity;
//       const order = new Order({
//         customerId: req.user.id,
//         tiffinId: tiffin._id,
//         providerId: tiffin.providerId,
//         quantity: item.quantity,
//         totalPrice,
//         status: 'Pending',
//         paymentStatus: 'Pending'
//       });
//       await order.save();
//       orders.push(order);
//     }

//     // Clear the cart
//     cart.items = [];
//     await cart.save();

//     // Return the order IDs so the frontend can show success
//     const orderIds = orders.map(o => o._id);
//     res.status(201).json({ msg: 'Orders created from cart', orderIds });
//   } catch (err) {
//     console.error('Checkout error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Tiffin = require('../models/Tiffin');
const Cart = require('../models/Cart');

// ---------- SINGLE ORDER ----------

// POST /api/order – Create a single order (from "Order Now")
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const { tiffinId, quantity } = req.body;
    const tiffin = await Tiffin.findById(tiffinId);
    if (!tiffin) return res.status(404).json({ msg: 'Tiffin not found' });

    const totalPrice = tiffin.price * quantity;
    const order = new Order({
      customerId: req.user.id,
      tiffinId,
      providerId: tiffin.providerId,
      quantity,
      totalPrice,
      status: 'Pending',
      paymentStatus: 'Pending'
    });
    await order.save();
    res.status(201).json({ msg: 'Order created', order });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/order – Get all orders for the logged-in customer
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const orders = await Order.find({ customerId: req.user.id })
      .populate('tiffinId')
      .populate('providerId', 'name contactInfo');
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/order/:orderId – Get a single order
router.get('/:orderId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const order = await Order.findById(req.params.orderId)
      .populate('tiffinId')
      .populate('providerId', 'name contactInfo');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    res.json(order);
  } catch (err) {
    console.error('Get order error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/order/confirm-payment/:orderId – Simulate payment for a single order
router.post('/confirm-payment/:orderId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ msg: 'Order already processed' });
    }
    order.status = 'Confirmed';
    order.paymentStatus = 'Paid';
    await order.save();
    res.json({ msg: 'Payment confirmed', order });
  } catch (err) {
    console.error('Confirm payment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/order/:orderId – Cancel an order (only if pending)
router.delete('/:orderId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ msg: 'Only pending orders can be cancelled' });
    }
    order.status = 'Cancelled';
    await order.save();
    res.json({ msg: 'Order cancelled' });
  } catch (err) {
    console.error('Cancel order error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------- CART CHECKOUT ----------

// POST /api/order/checkout – Create orders from cart (bulk)
router.post('/checkout', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const cart = await Cart.findOne({ customerId: req.user.id }).populate('items.tiffinId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    const orders = [];
    for (const item of cart.items) {
      const tiffin = item.tiffinId;
      const totalPrice = tiffin.price * item.quantity;
      const order = new Order({
        customerId: req.user.id,
        tiffinId: tiffin._id,
        providerId: tiffin.providerId,
        quantity: item.quantity,
        totalPrice,
        status: 'Confirmed',        // ✅ Fixed: Immediately Confirmed
        paymentStatus: 'Paid'       // ✅ Fixed: Immediately Paid
      });
      await order.save();
      orders.push(order);
    }

    cart.items = [];
    await cart.save();

    const orderIds = orders.map(o => o._id);
    res.status(201).json({ msg: 'Orders placed successfully', orderIds });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;