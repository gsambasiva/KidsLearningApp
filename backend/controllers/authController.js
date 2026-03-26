/**
 * SmartKids Learning App - Auth Controller
 * Handles user registration, login, and profile management
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');

/**
 * POST /api/auth/signup
 * Register new user
 */
exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { firstName, lastName, email, password, role, grade, age } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Create user
    const user = await User.create({
      firstName, lastName, email, password, role,
      ...(role === 'child' && { grade, age }),
    });

    const token = generateToken(user._id);
    user.lastLoginAt = new Date();
    await user.save();

    res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, grade, age, avatar, settings } = req.body;

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (grade) updates.grade = grade;
    if (age) updates.age = age;
    if (avatar) updates.avatar = avatar;
    if (settings) updates.settings = { ...req.user.settings, ...settings };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/children — Create child profile (parent only)
 */
exports.createChild = async (req, res, next) => {
  try {
    const { firstName, lastName, grade, age, avatar } = req.body;

    if (!firstName) {
      return res.status(400).json({ message: 'First name is required' });
    }

    // Generate a unique child email derived from parent's email
    const childEmail = `child_${Date.now()}_${req.user._id}@smartkids.internal`;

    const child = await User.create({
      firstName,
      lastName: lastName || '',
      email: childEmail,
      password: `child_${Date.now()}_secure`, // Internal password, not user-facing
      role: 'child',
      grade: grade || 'K',
      age,
      avatar: avatar || '🧒',
      parentId: req.user._id,
    });

    res.status(201).json({
      message: 'Child profile created',
      child: sanitizeUser(child),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/children — Get all children of a parent
 */
exports.getChildren = async (req, res, next) => {
  try {
    const children = await User.find({
      parentId: req.user._id,
      role: 'child',
      isActive: true,
    }).select('-password');

    res.json({ children });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/children/:id
 */
exports.updateChild = async (req, res, next) => {
  try {
    const child = await User.findOne({ _id: req.params.id, parentId: req.user._id });
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const { firstName, lastName, grade, age, avatar } = req.body;
    if (firstName) child.firstName = firstName;
    if (lastName !== undefined) child.lastName = lastName;
    if (grade) child.grade = grade;
    if (age) child.age = age;
    if (avatar) child.avatar = avatar;

    await child.save();
    res.json({ message: 'Updated', child: sanitizeUser(child) });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/auth/children/:id
 */
exports.deleteChild = async (req, res, next) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.id, parentId: req.user._id },
      { isActive: false }
    );
    if (!result) return res.status(404).json({ message: 'Child not found' });
    res.json({ message: 'Child removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/change-password
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// Helper to remove sensitive fields
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};
