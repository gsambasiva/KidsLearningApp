/**
 * SmartKids Learning App - Fill In The Blank Question Component
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { Colors } from '../../styles/colors';

const FillInBlank = ({
  question,
  correctAnswer,
  hint,
  showFeedback = false,
  isCorrect,
  onSubmit,
  disabled = false,
}) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
    onSubmit(answer.trim());
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Render question with blank highlighted
  const renderQuestion = () => {
    const parts = question.split('___');
    return (
      <View style={styles.questionRow}>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <Text style={styles.questionPart}>{part}</Text>
            {i < parts.length - 1 && (
              <View style={[
                styles.blank,
                submitted && showFeedback && (
                  isCorrect ? styles.blankCorrect : styles.blankWrong
                ),
              ]}>
                <Text style={[
                  styles.blankText,
                  submitted && showFeedback && (
                    isCorrect ? styles.correctText : styles.wrongText
                  ),
                ]}>
                  {submitted ? answer : '______'}
                </Text>
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Question */}
      <View style={styles.questionContainer}>
        {renderQuestion()}
      </View>

      {/* Hint */}
      {hint && !submitted && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>💡 Hint: {hint}</Text>
        </View>
      )}

      {/* Input */}
      {!submitted && (
        <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type your answer..."
            placeholderTextColor={Colors.textLight}
            editable={!disabled}
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.submitBtn, !answer.trim() && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!answer.trim() || disabled}
          >
            <Text style={styles.submitText}>Check ✓</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Feedback */}
      {submitted && showFeedback && (
        <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <Text style={styles.feedbackEmoji}>{isCorrect ? '✅' : '❌'}</Text>
          <View>
            <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.wrongText]}>
              {isCorrect ? 'Correct! Great job!' : `Not quite. The answer is: "${correctAnswer}"`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  questionContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: Colors.primary,
  },
  questionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionPart: { fontSize: 20, fontWeight: '600', color: Colors.textPrimary, lineHeight: 32 },
  blank: {
    borderBottomWidth: 2,
    borderColor: Colors.primary,
    minWidth: 80,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  blankCorrect: { borderColor: Colors.correct, backgroundColor: '#E8F5E9', borderRadius: 8 },
  blankWrong: { borderColor: Colors.wrong, backgroundColor: '#FFEBEE', borderRadius: 8 },
  blankText: { fontSize: 18, fontWeight: '700', color: Colors.primary, lineHeight: 32 },
  hintContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F9A825',
  },
  hintText: { fontSize: 14, color: '#F57F17', fontWeight: '500' },
  inputContainer: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    padding: 14,
  },
  feedbackCorrect: { backgroundColor: '#E8F5E9' },
  feedbackWrong: { backgroundColor: '#FFEBEE' },
  feedbackEmoji: { fontSize: 28 },
  feedbackText: { fontSize: 15, fontWeight: '600' },
  correctText: { color: Colors.correct },
  wrongText: { color: Colors.wrong },
});

export default FillInBlank;
