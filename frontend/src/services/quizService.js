/**
 * SmartKids Learning App - Quiz Service
 * Handles quiz generation, submission and results
 */

import api from './api';
import { storage } from '../utils/storage';
import { shuffleArray } from '../utils/helpers';

export const quizService = {
  /**
   * Generate quiz questions from backend
   */
  generateQuiz: async ({ grade, subject, topic, difficulty, count = 10 }) => {
    try {
      const response = await api.post('/quiz/generate', { grade, subject, topic, difficulty, count });
      // Cache for offline use
      await storage.cacheQuizQuestions(`${grade}_${topic}_${difficulty}`, response.questions);
      return response;
    } catch (error) {
      // Fallback to local cache if offline
      const cached = await storage.getCachedQuiz(`${grade}_${topic}_${difficulty}`);
      if (cached) {
        return { questions: shuffleArray(cached), fromCache: true };
      }
      // Last resort - use built-in questions
      const local = await quizService.getLocalQuestions({ grade, subject, topic, difficulty, count });
      return { questions: local, fromCache: false, isLocal: true };
    }
  },

  /**
   * Submit quiz results
   */
  submitResult: async (resultData) => {
    try {
      return await api.post('/quiz/results', resultData);
    } catch (error) {
      // Save offline for later sync
      await storage.saveOfflineResult(resultData);
      return { saved: false, offline: true };
    }
  },

  /**
   * Get quiz history for a child
   */
  getHistory: async ({ childId, limit = 20, subject, topic } = {}) => {
    const params = { limit };
    if (childId) params.childId = childId;
    if (subject) params.subject = subject;
    if (topic) params.topic = topic;
    return await api.get('/quiz/history', { params });
  },

  /**
   * Get quiz statistics
   */
  getStats: async (childId) => {
    return await api.get(`/quiz/stats${childId ? `?childId=${childId}` : ''}`);
  },

  /**
   * Sync offline results when online
   */
  syncOfflineResults: async () => {
    const offlineResults = await storage.flushOfflineResults();
    if (offlineResults.length === 0) return { synced: 0 };

    let synced = 0;
    for (const result of offlineResults) {
      try {
        await api.post('/quiz/results', result);
        synced++;
      } catch (error) {
        // Re-save if still failing
        await storage.saveOfflineResult(result);
      }
    }
    return { synced };
  },

  /**
   * Built-in local questions as fallback (subset for offline)
   */
  getLocalQuestions: async ({ grade, subject, topic, difficulty, count }) => {
    const LOCAL_QUESTIONS = require('../data/localQuestions').default;
    const filtered = (LOCAL_QUESTIONS[subject]?.[topic]?.[difficulty] || [])
      .filter(q => q.grades.includes(String(grade)));
    return shuffleArray(filtered).slice(0, count);
  },
};

export default quizService;
