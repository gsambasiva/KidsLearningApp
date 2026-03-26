/**
 * SmartKids Learning App - Leaderboard Routes & Controller
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const mongoose = require('mongoose');

router.use(authenticate);

/**
 * GET /api/leaderboard?type=global|weekly|streak
 */
router.get('/', async (req, res, next) => {
  try {
    const { type = 'global', limit = 50 } = req.query;

    let rankings = [];

    if (type === 'streak') {
      // Rank by streak
      const users = await User.find({ role: 'child', isActive: true })
        .select('firstName avatar grade streak rewards')
        .sort({ 'streak.current': -1 })
        .limit(parseInt(limit));

      rankings = users.map((u, i) => ({
        rank: i + 1,
        userId: u._id,
        name: u.firstName,
        avatar: u.avatar,
        grade: u.grade,
        score: u.streak?.current || 0,
        subject: 'Streak',
      }));

    } else {
      // Rank by total score (global or weekly)
      const dateFrom = type === 'weekly' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : new Date(0);

      const results = await QuizResult.aggregate([
        { $match: { completedAt: { $gte: dateFrom } } },
        {
          $group: {
            _id: '$userId',
            totalScore: { $sum: '$correctAnswers' },
            avgScore: { $avg: '$score' },
            quizCount: { $sum: 1 },
          },
        },
        { $sort: { totalScore: -1 } },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            name: '$user.firstName',
            avatar: '$user.avatar',
            grade: '$user.grade',
            totalScore: 1,
            avgScore: { $round: ['$avgScore', 0] },
            quizCount: 1,
          },
        },
      ]);

      rankings = results.map((r, i) => ({
        rank: i + 1,
        userId: r.userId,
        name: r.name,
        avatar: r.avatar || '🧒',
        grade: r.grade || '?',
        score: r.totalScore,
        avgScore: r.avgScore,
        subject: 'All',
      }));
    }

    // Find current user's rank
    const myEntry = rankings.find(r => r.userId?.toString() === req.user._id.toString());
    const myRank = myEntry?.rank || null;

    res.json({ rankings, myRank, type });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
