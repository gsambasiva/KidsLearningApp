/**
 * SmartKids Learning App - Child Home Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import StreakBadge from '../../components/gamification/StreakBadge';
import LevelBadge from '../../components/gamification/LevelBadge';
import ProgressBar from '../../components/common/ProgressBar';
import { quizService } from '../../services/quizService';
import { getGradeName, getSubjectIcon } from '../../utils/helpers';

const SUBJECTS = [
  { id: 'math', name: 'Math', emoji: '🔢', color: '#3F51B5', description: 'Numbers & equations' },
  { id: 'reading', name: 'Reading', emoji: '📚', color: '#009688', description: 'Stories & comprehension' },
];

const QUICK_CHALLENGES = [
  { label: '5-min Math', emoji: '⚡', subject: 'math', difficulty: 'easy', count: 5 },
  { label: 'Story Time', emoji: '📖', subject: 'reading', difficulty: 'easy', count: 3 },
  { label: 'Math Challenge', emoji: '🔥', subject: 'math', difficulty: 'medium', count: 8 },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { rewards, streak, currentGrade } = useAppContext();
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await quizService.getStats();
      setStats(data);
    } catch (e) {
      // Use default stats
      setStats({ totalQuizzes: 0, avgScore: 0, totalXP: 0 });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleSubjectPress = (subject) => {
    // Pass the ID string so every downstream screen can compare subject === 'math' reliably
    navigation.navigate('GradeSelection', { subject: subject.id || subject });
  };

  const handleQuickChallenge = (challenge) => {
    navigation.navigate('Quiz', {
      subject: challenge.subject,
      grade: currentGrade || 'K',
      difficulty: challenge.difficulty,
      count: challenge.count,
      topic: 'mixed',
    });
  };

  const xpToNextLevel = rewards.level * 100;
  const currentXP = rewards.stars * 10;
  const levelProgress = Math.min((currentXP % xpToNextLevel) / xpToNextLevel * 100, 100);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      {/* Header Banner */}
      <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good {getTimeGreeting()}! 👋</Text>
            <Text style={styles.name}>{user?.firstName || 'Learner'}!</Text>
          </View>
          <View style={styles.headerRight}>
            <StreakBadge streak={streak.current} size="small" />
          </View>
        </View>

        {/* Level & XP Bar */}
        <View style={styles.levelContainer}>
          <View style={styles.levelRow}>
            <LevelBadge level={rewards.level} showTitle />
            <View style={styles.xpInfo}>
              <Text style={styles.xpText}>{currentXP} XP</Text>
              <Text style={styles.xpNextText}>Next: {xpToNextLevel} XP</Text>
            </View>
          </View>
          <ProgressBar
            progress={levelProgress}
            total={100}
            color={Colors.star}
            backgroundColor="rgba(255,255,255,0.2)"
            height={10}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Reward Stats */}
        <View style={styles.rewardStats}>
          {[
            { emoji: '⭐', value: rewards.stars, label: 'Stars' },
            { emoji: '🪙', value: rewards.coins, label: 'Coins' },
            { emoji: '🎯', value: stats?.totalQuizzes || 0, label: 'Quizzes' },
          ].map((item, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statEmoji}>{item.emoji}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Challenges */}
        <Text style={styles.sectionTitle}>⚡ Quick Challenges</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {QUICK_CHALLENGES.map((challenge, i) => (
            <TouchableOpacity
              key={i}
              style={styles.challengeCard}
              onPress={() => handleQuickChallenge(challenge)}
            >
              <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
              <Text style={styles.challengeLabel}>{challenge.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Subjects */}
        <Text style={styles.sectionTitle}>📚 Choose a Subject</Text>
        {SUBJECTS.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={[styles.subjectCard, { borderLeftColor: subject.color }]}
            onPress={() => handleSubjectPress(subject)}
            activeOpacity={0.85}
          >
            <View style={[styles.subjectIcon, { backgroundColor: subject.color + '20' }]}>
              <Text style={styles.subjectEmoji}>{subject.emoji}</Text>
            </View>
            <View style={styles.subjectInfo}>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectDesc}>{subject.description}</Text>
            </View>
            <Text style={styles.subjectArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Leaderboard Shortcut */}
        <TouchableOpacity
          style={styles.leaderboardBtn}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.leaderboardGradient}>
            <Text style={styles.leaderboardEmoji}>🏆</Text>
            <View style={styles.leaderboardText}>
              <Text style={styles.leaderboardTitle}>Leaderboard</Text>
              <Text style={styles.leaderboardSub}>See where you rank!</Text>
            </View>
            <Text style={styles.leaderboardArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 50, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  name: { fontSize: 30, fontWeight: '900', color: Colors.white },
  headerRight: {},
  levelContainer: { marginBottom: 16 },
  levelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  xpInfo: { alignItems: 'flex-end' },
  xpText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  xpNextText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  rewardStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  statItem: { alignItems: 'center' },
  statEmoji: { fontSize: 24 },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14, marginTop: 8 },
  horizontalScroll: { marginBottom: 20 },
  challengeCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 100,
  },
  challengeEmoji: { fontSize: 32, marginBottom: 6 },
  challengeLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  subjectCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 14,
  },
  subjectIcon: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  subjectEmoji: { fontSize: 28 },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  subjectDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  subjectArrow: { fontSize: 24, color: Colors.textLight, fontWeight: '300' },
  leaderboardBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 4 },
  leaderboardGradient: {
    flexDirection: 'row', alignItems: 'center', padding: 20, gap: 14,
    borderRadius: 20,
  },
  leaderboardEmoji: { fontSize: 40 },
  leaderboardText: { flex: 1 },
  leaderboardTitle: { fontSize: 20, fontWeight: '800', color: Colors.white },
  leaderboardSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  leaderboardArrow: { fontSize: 24, color: Colors.white, fontWeight: '300' },
});

export default HomeScreen;
