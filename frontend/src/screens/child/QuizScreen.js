/**
 * SmartKids Learning App - Quiz Screen (CORE)
 * Full quiz flow with timer, feedback, and progress tracking
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Animated, Alert, BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import QuizTimer from '../../components/quiz/QuizTimer';
import MultipleChoice from '../../components/quiz/MultipleChoice';
import FillInBlank from '../../components/quiz/FillInBlank';
import ProgressBar from '../../components/common/ProgressBar';
import { quizService } from '../../services/quizService';
import { useAppContext } from '../../context/AppContext';
import { calculateXP, calculateStars, calculateCoins, checkBadges } from '../../utils/adaptive';
import { generateId } from '../../utils/helpers';

const TIMER_DURATION = 60; // seconds per question

const QuizScreen = ({ navigation, route }) => {
  const { subject, grade, topic, topicName, difficulty, count = 10 } = route.params || {};
  const { rewards, addRewards, updateStreak, soundEnabled } = useAppContext();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]); // Track all answers
  const [loading, setLoading] = useState(true);
  const [quizStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeBonus, setTimeBonus] = useState(0);

  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Prevent going back mid-quiz
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    Alert.alert(
      'Quit Quiz?',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        { text: 'Continue Quiz', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
    return true;
  };

  // Load quiz questions
  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const response = await quizService.generateQuiz({
        grade, subject, topic, difficulty, count,
      });
      setQuestions(response.questions || []);
      setTimerRunning(true);
    } catch (error) {
      Alert.alert('Error', 'Could not load quiz. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = useCallback((answer) => {
    if (selectedAnswer !== null) return;

    const timeTaken = (Date.now() - questionStartTime) / 1000;
    const isCorrect = answer === currentQuestion?.correctAnswer ||
      answer?.toLowerCase()?.trim() === currentQuestion?.correctAnswer?.toLowerCase()?.trim();

    // Calculate time bonus (bonus if answered quickly)
    const bonus = timeTaken < 10 ? 3 : timeTaken < 20 ? 2 : 0;
    setTimeBonus(prev => prev + bonus);

    setSelectedAnswer(answer);
    setTimerRunning(false);
    setShowFeedback(true);

    // Record answer
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id || currentIndex,
      question: currentQuestion.question,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeTaken,
    }]);

    // Feedback animation
    Animated.sequence([
      Animated.timing(feedbackAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1500),
    ]).start(() => {
      if (isLastQuestion) {
        finishQuiz();
      } else {
        goToNext();
      }
    });
  }, [currentQuestion, currentIndex, questionStartTime, isLastQuestion]);

  const handleTimeUp = useCallback(() => {
    if (selectedAnswer !== null) return;
    handleAnswer(null); // No answer selected
  }, [selectedAnswer, handleAnswer]);

  const goToNext = () => {
    // Slide out animation
    Animated.timing(slideAnim, {
      toValue: -400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
      setTimerRunning(true);
      feedbackAnim.setValue(0);
      slideAnim.setValue(400);

      // Slide in
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }).start();
    });
  };

  const finishQuiz = async () => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const totalTimeSecs = Math.round((Date.now() - quizStartTime) / 1000);

    const stars = calculateStars(scorePercent, difficulty);
    const coins = calculateCoins(correctCount, difficulty);
    const xp = calculateXP(correctCount, questions.length, difficulty, timeBonus);

    const earnedRewards = { stars, coins, xp };
    await addRewards(earnedRewards);
    await updateStreak();

    // Check for new badges
    const newStats = {
      totalQuizzes: (rewards.totalQuizzes || 0) + 1,
      lastScore: scorePercent,
      streak: 1,
      level: rewards.level,
    };
    const badges = checkBadges(newStats);
    if (badges.length > 0) {
      earnedRewards.badges = badges;
    }

    // Submit to backend
    const resultData = {
      subject, grade, topic, difficulty,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: scorePercent,
      timeTaken: totalTimeSecs,
      answers,
      earnedRewards,
      completedAt: new Date().toISOString(),
      sessionId: generateId(),
    };

    try {
      await quizService.submitResult(resultData);
    } catch (e) {
      // Saved offline
    }

    navigation.replace('Result', {
      score: correctCount,
      total: questions.length,
      scorePercent,
      difficulty,
      subject,
      topic: topicName || topic,
      grade,
      answers,
      earnedRewards,
      timeTaken: totalTimeSecs,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🔄</Text>
        <Text style={styles.loadingText}>Preparing your quiz...</Text>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) return null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient
        colors={subject === 'math' ? ['#3F51B5', '#283593'] : ['#009688', '#00695C']}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBackPress} style={styles.quitBtn}>
            <Text style={styles.quitText}>✕</Text>
          </TouchableOpacity>

          {/* Progress */}
          <View style={styles.progressSection}>
            <Text style={styles.questionCount}>
              {currentIndex + 1} / {questions.length}
            </Text>
            <ProgressBar
              progress={currentIndex + 1}
              total={questions.length}
              color={Colors.star}
              backgroundColor="rgba(255,255,255,0.2)"
              height={8}
              style={{ width: 160 }}
            />
          </View>

          {/* Timer */}
          <QuizTimer
            duration={TIMER_DURATION}
            onTimeUp={handleTimeUp}
            running={timerRunning}
            key={currentIndex} // Reset on new question
          />
        </View>

        {/* Topic Badge */}
        <View style={styles.topicBadge}>
          <Text style={styles.topicBadgeText}>
            {subject === 'math' ? '🔢' : '📚'} {topicName || topic} · {difficulty}
          </Text>
        </View>
      </LinearGradient>

      {/* Question Area */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.questionArea}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>

          {/* Question Number */}
          <View style={styles.qNumRow}>
            <View style={styles.qNumBadge}>
              <Text style={styles.qNumText}>Q{currentIndex + 1}</Text>
            </View>
            <Text style={styles.qType}>{getQuestionTypeLabel(currentQuestion.type)}</Text>
          </View>

          {/* Question Component */}
          {currentQuestion.type === 'multiple_choice' ? (
            <MultipleChoice
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.correctAnswer}
              showFeedback={showFeedback}
              onSelect={handleAnswer}
              disabled={showFeedback}
            />
          ) : currentQuestion.type === 'fill_blank' ? (
            <FillInBlank
              question={currentQuestion.question}
              correctAnswer={currentQuestion.correctAnswer}
              hint={currentQuestion.hint}
              showFeedback={showFeedback}
              isCorrect={selectedAnswer?.toLowerCase()?.trim() === currentQuestion.correctAnswer?.toLowerCase()?.trim()}
              onSubmit={handleAnswer}
              disabled={showFeedback}
            />
          ) : (
            <MultipleChoice
              question={currentQuestion.question}
              options={currentQuestion.options || ['True', 'False']}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.correctAnswer}
              showFeedback={showFeedback}
              onSelect={handleAnswer}
              disabled={showFeedback}
            />
          )}

          {/* Explanation on feedback */}
          {showFeedback && currentQuestion.explanation && (
            <Animated.View style={[styles.explanation, { opacity: feedbackAnim }]}>
              <Text style={styles.explanationTitle}>💡 Explanation</Text>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </Animated.View>
          )}

        </Animated.View>
      </ScrollView>

      {/* Score tracking bar */}
      <View style={styles.scoreBar}>
        {answers.map((a, i) => (
          <View
            key={i}
            style={[
              styles.scoreDot,
              a.isCorrect ? styles.scoreDotCorrect : styles.scoreDotWrong,
            ]}
          />
        ))}
        {Array.from({ length: questions.length - answers.length }).map((_, i) => (
          <View key={`empty_${i}`} style={styles.scoreDotEmpty} />
        ))}
      </View>
    </SafeAreaView>
  );
};

const getQuestionTypeLabel = (type) => {
  switch (type) {
    case 'multiple_choice': return 'Multiple Choice';
    case 'fill_blank': return 'Fill in the Blank';
    case 'true_false': return 'True or False';
    default: return 'Question';
  }
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  loadingEmoji: { fontSize: 60, marginBottom: 16 },
  loadingText: { fontSize: 18, color: Colors.textSecondary, fontWeight: '600' },
  header: { padding: 20, paddingTop: 50 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  quitBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  quitText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  progressSection: { alignItems: 'center', gap: 6 },
  questionCount: { fontSize: 14, fontWeight: '700', color: Colors.white },
  topicBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'center',
    marginTop: 6,
  },
  topicBadgeText: { fontSize: 13, color: Colors.white, fontWeight: '600', textTransform: 'capitalize' },
  scrollView: { flex: 1 },
  questionArea: { padding: 20, paddingBottom: 20 },
  qNumRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  qNumBadge: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 4, paddingHorizontal: 12,
  },
  qNumText: { fontSize: 14, fontWeight: '800', color: Colors.white },
  qType: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  explanation: {
    backgroundColor: '#FFF9C4',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F9A825',
  },
  explanationTitle: { fontSize: 15, fontWeight: '800', color: '#F57F17', marginBottom: 6 },
  explanationText: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  scoreBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 6,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexWrap: 'wrap',
  },
  scoreDot: { width: 12, height: 12, borderRadius: 6 },
  scoreDotCorrect: { backgroundColor: Colors.correct },
  scoreDotWrong: { backgroundColor: Colors.wrong },
  scoreDotEmpty: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border },
});

export default QuizScreen;
