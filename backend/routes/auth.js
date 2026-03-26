/**
 * SmartKids Learning App - Auth Routes
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, requireParent } = require('../middleware/auth');

// Signup
router.post('/signup', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['parent', 'child']).withMessage('Invalid role'),
], authController.signup);

// Login
router.post('/login', authController.login);

// Get profile (authenticated)
router.get('/profile', authenticate, authController.getProfile);

// Update profile
router.put('/profile', authenticate, authController.updateProfile);

// Change password
router.put('/change-password', authenticate, authController.changePassword);

// Children management (parent only)
router.post('/children', authenticate, requireParent, authController.createChild);
router.get('/children', authenticate, requireParent, authController.getChildren);
router.put('/children/:id', authenticate, requireParent, authController.updateChild);
router.delete('/children/:id', authenticate, requireParent, authController.deleteChild);

module.exports = router;
