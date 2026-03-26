/**
 * SmartKids Learning App - Main App Navigator
 * Handles all navigation routing based on auth state
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { Colors } from '../styles/colors';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';

// Child Screens
import HomeScreen from '../screens/child/HomeScreen';
import GradeSelectionScreen from '../screens/child/GradeSelectionScreen';
import TopicSelectionScreen from '../screens/child/TopicSelectionScreen';
import QuizScreen from '../screens/child/QuizScreen';
import ResultScreen from '../screens/child/ResultScreen';
import LeaderboardScreen from '../screens/child/LeaderboardScreen';

// Reading Module Screens
import ReadingStoriesScreen from '../screens/child/ReadingStoriesScreen';
import ReadingStoryScreen from '../screens/child/ReadingStoryScreen';
import ReadingQuizScreen from '../screens/child/ReadingQuizScreen';

// Parent Screens
import ParentDashboard from '../screens/parent/ParentDashboard';
import ManageChildrenScreen from '../screens/parent/ManageChildrenScreen';

const Stack = createNativeStackNavigator();

// Auth Stack (unauthenticated users)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Child Stack
const ChildStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="GradeSelection" component={GradeSelectionScreen} />
    <Stack.Screen name="TopicSelection" component={TopicSelectionScreen} />
    <Stack.Screen
      name="Quiz"
      component={QuizScreen}
      options={{ gestureEnabled: false }} // Prevent swipe back during quiz
    />
    <Stack.Screen name="Result" component={ResultScreen} />
    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    {/* ── Reading Module ── */}
    <Stack.Screen name="ReadingStories" component={ReadingStoriesScreen} />
    <Stack.Screen name="ReadingStory"   component={ReadingStoryScreen} />
    <Stack.Screen
      name="ReadingQuiz"
      component={ReadingQuizScreen}
      options={{ gestureEnabled: false }}
    />
  </Stack.Navigator>
);

// Parent Stack
const ParentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ParentDashboard">
    <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
    <Stack.Screen name="ManageChildren" component={ManageChildrenScreen} />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Unauthenticated
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          // Authenticated - show role selection then respective stacks
          <>
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="ChildStack" component={ChildStack} />
            <Stack.Screen name="ParentStack" component={ParentStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
