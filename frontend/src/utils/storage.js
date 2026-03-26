/**
 * SmartKids Learning App - Storage Utility
 * Wraps AsyncStorage with error handling and offline support
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: 'user_data',
  SETTINGS: 'app_settings',
  REWARDS: 'rewards',
  STREAK: 'streak',
  PROGRESS: 'progress_',
  QUIZ_CACHE: 'quiz_cache_',
  LEADERBOARD: 'leaderboard',
  OFFLINE_RESULTS: 'offline_results',
};

export const storage = {
  /**
   * Store a value by key
   */
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Storage setItem error [${key}]:`, error);
      return false;
    }
  },

  /**
   * Get a value by key
   */
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Storage getItem error [${key}]:`, error);
      return null;
    }
  },

  /**
   * Remove a value by key
   */
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Storage removeItem error [${key}]:`, error);
      return false;
    }
  },

  /**
   * Get all keys matching a prefix
   */
  getByPrefix: async (prefix) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const matchingKeys = allKeys.filter(k => k.startsWith(prefix));
      const pairs = await AsyncStorage.multiGet(matchingKeys);
      return pairs.map(([key, value]) => ({
        key,
        value: JSON.parse(value),
      }));
    } catch (error) {
      console.error(`Storage getByPrefix error [${prefix}]:`, error);
      return [];
    }
  },

  /**
   * Clear all app data (logout)
   */
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clearAll error:', error);
      return false;
    }
  },

  /**
   * Save quiz results for offline sync
   */
  saveOfflineResult: async (result) => {
    try {
      const existing = await storage.getItem(KEYS.OFFLINE_RESULTS);
      const results = existing ? JSON.parse(existing) : [];
      results.push({ ...result, savedAt: new Date().toISOString() });
      await storage.setItem(KEYS.OFFLINE_RESULTS, JSON.stringify(results));
      return true;
    } catch (error) {
      console.error('Save offline result error:', error);
      return false;
    }
  },

  /**
   * Get and clear offline results for sync
   */
  flushOfflineResults: async () => {
    try {
      const existing = await storage.getItem(KEYS.OFFLINE_RESULTS);
      if (!existing) return [];
      const results = JSON.parse(existing);
      await storage.removeItem(KEYS.OFFLINE_RESULTS);
      return results;
    } catch (error) {
      return [];
    }
  },

  /**
   * Cache quiz questions for offline use
   */
  cacheQuizQuestions: async (gradeTopicDiff, questions) => {
    await storage.setItem(
      `${KEYS.QUIZ_CACHE}${gradeTopicDiff}`,
      JSON.stringify({ questions, cachedAt: new Date().toISOString() })
    );
  },

  getCachedQuiz: async (gradeTopicDiff) => {
    const cached = await storage.getItem(`${KEYS.QUIZ_CACHE}${gradeTopicDiff}`);
    if (!cached) return null;
    const { questions, cachedAt } = JSON.parse(cached);
    // Cache valid for 24 hours
    const cacheAge = Date.now() - new Date(cachedAt).getTime();
    if (cacheAge > 24 * 60 * 60 * 1000) return null;
    return questions;
  },
};

export { KEYS };
export default storage;
