/**
 * SmartKids Learning App - Quiz Controller
 * Handles quiz generation, submission, history, and stats
 */

const QuizResult = require('../models/QuizResult');
const Progress = require('../models/Progress');
const User = require('../models/User');
const quizGenerator = require('../services/quizGenerator');
const adaptiveEngine = require('../services/adaptiveEngine');

/**
 * POST /api/quiz/generate
 * Generate quiz questions dynamically
 */
exports.generateQuiz = async (req, res, next) => {
  try {
    const { grade, subject, topic, difficulty, count = 10 } = req.body;

    if (!grade || !subject || !topic) {
      return res.status(400).json({ message: 'Grade, subject, and topic are required' });
    }

    // Check if adaptive difficulty should be used
    let effectiveDifficulty = difficulty;
    if (!difficulty) {
      const progress = await Progress.findOne({
        userId: req.user._id,
        subject,
        topic,
      });
      effectiveDifficulty = progress?.recommendedDifficulty || 'easy';
    }

    // Generate questions
    const questions = await quizGenerator.generate({
      grade,
      subject,
      topic,
      difficulty: effectiveDifficulty,
      count: Math.min(count, 20), // Max 20 questions
    });

    res.json({
      questions,
      difficulty: effectiveDifficulty,
      generatedAt: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/quiz/results
 * Save quiz result and update progress
 */
exports.submitResult = async (req, res, next) => {
  try {
    const {
      subject, topic, grade, difficulty,
      totalQuestions, correctAnswers, score, timeTaken,
      answers, earnedRewards, completedAt, sessionId,
    } = req.body;

    if (!subject || !topic || !grade || score === undefined) {
      return res.status(400).json({ message: 'Missing required quiz result fields' });
    }

    // Save quiz result
    const result = await QuizResult.create({
      userId: req.user._id,
      subject, topic, grade, difficulty,
      totalQuestions, correctAnswers, score,
      timeTaken, answers, earnedRewards,
      sessionId,
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    });

    // Update progress record
    await updateProgress(req.user._id, result);

    // Update user rewards
    if (earnedRewards) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: {
          'rewards.stars': earnedRewards.stars || 0,
          'rewards.coins': earnedRewards.coins || 0,
          'rewards.xp': earnedRewards.xp || 0,
        },
        $push: earnedRewards.badges?.length > 0 ? {
          'rewards.badges': { $each: earnedRewards.badges.map(b => ({ ...b, earnedAt: new Date() })) },
        } : {},
      });
    }

    // Update streak
    const user = await User.findById(req.user._id);
    user.updateStreak();
    user.rewards.level = calculateLevel(user.rewards.stars);
    await user.save();

    res.status(201).json({
      message: 'Result saved',
      resultId: result._id,
      streak: user.streak,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/history
 */
exports.getHistory = async (req, res, next) => {
  try {
    const { childId, limit = 20, subject, topic, page = 1 } = req.query;
    const userId = getTargetUserId(req, childId);

    const filter = { userId };
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;

    const total = await QuizResult.countDocuments(filter);
    const results = await QuizResult.find(filter)
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-answers'); // Exclude detailed answers for list view

    res.json({
      results,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/stats
 */
exports.getStats = async (req, res, next) => {
  try {
    const { childId } = req.query;
    const userId = getTargetUserId(req, childId);

    const [stats] = await QuizResult.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId.createFromHexString(userId.toString()) } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          avgScore: { $avg: '$score' },
          totalTimeSecs: { $sum: '$timeTaken' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' },
          highestScore: { $max: '$score' },
        },
      },
    ]);

    const user = await User.findById(userId);

    res.json({
      totalQuizzes: stats?.totalQuizzes || 0,
      avgScore: Math.round(stats?.avgScore || 0),
      totalTimeMins: Math.round((stats?.totalTimeSecs || 0) / 60),
      totalCorrect: stats?.totalCorrect || 0,
      totalQuestions: stats?.totalQuestions || 0,
      highestScore: stats?.highestScore || 0,
      streak: user?.streak || { current: 0, best: 0 },
      level: user?.rewards?.level || 1,
    });
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

const calculateLevel = (stars) => {
  if (stars < 50) return 1;
  if (stars < 150) return 2;
  if (stars < 350) return 3;
  if (stars < 700) return 4;
  if (stars < 1200) return 5;
  return Math.floor(stars / 300) + 1;
};

const updateProgress = async (userId, result) => {
  let progress = await Progress.findOne({
    userId,
    subject: result.subject,
    topic: result.topic,
  });

  if (!progress) {
    progress = new Progress({
      userId,
      subject: result.subject,
      topic: result.topic,
      grade: result.grade,
    });
  }

  progress.updateFromResult(result);
  await progress.save();
};
