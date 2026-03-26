/**
 * SmartKids Learning App - Quiz Result Model
 * Stores individual quiz attempt results
 */

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: String,
  question: String,
  selectedAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  timeTaken: Number, // seconds
}, { _id: false });

const quizResultSchema = new mongoose.Schema({
  // Who took the quiz
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Quiz details
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
    enum: ['K', '1', '2', '3', '4', '5'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
  },

  // Results
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  score: {
    type: Number, // percentage 0-100
    required: true,
  },
  timeTaken: {
    type: Number, // total seconds
    default: 0,
  },

  // Detailed answers
  answers: [answerSchema],

  // Rewards earned
  earnedRewards: {
    stars: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    badges: [{ id: String, name: String, icon: String }],
  },

  sessionId: String,
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for fast querying
quizResultSchema.index({ userId: 1, completedAt: -1 });
quizResultSchema.index({ userId: 1, subject: 1, topic: 1 });
quizResultSchema.index({ userId: 1, grade: 1 });
quizResultSchema.index({ score: -1 }); // For leaderboard queries

// Virtual: accuracy
quizResultSchema.virtual('accuracy').get(function () {
  return Math.round((this.correctAnswers / this.totalQuestions) * 100);
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
