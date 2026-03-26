/**
 * SmartKids Learning App - App Context
 * Global state: rewards, progress, settings, sound
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentGrade, setCurrentGrade] = useState(null);
  const [rewards, setRewards] = useState({ stars: 0, coins: 0, badges: [], level: 1 });
  const [streak, setStreak] = useState({ current: 0, best: 0, lastDate: null });
  const [offlineMode, setOfflineMode] = useState(false);
  const [appLoading, setAppLoading] = useState(false);

  useEffect(() => {
    loadAppSettings();
  }, []);

  const loadAppSettings = async () => {
    try {
      const settings = await storage.getItem('app_settings');
      const rewardsData = await storage.getItem('rewards');
      const streakData = await storage.getItem('streak');

      if (settings) {
        const parsed = JSON.parse(settings);
        setSoundEnabled(parsed.soundEnabled ?? true);
        setNotificationsEnabled(parsed.notificationsEnabled ?? true);
        if (parsed.currentGrade) setCurrentGrade(parsed.currentGrade);
      }
      if (rewardsData) setRewards(JSON.parse(rewardsData));
      if (streakData) setStreak(JSON.parse(streakData));
    } catch (error) {
      console.error('Error loading app settings:', error);
    }
  };

  const addRewards = useCallback(async (newRewards) => {
    setRewards(prev => {
      const updated = {
        ...prev,
        stars: prev.stars + (newRewards.stars || 0),
        coins: prev.coins + (newRewards.coins || 0),
        badges: [...prev.badges, ...(newRewards.badges || [])],
        level: calculateLevel(prev.stars + (newRewards.stars || 0)),
      };
      storage.setItem('rewards', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const calculateLevel = (stars) => {
    if (stars < 50) return 1;
    if (stars < 150) return 2;
    if (stars < 350) return 3;
    if (stars < 700) return 4;
    if (stars < 1200) return 5;
    return Math.floor(stars / 300) + 1;
  };

  const updateStreak = useCallback(async () => {
    const today = new Date().toDateString();
    setStreak(prev => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = prev.lastDate === yesterday.toDateString();
      const isAlreadyToday = prev.lastDate === today;

      if (isAlreadyToday) return prev;

      const newCurrent = isConsecutive ? prev.current + 1 : 1;
      const updated = {
        current: newCurrent,
        best: Math.max(prev.best, newCurrent),
        lastDate: today,
      };
      storage.setItem('streak', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleSound = useCallback(async () => {
    setSoundEnabled(prev => {
      const newVal = !prev;
      storage.setItem('app_settings', JSON.stringify({ soundEnabled: newVal, notificationsEnabled }));
      return newVal;
    });
  }, [notificationsEnabled]);

  const value = {
    soundEnabled,
    notificationsEnabled,
    currentGrade,
    rewards,
    streak,
    offlineMode,
    appLoading,
    setCurrentGrade,
    setOfflineMode,
    setAppLoading,
    addRewards,
    updateStreak,
    toggleSound,
    setNotificationsEnabled,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default AppContext;
