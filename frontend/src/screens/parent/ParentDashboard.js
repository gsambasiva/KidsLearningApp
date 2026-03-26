/**
 * SmartKids Learning App - Parent Dashboard Screen
 * Full analytics dashboard for tracking children's progress
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import ProgressChart from '../../components/dashboard/ProgressChart';
import { progressService } from '../../services/progressService';
import { authService } from '../../services/authService';
import { calcPercent, getRelativeTime } from '../../utils/helpers';

const StatCard = ({ emoji, label, value, color = Colors.primary }) => (
  <View style={[styles.statCard, { borderTopColor: color }]}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ParentDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [report, setReport] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [weakAreas, setWeakAreas] = useState([]);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) loadReport();
  }, [selectedChild, period]);

  const loadChildren = async () => {
    try {
      const result = await authService.getChildren();
      setChildren(result.children || []);
      if (result.children?.length > 0) {
        setSelectedChild(result.children[0]);
      }
    } catch (e) {
      // Use mock children if no API
      const mock = [{ _id: '1', firstName: 'Alex', lastName: 'M.', grade: '3', avatar: '🦁' }];
      setChildren(mock);
      setSelectedChild(mock[0]);
    }
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const [reportData, chart, weak] = await Promise.all([
        progressService.getReport(selectedChild._id, period),
        progressService.getChartData(selectedChild._id, period),
        progressService.getWeakAreas(selectedChild._id),
      ]);
      setReport(reportData);
      setChartData(chart);
      setWeakAreas(weak.areas || []);
    } catch (e) {
      setReport(getMockReport());
      setChartData(getMockChartData());
      setWeakAreas(getMockWeakAreas());
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReport();
    setRefreshing(false);
  };

  const getMockReport = () => ({
    totalQuizzes: 24,
    avgScore: 78,
    totalTimeMins: 340,
    correctAnswers: 186,
    totalQuestions: 240,
    streak: 5,
    topSubject: 'Math',
  });

  const getMockChartData = () => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [65, 72, 80, 75, 88, 92, 85] }],
  });

  const getMockWeakAreas = () => ([
    { topic: 'Fractions', mastery: 42, subject: 'Math', priority: 'high' },
    { topic: 'Reading Comprehension', mastery: 55, subject: 'Reading', priority: 'medium' },
    { topic: 'Division', mastery: 60, subject: 'Math', priority: 'medium' },
  ]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
      >
        {/* Header */}
        <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Parent Dashboard 👨‍👩‍👧</Text>
              <Text style={styles.headerName}>{user?.firstName}'s Overview</Text>
            </View>
            <TouchableOpacity
              style={styles.addChildBtn}
              onPress={() => navigation.navigate('ManageChildren')}
            >
              <Text style={styles.addChildText}>+ Add Child</Text>
            </TouchableOpacity>
          </View>

          {/* Child Selector */}
          {children.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childSelector}>
              {children.map((child) => (
                <TouchableOpacity
                  key={child._id}
                  style={[
                    styles.childChip,
                    selectedChild?._id === child._id && styles.childChipSelected,
                  ]}
                  onPress={() => setSelectedChild(child)}
                >
                  <Text style={styles.childAvatar}>{child.avatar || '🧒'}</Text>
                  <Text style={[
                    styles.childChipName,
                    selectedChild?._id === child._id && styles.childChipNameSelected,
                  ]}>
                    {child.firstName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </LinearGradient>

        {selectedChild && report ? (
          <View style={styles.content}>
            {/* Period Toggle */}
            <View style={styles.periodToggle}>
              {['weekly', 'monthly'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                    {p === 'weekly' ? '7 Days' : '30 Days'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Key Stats */}
            <View style={styles.statsGrid}>
              <StatCard emoji="🎯" label="Quizzes" value={report.totalQuizzes} color={Colors.accent} />
              <StatCard emoji="📊" label="Avg Score" value={`${report.avgScore}%`} color={Colors.primary} />
              <StatCard emoji="⏱️" label="Mins Spent" value={report.totalTimeMins} color={Colors.secondary} />
              <StatCard emoji="🔥" label="Streak" value={`${report.streak}d`} color={Colors.streak} />
            </View>

            {/* Accuracy */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📈 Overall Accuracy</Text>
              <View style={styles.accuracyRow}>
                <Text style={styles.accuracyPercent}>
                  {calcPercent(report.correctAnswers, report.totalQuestions)}%
                </Text>
                <Text style={styles.accuracyDetail}>
                  {report.correctAnswers}/{report.totalQuestions} correct
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${calcPercent(report.correctAnswers, report.totalQuestions)}%` },
                  ]}
                />
              </View>
            </View>

            {/* Progress Chart */}
            {chartData && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📊 Performance Trend</Text>
                <ProgressChart
                  data={chartData}
                  type="line"
                  period={period}
                  title=""
                />
              </View>
            )}

            {/* Weak Areas */}
            {weakAreas.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>⚠️ Areas Needing Attention</Text>
                {weakAreas.map((area, i) => (
                  <View key={i} style={styles.weakAreaItem}>
                    <View style={styles.weakAreaInfo}>
                      <Text style={styles.weakAreaTopic}>{area.topic}</Text>
                      <Text style={styles.weakAreaSubject}>{area.subject}</Text>
                    </View>
                    <View style={styles.weakAreaRight}>
                      <View style={styles.masteryBar}>
                        <View
                          style={[
                            styles.masteryFill,
                            { width: `${area.mastery}%`, backgroundColor: area.mastery < 50 ? Colors.wrong : Colors.warning },
                          ]}
                        />
                      </View>
                      <Text style={[
                        styles.masteryPercent,
                        { color: area.mastery < 50 ? Colors.wrong : Colors.warning },
                      ]}>
                        {area.mastery}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Recommendations */}
            <View style={[styles.card, styles.recommendCard]}>
              <Text style={styles.cardTitle}>💡 Recommendations</Text>
              <View style={styles.recommendItem}>
                <Text style={styles.recommendEmoji}>📚</Text>
                <Text style={styles.recommendText}>
                  Practice <Text style={styles.bold}>Fractions</Text> daily — it's their weakest area
                </Text>
              </View>
              <View style={styles.recommendItem}>
                <Text style={styles.recommendEmoji}>🎯</Text>
                <Text style={styles.recommendText}>
                  Challenge with <Text style={styles.bold}>Hard difficulty</Text> Math — they're excelling!
                </Text>
              </View>
            </View>

          </View>
        ) : (
          <View style={styles.noChild}>
            <Text style={styles.noChildEmoji}>👨‍👩‍👧</Text>
            <Text style={styles.noChildText}>No children added yet</Text>
            <TouchableOpacity
              style={styles.addFirstChildBtn}
              onPress={() => navigation.navigate('ManageChildren')}
            >
              <Text style={styles.addFirstChildText}>Add Your First Child →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 20, paddingTop: 48, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  headerName: { fontSize: 26, fontWeight: '900', color: Colors.white },
  addChildBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 14,
  },
  addChildText: { fontSize: 14, color: Colors.white, fontWeight: '700' },
  childSelector: { flexDirection: 'row' },
  childChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 14, marginRight: 8,
  },
  childChipSelected: { backgroundColor: Colors.white },
  childAvatar: { fontSize: 20 },
  childChipName: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  childChipNameSelected: { color: Colors.accent },
  content: { padding: 16 },
  periodToggle: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 16,
    padding: 4, marginBottom: 16, gap: 4,
  },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 12 },
  periodBtnActive: { backgroundColor: Colors.accent },
  periodText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  periodTextActive: { color: Colors.white },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.white,
    borderRadius: 18, padding: 14, alignItems: 'center',
    borderTopWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14 },
  accuracyRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  accuracyPercent: { fontSize: 36, fontWeight: '900', color: Colors.accent },
  accuracyDetail: { fontSize: 14, color: Colors.textSecondary },
  progressTrack: {
    height: 10, backgroundColor: Colors.border, borderRadius: 5, overflow: 'hidden',
  },
  progressFill: { height: 10, backgroundColor: Colors.accent, borderRadius: 5 },
  weakAreaItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 12,
  },
  weakAreaInfo: { flex: 1 },
  weakAreaTopic: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  weakAreaSubject: { fontSize: 12, color: Colors.textSecondary },
  weakAreaRight: { alignItems: 'flex-end', gap: 4 },
  masteryBar: { width: 80, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  masteryFill: { height: 8, borderRadius: 4 },
  masteryPercent: { fontSize: 13, fontWeight: '700' },
  recommendCard: { backgroundColor: Colors.primaryLight },
  recommendItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  recommendEmoji: { fontSize: 22 },
  recommendText: { flex: 1, fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  bold: { fontWeight: '700' },
  noChild: { alignItems: 'center', paddingVertical: 60, padding: 24 },
  noChildEmoji: { fontSize: 64, marginBottom: 16 },
  noChildText: { fontSize: 18, color: Colors.textSecondary, marginBottom: 20 },
  addFirstChildBtn: {
    backgroundColor: Colors.primary, borderRadius: 25,
    paddingVertical: 14, paddingHorizontal: 28,
  },
  addFirstChildText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});

export default ParentDashboard;
