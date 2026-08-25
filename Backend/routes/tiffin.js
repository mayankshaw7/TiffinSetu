const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Tiffin = require('../models/Tiffin');

// Helper middleware: ensure provider & ownership
const checkProviderAndOwner = async (req, res, next) => {
  if (req.user.role !== 'provider') return res.status(403).json({ msg: 'Access denied' });
  const tiffin = await Tiffin.findById(req.params.id);
  if (!tiffin) return res.status(404).json({ msg: 'Not found' });
  if (tiffin.providerId.toString() !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });
  req.tiffin = tiffin; // attach for later use
  next();
};

// POST – Add
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') return res.status(403).json({ msg: 'Access denied' });
    const tiffin = new Tiffin({ providerId: req.user.id, ...req.body });
    await tiffin.save();
    res.status(201).json(tiffin);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET – List with filters
router.get('/', async (req, res) => {
  try {
    const { location, foodType, timing } = req.query;
    const filter = { isAvailable: true };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (foodType) filter.foodType = foodType;
    if (timing) filter.timing = timing;
    const tiffins = await Tiffin.find(filter).populate('providerId', 'name contactInfo phone email');
    res.json(tiffins);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PUT – Update
router.put('/:id', auth, checkProviderAndOwner, async (req, res) => {
  try {
    const updated = await Tiffin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// DELETE – Remove
router.delete('/:id', auth, checkProviderAndOwner, async (req, res) => {
  try {
    await Tiffin.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;