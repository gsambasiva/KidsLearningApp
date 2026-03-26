/**
 * SmartKids Learning App - Root Entry Point
 * Sets up providers and handles initial app loading
 */

import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreenComponent from './src/screens/SplashScreen';
import { notificationService } from './src/services/notificationService';
import { quizService } from './src/services/quizService';

// Prevent the native splash from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Perform any startup tasks
      await Promise.all([
        // Register push notifications
        notificationService.registerForPushNotifications(),
        // Sync offline results if any
        quizService.syncOfflineResults(),
        // Schedule daily reminder
        notificationService.scheduleDailyReminder(18, 0),
      ]);
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      // Hide native splash
      await SplashScreen.hideAsync().catch(() => {});
      setAppReady(true);
    }
  };

  const handleSplashFinish = () => {
    setShowCustomSplash(false);
  };

  // Show custom animated splash screen
  if (showCustomSplash || !appReady) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreenComponent onFinish={handleSplashFinish} />
      </>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </AppProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
