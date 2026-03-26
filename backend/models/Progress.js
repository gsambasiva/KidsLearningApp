/**
 * SmartKids Learning App - Progress Model
 * Aggregated progress tracking per topic/subject
 */

const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    enum: ['math', 'reading', 'science'],
  },
  topic: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },

  // Aggregated stats
  totalAttempts: { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  masteryLevel: { type: Number, default: 0 }, // 0-100

  // Per-difficulty stats
  easyStats: {
    attempts: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
  },
  mediumStats: {
    attempts: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
  },
  hardStats: {
    attempts: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
  },

  // Recommended next difficulty
  recommendedDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },

  lastAttemptAt: Date,
  firstAttemptAt: Date,
}, {
  timestamps: true,
});

// Compound unique index
progressSchema.index({ userId: 1, subject: 1, topic: 1 }, { unique: true });
progressSchema.index({ userId: 1, masteryLevel: 1 });

// Method: update after a quiz result
progressSchema.methods.updateFromResult = function (result) {
  const diffKey = `${result.difficulty}Stats`;

  // Update overall stats
  this.totalAttempts += 1;
  this.totalCorrect += result.correctAnswers;
  this.totalQuestions += result.totalQuestions;
  this.lastAttemptAt = result.completedAt || new Date();
  if (!this.firstAttemptAt) this.firstAttemptAt = this.lastAttemptAt;

  // Update difficulty-specific stats
  if (this[diffKey]) {
    const prevAttempts = this[diffKey].attempts;
    const prevAvg = this[diffKey].avgScore;
    this[diffKey].attempts += 1;
    this[diffKey].avgScore = Math.round(
      (prevAvg * prevAttempts + result.score) / (prevAttempts + 1)
    );
    this[diffKey].bestScore = Math.max(this[diffKey].bestScore, result.score);
  }

  // Recalculate mastery
  const totalAcc = this.totalQuestions > 0
    ? Math.round((this.totalCorrect / this.totalQuestions) * 100)
    : 0;

  // Weighted mastery (hard counts more)
  const difficultyWeighted =
    (this.easyStats.avgScore * 0.2 * (this.easyStats.attempts > 0 ? 1 : 0)) +
    (this.mediumStats.avgScore * 0.35 * (this.mediumStats.attempts > 0 ? 1 : 0)) +
    (this.hardStats.avgScore * 0.45 * (this.hardStats.attempts > 0 ? 1 : 0));

  const totalWeight =
    (this.easyStats.attempts > 0 ? 0.2 : 0) +
    (this.mediumStats.attempts > 0 ? 0.35 : 0) +
    (this.hardStats.attempts > 0 ? 0.45 : 0);

  this.masteryLevel = totalWeight > 0
    ? Math.round(difficultyWeighted / totalWeight)
    : totalAcc;

  // Recommend next difficulty
  if (this.masteryLevel >= 80 && this.hardStats.attempts === 0) {
    this.recommendedDifficulty = 'hard';
  } else if (this.masteryLevel >= 60 && this.mediumStats.attempts === 0) {
    this.recommendedDifficulty = 'medium';
  } else if (this.masteryLevel < 50) {
    this.recommendedDifficulty = 'easy';
  } else {
    this.recommendedDifficulty = 'medium';
  }
};

module.exports = mongoose.model('Progress', progressSchema);
