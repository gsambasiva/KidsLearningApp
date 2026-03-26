'use strict';
/**
 * react-native-worklets stub
 *
 * CRITICAL: The worklet Hermes thread loads the SAME Metro bundle as the main
 * JS thread. The real react-native-worklets detects which runtime it is in via
 * globalThis.__RUNTIME_KIND and, when running in the worklet thread, calls
 * init() then intentionally throws an error. C++ catches that throw as a
 * success signal ("initialization complete") and stops bundle execution.
 *
 * If we return a plain no-op stub, the worklet thread never throws, keeps
 * loading the bundle, and eventually hits code incompatible with the worklet
 * environment (e.g. accesses global.__reanimatedModuleProxy.S) causing:
 *   [runtime not ready]: TypeError: Cannot read property 'S' of undefined
 *
 * Solution: detect the worklet runtime and throw the intentional stop error,
 * mirroring what the real package does in bundleModeInit().
 */

const RuntimeKind = {
  ReactNative: 'ReactNative',
  UI: 'UI',
  Custom: 'Custom',
};

// When running inside the worklet Hermes thread, globalThis.__RUNTIME_KIND
// is NOT 'ReactNative'. We must throw here to stop bundle execution.
// This throw is INTENTIONAL – it is caught by the C++ worklets runtime as
// the signal that initialization succeeded.
const _global = (typeof globalThis !== 'undefined') ? globalThis : global;
const runtimeKind = _global.__RUNTIME_KIND;
if (runtimeKind && runtimeKind !== RuntimeKind.ReactNative) {
  throw new Error('Worklets initialized successfully');
}

// ── Main RN thread ────────────────────────────────────────────────────────────
// Safe no-op exports for the main JS thread.
// gesture-handler imports react-native-worklets via reanimatedWrapper.js;
// these stubs let it load without crashing.

const noop = () => {};

const stub = {
  __esModule: true,
  default: {},

  // Thread helpers
  runOnJS: function runOnJS(fn) { return fn; },
  runOnUI: function runOnUI(fn) { return fn; },
  runOnUIAsync: function runOnUIAsync(fn) { return fn; },
  runOnUISync: function runOnUISync(fn) { return fn; },
  executeOnUIRuntimeSync: function executeOnUIRuntimeSync(fn) { return fn; },
  scheduleOnUI: noop,
  scheduleOnRN: noop,
  callMicrotasks: noop,
  unstable_eventLoopTask: noop,

  // Shared values
  makeShareable: function makeShareable(v) { return v; },
  makeShareableCloneRecursive: function(v) { return v; },
  makeShareableCloneOnUIRecursive: function(v) { return v; },
  isShareableRef: function() { return false; },
  shareableMappingCache: { get: function() { return null; }, set: noop },

  // Worklet function utilities
  isWorkletFunction: function() { return false; },

  // Runtime queries
  RuntimeKind: RuntimeKind,
  getRuntimeKind: function() { return RuntimeKind.ReactNative; },

  // Feature flags
  getStaticFeatureFlag: function() { return false; },
  setDynamicFeatureFlag: noop,

  // WorkletsModule object (checked by gesture-handler)
  WorkletsModule: {
    makeShareableClone: function(v) { return v; },
    initDataSharingWithUIRuntime: noop,
    scheduleOnUI: noop,
  },

  // Misc
  createWorkletRuntime: function() { return null; },
  runOnRuntime: noop,
  createSerializable: function(v) { return v; },
  isSerializableRef: function() { return false; },
  serializableMappingCache: { get: function() { return null; }, set: noop },
  isSynchronizable: function() { return false; },
};

module.exports = stub;
