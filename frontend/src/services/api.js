/**
 * SmartKids Learning App - API Service
 * Central Axios instance with interceptors and error handling
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

/**
 * Resolve the backend base URL automatically.
 *
 * Problem: When running in Expo Go on a physical iPhone/Android device,
 * "localhost" means the DEVICE itself – not the Mac/PC running the backend.
 *
 * Solution: Read the Metro server host from expo-constants (it already
 * contains your machine's local IP, e.g. "192.168.1.42:8081"), strip the
 * port, and append the backend port 5001. This way any device on the same
 * Wi-Fi network can reach the backend automatically.
 *
 * Priority order:
 *  1. EXPO_PUBLIC_API_URL in .env (if it doesn't contain "localhost")
 *  2. Auto-detect from Metro host (Expo Go on device)
 *  3. localhost fallback (iOS/Android simulator, web)
 */
function getBaseURL() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  // Use .env value if it points to a real host (not localhost)
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // Auto-detect from the Metro bundler host
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||                      // SDK 46+
      Constants.manifest2?.extra?.expoGo?.debuggerHost ||   // SDK 44-45
      Constants.manifest?.debuggerHost;                     // legacy

    if (hostUri) {
      const host = hostUri.split(':')[0]; // strip Metro port, keep IP only
      const url = `http://${host}:5001/api`;
      console.log('[API] Auto-detected backend URL:', url);
      return url;
    }
  } catch (_err) {
    // ignore – fall through to localhost
  }

  // Simulator / web / local dev fallback
  return envUrl || 'http://localhost:5001/api';
}

const BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear auth and redirect to login
      await SecureStore.deleteItemAsync('auth_token');
      // Emit event for AuthContext to handle
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(new Error(message));
  }
);

export default api;
