const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add this line to fix the "S" or "default" of undefined error
config.resolver.unstable_enablePackageExports = false;


// Resolve packages from root node_modules AND react-native's own nested
// node_modules (some RN 0.81 deps like stacktrace-parser may not be hoisted).
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'node_modules/react-native/node_modules'),
];

// Stub out react-native-reanimated and react-native-worklets.
//
// Why: reanimated v4 and worklets initialise global.__reanimatedModuleProxy
// through a Hermes native extension at module-load time.  The native binary
// inside Expo Go 54.0.2 is version-mismatched with the JS packages we install,
// so that global is undefined/incomplete, causing:
//   [runtime not ready]: TypeError: Cannot read property 'S' of undefined
//
// IMPORTANT: extraNodeModules only acts as a FALLBACK — if the package is
// already installed in node_modules it is silently ignored.  We must use
// resolver.resolveRequest which OVERRIDES resolution entirely, ensuring the
// stub is always used regardless of what is installed in node_modules.
//
// Our app never calls reanimated APIs directly — we use @react-navigation/
// native-stack (100% native transitions, no JS animation layer) and React
// Native's built-in Animated API.  The stubs export safe no-op functions so
// react-native-gesture-handler can still import them without crashing.

const REANIMATED_STUB = path.resolve(__dirname, 'src/stubs/reanimated-stub.js');
const WORKLETS_STUB   = path.resolve(__dirname, 'src/stubs/worklets-stub.js');

const STUB_MAP = {
  'react-native-reanimated':  REANIMATED_STUB,
  'react-native-worklets':    WORKLETS_STUB,
  'react-native-worklets-core': WORKLETS_STUB,
};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (STUB_MAP[moduleName]) {
    return {
      filePath: STUB_MAP[moduleName],
      type: 'sourceFile',
    };
  }
  // Fall back to the default Metro resolution chain
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
