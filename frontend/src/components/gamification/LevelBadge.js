/**
 * SmartKids Learning App - Level Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

const getLevelColor = (level) => {
  if (level <= 3) return '#78909C';     // Beginner - grey
  if (level <= 6) return '#4CAF50';     // Intermediate - green
  if (level <= 10) return '#2196F3';    // Advanced - blue
  if (level <= 15) return '#9C27B0';    // Expert - purple
  return '#FFD700';                     // Master - gold
};

const getLevelTitle = (level) => {
  if (level <= 3) return 'Beginner';
  if (level <= 6) return 'Explorer';
  if (level <= 10) return 'Scholar';
  if (level <= 15) return 'Expert';
  return 'Master';
};

const LevelBadge = ({ level = 1, showTitle = true, size = 'medium' }) => {
  const color = getLevelColor(level);
  const title = getLevelTitle(level);

  return (
    <View style={[styles.container, { backgroundColor: color }, size === 'small' && styles.small]}>
      <Text style={[styles.level, size === 'small' && styles.levelSmall]}>Lv.{level}</Text>
      {showTitle && size !== 'small' && (
        <Text style={styles.title}>{title}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  small: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 14 },
  level: { fontSize: 18, fontWeight: '800', color: Colors.white },
  levelSmall: { fontSize: 13 },
  title: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
});

export default LevelBadge;
