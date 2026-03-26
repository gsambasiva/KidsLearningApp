/**
 * SmartKids Learning App - Quiz Timer Component
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../styles/colors';
import { formatTime } from '../../utils/helpers';

const QuizTimer = ({ duration = 60, onTimeUp, running = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp && onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  // Pulse animation when time is low
  useEffect(() => {
    if (timeLeft <= 10) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft <= 10]);

  const getTimerColor = () => {
    const percent = (timeLeft / duration) * 100;
    if (percent > 60) return Colors.correct;
    if (percent > 30) return Colors.warning;
    return Colors.wrong;
  };

  const timerColor = getTimerColor();
  const progressPercent = (timeLeft / duration) * 100;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.timerRing}>
        {/* Background circle */}
        <View style={[styles.ring, styles.ringBg]} />
        {/* Progress - simplified representation */}
        <View style={[styles.timerInner, { borderColor: timerColor }]}>
          <Text style={[styles.timeText, { color: timerColor }]}>
            {timeLeft}
          </Text>
          <Text style={styles.secLabel}>sec</Text>
        </View>
      </View>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressPercent}%`, backgroundColor: timerColor },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  timerRing: { position: 'relative', width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 72, height: 72, borderRadius: 36 },
  ringBg: { backgroundColor: Colors.border },
  timerInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: { fontSize: 22, fontWeight: '800' },
  secLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: -2 },
  progressTrack: {
    width: 80,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3 },
});

export default QuizTimer;
