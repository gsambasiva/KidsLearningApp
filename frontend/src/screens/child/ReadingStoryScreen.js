/**
 * SmartKids — Reading Story Screen
 * Full story reading view with:
 *  - Highlighted vocabulary words (tap for definition popup)
 *  - Vocabulary glossary section
 *  - "Take the Quiz" button
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Modal, Animated, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';

const DIFF_COLOR  = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' };
const GRADE_COLOR = {
  K:'#E91E63',1:'#FF5722',2:'#FF9800',3:'#8BC34A',4:'#00BCD4',5:'#9C27B0',
};

// ─── Vocabulary Word Popup ────────────────────────────────────────────────────
const VocabPopup = ({ visible, word, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(fadeAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!word) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Animated.View
          style={[styles.popupCard, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}
        >
          <TouchableOpacity style={styles.popupClose} onPress={onClose}>
            <Text style={styles.popupCloseText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.popupWordRow}>
            <Text style={styles.popupWordIcon}>📖</Text>
            <Text style={styles.popupWord}>{word.word}</Text>
          </View>
          <View style={styles.popupDivider} />
          <Text style={styles.popupLabel}>Meaning</Text>
          <Text style={styles.popupMeaning}>{word.meaning}</Text>
          {word.example && (
            <>
              <Text style={[styles.popupLabel, { marginTop: 10 }]}>Example</Text>
              <View style={styles.popupExampleBox}>
                <Text style={styles.popupExample}>"{word.example}"</Text>
              </View>
            </>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

// ─── Highlighted Story Text ───────────────────────────────────────────────────
const HighlightedStory = ({ content, vocabulary, onVocabPress }) => {
  if (!vocabulary || vocabulary.length === 0) {
    return <Text style={styles.storyText}>{content}</Text>;
  }

  // Build regex to match vocab words (whole word, case-insensitive)
  const vocabWords = vocabulary.map((v) => v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${vocabWords.join('|')})\\b`, 'gi');

  // Split content by pattern; odd-indexed parts are matched vocab words
  const parts = content.split(pattern);

  return (
    <Text style={styles.storyText}>
      {parts.map((part, i) => {
        const vocabEntry = vocabulary.find(
          (v) => v.word.toLowerCase() === part.toLowerCase()
        );
        if (vocabEntry) {
          return (
            <Text
              key={i}
              style={styles.vocabHighlight}
              onPress={() => onVocabPress(vocabEntry)}
            >
              {part}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
};

// ─── Vocabulary Glossary ──────────────────────────────────────────────────────
const VocabularyGlossary = ({ vocabulary, onWordPress }) => (
  <View style={styles.glossaryCard}>
    <Text style={styles.glossaryTitle}>📚 Vocabulary Builder</Text>
    <Text style={styles.glossaryHint}>Tap any word for the full definition</Text>
    {vocabulary.map((v, i) => (
      <TouchableOpacity key={i} style={styles.glossaryRow} onPress={() => onWordPress(v)}>
        <View style={styles.glossaryLeft}>
          <Text style={styles.glossaryWord}>{v.word}</Text>
          <Text style={styles.glossaryMeaning} numberOfLines={2}>{v.meaning}</Text>
        </View>
        <View style={styles.glossaryArrow}>
          <Text style={styles.glossaryArrowText}>›</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ReadingStoryScreen = ({ navigation, route }) => {
  const { story, grade = 'K' } = route.params || {};

  const [selectedVocab, setSelectedVocab] = useState(null);
  const [popupVisible,  setPopupVisible]  = useState(false);
  const [hasRead,       setHasRead]       = useState(false);

  if (!story) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Story not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 16, marginTop: 12 }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const gradeColor = GRADE_COLOR[grade] || Colors.reading;
  const diffColor  = DIFF_COLOR[story.difficulty] || Colors.primary;

  const handleVocabPress = (vocabEntry) => {
    setSelectedVocab(vocabEntry);
    setPopupVisible(true);
  };

  const handleStartQuiz = () => {
    navigation.navigate('ReadingQuiz', { story, grade });
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    // Mark as "read" once user scrolls past 50% of the content
    const scrolledPercent = (contentOffset.y + layoutMeasurement.height) / contentSize.height;
    if (scrolledPercent > 0.5 && !hasRead) setHasRead(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient colors={[gradeColor, '#00695C']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerMeta}>
          <View style={[styles.diffBadge, { backgroundColor: diffColor }]}>
            <Text style={styles.diffBadgeText}>{story.difficulty?.toUpperCase()}</Text>
          </View>
          <Text style={styles.wordCount}>📖 {story.wordCount || ''} words</Text>
        </View>
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.vocabHint}>
          💡 Tap the <Text style={styles.vocabHintHighlight}>highlighted words</Text> to learn their meaning
        </Text>
      </LinearGradient>

      {/* Story Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={200}
      >
        {/* Story text with vocabulary highlights */}
        <View style={styles.storyCard}>
          <HighlightedStory
            content={story.content}
            vocabulary={story.vocabulary}
            onVocabPress={handleVocabPress}
          />
        </View>

        {/* Vocabulary glossary */}
        {story.vocabulary && story.vocabulary.length > 0 && (
          <VocabularyGlossary
            vocabulary={story.vocabulary}
            onWordPress={handleVocabPress}
          />
        )}

        {/* Question preview */}
        <View style={styles.quizPreviewCard}>
          <Text style={styles.quizPreviewTitle}>🧠 Comprehension Quiz</Text>
          <Text style={styles.quizPreviewText}>
            Ready to test your understanding? This quiz has{' '}
            <Text style={styles.quizPreviewBold}>{story.questions?.length || 6} questions</Text>{' '}
            including multiple choice, true/false, and fill-in-the-blank.
          </Text>
          <View style={styles.quizPreviewStats}>
            <View style={styles.quizStatPill}>
              <Text style={styles.quizStatText}>
                🔵 {story.questions?.filter(q => q.type === 'mcq').length || 3} MCQ
              </Text>
            </View>
            <View style={styles.quizStatPill}>
              <Text style={styles.quizStatText}>
                ✅ {story.questions?.filter(q => q.type === 'true_false').length || 2} True/False
              </Text>
            </View>
            <View style={styles.quizStatPill}>
              <Text style={styles.quizStatText}>
                ✏️ {story.questions?.filter(q => q.type === 'fill_blank').length || 1} Fill-in
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Fixed "Take Quiz" button */}
      <View style={styles.quizBtnContainer}>
        <TouchableOpacity
          style={[styles.quizBtn, { backgroundColor: hasRead ? Colors.reading : '#8BC34A' }]}
          onPress={handleStartQuiz}
          activeOpacity={0.85}
        >
          <Text style={styles.quizBtnText}>
            {hasRead ? '🎯 Take the Quiz!' : '📝 Take the Quiz'}
          </Text>
          {hasRead && <Text style={styles.quizBtnSub}>Test your comprehension</Text>}
        </TouchableOpacity>
      </View>

      {/* Vocabulary popup */}
      <VocabPopup
        visible={popupVisible}
        word={selectedVocab}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.background },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { fontSize: 18, color: Colors.textPrimary },

  // Header
  header:       { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 22 },
  backBtn:      { marginBottom: 10 },
  backText:     { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  headerMeta:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  diffBadge:    { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  diffBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.white, letterSpacing: 0.5 },
  wordCount:    { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  storyTitle:   { fontSize: 24, fontWeight: '900', color: Colors.white, lineHeight: 30, marginBottom: 8 },
  vocabHint:    { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  vocabHintHighlight: { color: Colors.star, fontWeight: '700' },

  // Scroll
  scroll:       { flex: 1 },
  scrollContent: { padding: 16 },

  // Story text card
  storyCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  storyText: {
    fontSize: 17, color: Colors.textPrimary, lineHeight: 28,
    fontFamily: 'serif', letterSpacing: 0.2,
  },
  vocabHighlight: {
    fontSize: 17, color: '#E65100', fontWeight: '700',
    backgroundColor: '#FFF3E0', lineHeight: 28,
    borderRadius: 4, overflow: 'hidden',
  },

  // Vocabulary glossary
  glossaryCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  glossaryTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  glossaryHint:  { fontSize: 13, color: Colors.textSecondary, marginBottom: 14 },
  glossaryRow:   {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  glossaryLeft:  { flex: 1 },
  glossaryWord:  { fontSize: 16, fontWeight: '800', color: '#E65100', marginBottom: 2 },
  glossaryMeaning: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  glossaryArrow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
  },
  glossaryArrowText: { fontSize: 18, color: '#E65100', fontWeight: '700' },

  // Quiz preview card
  quizPreviewCard: {
    backgroundColor: '#E3F2FD', borderRadius: 20, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: '#BBDEFB',
  },
  quizPreviewTitle: { fontSize: 18, fontWeight: '800', color: '#1565C0', marginBottom: 6 },
  quizPreviewText:  { fontSize: 14, color: '#1E3A5F', lineHeight: 21, marginBottom: 12 },
  quizPreviewBold:  { fontWeight: '800' },
  quizPreviewStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quizStatPill:     {
    backgroundColor: Colors.white, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#BBDEFB',
  },
  quizStatText: { fontSize: 13, color: '#1565C0', fontWeight: '700' },

  // Fixed quiz button
  quizBtnContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  quizBtn: {
    borderRadius: 28, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#009688', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  quizBtnText: { fontSize: 20, fontWeight: '900', color: Colors.white },
  quizBtnSub:  { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Vocab popup modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  popupCard: {
    backgroundColor: Colors.white, borderRadius: 24, padding: 24,
    width: '100%', maxWidth: 380,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
  },
  popupClose: { position: 'absolute', top: 16, right: 16, padding: 6 },
  popupCloseText: { fontSize: 18, color: Colors.textSecondary },
  popupWordRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  popupWordIcon:  { fontSize: 28 },
  popupWord:      { fontSize: 26, fontWeight: '900', color: '#E65100' },
  popupDivider:   { height: 1, backgroundColor: Colors.border, marginBottom: 14 },
  popupLabel:     { fontSize: 12, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' },
  popupMeaning:   { fontSize: 17, color: Colors.textPrimary, lineHeight: 25 },
  popupExampleBox: {
    backgroundColor: '#FFF8F0', borderRadius: 12, padding: 12, marginTop: 4,
    borderLeftWidth: 3, borderLeftColor: '#E65100',
  },
  popupExample:   { fontSize: 15, color: '#5D4037', fontStyle: 'italic', lineHeight: 22 },
});

export default ReadingStoryScreen;
