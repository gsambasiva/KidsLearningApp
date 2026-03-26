/**
 * SmartKids Learning App - User Model
 * Handles both Parent and Child accounts
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name too long'],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name too long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include in queries by default
  },

  // Role
  role: {
    type: String,
    enum: ['parent', 'child'],
    required: true,
  },

  // Child-specific fields
  grade: {
    type: String,
    enum: ['K', '1', '2', '3', '4', '5'],
  },
  age: {
    type: Number,
    min: 3,
    max: 18,
  },
  avatar: {
    type: String,
    default: '🧒',
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Gamification
  rewards: {
    stars: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{
      id: String,
      name: String,
      icon: String,
      earnedAt: Date,
    }],
  },

  // Streak tracking
  streak: {
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    lastActivityDate: Date,
  },

  // Push notification token
  pushToken: {
    type: String,
  },

  // Settings
  settings: {
    soundEnabled: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
    preferredSubject: { type: String, default: 'math' },
    dailyGoal: { type: Number, default: 3 }, // quizzes per day
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLoginAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName}${this.lastName ? ' ' + this.lastName : ''}`;
});

// Pre-save: hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method: update streak
userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = this.streak.lastActivityDate
    ? new Date(this.streak.lastActivityDate)
    : null;

  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day — no change
      return;
    } else if (diffDays === 1) {
      // Consecutive day
      this.streak.current += 1;
    } else {
      // Streak broken
      this.streak.current = 1;
    }
  } else {
    this.streak.current = 1;
  }

  this.streak.best = Math.max(this.streak.best, this.streak.current);
  this.streak.lastActivityDate = today;
};

// Index (email index is already created via unique:true in schema field)
userSchema.index({ parentId: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
