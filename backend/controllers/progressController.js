/**
 * SmartKids Learning App - Progress Controller
 * Analytics and reporting for parent dashboard
 */

const QuizResult = require('../models/QuizResult');
const Progress = require('../models/Progress');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * GET /api/progress/report
 */
exports.getReport = async (req, res, next) => {
  try {
    const { childId, period = 'weekly' } = req.query;
    const userId = getTargetUserId(req, childId);

    // Date range
    const dateFrom = getPeriodStart(period);

    const [stats] = await QuizResult.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId.toString()),
          completedAt: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          avgScore: { $avg: '$score' },
          totalTimeSecs: { $sum: '$timeTaken' },
          correctAnswers: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' },
          mathCount: { $sum: { $cond: [{ $eq: ['$subject', 'math'] }, 1, 0] } },
          readingCount: { $sum: { $cond: [{ $eq: ['$subject', 'reading'] }, 1, 0] } },
        },
      },
    ]);

    const user = await User.findById(userId);
    const topSubject = (stats?.mathCount || 0) >= (stats?.readingCount || 0) ? 'Math' : 'Reading';

    res.json({
      totalQuizzes: stats?.totalQuizzes || 0,
      avgScore: Math.round(stats?.avgScore || 0),
      totalTimeMins: Math.round((stats?.totalTimeSecs || 0) / 60),
      correctAnswers: stats?.correctAnswers || 0,
      totalQuestions: stats?.totalQuestions || 0,
      topSubject,
      streak: user?.streak || { current: 0, best: 0 },
      period,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/progress/topics
 */
exports.getTopicBreakdown = async (req, res, next) => {
  try {
    const { childId } = req.query;
    const userId = getTargetUserId(req, childId);

    const progressData = await Progress.find({ userId });
    res.json({ topics: progressData });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/progress/weak-areas
 */
exports.getWeakAreas = async (req, res, next) => {
  try {
    const { childId } = req.query;
    const userId = getTargetUserId(req, childId);

    const weakAreas = await Progress.find({
      userId,
      masteryLevel: { $lt: 70 },
      totalAttempts: { $gte: 1 },
    })
      .sort({ masteryLevel: 1 })
      .limit(5);

    const formatted = weakAreas.map(p => ({
      topic: p.topic,
      subject: p.subject,
      mastery: p.masteryLevel,
      attempts: p.totalAttempts,
      recommendedDifficulty: p.recommendedDifficulty,
      priority: p.masteryLevel < 50 ? 'high' : 'medium',
    }));

    res.json({ areas: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/progress/chart
 */
exports.getChartData = async (req, res, next) => {
  try {
    const { childId, period = 'weekly' } = req.query;
    const userId = getTargetUserId(req, childId);
    const dateFrom = getPeriodStart(period);

    const results = await QuizResult.find({
      userId: mongoose.Types.ObjectId.createFromHexString(userId.toString()),
      completedAt: { $gte: dateFrom },
    })
      .sort({ completedAt: 1 })
      .select('score completedAt subject');

    // Group by day
    const grouped = {};
    results.forEach(r => {
      const day = r.completedAt.toLocaleDateString('en-US', { weekday: 'short' });
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(r.score);
    });

    const labels = period === 'weekly'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : getLast30DayLabels();

    const data = labels.map(label => {
      const scores = grouped[label] || [];
      if (scores.length === 0) return 0;
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    });

    res.json({
      labels,
      datasets: [{ data }],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/progress/recommendations
 */
exports.getRecommendations = async (req, res, next) => {
  try {
    const { childId } = req.query;
    const userId = getTargetUserId(req, childId);

    const weak = await Progress.find({
      userId,
      masteryLevel: { $lt: 70 },
    }).sort({ masteryLevel: 1 }).limit(3);

    const strong = await Progress.find({
      userId,
      masteryLevel: { $gte: 85 },
    }).sort({ masteryLevel: -1 }).limit(2);

    const recommendations = [
      ...weak.map(p => ({
        type: 'practice',
        topic: p.topic,
        subject: p.subject,
        difficulty: p.recommendedDifficulty,
        reason: `Mastery at ${p.masteryLevel}% — needs practice`,
        priority: p.masteryLevel < 50 ? 'high' : 'medium',
      })),
      ...strong.map(p => ({
        type: 'challenge',
        topic: p.topic,
        subject: p.subject,
        difficulty: 'hard',
        reason: `Excelling at ${p.masteryLevel}%! Ready for challenge`,
        priority: 'low',
      })),
    ];

    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
};

// ========================
// Helpers
// ========================

const getTargetUserId = (req, childId) => {
  if (childId && req.user.role === 'parent') return childId;
  return req.user._id;
};

const getPeriodStart = (period) => {
  const date = new Date();
  if (period === 'weekly') {
    date.setDate(date.getDate() - 7);
  } else if (period === 'monthly') {
    date.setMonth(date.getMonth() - 1);
  } else {
    date.setDate(date.getDate() - 7); // Default weekly
  }
  return date;
};

const getLast30DayLabels = () => {
  const labels = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.getDate().toString());
  }
  return labels;
};
