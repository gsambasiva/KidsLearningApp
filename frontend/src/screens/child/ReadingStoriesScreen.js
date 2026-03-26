/**
 * SmartKids — Reading Stories Screen
 * Shows a browsable list of stories for the selected grade.
 * Each card shows title, difficulty badge, word count, and completion status.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { fetchStoriesForGrade, fetchGradeMeta, getReadingProgress } from '../../services/readingService';

// ─── Difficulty badge colours ─────────────────────────────────────────────────
const DIFF_COLOR = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' };
const DIFF_EMOJI = { easy: '🟢', medium: '🟡', hard: '🔴' };

// ─── Story Card ───────────────────────────────────────────────────────────────
const StoryCard = ({ story, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(story)} activeOpacity={0.85}>
    <View style={styles.cardLeft}>
      <View style={[styles.storyNumBadge, { backgroundColor: DIFF_COLOR[story.difficulty] }]}>
        <Text style={styles.storyNumText}>{story.storyNumber}</Text>
      </View>
    </View>

    <View style={styles.cardMiddle}>
      <Text style={styles.cardTitle} numberOfLines={2}>{story.title}</Text>
      <View style={styles.cardMeta}>
        <Text style={styles.metaChip}>
          {DIFF_EMOJI[story.difficulty]} {story.difficulty}
        </Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaChip}>📖 {story.wordCount || '~50'} words</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaChip}>❓ {story.questions?.length || 6} Qs</Text>
      </View>
      {story.vocabulary && (
        <View style={styles.vocabRow}>
          {story.vocabulary.slice(0, 3).map((v, i) => (
            <View key={i} style={styles.vocabPill}>
              <Text style={styles.vocabPillText}>{v.word}</Text>
            </View>
          ))}
        </View>
      )}
    </View>

    <View style={styles.cardRight}>
      {story.isCompleted ? (
        <View style={styles.completedBadge}>
          <Text style={styles.completedEmoji}>✅</Text>
          {story.completedScore != null && (
            <Text style={styles.completedScore}>{story.completedScore}%</Text>
          )}
        </View>
      ) : (
        <View style={styles.arrowBadge}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ReadingStoriesScreen = ({ navigation, route }) => {
  const { grade = 'K', topic = 'stories', subject = 'reading' } = route.params || {};

  const [stories, setStories]     = useState([]);
  const [progress, setProgress]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]       = useState('all'); // 'all' | 'unread' | 'completed'

  const meta = fetchGradeMeta(grade);

  const loadData = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([
        fetchStoriesForGrade(grade),
        getReadingProgress(grade),
      ]);
      setStories(s);
      setProgress(p);
    } catch (e) {
      // use empty fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [grade]);

  useEffect(() => { loadData(); }, [loadData]);

  // Re-load when coming back from quiz (story may now be completed)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const handleStoryPress = (story) => {
    navigation.navigate('ReadingStory', { story, grade });
  };

  const filteredStories = stories.filter((s) => {
    if (filter === 'unread')    return !s.isCompleted;
    if (filter === 'completed') return s.isCompleted;
    return true;
  });

  const headerColors = { K:'#E91E63',1:'#FF5722',2:'#FF9800',3:'#8BC34A',4:'#00BCD4',5:'#9C27B0' };
  const hc = headerColors[grade] || Colors.reading;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient colors={[hc, shadeColor(hc, -30)]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 Reading Stories</Text>
        <Text style={styles.headerSub}>{meta.label} · {meta.sentenceHint}</Text>

        {/* Progress bar */}
        {progress && (
          <View style={styles.progressSection}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress.percent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {progress.completed}/{progress.total} stories read
              {progress.avgScore > 0 ? ` · avg ${progress.avgScore}%` : ''}
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {['all', 'unread', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? '📋 All' : f === 'unread' ? '✨ Unread' : '✅ Done'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Story list */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.reading} />
          <Text style={styles.loadingText}>Loading stories...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.reading]} />}
        >
          {filteredStories.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>{filter === 'completed' ? '📚' : '✨'}</Text>
              <Text style={styles.emptyTitle}>
                {filter === 'completed' ? 'No completed stories yet!' : 'All stories read!'}
              </Text>
              <Text style={styles.emptyHint}>
                {filter === 'completed'
                  ? 'Start reading to track your progress.'
                  : 'Great job! Switch to "All" to re-read.'}
              </Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => setFilter('all')}>
                <Text style={styles.emptyBtnText}>Show All Stories</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.listHeader}>
                {filteredStories.length} {filter === 'all' ? '' : filter} {filteredStories.length === 1 ? 'story' : 'stories'}
              </Text>
              {filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} onPress={handleStoryPress} />
              ))}
              <View style={{ height: 30 }} />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ─── Helper: darken a hex colour ─────────────────────────────────────────────
function shadeColor(hex, pct) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * pct);
  const R = Math.max(0, (num >> 16) + amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) + amt);
  const B = Math.max(0, (num & 0x0000ff) + amt);
  return '#' + ((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1);
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.background },
  header:       { padding: 24, paddingBottom: 20 },
  backBtn:      { marginBottom: 6 },
  backText:     { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  headerTitle:  { fontSize: 26, fontWeight: '900', color: Colors.white, marginBottom: 2 },
  headerSub:    { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 14 },
  progressSection: { marginTop: 4 },
  progressBarBg:   { height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.white, borderRadius: 4 },
  progressText:    { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 5 },

  filterRow:    { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterTab:    { flex: 1, paddingVertical: 12, alignItems: 'center' },
  filterTabActive: { borderBottomWidth: 3, borderBottomColor: Colors.reading },
  filterText:   { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.reading },

  scroll:       { flex: 1 },
  scrollContent: { padding: 16 },
  listHeader:   { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', marginBottom: 12 },

  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLeft:    { marginRight: 12 },
  storyNumBadge: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  storyNumText: { fontSize: 14, fontWeight: '900', color: Colors.white },
  cardMiddle:  { flex: 1 },
  cardTitle:   { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 5 },
  cardMeta:    { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  metaChip:    { fontSize: 12, color: Colors.textSecondary },
  metaDot:     { fontSize: 12, color: Colors.textLight },
  vocabRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  vocabPill:   {
    backgroundColor: '#E8F5E9', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  vocabPillText: { fontSize: 11, color: Colors.primaryDark, fontWeight: '600' },
  cardRight:   { marginLeft: 8 },
  completedBadge: { alignItems: 'center' },
  completedEmoji: { fontSize: 20 },
  completedScore: { fontSize: 11, fontWeight: '800', color: Colors.correct, marginTop: 2 },
  arrowBadge:  {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  arrowText:   { fontSize: 18, color: Colors.primary, fontWeight: '700' },

  loadingBox:  { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  loadingText: { fontSize: 16, color: Colors.textSecondary, marginTop: 12 },

  emptyBox:    { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyEmoji:  { fontSize: 60, marginBottom: 16 },
  emptyTitle:  { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  emptyHint:   { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  emptyBtn:    {
    backgroundColor: Colors.reading, borderRadius: 20,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  emptyBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});

export default ReadingStoriesScreen;
