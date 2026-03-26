/**
 * SmartKids — Lesson Screen
 * Animated interactive lesson player. Uses code-based animations (no video/no reanimated).
 * Features:
 *  - Slide-based lesson with RN Animated transitions
 *  - Animated scenes per topic (math + reading)
 *  - TTS narration (expo-speech with silent fallback)
 *  - Interactive examples
 *  - Progress indicator
 *  - "Start Quiz" on completion
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
  Animated, Easing, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { getLessonForTopic } from '../../data/lessonContent';
import { AnimationScene, InteractiveExample } from '../../components/animations/MathAnimationScene';
import { StarsBurst, CorrectFlash, CelebrationBanner } from '../../components/animations/CelebrationEffect';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── TTS helper (silent fallback if expo-speech not installed) ────────────────
let Speech = null;
try { Speech = require('expo-speech'); } catch (_) {}

const speak = (text) => {
  try {
    if (Speech && Speech.speak) {
      Speech.stop();
      Speech.speak(text, { rate: 0.85, pitch: 1.1, language: 'en-US' });
    }
  } catch (_) {}
};

const stopSpeech = () => {
  try { if (Speech && Speech.stop) Speech.stop(); } catch (_) {}
};

// ─── Slide Progress Bar ───────────────────────────────────────────────────────
const SlideProgress = ({ current, total, color }) => (
  <View style={styles.progressRow}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.progressDot,
          i <= current && { backgroundColor: color, width: i === current ? 20 : 10 },
        ]}
      />
    ))}
  </View>
);

// ─── Slide Card ───────────────────────────────────────────────────────────────
const SlideCard = ({ slide, color, onInteract, isCurrent }) => {
  const [interacted, setInteracted] = useState(false);

  const handleInteract = useCallback((success) => {
    setInteracted(true);
    if (onInteract) onInteract(success);
  }, [onInteract]);

  return (
    <View style={styles.slideCard}>
      {/* Slide title */}
      <View style={[styles.slideTitleBar, { backgroundColor: color + '22' }]}>
        <Text style={[styles.slideTitle, { color }]}>{slide.title}</Text>
      </View>

      {/* Animation viewport */}
      <View style={styles.animationViewport}>
        <AnimationScene slide={slide} onInteract={handleInteract} />
      </View>

      {/* Tip badge */}
      {!!slide.tip && (
        <View style={[styles.tipBadge, { borderColor: color }]}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={[styles.tipText, { color }]}>{slide.tip}</Text>
        </View>
      )}

      {/* Interaction success */}
      {interacted && (
        <View style={styles.interactedBadge}>
          <Text style={styles.interactedText}>✅ Nice work!</Text>
        </View>
      )}
    </View>
  );
};

// ─── Interactive Example Card ─────────────────────────────────────────────────
const ExampleCard = ({ example, index, onComplete }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = (success) => {
    if (!completed) {
      setCompleted(true);
      if (onComplete) onComplete(index, success);
    }
  };

  return (
    <View style={[styles.exampleCard, completed && styles.exampleCardDone]}>
      <View style={styles.exampleHeader}>
        <Text style={styles.exampleBadge}>Example {index + 1}</Text>
        {completed && <Text style={styles.exampleDoneTag}>✅ Done!</Text>}
      </View>
      <Text style={styles.exampleQuestion}>{example.question}</Text>
      {!!example.hint && !completed && (
        <Text style={styles.exampleHint}>💡 {example.hint}</Text>
      )}
      <View style={styles.exampleSceneContainer}>
        <InteractiveExample example={example} onComplete={handleComplete} />
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const LessonScreen = ({ navigation, route }) => {
  const { topic, subject, grade, topicName, difficulty } = route.params || {};

  const lesson = getLessonForTopic(topic) || getLessonForTopic(subject === 'reading' ? 'phonics' : 'counting');

  const slides = lesson?.slides || [];
  const examples = lesson?.interactiveExamples || [];
  const color = lesson?.color || Colors.primary;

  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'slides' | 'examples' | 'complete'
  const [completedExamples, setCompletedExamples] = useState(0);
  const [narrating, setNarrating] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const starsRef = useRef(null);
  const correctFlashRef = useRef(null);
  const autoTimer = useRef(null);

  const currentSlide = slides[slideIndex];

  // Clean up speech & timer on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, []);

  // Auto-narrate when slide changes
  useEffect(() => {
    if (phase === 'slides' && currentSlide?.narration) {
      speak(currentSlide.narration);
    }
  }, [slideIndex, phase]);

  // Animate slide entrance
  const animateSlide = useCallback((direction = 1) => {
    slideAnim.setValue(SCREEN_W * direction);
    Animated.spring(slideAnim, {
      toValue: 0, friction: 8, tension: 60, useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // Start lesson
  const handleStart = () => {
    setPhase('slides');
    setSlideIndex(0);
    animateSlide(1);
  };

  // Next slide
  const handleNext = () => {
    const nextIdx = slideIndex + 1;
    if (nextIdx < slides.length) {
      animateSlide(1);
      setSlideIndex(nextIdx);
    } else {
      // Move to interactive examples
      stopSpeech();
      setPhase('examples');
    }
  };

  // Previous slide
  const handlePrev = () => {
    if (slideIndex > 0) {
      animateSlide(-1);
      setSlideIndex(slideIndex - 1);
    }
  };

  // Handle narrate button
  const handleNarrate = () => {
    if (currentSlide?.narration) {
      setNarrating(true);
      speak(currentSlide.narration);
      setTimeout(() => setNarrating(false), 3000);
    }
  };

  // Example completed
  const handleExampleComplete = (idx, success) => {
    const newCount = completedExamples + 1;
    setCompletedExamples(newCount);
    if (correctFlashRef.current) correctFlashRef.current.flash();
    if (starsRef.current) starsRef.current.burst(SCREEN_W / 2, 200);
    if (newCount >= examples.length) {
      setTimeout(() => {
        setPhase('complete');
        setCelebrationVisible(true);
      }, 800);
    }
  };

  // Skip examples (if no examples)
  const handleSkipToComplete = () => {
    stopSpeech();
    setPhase('complete');
    setCelebrationVisible(true);
  };

  // Start quiz
  const handleStartQuiz = () => {
    stopSpeech();
    if (subject === 'reading') {
      navigation.navigate('ReadingStories', { grade, topic, subject });
    } else {
      navigation.navigate('Quiz', {
        subject,
        grade,
        topic,
        topicName: topicName || lesson?.title,
        difficulty: difficulty || 'medium',
        count: 10,
      });
    }
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={styles.errorEmoji}>📚</Text>
          <Text style={styles.errorTitle}>Lesson coming soon!</Text>
          <TouchableOpacity style={styles.errorBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.errorBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient colors={[color, shadeColor(color, -25)]} style={styles.header}>
        <TouchableOpacity onPress={() => { stopSpeech(); navigation.goBack(); }} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>{lesson.emoji}</Text>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{lesson.title}</Text>
            <Text style={styles.headerSub}>
              {subject === 'reading' ? '📚 Reading' : '🔢 Math'} · Grade {grade}
            </Text>
          </View>
        </View>

        {/* Slide progress dots */}
        {phase === 'slides' && (
          <SlideProgress current={slideIndex} total={slides.length} color="#fff" />
        )}
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── INTRO PHASE ─────────────────────────────────────────────────── */}
        {phase === 'intro' && (
          <View style={styles.introContainer}>
            <Text style={styles.introEmoji}>{lesson.emoji}</Text>
            <Text style={styles.introTitle}>{lesson.title}</Text>
            <Text style={styles.introDesc}>
              Get ready for an animated lesson with {slides.length} slides
              {examples.length > 0 ? ` and ${examples.length} interactive examples` : ''}!
            </Text>

            {/* Preview chips */}
            <View style={styles.introChips}>
              <View style={[styles.chip, { backgroundColor: color + '22' }]}>
                <Text style={styles.chipText}>🎬 {slides.length} Slides</Text>
              </View>
              {examples.length > 0 && (
                <View style={[styles.chip, { backgroundColor: color + '22' }]}>
                  <Text style={styles.chipText}>🎮 {examples.length} Activities</Text>
                </View>
              )}
              <View style={[styles.chip, { backgroundColor: color + '22' }]}>
                <Text style={styles.chipText}>🔊 Narrated</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: color }]}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Text style={styles.startBtnText}>▶️ Start Lesson!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipBtn}
              onPress={handleStartQuiz}
            >
              <Text style={styles.skipBtnText}>Skip to Quiz ➡️</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── SLIDES PHASE ─────────────────────────────────────────────────── */}
        {phase === 'slides' && currentSlide && (
          <View>
            {/* Slide progress text */}
            <View style={styles.slideProgressRow}>
              <Text style={styles.slideProgressText}>
                Slide {slideIndex + 1} of {slides.length}
              </Text>
              <TouchableOpacity onPress={handleNarrate} style={[styles.narrateBtn, narrating && styles.narrateBtnActive]}>
                <Text style={styles.narrateIcon}>🔊</Text>
                <Text style={styles.narrateBtnText}>{narrating ? 'Speaking...' : 'Read aloud'}</Text>
              </TouchableOpacity>
            </View>

            {/* Animated slide */}
            <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
              <SlideCard
                slide={currentSlide}
                color={color}
                onInteract={() => {}}
                isCurrent
              />
            </Animated.View>

            {/* Narration text */}
            <View style={styles.narrationCard}>
              <Text style={styles.narrationText}>{currentSlide.narration}</Text>
            </View>

            {/* Navigation buttons */}
            <View style={styles.navRow}>
              <TouchableOpacity
                style={[styles.navBtn, styles.navBtnSecondary, slideIndex === 0 && styles.navBtnDisabled]}
                onPress={handlePrev}
                disabled={slideIndex === 0}
                activeOpacity={0.8}
              >
                <Text style={styles.navBtnText}>‹ Prev</Text>
              </TouchableOpacity>

              <Text style={styles.navCounter}>{slideIndex + 1}/{slides.length}</Text>

              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: color }]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.navBtnTextPrimary}>
                  {slideIndex < slides.length - 1 ? 'Next ›' : examples.length > 0 ? 'Try it! 🎮' : 'Finish! 🎉'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── EXAMPLES PHASE ───────────────────────────────────────────────── */}
        {phase === 'examples' && (
          <View>
            <View style={styles.examplesHeader}>
              <Text style={styles.examplesTitle}>🎮 Now let's practice!</Text>
              <Text style={styles.examplesSub}>
                Complete {examples.length} interactive activities
              </Text>
            </View>

            {examples.map((ex, i) => (
              <ExampleCard
                key={ex.id}
                example={ex}
                index={i}
                onComplete={handleExampleComplete}
              />
            ))}

            <TouchableOpacity style={styles.skipBtn} onPress={handleSkipToComplete}>
              <Text style={styles.skipBtnText}>Skip to finish ➡️</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── COMPLETE PHASE ───────────────────────────────────────────────── */}
        {phase === 'complete' && (
          <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>🏆</Text>
            <Text style={styles.completeTitle}>Lesson Complete!</Text>
            <Text style={styles.completeSub}>
              Amazing work! You finished the "{lesson.title}" lesson.
            </Text>

            <View style={styles.starsRow}>
              {[0, 1, 2].map((i) => (
                <Text key={i} style={styles.completeStar}>⭐</Text>
              ))}
            </View>

            <View style={styles.completeStats}>
              <View style={styles.completeStat}>
                <Text style={styles.completeStatNum}>{slides.length}</Text>
                <Text style={styles.completeStatLabel}>Slides</Text>
              </View>
              <View style={[styles.completeStat, { backgroundColor: color + '22' }]}>
                <Text style={[styles.completeStatNum, { color }]}>{examples.length}</Text>
                <Text style={styles.completeStatLabel}>Activities</Text>
              </View>
              <View style={styles.completeStat}>
                <Text style={styles.completeStatNum}>100%</Text>
                <Text style={styles.completeStatLabel}>Done!</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.quizBtn, { backgroundColor: color }]}
              onPress={handleStartQuiz}
              activeOpacity={0.85}
            >
              <Text style={styles.quizBtnText}>🚀 Start the Quiz!</Text>
              <Text style={styles.quizBtnSub}>Test what you learned</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.replayBtn} onPress={handleStart}>
              <Text style={styles.replayBtnText}>🔄 Replay Lesson</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Celebration overlays */}
      <StarsBurst ref={starsRef} />
      <CorrectFlash ref={correctFlashRef} />
      <CelebrationBanner
        visible={celebrationVisible}
        message="🎉 Lesson Complete!"
        subText="Great learning today!"
      />
    </SafeAreaView>
  );
};

// ─── Color utility ────────────────────────────────────────────────────────────
function shadeColor(hex, pct) {
  try {
    const num = parseInt((hex || '#3F51B5').replace('#', ''), 16);
    const amt = Math.round(2.55 * pct);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
    return '#' + ((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1);
  } catch { return '#283593'; }
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 18 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerEmoji: { fontSize: 38 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  progressDot: { height: 8, width: 10, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  // Intro
  introContainer: { alignItems: 'center', paddingVertical: 20 },
  introEmoji: { fontSize: 80, marginBottom: 12 },
  introTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  introDesc: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  introChips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipText: { fontSize: 14, fontWeight: '700', color: '#444' },
  startBtn: { borderRadius: 28, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center', marginBottom: 12 },
  startBtnText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  skipBtn: { paddingVertical: 10 },
  skipBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },

  // Slide
  slideProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  slideProgressText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  narrateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8EAF6', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  narrateBtnActive: { backgroundColor: '#C5CAE9' },
  narrateIcon: { fontSize: 14 },
  narrateBtnText: { fontSize: 12, fontWeight: '700', color: '#3F51B5' },

  slideCard: {
    backgroundColor: Colors.white, borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
    marginBottom: 12,
  },
  slideTitleBar: { paddingHorizontal: 16, paddingVertical: 12 },
  slideTitle: { fontSize: 17, fontWeight: '800' },
  animationViewport: { minHeight: 200, justifyContent: 'center', paddingBottom: 8 },
  tipBadge: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, borderTopWidth: 1, borderTopColor: '#F0F0F0', padding: 12, borderWidth: 0, borderLeftWidth: 3, margin: 10, borderRadius: 8, backgroundColor: '#FAFAFA' },
  tipIcon: { fontSize: 16 },
  tipText: { fontSize: 13, fontWeight: '700', flex: 1 },
  interactedBadge: { backgroundColor: '#E8F5E9', padding: 8, margin: 10, borderRadius: 10, alignItems: 'center' },
  interactedText: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },

  narrationCard: { backgroundColor: '#E8EAF6', borderRadius: 16, padding: 14, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#3F51B5' },
  narrationText: { fontSize: 15, color: '#3D3D3D', lineHeight: 23, fontStyle: 'italic' },

  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
  navBtn: { flex: 1, borderRadius: 20, paddingVertical: 14, alignItems: 'center' },
  navBtnSecondary: { backgroundColor: Colors.background, borderWidth: 2, borderColor: Colors.border },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  navBtnTextPrimary: { fontSize: 15, fontWeight: '800', color: '#fff' },
  navCounter: { fontSize: 13, color: Colors.textSecondary, fontWeight: '700', minWidth: 36, textAlign: 'center' },

  // Examples
  examplesHeader: { marginBottom: 16 },
  examplesTitle: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  examplesSub: { fontSize: 14, color: Colors.textSecondary },
  exampleCard: {
    backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
    borderWidth: 2, borderColor: Colors.border,
  },
  exampleCardDone: { borderColor: '#4CAF50', backgroundColor: '#F1F8E9' },
  exampleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  exampleBadge: { fontSize: 13, fontWeight: '800', color: Colors.primary, backgroundColor: Colors.primaryLight, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  exampleDoneTag: { fontSize: 13, fontWeight: '800', color: '#2E7D32' },
  exampleQuestion: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  exampleHint: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10, fontStyle: 'italic' },
  exampleSceneContainer: { marginTop: 8 },

  // Complete
  completeContainer: { alignItems: 'center', paddingVertical: 20 },
  completeEmoji: { fontSize: 80, marginBottom: 12 },
  completeTitle: { fontSize: 30, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  completeSub: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  completeStar: { fontSize: 40 },
  completeStats: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  completeStat: { alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 14, padding: 14, flex: 1 },
  completeStatNum: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, marginBottom: 2 },
  completeStatLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  quizBtn: { borderRadius: 28, paddingVertical: 18, paddingHorizontal: 36, alignItems: 'center', marginBottom: 12, width: '90%' },
  quizBtnText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  quizBtnSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  replayBtn: { paddingVertical: 12 },
  replayBtnText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },

  // Error
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  errorEmoji: { fontSize: 60, marginBottom: 16 },
  errorTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  errorBtn: { backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 12, paddingHorizontal: 24 },
  errorBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

export default LessonScreen;
