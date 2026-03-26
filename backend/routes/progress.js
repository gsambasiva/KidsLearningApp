const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/report', progressController.getReport);
router.get('/topics', progressController.getTopicBreakdown);
router.get('/weak-areas', progressController.getWeakAreas);
router.get('/recommendations', progressController.getRecommendations);
router.get('/chart', progressController.getChartData);

module.exports = router;
