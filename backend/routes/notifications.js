/**
 * SmartKids Learning App - Notification Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

router.use(authenticate);

// Register Expo push token
router.post('/register-token', async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token required' });
    await notificationService.registerToken(req.user._id, token);
    res.json({ message: 'Token registered' });
  } catch (error) {
    next(error);
  }
});

// Send test notification (dev only)
router.post('/test', async (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'Test notifications only in development' });
  }
  try {
    await notificationService.sendToUser(req.user._id, {
      title: '🎯 Test Notification',
      body: 'SmartKids push notifications are working!',
    });
    res.json({ message: 'Test notification sent' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
