/**
 * SmartKids Learning App - Card Component
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../styles/colors';

const Card = ({
  children,
  onPress,
  style,
  variant = 'default',
  padding = 'medium',
  shadow = true,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        shadow && styles.shadow,
        styles[variant],
        styles[`pad_${padding}`],
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginVertical: 6,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  default: {
    backgroundColor: Colors.white,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  accent: {
    backgroundColor: Colors.accent,
  },
  light: {
    backgroundColor: Colors.primaryLight,
  },
  outlined: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  pad_none: { padding: 0 },
  pad_small: { padding: 10 },
  pad_medium: { padding: 16 },
  pad_large: { padding: 24 },
});

export default Card;
