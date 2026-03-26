/**
 * SmartKids Learning App - Streak Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

const StreakBadge = ({ streak = 0, size = 'medium' }) => {
  const isSize = (s) => size === s;

  return (
    <View style={[styles.container, isSize('small') && styles.small, isSize('large') && styles.large]}>
      <Text style={[styles.fire, isSize('small') && styles.fireSmall, isSize('large') && styles.fireLarge]}>
        🔥
      </Text>
      <Text style={[styles.count, isSize('small') && styles.countSmall, isSize('large') && styles.countLarge]}>
        {streak}
      </Text>
      {size !== 'small' && <Text style={styles.label}>day streak</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.streak,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  small: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  large: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 24 },
  fire: { fontSize: 22 },
  fireSmall: { fontSize: 16 },
  fireLarge: { fontSize: 32 },
  count: { fontSize: 20, fontWeight: '800', color: Colors.white },
  countSmall: { fontSize: 14 },
  countLarge: { fontSize: 28 },
  label: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
});

export default StreakBadge;
