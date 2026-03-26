/**
 * SmartKids Learning App - Result Screen
 * Animated results display with rewards
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import RewardPopup from '../../components/gamification/RewardPopup';
import ProgressBar from '../../components/common/ProgressBar';
import { getPerformanceLabel, formatTime } from '../../utils/helpers';

const ResultScreen = ({ navigation, route }) => {
  const {
    score, total, scorePercent, difficulty, subject, topic,
    grade, answers = [], earnedRewards, timeTaken,
  } = route.params || {};

  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [showAnswerReview, setShowAnswerReview] = useState(false);

  const scoreAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const performance = getPerformanceLabel(scorePercent);

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      // Show rewards after entrance
      if (earnedRewards && (earnedRewards.stars > 0 || earnedRewards.badges?.length > 0)) {
        setTimeout(() => setShowRewardPopup(true), 600);
      }
    });

    // Count up animation for score
    Animated.timing(scoreAnim, {
      toValue: scorePercent,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, []);

  const scoreDisplay = scoreAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, scorePercent],
  });

  const getResultEmoji = () => {
    if (scorePercent >= 90) return '🌟';
    if (scorePercent >= 75) return '🎉';
    if (scorePercent >= 60) return '😊';
    if (scorePercent >= 40) return '💪';
    return '📚';
  };

  const getGradientColors = () => {
    if (scorePercent >= 75) return [Colors.primary, Colors.primaryDark];
    if (scorePercent >= 50) return [Colors.warning, Colors.secondaryDark];
    return [Colors.wrong, '#B71C1C'];
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <LinearGradient colors={getGradientColors()} style={styles.hero}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
            <Text style={styles.resultEmoji}>{getResultEmoji()}</Text>
            <Text style={styles.performanceLabel}>{performance.label}</Text>
          </Animated.View>

          {/* Score Circle */}
          <Animated.View style={[styles.scoreCircle, { opacity: contentAnim }]}>
            <Animated.Text style={styles.scoreNumber}>
              {scorePercent}%
            </Animated.Text>
            <Text style={styles.scoreSubText}>
              {score} / {total} correct
            </Text>
          </Animated.View>

          {/* Stars Earned */}
          {earnedRewards?.stars > 0 && (
            <View style={styles.starsRow}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Text
                  key={i}
                  style={[styles.star, i < earnedRewards.stars ? styles.starFilled : styles.starEmpty]}
                >
                  ⭐
                </Text>
              ))}
            </View>
          )}
        </LinearGradient>

        {/* Stats Cards */}
        <Animated.View style={[styles.statsRow, { opacity: contentAnim }]}>
          {[
            { label: 'Score', value: `${scorePercent}%`, emoji: '🎯' },
            { label: 'Time', value: formatTime(timeTaken || 0), emoji: '⏱️' },
            { label: 'Streak', value: `${score} 🔥`, emoji: '' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Rewards Earned */}
        {earnedRewards && (
          <Animated.View style={[styles.rewardsCard, { opacity: contentAnim }]}>
            <Text style={styles.sectionTitle}>🏆 Rewards Earned</Text>
            <View style={styles.rewardsRow}>
              {earnedRewards.stars > 0 && (
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardEmoji}>⭐</Text>
                  <Text style={styles.rewardValue}>+{earnedRewards.stars}</Text>
                  <Text style={styles.rewardLabel}>Stars</Text>
                </View>
              )}
              {earnedRewards.coins > 0 && (
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardEmoji}>🪙</Text>
                  <Text style={styles.rewardValue}>+{earnedRewards.coins}</Text>
                  <Text style={styles.rewardLabel}>Coins</Text>
                </View>
              )}
              {earnedRewards.xp > 0 && (
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardEmoji}>⚡</Text>
                  <Text style={styles.rewardValue}>+{earnedRewards.xp}</Text>
                  <Text style={styles.rewardLabel}>XP</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Answer Review Toggle */}
        <TouchableOpacity
          style={styles.reviewToggle}
          onPress={() => setShowAnswerReview(!showAnswerReview)}
        >
          <Text style={styles.reviewToggleText}>
            {showAnswerReview ? '▲ Hide' : '▼ Review'} Answers
          </Text>
        </TouchableOpacity>

        {/* Answer Review */}
        {showAnswerReview && (
          <View style={styles.reviewList}>
            {answers.map((a, i) => (
              <View
                key={i}
                style={[styles.reviewItem, a.isCorrect ? styles.reviewCorrect : styles.reviewWrong]}
              >
                <Text style={styles.reviewNum}>{i + 1}.</Text>
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewQuestion} numberOfLines={2}>{a.question}</Text>
                  {!a.isCorrect && (
                    <Text style={styles.reviewAnswer}>
                      Correct: <Text style={styles.reviewCorrectText}>{a.correctAnswer}</Text>
                    </Text>
                  )}
                </View>
                <Text style={styles.reviewIcon}>{a.isCorrect ? '✅' : '❌'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.primaryBtn]}
            onPress={() => navigation.replace('Quiz', {
              subject, grade, topic,
              difficulty: scorePercent >= 80 ? 'hard' : scorePercent < 50 ? 'easy' : difficulty,
              count: total,
            })}
          >
            <Text style={styles.actionBtnText}>🔄 Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.secondaryBtn]}
            onPress={() => navigation.navigate('TopicSelection', { subject, grade })}
          >
            <Text style={[styles.actionBtnText, { color: Colors.primary }]}>📚 New Topic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.homeBtn]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.actionBtnText, { color: Colors.textSecondary }]}>🏠 Home</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Reward Popup */}
      <RewardPopup
        visible={showRewardPopup}
        rewards={earnedRewards}
        onClose={() => setShowRewardPopup(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: { padding: 32, alignItems: 'center', paddingTop: 48 },
  resultEmoji: { fontSize: 64, marginBottom: 8 },
  performanceLabel: { fontSize: 26, fontWeight: '900', color: Colors.white, marginBottom: 20 },
  scoreCircle: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  scoreNumber: { fontSize: 36, fontWeight: '900', color: Colors.white },
  scoreSubText: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  starsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  star: { fontSize: 34 },
  starFilled: { opacity: 1 },
  starEmpty: { opacity: 0.3 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10, justifyContent: 'space-between' },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 20,
    padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  rewardsCard: {
    backgroundColor: Colors.white, borderRadius: 24,
    margin: 16, marginTop: 0, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14 },
  rewardsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  rewardItem: { alignItems: 'center' },
  rewardEmoji: { fontSize: 32 },
  rewardValue: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  rewardLabel: { fontSize: 12, color: Colors.textSecondary },
  reviewToggle: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 14, marginHorizontal: 16, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  reviewToggleText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  reviewList: { margin: 16, gap: 8 },
  reviewItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 14, padding: 14,
  },
  reviewCorrect: { backgroundColor: '#E8F5E9' },
  reviewWrong: { backgroundColor: '#FFEBEE' },
  reviewNum: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary, width: 24 },
  reviewContent: { flex: 1 },
  reviewQuestion: { fontSize: 14, color: Colors.textPrimary },
  reviewAnswer: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  reviewCorrectText: { color: Colors.correct, fontWeight: '700' },
  reviewIcon: { fontSize: 22 },
  actions: { padding: 20, gap: 12, paddingBottom: 36 },
  actionBtn: {
    borderRadius: 20, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  primaryBtn: { backgroundColor: Colors.primary },
  secondaryBtn: { backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.primary },
  homeBtn: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  actionBtnText: { fontSize: 17, fontWeight: '800', color: Colors.white },
});

export default ResultScreen;
