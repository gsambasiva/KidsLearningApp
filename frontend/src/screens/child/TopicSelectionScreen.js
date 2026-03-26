/**
 * SmartKids Learning App - Topic Selection Screen
 */

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { getDifficultyColor, getGradeName } from '../../utils/helpers';

const MATH_TOPICS = {
  K: [
    { id: 'counting', name: 'Counting', emoji: '🔢', desc: 'Count 1 to 20' },
    { id: 'shapes', name: 'Shapes', emoji: '🔷', desc: 'Basic shapes' },
    { id: 'compare', name: 'Compare Numbers', emoji: '⚖️', desc: 'More or less?' },
  ],
  1: [
    { id: 'addition', name: 'Addition', emoji: '➕', desc: 'Add numbers up to 20' },
    { id: 'subtraction', name: 'Subtraction', emoji: '➖', desc: 'Subtract numbers' },
    { id: 'place_value', name: 'Place Value', emoji: '📊', desc: 'Tens and ones' },
  ],
  2: [
    { id: 'addition_adv', name: 'Addition', emoji: '➕', desc: 'Add up to 100' },
    { id: 'subtraction_adv', name: 'Subtraction', emoji: '➖', desc: 'Subtract up to 100' },
    { id: 'measurement', name: 'Measurement', emoji: '📏', desc: 'Length & time' },
  ],
  3: [
    { id: 'multiplication', name: 'Multiplication', emoji: '✖️', desc: 'Times tables' },
    { id: 'division', name: 'Division', emoji: '➗', desc: 'Divide numbers' },
    { id: 'word_problems', name: 'Word Problems', emoji: '📝', desc: 'Math in stories' },
  ],
  4: [
    { id: 'fractions', name: 'Fractions', emoji: '½', desc: 'Parts of a whole' },
    { id: 'decimals', name: 'Decimals', emoji: '.5', desc: 'Decimal numbers' },
    { id: 'geometry', name: 'Geometry', emoji: '📐', desc: 'Angles & shapes' },
  ],
  5: [
    { id: 'fractions_adv', name: 'Advanced Fractions', emoji: '🔢', desc: 'Mixed numbers' },
    { id: 'percentages', name: 'Percentages', emoji: '%', desc: 'Parts of 100' },
    { id: 'word_problems_adv', name: 'Complex Problems', emoji: '🧩', desc: 'Multi-step problems' },
  ],
};

const READING_TOPICS = {
  K: [
    { id: 'phonics', name: 'Phonics', emoji: '🔤', desc: 'Letter sounds' },
    { id: 'sight_words', name: 'Sight Words', emoji: '👁', desc: 'Common words' },
  ],
  1: [
    { id: 'stories_1', name: 'Short Stories', emoji: '📖', desc: 'Simple reading' },
    { id: 'vocabulary_1', name: 'Vocabulary', emoji: '📘', desc: 'New words' },
  ],
  2: [
    { id: 'comprehension_2', name: 'Comprehension', emoji: '💭', desc: 'Understanding text' },
    { id: 'vocabulary_2', name: 'Vocabulary', emoji: '📘', desc: 'Word meanings' },
  ],
  3: [
    { id: 'stories_3', name: 'Chapter Stories', emoji: '📚', desc: 'Longer reading' },
    { id: 'main_idea', name: 'Main Idea', emoji: '💡', desc: 'Key message' },
  ],
  4: [
    { id: 'inference', name: 'Inference', emoji: '🔍', desc: 'Read between lines' },
    { id: 'summarize', name: 'Summarizing', emoji: '📋', desc: 'Key points' },
  ],
  5: [
    { id: 'analysis', name: 'Text Analysis', emoji: '🧠', desc: 'Deep reading' },
    { id: 'poetry', name: 'Poetry', emoji: '🎭', desc: 'Poems & verse' },
  ],
};

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', emoji: '🟢', color: Colors.correct },
  { id: 'medium', label: 'Medium', emoji: '🟡', color: Colors.warning },
  { id: 'hard', label: 'Hard', emoji: '🔴', color: Colors.wrong },
];

const TopicSelectionScreen = ({ navigation, route }) => {
  const { subject: rawSubject, grade } = route.params || {};

  // Normalise: subject may arrive as a string ('math') or a legacy object ({id:'math',...})
  const subject = (rawSubject && typeof rawSubject === 'object')
    ? (rawSubject.id || 'math')
    : (rawSubject || 'math');

  const topics = subject === 'math'
    ? (MATH_TOPICS[grade] || MATH_TOPICS['3'])
    : (READING_TOPICS[grade] || READING_TOPICS['3']);

  const [selectedTopic, setSelectedTopic] = React.useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('medium');

  const handleStart = () => {
    if (!selectedTopic) return;

    // ── Reading topics → Reading Module ──────────────────────────────────────
    if (subject === 'reading') {
      navigation.navigate('ReadingStories', {
        grade,
        topic: selectedTopic.id,
        subject: 'reading',
      });
      return;
    }

    // ── Math/other topics → Quiz Screen ──────────────────────────────────────
    navigation.navigate('Quiz', {
      subject,
      grade,
      topic: selectedTopic.id,
      topicName: selectedTopic.name,
      difficulty: selectedDifficulty,
      count: 10,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={subject === 'math' ? ['#3F51B5', '#283593'] : ['#009688', '#00695C']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose a Topic</Text>
        <Text style={styles.headerSubtitle}>
          {getGradeName(grade)} · {subject === 'math' ? '🔢 Math' : '📚 Reading'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Topic Grid */}
        <Text style={styles.sectionTitle}>📖 Select Topic</Text>
        <View style={styles.topicGrid}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[styles.topicCard, selectedTopic?.id === topic.id && styles.topicCardSelected]}
              onPress={() => setSelectedTopic(topic)}
              activeOpacity={0.85}
            >
              <Text style={styles.topicEmoji}>{topic.emoji}</Text>
              <Text style={styles.topicName}>{topic.name}</Text>
              <Text style={styles.topicDesc}>{topic.desc}</Text>
              {selectedTopic?.id === topic.id && (
                <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty */}
        <Text style={styles.sectionTitle}>⚡ Select Difficulty</Text>
        <View style={styles.difficultyRow}>
          {DIFFICULTIES.map((diff) => (
            <TouchableOpacity
              key={diff.id}
              style={[
                styles.diffBtn,
                selectedDifficulty === diff.id && { backgroundColor: diff.color, borderColor: diff.color },
              ]}
              onPress={() => setSelectedDifficulty(diff.id)}
            >
              <Text style={styles.diffEmoji}>{diff.emoji}</Text>
              <Text style={[
                styles.diffLabel,
                selectedDifficulty === diff.id && styles.diffLabelSelected,
              ]}>
                {diff.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startBtn, !selectedTopic && styles.startBtnDisabled]}
          onPress={handleStart}
          disabled={!selectedTopic}
        >
          <Text style={styles.startBtnText}>
            {selectedTopic ? `Start Quiz! 🚀` : 'Select a topic first'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingBottom: 28 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12, marginTop: 8 },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  topicCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  topicCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  topicEmoji: { fontSize: 32, marginBottom: 8 },
  topicName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  topicDesc: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  checkmark: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Colors.primary, borderRadius: 12,
    width: 22, height: 22, alignItems: 'center', justifyContent: 'center',
  },
  checkmarkText: { color: Colors.white, fontSize: 12, fontWeight: '800' },
  difficultyRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  diffBtn: {
    flex: 1, alignItems: 'center', borderRadius: 16, paddingVertical: 12,
    borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  diffEmoji: { fontSize: 22, marginBottom: 4 },
  diffLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  diffLabelSelected: { color: Colors.white },
  startBtn: {
    backgroundColor: Colors.primary, borderRadius: 28,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  startBtnDisabled: { backgroundColor: Colors.border },
  startBtnText: { fontSize: 20, fontWeight: '800', color: Colors.white },
});

export default TopicSelectionScreen;
