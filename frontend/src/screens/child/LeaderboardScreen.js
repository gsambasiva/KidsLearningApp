/**
 * SmartKids Learning App - Leaderboard Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatNumber, getOrdinal } from '../../utils/helpers';

const TABS = ['Global', 'Weekly', 'Streaks'];

const LeaderboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const type = ['global', 'weekly', 'streak'][activeTab];
      const response = await api.get(`/leaderboard?type=${type}`);
      setData(response.rankings || []);
      setMyRank(response.myRank || null);
    } catch (e) {
      // Fallback mock data
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const getMockData = () => [
    { rank: 1, name: 'Alex M.', avatar: '🦁', score: 2450, grade: '3', subject: 'Math' },
    { rank: 2, name: 'Sofia L.', avatar: '🦋', score: 2380, grade: '4', subject: 'Reading' },
    { rank: 3, name: 'Noah K.', avatar: '🦊', score: 2210, grade: '3', subject: 'Math' },
    { rank: 4, name: 'Emma R.', avatar: '🐬', score: 1990, grade: '2', subject: 'Math' },
    { rank: 5, name: 'Liam W.', avatar: '🐯', score: 1870, grade: '5', subject: 'Reading' },
  ];

  const getRankDecoration = (rank) => {
    if (rank === 1) return { emoji: '🥇', color: '#FFD700' };
    if (rank === 2) return { emoji: '🥈', color: '#C0C0C0' };
    if (rank === 3) return { emoji: '🥉', color: '#CD7F32' };
    return { emoji: `#${rank}`, color: Colors.textSecondary };
  };

  const renderItem = ({ item, index }) => {
    const { emoji, color } = getRankDecoration(item.rank);
    const isMe = item.userId === user?.id;
    const isTopThree = item.rank <= 3;

    return (
      <View style={[styles.item, isMe && styles.itemMe, isTopThree && styles.itemTop]}>
        {/* Rank */}
        <View style={[styles.rankContainer, { borderColor: color }]}>
          <Text style={[styles.rankText, { color }]}>{emoji}</Text>
        </View>

        {/* Avatar */}
        <View style={[styles.avatar, isTopThree && { backgroundColor: color + '20' }]}>
          <Text style={styles.avatarEmoji}>{item.avatar || '🧒'}</Text>
        </View>

        {/* Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>
            {item.name} {isMe && <Text style={styles.meTag}>(You)</Text>}
          </Text>
          <Text style={styles.itemGrade}>Grade {item.grade} · {item.subject}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={[styles.itemScore, isTopThree && { color }]}>
            {formatNumber(item.score)}
          </Text>
          <Text style={styles.itemScoreLabel}>pts</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
        {myRank && (
          <Text style={styles.myRankText}>
            Your Rank: {getOrdinal(myRank)} place
          </Text>
        )}
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top 3 Podium */}
      {data.length >= 3 && (
        <View style={styles.podium}>
          {[1, 0, 2].map((pos) => {
            const entry = data[pos];
            if (!entry) return null;
            const heights = [90, 110, 70];
            const colors = ['#C0C0C0', '#FFD700', '#CD7F32'];
            return (
              <View key={pos} style={[styles.podiumItem, { height: heights[pos] + 60, justifyContent: 'flex-end' }]}>
                <Text style={styles.podiumAvatar}>{entry.avatar || '🧒'}</Text>
                <Text style={styles.podiumName} numberOfLines={1}>{entry.name}</Text>
                <View style={[styles.podiumBar, { height: heights[pos], backgroundColor: colors[pos] }]}>
                  <Text style={styles.podiumRank}>{['🥈', '🥇', '🥉'][pos]}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Full List */}
      <FlatList
        data={data.slice(3)}
        keyExtractor={(item, i) => `${item.rank}_${i}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>No data yet. Start playing!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 20, paddingTop: 48 },
  backBtn: { marginBottom: 4 },
  backText: { fontSize: 16, color: Colors.white, fontWeight: '600' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
  myRankText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontWeight: '600' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 4,
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 16 },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 4,
    height: 180,
  },
  podiumItem: { flex: 1, alignItems: 'center' },
  podiumAvatar: { fontSize: 28, marginBottom: 4 },
  podiumName: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4, textAlign: 'center' },
  podiumBar: { width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: 'center', justifyContent: 'center' },
  podiumRank: { fontSize: 24, marginTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 30 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 16, padding: 12,
    marginBottom: 8, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  itemMe: { borderWidth: 2, borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  itemTop: {},
  rankContainer: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 18, fontWeight: '800' },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  meTag: { fontSize: 13, color: Colors.primary },
  itemGrade: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  scoreContainer: { alignItems: 'flex-end' },
  itemScore: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  itemScoreLabel: { fontSize: 11, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
});

export default LeaderboardScreen;
