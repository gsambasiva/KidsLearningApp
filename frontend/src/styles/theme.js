/**
 * SmartKids Learning App - Global Theme
 * Unified design system for consistent UI
 */

import { Colors } from './colors';
import { Typography } from './typography';

export const Theme = {
  colors: Colors,
  typography: Typography,

  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Border Radius - rounded for kid-friendly feel
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
  },

  // Shadows
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    colored: (color) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
    }),
  },

  // Animation durations
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
    bounce: 600,
  },

  // Screen padding
  screenPadding: {
    horizontal: 20,
    vertical: 24,
  },

  // Component styles
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  button: {
    primary: {
      backgroundColor: Colors.primary,
      borderRadius: 25,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: 'center',
    },
    secondary: {
      backgroundColor: Colors.secondary,
      borderRadius: 25,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: 'center',
    },
    outline: {
      backgroundColor: 'transparent',
      borderRadius: 25,
      borderWidth: 2,
      borderColor: Colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      alignItems: 'center',
    },
  },
};

export default Theme;
