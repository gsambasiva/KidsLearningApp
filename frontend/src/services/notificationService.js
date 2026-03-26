/**
 * SmartKids Learning App - Notification Service
 * Push notifications using Expo Notifications
 */

import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

// Safely import expo-notifications — it may be partially unavailable in Expo Go
let Notifications = null;
try {
  Notifications = require('expo-notifications');

  // setNotificationHandler must be called inside a try-catch and never at bare
  // module scope, because in Expo Go 54 the native module can be in a partial state.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false, // setBadge requires entitlement; keep false for Expo Go
    }),
  });
} catch (e) {
  console.warn('expo-notifications not available:', e.message);
}

export const notificationService = {
  /**
   * Request notification permissions and register push token
   */
  registerForPushNotifications: async () => {
    try {
      if (!Notifications) return null;
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      // getExpoPushTokenAsync requires a projectId in newer SDK versions.
      // In Expo Go it may not be available — catch gracefully.
      let token = null;
      try {
        const result = await Notifications.getExpoPushTokenAsync();
        token = result?.data ?? null;
      } catch (tokenErr) {
        console.warn('Could not get push token (Expo Go limitation):', tokenErr.message);
      }

      // Configure Android notification channels
      if (Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'SmartKids',
            importance: Notifications.AndroidImportance?.MAX ?? 5,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4CAF50',
          });
          await Notifications.setNotificationChannelAsync('reminders', {
            name: 'Learning Reminders',
            importance: Notifications.AndroidImportance?.DEFAULT ?? 3,
            vibrationPattern: [0, 250],
          });
        } catch (channelErr) {
          console.warn('Could not set notification channels:', channelErr.message);
        }
      }

      // Register token with backend
      if (token) {
        try {
          await api.post('/notifications/register-token', { token });
        } catch (error) {
          console.warn('Error registering push token with backend:', error.message);
        }
      }

      return token;
    } catch (err) {
      console.warn('registerForPushNotifications failed:', err.message);
      return null;
    }
  },

  /**
   * Schedule a local daily reminder
   */
  scheduleDailyReminder: async (hour = 18, minute = 0) => {
    try {
      if (!Notifications) return;
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to Learn! 🎓",
          body: "Ready for today's quiz? Let's keep that streak going! 🔥",
          sound: true,
          data: { screen: 'Home' },
        },
        trigger: { hour, minute, repeats: true },
      });
    } catch (err) {
      console.warn('scheduleDailyReminder failed:', err.message);
    }
  },

  /**
   * Send a local celebration notification
   */
  sendCelebrationNotification: async (achievement) => {
    try {
      if (!Notifications) return;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🏆 ${achievement.name}`,
          body: achievement.description,
          sound: true,
          data: { type: 'achievement', achievement },
        },
        trigger: null, // Immediate
      });
    } catch (err) {
      console.warn('sendCelebrationNotification failed:', err.message);
    }
  },

  /**
   * Cancel all scheduled notifications
   */
  cancelAll: async () => {
    try {
      if (!Notifications) return;
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      console.warn('cancelAll notifications failed:', err.message);
    }
  },

  /**
   * Listen for notification interactions
   */
  addNotificationListener: (handler) => {
    if (!Notifications) return { remove: () => {} };
    try {
      return Notifications.addNotificationResponseReceivedListener(handler);
    } catch (err) {
      console.warn('addNotificationListener failed:', err.message);
      return { remove: () => {} };
    }
  },
};

export default notificationService;
