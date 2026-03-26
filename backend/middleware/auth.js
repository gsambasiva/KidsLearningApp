/**
 * SmartKids Learning App - Auth Middleware
 * JWT verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT token
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next(error);
  }
};

/**
 * Require parent role
 */
exports.requireParent = (req, res, next) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({ message: 'Access denied. Parent account required.' });
  }
  next();
};

/**
 * Require child role
 */
exports.requireChild = (req, res, next) => {
  if (req.user.role !== 'child') {
    return res.status(403).json({ message: 'Access denied. Child account required.' });
  }
  next();
};

/**
 * Allow both parents and children (any authenticated user)
 */
exports.requireAny = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

/**
 * Check if parent owns the child (for child data access)
 */
exports.requireChildAccess = async (req, res, next) => {
  const childId = req.params.childId || req.query.childId || req.body.childId;

  if (!childId) return next(); // No childId - proceed with current user

  // If user is child, they can only access their own data
  if (req.user.role === 'child') {
    if (req.user._id.toString() !== childId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    return next();
  }

  // If user is parent, check they own this child
  const child = await User.findById(childId);
  if (!child || child.parentId?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied. Not your child.' });
  }

  req.child = child;
  next();
};

/**
 * Generate JWT token
 */
exports.generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
