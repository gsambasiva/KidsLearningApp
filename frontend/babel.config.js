module.exports = function(api) {
  api.cache(true);

  // No reanimated/worklets babel plugin needed:
  // - Our app uses @react-navigation/native-stack (native UINavigationController),
  //   which does NOT require reanimated for transitions.
  // - None of our source files use worklet functions or useSharedValue/useAnimatedStyle.
  // - The plugin injects worklet initialization calls that crash in Expo Go 54 because
  //   they run before the Hermes worklet runtime is ready ([runtime not ready] error).
  return {
    presets: ['babel-preset-expo'],
  };
};
