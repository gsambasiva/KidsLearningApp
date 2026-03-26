/**
 * SmartKids Learning App - Typography
 * Large, readable fonts for kids
 */

export const Typography = {
  // Font Families (loaded via expo-font)
  fontFamily: {
    regular: 'System',
    bold: 'System',
    light: 'System',
  },

  // Font Sizes - bigger for kids!
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
    display: 48,
  },

  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },

  // Text Styles
  h1: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 22,
    fontWeight: '700',
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  button: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
  quizQuestion: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
  },
  quizOption: {
    fontSize: 17,
    fontWeight: '500',
  },
};

export default Typography;
