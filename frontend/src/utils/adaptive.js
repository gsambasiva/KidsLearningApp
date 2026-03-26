/**
 * SmartKids Learning App - Adaptive Learning Engine (Frontend)
 * Analyzes quiz performance and adjusts difficulty locally
 */

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

/**
 * Analyze quiz results and suggest next difficulty
 * @param {Array} recentResults - Last N quiz results for a topic
 * @param {string} currentDifficulty
 * @returns {string} recommended difficulty
 */
export const getRecommendedDifficulty = (recentResults, currentDifficulty = 'easy') => {
  if (!recentResults || recentResults.length === 0) return 'easy';

  // Calculate average score from last 3 attempts
  const last3 = recentResults.slice(-3);
  const avgScore = last3.reduce((sum, r) => sum + (r.score / r.totalQuestions * 100), 0) / last3.length;

  const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);

  // Thresholds for advancement
  if (avgScore >= 80 && currentIndex < 2) {
    return DIFFICULTY_LEVELS[currentIndex + 1]; // Go harder
  } else if (avgScore < 50 && currentIndex > 0) {
    return DIFFICULTY_LEVELS[currentIndex - 1]; // Go easier
  }
  return currentDifficulty;
};

/**
 * Calculate a student's mastery level for a topic (0-100)
 */
export const calculateMasteryLevel = (results) => {
  if (!results || results.length === 0) return 0;

  const weights = { easy: 0.2, medium: 0.35, hard: 0.45 };
  let weightedScore = 0;
  let totalWeight = 0;

  results.forEach(result => {
    const weight = weights[result.difficulty] || 0.33;
    const scorePercent = (result.score / result.totalQuestions) * 100;
    weightedScore += scorePercent * weight;
    totalWeight += weight;
  });

  return Math.round(weightedScore / totalWeight);
};

/**
 * Detect weak topics from progress data
 * @param {Object} progressByTopic - { topicId: { results, masteryLevel } }
 * @returns {Array} weak topics sorted by priority
 */
export const detectWeakTopics = (progressByTopic) => {
  const weakTopics = [];

  Object.entries(progressByTopic).forEach(([topicId, data]) => {
    const mastery = calculateMasteryLevel(data.results || []);
    if (mastery < 60) {
      weakTopics.push({
        topicId,
        topicName: data.topicName || topicId,
        masteryLevel: mastery,
        priority: mastery < 40 ? 'high' : 'medium',
        recommendedDifficulty: mastery < 30 ? 'easy' : 'medium',
        lastAttempt: data.results?.[data.results.length - 1]?.completedAt,
      });
    }
  });

  // Sort by mastery level (lowest first)
  return weakTopics.sort((a, b) => a.masteryLevel - b.masteryLevel);
};

/**
 * Generate personalized practice recommendations
 */
export const getRecommendations = (progressByTopic, grade) => {
  const weakTopics = detectWeakTopics(progressByTopic);
  const recommendations = [];

  // Add weak topic practice
  weakTopics.slice(0, 3).forEach(topic => {
    recommendations.push({
      type: 'practice',
      topicId: topic.topicId,
      topicName: topic.topicName,
      reason: topic.masteryLevel < 40 ? 'Needs improvement' : 'Keep practicing',
      difficulty: topic.recommendedDifficulty,
      priority: topic.priority,
    });
  });

  // Add challenge for strong topics
  Object.entries(progressByTopic).forEach(([topicId, data]) => {
    const mastery = calculateMasteryLevel(data.results || []);
    if (mastery >= 85) {
      recommendations.push({
        type: 'challenge',
        topicId,
        topicName: data.topicName || topicId,
        reason: 'Ready for a challenge!',
        difficulty: 'hard',
        priority: 'low',
      });
    }
  });

  return recommendations.slice(0, 5);
};

/**
 * Calculate XP earned from a quiz session
 */
export const calculateXP = (score, totalQuestions, difficulty, timeBonus = 0) => {
  const baseXP = {
    easy: 10,
    medium: 20,
    hard: 35,
  };

  const scorePercent = (score / totalQuestions) * 100;
  const base = baseXP[difficulty] || 15;
  const scoreMultiplier = scorePercent >= 100 ? 2 : scorePercent >= 80 ? 1.5 : scorePercent >= 60 ? 1 : 0.5;

  const xp = Math.round(base * score * scoreMultiplier) + timeBonus;
  return Math.max(5, xp); // Minimum 5 XP for participation
};

/**
 * Calculate stars earned
 */
export const calculateStars = (scorePercent, difficulty) => {
  const bonusForHard = difficulty === 'hard' ? 1 : 0;
  if (scorePercent >= 90) return 3 + bonusForHard;
  if (scorePercent >= 70) return 2 + bonusForHard;
  if (scorePercent >= 50) return 1;
  return 0;
};

/**
 * Calculate coins earned
 */
export const calculateCoins = (score, difficulty) => {
  const multiplier = { easy: 1, medium: 2, hard: 3 };
  return score * (multiplier[difficulty] || 1);
};

/**
 * Check which badges to award
 */
export const checkBadges = (stats) => {
  const badges = [];

  // First quiz badge
  if (stats.totalQuizzes === 1) {
    badges.push({ id: 'first_quiz', name: 'First Steps', icon: '🎯', description: 'Completed your first quiz!' });
  }

  // Perfect score badge
  if (stats.lastScore === 100) {
    badges.push({ id: 'perfect', name: 'Perfect Score!', icon: '⭐', description: 'Got 100% on a quiz!' });
  }

  // Streak badges
  if (stats.streak === 7) {
    badges.push({ id: 'week_streak', name: 'Week Warrior', icon: '🔥', description: '7 day learning streak!' });
  }
  if (stats.streak === 30) {
    badges.push({ id: 'month_streak', name: 'Monthly Master', icon: '🏆', description: '30 day learning streak!' });
  }

  // Level badges
  if (stats.level === 5) {
    badges.push({ id: 'level_5', name: 'Rising Star', icon: '🌟', description: 'Reached Level 5!' });
  }
  if (stats.level === 10) {
    badges.push({ id: 'level_10', name: 'Learning Legend', icon: '👑', description: 'Reached Level 10!' });
  }

  // Quiz count badges
  if (stats.totalQuizzes === 10) {
    badges.push({ id: 'quiz_10', name: 'Quiz Explorer', icon: '🔍', description: 'Completed 10 quizzes!' });
  }
  if (stats.totalQuizzes === 50) {
    badges.push({ id: 'quiz_50', name: 'Quiz Champion', icon: '🥇', description: 'Completed 50 quizzes!' });
  }

  return badges;
};

export default {
  getRecommendedDifficulty,
  calculateMasteryLevel,
  detectWeakTopics,
  getRecommendations,
  calculateXP,
  calculateStars,
  calculateCoins,
  checkBadges,
};
