/**
 * SmartKids Learning App - Multiple Choice Question Component
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../../styles/colors';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const OPTION_COLORS = ['#3F51B5', '#E91E63', '#FF9800', '#009688'];

const MultipleChoice = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showFeedback = false,
  onSelect,
  disabled = false,
}) => {
  const animations = options.map(() => useRef(new Animated.Value(1)).current);

  const handleSelect = (option, index) => {
    if (disabled || selectedAnswer !== null) return;

    // Press animation
    Animated.sequence([
      Animated.timing(animations[index], { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(animations[index], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    onSelect(option);
  };

  const getOptionStyle = (option) => {
    if (!showFeedback || selectedAnswer === null) {
      return selectedAnswer === option ? styles.selected : styles.optionDefault;
    }
    if (option === correctAnswer) return styles.correct;
    if (option === selectedAnswer && option !== correctAnswer) return styles.wrong;
    return styles.optionDefault;
  };

  const getOptionTextStyle = (option) => {
    if (!showFeedback || selectedAnswer === null) {
      return selectedAnswer === option ? styles.selectedText : styles.optionText;
    }
    if (option === correctAnswer) return styles.correctText;
    if (option === selectedAnswer && option !== correctAnswer) return styles.wrongText;
    return styles.optionText;
  };

  const getOptionIcon = (option) => {
    if (!showFeedback || selectedAnswer === null) return null;
    if (option === correctAnswer) return '✓';
    if (option === selectedAnswer && option !== correctAnswer) return '✗';
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Animated.View
            key={index}
            style={{ transform: [{ scale: animations[index] }] }}
          >
            <TouchableOpacity
              style={[styles.option, getOptionStyle(option)]}
              onPress={() => handleSelect(option, index)}
              disabled={disabled || selectedAnswer !== null}
              activeOpacity={0.85}
            >
              {/* Label circle */}
              <View style={[styles.labelCircle, { backgroundColor: OPTION_COLORS[index] }]}>
                <Text style={styles.labelText}>{OPTION_LABELS[index]}</Text>
              </View>

              {/* Option text */}
              <Text style={[styles.optionText, getOptionTextStyle(option)]} numberOfLines={3}>
                {option}
              </Text>

              {/* Feedback icon */}
              {getOptionIcon(option) && (
                <Text style={[
                  styles.feedbackIcon,
                  option === correctAnswer ? styles.correctIcon : styles.wrongIcon,
                ]}>
                  {getOptionIcon(option)}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  questionContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: Colors.primary,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 30,
    textAlign: 'center',
  },
  optionsContainer: { gap: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    gap: 12,
  },
  optionDefault: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
  },
  selected: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accent,
  },
  correct: {
    backgroundColor: '#E8F5E9',
    borderColor: Colors.correct,
  },
  wrong: {
    backgroundColor: '#FFEBEE',
    borderColor: Colors.wrong,
  },
  labelCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  optionText: { flex: 1, fontSize: 16, color: Colors.textPrimary, fontWeight: '500' },
  selectedText: { color: Colors.accent, fontWeight: '600' },
  correctText: { color: Colors.correct, fontWeight: '700' },
  wrongText: { color: Colors.wrong, fontWeight: '700' },
  feedbackIcon: { fontSize: 22, fontWeight: '800' },
  correctIcon: { color: Colors.correct },
  wrongIcon: { color: Colors.wrong },
});

export default MultipleChoice;
