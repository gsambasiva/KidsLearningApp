/**
 * SmartKids Learning App - Reward Popup
 * Animated celebration popup when earning rewards
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, Animated, TouchableOpacity,
} from 'react-native';
import { Colors } from '../../styles/colors';

const RewardPopup = ({ visible, rewards, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Bounce stars animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
        { iterations: 3 }
      ).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!rewards) return null;

  const starBounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>

          {/* Header */}
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Awesome Job!</Text>
          <Text style={styles.subtitle}>You earned rewards!</Text>

          {/* Rewards Display */}
          <View style={styles.rewardsRow}>
            {rewards.stars > 0 && (
              <Animated.View style={[styles.rewardItem, { transform: [{ scale: starBounce }] }]}>
                <Text style={styles.rewardEmoji}>⭐</Text>
                <Text style={styles.rewardValue}>+{rewards.stars}</Text>
                <Text style={styles.rewardLabel}>Stars</Text>
              </Animated.View>
            )}
            {rewards.coins > 0 && (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>🪙</Text>
                <Text style={styles.rewardValue}>+{rewards.coins}</Text>
                <Text style={styles.rewardLabel}>Coins</Text>
              </View>
            )}
            {rewards.xp > 0 && (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>⚡</Text>
                <Text style={styles.rewardValue}>+{rewards.xp}</Text>
                <Text style={styles.rewardLabel}>XP</Text>
              </View>
            )}
          </View>

          {/* Badges */}
          {rewards.badges && rewards.badges.length > 0 && (
            <View style={styles.badgesContainer}>
              <Text style={styles.badgeTitle}>New Badges Unlocked! 🏆</Text>
              {rewards.badges.map((badge, i) => (
                <View key={i} style={styles.badgeItem}>
                  <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                  <View>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDesc}>{badge.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue! 🚀</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: 28,
    width: '82%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emoji: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 20 },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  rewardItem: { alignItems: 'center', backgroundColor: Colors.background, borderRadius: 16, padding: 12, minWidth: 70 },
  rewardEmoji: { fontSize: 32 },
  rewardValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  rewardLabel: { fontSize: 12, color: Colors.textSecondary },
  badgesContainer: { width: '100%', backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 12, marginBottom: 16 },
  badgeTitle: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark, marginBottom: 8 },
  badgeItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 4, gap: 10 },
  badgeEmoji: { fontSize: 28 },
  badgeName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  badgeDesc: { fontSize: 12, color: Colors.textSecondary },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 40,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: Colors.white, fontSize: 18, fontWeight: '800' },
});

export default RewardPopup;
