/**
 * SmartKids Learning App - Push Notification Service
 * Uses Expo Push Notifications SDK
 */

const { Expo } = require('expo-server-sdk');
const User = require('../models/User');

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

/**
 * Send daily reminder to all active users
 */
exports.sendDailyReminders = async () => {
  const users = await User.find({
    role: 'child',
    pushToken: { $exists: true, $ne: null },
    'settings.notificationsEnabled': true,
    isActive: true,
  });

  const messages = [];
  for (const user of users) {
    if (!Expo.isExpoPushToken(user.pushToken)) continue;

    messages.push({
      to: user.pushToken,
      sound: 'default',
      title: `Hey ${user.firstName}! 👋`,
      body: "Time to learn! Ready for today's quiz? 🎯",
      data: { type: 'daily_reminder', screen: 'Home' },
      badge: 1,
    });
  }

  await sendBatch(messages);
  console.log(`[Push] Sent ${messages.length} daily reminders`);
};

/**
 * Send notification to a specific user
 */
exports.sendToUser = async (userId, notification) => {
  const user = await User.findById(userId);
  if (!user?.pushToken || !Expo.isExpoPushToken(user.pushToken)) return;

  await sendBatch([{
    to: user.pushToken,
    sound: 'default',
    ...notification,
  }]);
};

/**
 * Register push token for user
 */
exports.registerToken = async (userId, token) => {
  await User.findByIdAndUpdate(userId, { pushToken: token });
};

// Send in batches (Expo SDK requirement)
const sendBatch = async (messages) => {
  if (messages.length === 0) return;
  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error('[Push] Batch send error:', error);
    }
  }
};
