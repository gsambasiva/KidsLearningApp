/**
 * SmartKids Learning App - Splash Screen
 * Animated launch screen with logo
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../styles/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo bounce in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Text fade in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Stars
      Animated.timing(starsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Hold
      Animated.delay(800),
    ]).start(() => {
      onFinish && onFinish();
    });
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark, '#1B5E20']}
      style={styles.container}
    >
      {/* Decorative bubbles */}
      <View style={[styles.bubble, styles.bubble1]} />
      <View style={[styles.bubble, styles.bubble2]} />
      <View style={[styles.bubble, styles.bubble3]} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, {
        transform: [{ scale: logoScale }],
        opacity: logoOpacity,
      }]}>
        <Text style={styles.logoEmoji}>🧠</Text>
      </Animated.View>

      {/* App Name */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={styles.appName}>SmartKids</Text>
        <Text style={styles.tagline}>Learning App</Text>
      </Animated.View>

      {/* Stars decoration */}
      <Animated.Text style={[styles.stars, { opacity: starsOpacity }]}>
        ⭐ 🌟 ✨ 🌟 ⭐
      </Animated.Text>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your adventure...</Text>
        <View style={styles.loadingBar}>
          <Animated.View style={styles.loadingFill} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bubble1: { width: 200, height: 200, top: -50, right: -60 },
  bubble2: { width: 150, height: 150, bottom: 100, left: -40 },
  bubble3: { width: 100, height: 100, top: 150, left: 30 },

  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoEmoji: { fontSize: 70 },

  appName: {
    fontSize: 44,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  stars: {
    fontSize: 28,
    marginTop: 32,
    letterSpacing: 4,
  },

  loadingContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '60%',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 10,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    width: '70%',
    height: 4,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
});

export default SplashScreen;
