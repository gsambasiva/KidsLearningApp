/**
 * SmartKids Learning App - Progress Service
 * Track and retrieve learning progress
 */

import api from './api';
import { storage } from '../utils/storage';

export const progressService = {
  /**
   * Get full progress report for a child
   */
  getReport: async (childId, period = 'weekly') => {
    return await api.get(`/progress/report`, { params: { childId, period } });
  },

  /**
   * Get topic-wise progress breakdown
   */
  getTopicBreakdown: async (childId) => {
    return await api.get(`/progress/topics`, { params: { childId } });
  },

  /**
   * Get weak areas
   */
  getWeakAreas: async (childId) => {
    return await api.get(`/progress/weak-areas`, { params: { childId } });
  },

  /**
   * Get recommendations based on performance
   */
  getRecommendations: async (childId) => {
    return await api.get(`/progress/recommendations`, { params: { childId } });
  },

  /**
   * Get performance chart data (for graphs)
   */
  getChartData: async (childId, period = 'weekly') => {
    return await api.get(`/progress/chart`, { params: { childId, period } });
  },

  /**
   * Get time spent learning
   */
  getTimeStats: async (childId) => {
    return await api.get(`/progress/time-stats`, { params: { childId } });
  },
};

export default progressService;
