/**
 * SmartKids Learning App - Auth Context
 * Manages authentication state across the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);

  // Load stored auth on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      const storedUser = await storage.getItem('user_data');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Verify token is still valid
        try {
          const freshUser = await authService.getProfile(storedToken);
          setUser(freshUser);
          await storage.setItem('user_data', JSON.stringify(freshUser));
        } catch (err) {
          // Token expired, clear auth
          await clearAuth();
        }
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: newToken, user: newUser } = response;

      await SecureStore.setItemAsync('auth_token', newToken);
      await storage.setItem('user_data', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const response = await authService.signup(userData);
      const { token: newToken, user: newUser } = response;

      await SecureStore.setItemAsync('auth_token', newToken);
      await storage.setItem('user_data', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    await clearAuth();
  }, []);

  const clearAuth = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await storage.removeItem('user_data');
    setToken(null);
    setUser(null);
    setSelectedChild(null);
  };

  const updateUser = useCallback(async (updatedUser) => {
    setUser(updatedUser);
    await storage.setItem('user_data', JSON.stringify(updatedUser));
  }, []);

  const selectChild = useCallback((child) => {
    setSelectedChild(child);
  }, []);

  const value = {
    user,
    token,
    loading,
    selectedChild,
    isAuthenticated: !!token,
    isParent: user?.role === 'parent',
    isChild: user?.role === 'child',
    login,
    signup,
    logout,
    updateUser,
    selectChild,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
