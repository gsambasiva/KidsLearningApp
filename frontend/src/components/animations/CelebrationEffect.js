/**
 * SmartKids — Celebration Effects
 * Reusable animated celebration overlays using React Native built-in Animated API.
 * - Floating stars burst (correct answer)
 * - Green flash overlay (correct)
 * - Red shake (wrong answer) — exports a hook
 * - Confetti particles
 */

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const STAR_EMOJIS = ['⭐', '🌟', '💫', '✨', '🎉', '🏆', '🎊', '🌈'];
const COLORS = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];

// ─── Single Floating Particle ─────────────────────────────────────────────────
const FloatParticle = ({ emoji, startX, startY, delay = 0, onDone }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dx = (Math.random() - 0.5) * 200;
    const dy = -(Math.random() * 150 + 80);

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: dx, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: dy, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => { if (onDone) onDone(); });
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${(Math.random() > 0.5 ? 1 : -1) * 360}deg`] });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          top: startY,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }, { rotate: spin }],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.particleEmoji}>{emoji}</Text>
    </Animated.View>
  );
};

// ─── Stars Burst — shows on correct answer ────────────────────────────────────
export const StarsBurst = forwardRef((props, ref) => {
  const [particles, setParticles] = useState([]);

  const burst = (cx = SCREEN_W / 2, cy = SCREEN_H / 2) => {
    const count = 10;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: STAR_EMOJIS[i % STAR_EMOJIS.length],
      x: cx - 16,
      y: cy - 16,
      delay: i * 50,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((n) => n.id === p.id)));
    }, 1400);
  };

  useImperativeHandle(ref, () => ({ burst }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((p) => (
        <FloatParticle
          key={p.id}
          emoji={p.emoji}
          startX={p.x}
          startY={p.y}
          delay={p.delay}
        />
      ))}
    </View>
  );
});

// ─── Correct Flash Overlay ────────────────────────────────────────────────────
export const CorrectFlash = forwardRef((props, ref) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const flash = () => {
    opacity.setValue(0.35);
    Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }).start();
  };

  useImperativeHandle(ref, () => ({ flash }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.correctOverlay, { opacity }]}
      pointerEvents="none"
    />
  );
});

// ─── Wrong Answer Shake Hook ──────────────────────────────────────────────────
/**
 * Returns [shakeAnim, triggerShake].
 * Apply shakeAnim as translateX to the element you want to shake.
 */
export const useShakeAnimation = () => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return [shakeAnim, triggerShake];
};

// ─── Wrong Flash Overlay ──────────────────────────────────────────────────────
export const WrongFlash = forwardRef((props, ref) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const flash = () => {
    opacity.setValue(0.3);
    Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }).start();
  };

  useImperativeHandle(ref, () => ({ flash }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.wrongOverlay, { opacity }]}
      pointerEvents="none"
    />
  );
});

// ─── Score Popup (+10!) ───────────────────────────────────────────────────────
export const ScorePopup = forwardRef((props, ref) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState('+10!');
  const [visible, setVisible] = useState(false);

  const show = (msg = '+10!', x = SCREEN_W / 2, y = SCREEN_H / 2) => {
    setText(msg);
    setVisible(true);
    translateY.setValue(0);
    opacity.setValue(1);
    scale.setValue(0);

    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -80, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(() => setVisible(false));
  };

  useImperativeHandle(ref, () => ({ show }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.scorePopup,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.scorePopupText}>{text}</Text>
    </Animated.View>
  );
});

// ─── Trophy Bounce (end of lesson) ───────────────────────────────────────────
export const TrophyBounce = ({ show = false, stars = 3 }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const starAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!show) return;
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
      Animated.stagger(150, starAnims.slice(0, stars).map((a) =>
        Animated.spring(a, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true })
      )),
    ]).start();
  }, [show]);

  if (!show) return null;

  return (
    <View style={styles.trophyContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.trophyEmoji}>🏆</Text>
      </Animated.View>
      <View style={styles.starsRow}>
        {[0, 1, 2].map((i) => (
          <Animated.View key={i} style={{ transform: [{ scale: starAnims[i] }] }}>
            <Text style={[styles.starEmoji, i < stars ? styles.starFilled : styles.starEmpty]}>
              {i < stars ? '⭐' : '☆'}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

// ─── Inline Celebration Banner ────────────────────────────────────────────────
export const CelebrationBanner = ({ visible, message = 'Great job! 🎉', subText = '' }) => {
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -80, duration: 250, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[styles.banner, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}
      pointerEvents="none"
    >
      <Text style={styles.bannerMessage}>{message}</Text>
      {!!subText && <Text style={styles.bannerSub}>{subText}</Text>}
    </Animated.View>
  );
};

// ─── Pulsing Correct Indicator ────────────────────────────────────────────────
export const PulsingCorrect = ({ visible = false }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.2, duration: 300, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      { iterations: 3 }
    );
    loop.start();
    return () => loop.stop();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.pulsingIcon, { transform: [{ scale: pulse }] }]}>
      <Text style={styles.pulsingIconText}>✅</Text>
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    zIndex: 999,
  },
  particleEmoji: { fontSize: 28 },

  correctOverlay: {
    backgroundColor: '#4CAF50',
    zIndex: 100,
  },
  wrongOverlay: {
    backgroundColor: '#F44336',
    zIndex: 100,
  },

  scorePopup: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 500,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  scorePopupText: { fontSize: 28, fontWeight: '900', color: '#fff' },

  trophyContainer: { alignItems: 'center', padding: 16 },
  trophyEmoji: { fontSize: 70 },
  starsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  starEmoji: { fontSize: 36 },
  starFilled: { color: '#FFD700' },
  starEmpty: { color: '#DDD' },

  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 200,
    borderRadius: 0,
    elevation: 8,
  },
  bannerMessage: { fontSize: 20, fontWeight: '900', color: '#fff' },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },

  pulsingIcon: { alignItems: 'center', justifyContent: 'center' },
  pulsingIconText: { fontSize: 40 },
});
