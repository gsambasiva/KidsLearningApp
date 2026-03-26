/**
 * SmartKids Learning App - Rewards Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

router.use(authenticate);

// Get current user's rewards
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('rewards streak');
    res.json({
      rewards: user.rewards,
      streak: user.streak,
    });
  } catch (error) {
    next(error);
  }
});

// Get rewards for a specific child (parent only)
router.get('/child/:childId', async (req, res, next) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Parents only' });
    }
    const child = await User.findOne({
      _id: req.params.childId,
      parentId: req.user._id,
    }).select('rewards streak firstName');

    if (!child) return res.status(404).json({ message: 'Child not found' });

    res.json({ rewards: child.rewards, streak: child.streak });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
