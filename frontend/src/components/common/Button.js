/**
 * SmartKids Learning App - Custom Button Component
 * Kid-friendly buttons with press animations
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors } from '../../styles/colors';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const getButtonStyle = () => {
    const base = styles.base;
    const variantStyle = styles[variant] || styles.primary;
    const sizeStyle = styles[`size_${size}`] || styles.size_medium;
    const widthStyle = fullWidth ? styles.fullWidth : {};
    const disabledStyle = disabled ? styles.disabled : {};
    return [base, variantStyle, sizeStyle, widthStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
    const variantText = styles[`${variant}Text`] || styles.primaryText;
    const sizeText = styles[`text_${size}`] || styles.text_medium;
    return [styles.text, variantText, sizeText, textStyle];
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'outline' ? Colors.primary : Colors.white}
            size="small"
          />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  accent: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  danger: {
    backgroundColor: Colors.wrong,
    shadowColor: Colors.wrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  white: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Sizes
  size_small: { paddingVertical: 10, paddingHorizontal: 20 },
  size_medium: { paddingVertical: 14, paddingHorizontal: 28 },
  size_large: { paddingVertical: 18, paddingHorizontal: 36 },

  // Text
  text: { fontWeight: '700' },
  primaryText: { color: Colors.white },
  secondaryText: { color: Colors.white },
  accentText: { color: Colors.white },
  outlineText: { color: Colors.primary },
  ghostText: { color: Colors.primary },
  dangerText: { color: Colors.white },
  whiteText: { color: Colors.primary },
  text_small: { fontSize: 14 },
  text_medium: { fontSize: 16 },
  text_large: { fontSize: 18 },

  // States
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
});

export default Button;
