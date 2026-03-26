/**
 * SmartKids Learning App - Role Selection Screen
 * Choose between Parent and Child modes
 */

import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }) => {
  const { user, selectChild } = useAuth();
  const parentScale = useRef(new Animated.Value(1)).current;
  const childScale = useRef(new Animated.Value(1)).current;

  const animatePress = (anim, callback) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 0.93, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start(callback);
  };

  const handleParentMode = () => {
    animatePress(parentScale, () => {
      navigation.navigate('ParentStack');
    });
  };

  const handleChildMode = () => {
    animatePress(childScale, () => {
      navigation.navigate('ChildStack');
    });
  };

  return (
    <LinearGradient colors={['#F5F7FA', '#E8F5E9']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.firstName}! 👋</Text>
        <Text style={styles.title}>Who's learning today?</Text>
        <Text style={styles.subtitle}>Choose your mode to continue</Text>
      </View>

      {/* Role Cards */}
      <View style={styles.cardsContainer}>

        {/* Parent Card */}
        <Animated.View style={{ transform: [{ scale: parentScale }] }}>
          <TouchableOpacity
            style={[styles.card, styles.parentCard]}
            onPress={handleParentMode}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.accent, Colors.accentDark]}
              style={styles.cardGradient}
            >
              <Text style={styles.cardEmoji}>👨‍👩‍👧‍👦</Text>
              <Text style={styles.cardTitle}>Parent</Text>
              <Text style={styles.cardDesc}>
                View progress, manage{'\n'}children and settings
              </Text>
              <View style={styles.cardFeatures}>
                {['📊 View Reports', '👧 Manage Kids', '🎯 Set Goals'].map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Child Card */}
        <Animated.View style={{ transform: [{ scale: childScale }] }}>
          <TouchableOpacity
            style={[styles.card, styles.childCard]}
            onPress={handleChildMode}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.secondary, Colors.secondaryDark]}
              style={styles.cardGradient}
            >
              <Text style={styles.cardEmoji}>🧒</Text>
              <Text style={styles.cardTitle}>Child</Text>
              <Text style={styles.cardDesc}>
                Play, learn, take quizzes{'\n'}and earn rewards!
              </Text>
              <View style={styles.cardFeatures}>
                {['🎮 Play Games', '⭐ Earn Stars', '🏆 Win Badges'].map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Tap to choose your learning journey 🚀
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 32 },
  greeting: { fontSize: 18, color: Colors.textSecondary, fontWeight: '500' },
  title: { fontSize: 30, fontWeight: '900', color: Colors.textPrimary, textAlign: 'center', marginTop: 4 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 6 },
  cardsContainer: { flex: 1, gap: 16, justifyContent: 'center' },
  card: { borderRadius: 28, overflow: 'hidden' },
  parentCard: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  childCard: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: { padding: 28, alignItems: 'center' },
  cardEmoji: { fontSize: 56, marginBottom: 10 },
  cardTitle: { fontSize: 28, fontWeight: '900', color: Colors.white, marginBottom: 6 },
  cardDesc: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24, marginBottom: 16 },
  cardFeatures: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  featureItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  featureText: { fontSize: 13, color: Colors.white, fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: 14, color: Colors.textSecondary, paddingBottom: 24 },
});

export default RoleSelectionScreen;
