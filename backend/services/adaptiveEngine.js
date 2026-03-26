/**
 * SmartKids Learning App - Adaptive Learning Engine (Backend)
 * Analyzes performance history and recommends next steps
 */

const Progress = require('../models/Progress');
const QuizResult = require('../models/QuizResult');

/**
 * Get recommended difficulty for a user on a specific topic
 */
exports.getRecommendedDifficulty = async (userId, subject, topic) => {
  const progress = await Progress.findOne({ userId, subject, topic });
  if (!progress) return 'easy';

  const mastery = progress.masteryLevel;
  if (mastery >= 80 && progress.mediumStats.attempts > 0) return 'hard';
  if (mastery >= 55) return 'medium';
  return 'easy';
};

/**
 * Get weak areas for a user
 */
exports.getWeakAreas = async (userId) => {
  const weak = await Progress.find({
    userId,
    masteryLevel: { $lt: 70 },
    totalAttempts: { $gte: 1 },
  }).sort({ masteryLevel: 1 }).limit(5);

  return weak.map(p => ({
    subject: p.subject,
    topic: p.topic,
    mastery: p.masteryLevel,
    recommendedDifficulty: p.recommendedDifficulty,
  }));
};

/**
 * Get personalized study plan
 */
exports.getStudyPlan = async (userId, grade) => {
  const weakAreas = await exports.getWeakAreas(userId);
  const recentResults = await QuizResult.find({ userId })
    .sort({ completedAt: -1 })
    .limit(10)
    .select('subject topic score difficulty');

  const plan = {
    priority: weakAreas.slice(0, 3),
    nextChallenges: [],
    dailyGoal: 3,
  };

  return plan;
};
