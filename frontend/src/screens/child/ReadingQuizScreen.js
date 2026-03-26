/**
 * SmartKids — Reading Comprehension Quiz Screen
 * Handles MCQ, True/False, and Fill-in-blank question types.
 * Shows instant feedback with explanation, tracks progress, awards XP.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Animated, Alert, BackHandler, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
// ProgressBar is rendered inline in the quiz header below
import { useAppContext } from '../../context/AppContext';
import { calculateXP, calculateStars, calculateCoins, checkBadges } from '../../utils/adaptive';
import { generateId } from '../../utils/helpers';
import { saveStoryResult } from '../../services/readingService';

// ─── MCQ / True-False Component ───────────────────────────────────────────────
const MCQQuestion = ({ question, options, selectedAnswer, correctAnswer, showFeedback, onSelect, disabled }) => (
  <View>
    <Text style={styles.questionText}>{question}</Text>
    <View style={styles.optionsContainer}>
      {options.map((option, i) => {
        let optStyle = styles.optionBtn;
        let textStyle = styles.optionText;
        if (showFeedback) {
          if (option === correctAnswer) {
            optStyle = [styles.optionBtn, styles.optionCorrect];
            textStyle = [styles.optionText, styles.optionTextSelected];
          } else if (option === selectedAnswer && option !== correctAnswer) {
            optStyle = [styles.optionBtn, styles.optionWrong];
            textStyle = [styles.optionText, styles.optionTextSelected];
          }
        } else if (option === selectedAnswer) {
          optStyle = [styles.optionBtn, styles.optionSelected];
          textStyle = [styles.optionText, styles.optionTextSelected];
        }
        return (
          <TouchableOpacity
            key={i}
            style={optStyle}
            onPress={() => !disabled && onSelect(option)}
            activeOpacity={disabled ? 1 : 0.8}
          >
            <View style={styles.optionLabel}>
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text>
            </View>
            <Text style={textStyle}>{option}</Text>
            {showFeedback && option === correctAnswer && (
              <Text style={styles.optionIcon}>✅</Text>
            )}
            {showFeedback && option === selectedAnswer && option !== correctAnswer && (
              <Text style={styles.optionIcon}>❌</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// ─── Fill-in-blank Component ──────────────────────────────────────────────────
const FillBlankQuestion = ({ question, correctAnswer, showFeedback, isCorrect, onSubmit, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(input.trim());
  };

  const isAnswered = showFeedback;

  return (
    <View>
      <Text style={styles.questionText}>{question}</Text>
      <View style={[
        styles.fillInputWrapper,
        isAnswered && (isCorrect ? styles.fillInputCorrect : styles.fillInputWrong),
      ]}>
        <TextInput
          style={styles.fillInput}
          placeholder="Type your answer here..."
          placeholderTextColor={Colors.textLight}
          value={isAnswered ? (isCorrect ? input : `${input}`) : input}
          onChangeText={setInput}
          editable={!disabled}
          onSubmitEditing={!disabled ? handleSubmit : undefined}
          returnKeyType="done"
          autoCapitalize="none"
        />
        {isAnswered && (
          <Text style={styles.fillFeedbackIcon}>{isCorrect ? '✅' : '❌'}</Text>
        )}
      </View>
      {isAnswered && !isCorrect && (
        <View style={styles.correctAnswerBox}>
          <Text style={styles.correctAnswerLabel}>✅ Correct answer: </Text>
          <Text style={styles.correctAnswerValue}>{correctAnswer}</Text>
        </View>
      )}
      {!disabled && !isAnswered && (
        <TouchableOpacity
          style={[styles.submitBtn, !input.trim() && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!input.trim()}
        >
          <Text style={styles.submitBtnText}>Submit Answer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Main Quiz Screen ─────────────────────────────────────────────────────────
const ReadingQuizScreen = ({ navigation, route }) => {
  const { story, grade = 'K' } = route.params || {};
  const { rewards, addRewards, updateStreak } = useAppContext();

  const questions = story?.questions || [];

  const [currentIndex,    setCurrentIndex]    = useState(0);
  const [selectedAnswer,  setSelectedAnswer]  = useState(null);
  const [showFeedback,    setShowFeedback]     = useState(false);
  const [answers,         setAnswers]          = useState([]);
  const [quizStartTime]                        = useState(Date.now());

  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(0)).current;

  // Prevent hardware back during quiz
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => handler.remove();
  }, []);

  const handleBack = () => {
    Alert.alert(
      'Quit Quiz?',
      'Your progress will be lost.',
      [
        { text: 'Continue Quiz', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
    return true;
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion  = currentIndex === questions.length - 1;
  const totalQuestions  = questions.length;

  const handleAnswer = useCallback((answer) => {
    if (selectedAnswer !== null) return;

    const q = currentQuestion;
    const correct = q.answer || q.correctAnswer;
    const isCorrect =
      answer?.toLowerCase()?.trim() === correct?.toLowerCase()?.trim();

    setSelectedAnswer(answer);
    setShowFeedback(true);

    setAnswers((prev) => [
      ...prev,
      {
        questionId: q.id || currentIndex,
        question: q.question,
        type: q.type,
        selectedAnswer: answer,
        correctAnswer: correct,
        isCorrect,
      },
    ]);

    Animated.sequence([
      Animated.timing(feedbackAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
    ]).start(() => {
      if (isLastQuestion) {
        finishQuiz([...answers, { isCorrect }]);
      } else {
        goToNext();
      }
    });
  }, [currentQuestion, currentIndex, answers, isLastQuestion]);

  const goToNext = () => {
    Animated.timing(slideAnim, { toValue: -400, duration: 220, useNativeDriver: true }).start(() => {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      feedbackAnim.setValue(0);
      slideAnim.setValue(400);
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 80, useNativeDriver: true }).start();
    });
  };

  const finishQuiz = async (allAnswers) => {
    const correctCount  = allAnswers.filter((a) => a.isCorrect).length;
    const scorePercent  = Math.round((correctCount / totalQuestions) * 100);
    const timeTaken     = Math.round((Date.now() - quizStartTime) / 1000);
    const difficulty    = story.difficulty || 'easy';

    const stars  = calculateStars(scorePercent, difficulty);
    const coins  = calculateCoins(correctCount, difficulty);
    const xp     = calculateXP(correctCount, totalQuestions, difficulty, 0);
    const earnedRewards = { stars, coins, xp };

    await addRewards(earnedRewards);
    await updateStreak();

    const newStats = {
      totalQuizzes: 1,          // simplified — sufficient for badge checks
      lastScore: scorePercent,
      streak: 1,
      level: rewards?.level || 1,
    };
    const badges = checkBadges(newStats);
    if (badges.length > 0) earnedRewards.badges = badges;

    // Save to local storage
    await saveStoryResult(story.id, grade, {
      scorePercent,
      correctCount,
      totalQuestions,
      timeTaken,
      answers: allAnswers,
    });

    navigation.replace('Result', {
      score: correctCount,
      total: totalQuestions,
      scorePercent,
      difficulty,
      subject: 'reading',
      topic: story.title,
      grade,
      answers: allAnswers,
      earnedRewards,
      timeTaken,
      sessionId: generateId(),
    });
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>📭</Text>
        <Text style={styles.errorTitle}>No questions available</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const q = currentQuestion;
  const correct = q?.answer || q?.correctAnswer;
  const isFillBlankCorrect = selectedAnswer?.toLowerCase()?.trim() === correct?.toLowerCase()?.trim();

  const getQuestionTypeLabel = (type) => {
    if (type === 'mcq')        return '🔵 Multiple Choice';
    if (type === 'true_false') return '✅ True or False';
    if (type === 'fill_blank') return '✏️ Fill in the Blank';
    return '❓ Question';
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <LinearGradient colors={['#009688', '#00695C']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack} style={styles.quitBtn}>
              <Text style={styles.quitText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.progressLabel}>{currentIndex + 1} / {totalQuestions}</Text>
              {/* Inline progress bar — avoids style-prop width issues */}
              <View style={styles.inlineProgressBg}>
                <View
                  style={[
                    styles.inlineProgressFill,
                    { width: `${Math.round(((currentIndex + 1) / totalQuestions) * 100)}%` },
                  ]}
                />
              </View>
            </View>
            <View style={styles.scoreMini}>
              <Text style={styles.scoreMiniText}>
                ✅ {answers.filter((a) => a.isCorrect).length}
              </Text>
            </View>
          </View>
          <View style={styles.storyBadge}>
            <Text style={styles.storyBadgeText} numberOfLines={1}>
              📚 {story?.title || 'Reading Quiz'}
            </Text>
          </View>
        </LinearGradient>

        {/* Score dots */}
        <View style={styles.scoreBar}>
          {answers.map((a, i) => (
            <View
              key={i}
              style={[styles.scoreDot, a.isCorrect ? styles.dotCorrect : styles.dotWrong]}
            />
          ))}
          {Array.from({ length: totalQuestions - answers.length }).map((_, i) => (
            <View key={`e${i}`} style={styles.dotEmpty} />
          ))}
        </View>

        {/* Question Area */}
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>

            {/* Q badge + type */}
            <View style={styles.qRow}>
              <View style={styles.qBadge}>
                <Text style={styles.qBadgeText}>Q{currentIndex + 1}</Text>
              </View>
              <Text style={styles.qTypeLabel}>{getQuestionTypeLabel(q?.type)}</Text>
            </View>

            {/* Question component */}
            {(q?.type === 'mcq' || q?.type === 'true_false') && (
              <MCQQuestion
                question={q.question}
                options={q.options || (q.type === 'true_false' ? ['True', 'False'] : [])}
                selectedAnswer={selectedAnswer}
                correctAnswer={correct}
                showFeedback={showFeedback}
                onSelect={handleAnswer}
                disabled={showFeedback}
              />
            )}

            {q?.type === 'fill_blank' && (
              <FillBlankQuestion
                question={q.question}
                correctAnswer={correct}
                showFeedback={showFeedback}
                isCorrect={isFillBlankCorrect}
                onSubmit={handleAnswer}
                disabled={showFeedback}
              />
            )}

            {/* Explanation */}
            {showFeedback && q?.explanation && (
              <Animated.View style={[styles.explanationBox, { opacity: feedbackAnim }]}>
                <Text style={styles.explanationTitle}>💡 Explanation</Text>
                <Text style={styles.explanationText}>{q.explanation}</Text>
              </Animated.View>
            )}

            {/* Feedback banner */}
            {showFeedback && (
              <Animated.View
                style={[
                  styles.feedbackBanner,
                  selectedAnswer !== null && (
                    (q?.type === 'fill_blank' ? isFillBlankCorrect : selectedAnswer === correct)
                      ? styles.feedbackCorrect
                      : styles.feedbackWrong
                  ),
                  { opacity: feedbackAnim },
                ]}
              >
                <Text style={styles.feedbackText}>
                  {(() => {
                    const ans = q?.type === 'fill_blank' ? isFillBlankCorrect : selectedAnswer === correct;
                    return ans
                      ? '🎉 Correct! Well done!'
                      : selectedAnswer === null
                        ? '⏰ Time\'s up!'
                        : '❌ Not quite — check the explanation above.';
                  })()}
                </Text>
              </Animated.View>
            )}

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorEmoji: { fontSize: 56, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  backLink:   { marginTop: 8 },
  backLinkText: { fontSize: 16, color: Colors.primary, fontWeight: '600' },

  // Header
  header:       { paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12 },
  headerRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  quitBtn:      { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  quitText:     { fontSize: 16, fontWeight: '700', color: Colors.white },
  headerCenter: { alignItems: 'center', gap: 5 },
  progressLabel: { fontSize: 13, fontWeight: '700', color: Colors.white },
  inlineProgressBg: { width: 160, height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' },
  inlineProgressFill: { height: '100%', backgroundColor: Colors.star, borderRadius: 4 },
  scoreMini:    { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  scoreMiniText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  storyBadge:   { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, paddingVertical: 5, paddingHorizontal: 14, alignSelf: 'center' },
  storyBadgeText: { fontSize: 13, color: Colors.white, fontWeight: '600' },

  // Score bar
  scoreBar:   { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', paddingVertical: 10, paddingHorizontal: 16, gap: 5, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  scoreDot:   { width: 12, height: 12, borderRadius: 6 },
  dotCorrect: { backgroundColor: Colors.correct },
  dotWrong:   { backgroundColor: Colors.wrong },
  dotEmpty:   { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border },

  // Scroll
  scroll:        { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Q badge
  qRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  qBadge:    { backgroundColor: Colors.reading, borderRadius: 10, paddingVertical: 4, paddingHorizontal: 12 },
  qBadgeText:{ fontSize: 13, fontWeight: '800', color: Colors.white },
  qTypeLabel:{ fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },

  // Question text
  questionText: {
    fontSize: 18, fontWeight: '700', color: Colors.textPrimary, lineHeight: 26,
    marginBottom: 18, backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },

  // MCQ options
  optionsContainer: { gap: 10, marginBottom: 8 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    borderWidth: 2, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  optionSelected: { borderColor: Colors.accent, backgroundColor: '#E3F2FD' },
  optionCorrect:  { borderColor: Colors.correct, backgroundColor: '#E8F5E9' },
  optionWrong:    { borderColor: Colors.wrong,   backgroundColor: '#FFEBEE' },
  optionLabel:    { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  optionLetter:   { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
  optionText:     { flex: 1, fontSize: 16, color: Colors.textPrimary, fontWeight: '600', lineHeight: 22 },
  optionTextSelected: { color: Colors.textPrimary },
  optionIcon:     { fontSize: 20 },

  // Fill in blank
  fillInputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.border, borderRadius: 16,
    backgroundColor: Colors.white, paddingHorizontal: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4,
  },
  fillInputCorrect: { borderColor: Colors.correct, backgroundColor: '#E8F5E9' },
  fillInputWrong:   { borderColor: Colors.wrong,   backgroundColor: '#FFEBEE' },
  fillInput:    { flex: 1, fontSize: 17, color: Colors.textPrimary, paddingVertical: 14 },
  fillFeedbackIcon: { fontSize: 22 },
  correctAnswerBox: {
    flexDirection: 'row', backgroundColor: '#E8F5E9', borderRadius: 12,
    padding: 12, marginBottom: 10, alignItems: 'center',
  },
  correctAnswerLabel: { fontSize: 14, color: Colors.correct, fontWeight: '700' },
  correctAnswerValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '800' },
  submitBtn: {
    backgroundColor: Colors.reading, borderRadius: 20, paddingVertical: 14, alignItems: 'center',
    shadowColor: Colors.reading, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    marginBottom: 8,
  },
  submitBtnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0 },
  submitBtnText:     { fontSize: 17, fontWeight: '800', color: Colors.white },

  // Explanation
  explanationBox: {
    backgroundColor: '#FFF9C4', borderRadius: 16, padding: 16, marginTop: 12,
    borderLeftWidth: 4, borderLeftColor: '#F9A825',
  },
  explanationTitle: { fontSize: 15, fontWeight: '800', color: '#F57F17', marginBottom: 6 },
  explanationText:  { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },

  // Feedback banner
  feedbackBanner: { borderRadius: 16, padding: 16, marginTop: 10, alignItems: 'center' },
  feedbackCorrect: { backgroundColor: '#E8F5E9' },
  feedbackWrong:   { backgroundColor: '#FFEBEE' },
  feedbackText:    { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
});

export default ReadingQuizScreen;
