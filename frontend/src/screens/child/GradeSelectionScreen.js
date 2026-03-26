/**
 * SmartKids Learning App - Grade Selection Screen
 */

import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  ScrollView, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { getGradeName, getGradeColor } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

const GRADES = [
  { id: 'K', name: 'Kindergarten', emoji: '🌱', description: 'Counting & basics', range: 'Ages 5-6' },
  { id: '1', name: 'Grade 1', emoji: '⭐', description: 'Addition & subtraction', range: 'Ages 6-7' },
  { id: '2', name: 'Grade 2', emoji: '🚀', description: 'Numbers up to 1000', range: 'Ages 7-8' },
  { id: '3', name: 'Grade 3', emoji: '🔥', description: 'Multiplication & division', range: 'Ages 8-9' },
  { id: '4', name: 'Grade 4', emoji: '💡', description: 'Fractions & decimals', range: 'Ages 9-10' },
  { id: '5', name: 'Grade 5', emoji: '🏆', description: 'Advanced word problems', range: 'Ages 10-11' },
];

const GradeSelectionScreen = ({ navigation, route }) => {
  const { subject: rawSubject } = route.params || {};
  // Normalise: may arrive as string 'math' or legacy object {id:'math',...}
  const subject = (rawSubject && typeof rawSubject === 'object')
    ? (rawSubject.id || 'math')
    : (rawSubject || 'math');
  const { currentGrade, setCurrentGrade } = useAppContext();
  const animations = GRADES.map(() => useRef(new Animated.Value(1)).current);

  const handleGradeSelect = (grade, index) => {
    setCurrentGrade(grade.id);

    Animated.sequence([
      Animated.spring(animations[index], { toValue: 0.93, useNativeDriver: true }),
      Animated.spring(animations[index], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('TopicSelection', { subject, grade: grade.id });
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Grade</Text>
        <Text style={styles.headerSubtitle}>
          {subject === 'math' ? '🔢 Math' : '📚 Reading'} · Choose your level
        </Text>
      </LinearGradient>

      {/* Grade Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.grid}>
        {GRADES.map((grade, index) => {
          const color = getGradeColor(grade.id);
          const isSelected = currentGrade === grade.id;

          return (
            <Animated.View
              key={grade.id}
              style={[styles.cardWrapper, { transform: [{ scale: animations[index] }] }]}
            >
              <TouchableOpacity
                style={[styles.card, { borderColor: color }, isSelected && { backgroundColor: color + '15' }]}
                onPress={() => handleGradeSelect(grade, index)}
                activeOpacity={0.85}
              >
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: color }]}>
                    <Text style={styles.selectedBadgeText}>Current</Text>
                  </View>
                )}
                <View style={[styles.gradeCircle, { backgroundColor: color }]}>
                  <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
                </View>
                <Text style={[styles.gradeId, { color }]}>{grade.name === 'Kindergarten' ? 'K' : `G${grade.id}`}</Text>
                <Text style={styles.gradeName} numberOfLines={1}>{grade.name}</Text>
                <Text style={styles.gradeDesc}>{grade.description}</Text>
                <Text style={styles.gradeRange}>{grade.range}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
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
  scrollView: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  cardWrapper: { width: '47%' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  selectedBadgeText: { fontSize: 10, color: Colors.white, fontWeight: '700' },
  gradeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gradeEmoji: { fontSize: 30 },
  gradeId: { fontSize: 22, fontWeight: '900', marginBottom: 2 },
  gradeName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  gradeDesc: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  gradeRange: { fontSize: 11, color: Colors.textLight },
});

export default GradeSelectionScreen;
