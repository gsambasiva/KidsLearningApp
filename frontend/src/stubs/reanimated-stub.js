'use strict';
/**
 * react-native-reanimated stub
 *
 * Replaces the real reanimated module via Metro's resolveRequest override so
 * that react-native-gesture-handler (and anything else) can import it without
 * touching global.__reanimatedModuleProxy, which is unavailable/version-
 * mismatched in Expo Go 54.0.2 and causes "[runtime not ready]" crashes.
 *
 * IMPORTANT: Like the worklets stub, we must detect the worklet Hermes thread
 * (globalThis.__RUNTIME_KIND !== 'ReactNative') and throw to stop bundle
 * execution there — the C++ runtime catches this as "initialized OK".
 *
 * Our app uses @react-navigation/native-stack (all-native transitions, no
 * JS animation layer) and plain RN Animated — not reanimated APIs — so none
 * of these stubs are ever actually called at runtime on the main thread.
 */

// Worklet runtime detection — MUST happen before any require() calls
const _g = (typeof globalThis !== 'undefined') ? globalThis : global;
if (_g.__RUNTIME_KIND && _g.__RUNTIME_KIND !== 'ReactNative') {
  throw new Error('Worklets initialized successfully');
}

const { View, Text, Image, ScrollView, FlatList, SectionList } = require('react-native');

const noop = () => {};
const passThrough = (v) => v;
const makeSharedValue = (init) => ({
  value: init,
  addListener: noop,
  removeAllListeners: noop,
  modify: noop,
});

const Easing = {
  linear: passThrough,
  ease: passThrough,
  quad: passThrough,
  cubic: passThrough,
  sin: passThrough,
  circle: passThrough,
  exp: passThrough,
  elastic: () => passThrough,
  back: () => passThrough,
  bounce: passThrough,
  bezier: () => passThrough,
  in: passThrough,
  out: passThrough,
  inOut: passThrough,
  poly: () => passThrough,
  step0: passThrough,
  step1: passThrough,
};

const stub = {
  __esModule: true,

  // Animated component creator
  createAnimatedComponent: (C) => C,
  default: { createAnimatedComponent: (C) => C },

  // Shared values & derived values
  useSharedValue: makeSharedValue,
  useDerivedValue: (fn) => makeSharedValue(fn()),
  useAnimatedStyle: () => ({}),
  useAnimatedProps: () => ({}),
  useAnimatedScrollHandler: () => noop,
  useAnimatedGestureHandler: () => ({}),
  useAnimatedRef: () => ({ current: null }),
  useAnimatedReaction: noop,
  useFrameCallback: noop,
  useReducedMotion: () => false,

  // Animation creators
  withTiming: passThrough,
  withSpring: passThrough,
  withDecay: (cfg) => (cfg && cfg.velocity) || 0,
  withRepeat: passThrough,
  withSequence: (...vals) => vals[vals.length - 1],
  withDelay: (_d, v) => v,
  withClamp: (_cfg, v) => v,

  // Thread execution
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  executeOnUIRuntimeSync: (fn) => fn,
  cancelAnimation: noop,

  // Interpolation
  interpolate: passThrough,
  Extrapolation: { EXTEND: 'extend', CLAMP: 'clamp', IDENTITY: 'identity' },
  Extrapolate: { EXTEND: 'extend', CLAMP: 'clamp', IDENTITY: 'identity' },

  // Easing
  Easing,

  // Animated views (fall back to plain RN views — sufficient for native-stack nav)
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  SectionList,

  // Misc helpers
  isReanimated2: false,
  isChromeDebugger: false,
  isJest: false,
  makeRemote: (obj) => obj,
  makeShareable: (obj) => obj,
  getReanimatedVersion: () => '0.0.0-stub',
  measure: noop,
  scrollTo: noop,
  setGestureState: noop,
};

module.exports = stub;
