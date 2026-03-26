/**
 * SmartKids Learning App - Auth Service
 * Handles all authentication API calls
 */

import api from './api';

export const authService = {
  /**
   * Login with email and password
   */
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },

  /**
   * Register new user (parent or child)
   */
  signup: async (userData) => {
    return await api.post('/auth/signup', userData);
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    return await api.get('/auth/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates) => {
    return await api.put('/auth/profile', updates);
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword) => {
    return await api.put('/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  /**
   * Create child profile (parent only)
   */
  createChild: async (childData) => {
    return await api.post('/auth/children', childData);
  },

  /**
   * Get all children of a parent
   */
  getChildren: async () => {
    return await api.get('/auth/children');
  },

  /**
   * Update child profile
   */
  updateChild: async (childId, updates) => {
    return await api.put(`/auth/children/${childId}`, updates);
  },

  /**
   * Delete child profile
   */
  deleteChild: async (childId) => {
    return await api.delete(`/auth/children/${childId}`);
  },
};

export default authService;
