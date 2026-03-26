/**
 * SmartKids Learning App - Quiz Routes
 */

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth');

// All quiz routes require authentication
router.use(authenticate);

// Generate quiz questions
router.post('/generate', quizController.generateQuiz);

// Submit quiz result
router.post('/results', quizController.submitResult);

// Get quiz history
router.get('/history', quizController.getHistory);

// Get quiz statistics
router.get('/stats', quizController.getStats);

module.exports = router;
