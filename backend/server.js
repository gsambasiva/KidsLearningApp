/**
 * SmartKids Learning App - Express Server
 * Main entry point for the backend API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const cron = require('node-cron');

// Route imports
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');
const notificationRoutes = require('./routes/notifications');
const rewardRoutes = require('./routes/rewards');

const app = express();

// Connect to MongoDB
connectDB();

// ========================
// Middleware
// ========================
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Auth routes have stricter limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts. Please wait 15 minutes.' },
});
app.use('/api/auth/', authLimiter);

// ========================
// Routes
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/rewards', rewardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SmartKids API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ========================
// Scheduled Tasks
// ========================

// Daily: Send learning reminders (18:00 daily)
cron.schedule('0 18 * * *', async () => {
  console.log('[CRON] Running daily reminder notifications...');
  try {
    const notificationService = require('./services/notificationService');
    await notificationService.sendDailyReminders();
  } catch (err) {
    console.error('[CRON] Daily reminder error:', err);
  }
});

// Weekly: Send progress reports (Monday 8:00 AM)
cron.schedule('0 8 * * 1', async () => {
  console.log('[CRON] Running weekly progress reports...');
  try {
    const emailService = require('./services/emailService');
    await emailService.sendWeeklyProgressReports();
  } catch (err) {
    console.error('[CRON] Weekly report error:', err);
  }
});

// ========================
// Error Handling
// ========================
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ========================
// Start Server
// ========================
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 SmartKids API running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
