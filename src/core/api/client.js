// src/core/api/client.js
// Central API Client for MindBloom Frontend
// Handles automatic Bearer token injection, session refresh, and offline-safe error handling.

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Local dev server fallback (10.0.2.2 for Android emulator, localhost for Web/iOS)
const DEFAULT_API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api/v1'
    : 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Keys for session storage
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: '@mindbloom_access_token',
  REFRESH_TOKEN: '@mindbloom_refresh_token',
  USER_PROFILE: '@mindbloom_user_profile',
};

/**
 * Secure token storage helpers.
 * On native (iOS/Android): tokens stored in encrypted SecureStore.
 * On web: SecureStore is unavailable — falls back to AsyncStorage (web has no native keychain).
 */
const TokenStorage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(key, value);
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Fallback to AsyncStorage if SecureStore fails (emulator edge case)
      await AsyncStorage.setItem(key, value);
    }
  },
  async removeItem(key) {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      await AsyncStorage.removeItem(key);
    }
  },
  async multiRemove(keys) {
    for (const key of keys) {
      await TokenStorage.removeItem(key);
    }
  },
};

export { TokenStorage };
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await TokenStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Storage read error ignored
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Refresh Token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.error?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await TokenStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const refreshRes = await axios.post(`${DEFAULT_API_URL}/auth/refresh`, {
          refreshToken,
        });

        if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshRes.data.data;
          await TokenStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
          if (newRefreshToken) {
            await TokenStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        // If refresh fails, clear session gracefully
        await TokenStorage.multiRemove([
          AUTH_STORAGE_KEYS.ACCESS_TOKEN,
          AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        ]);
      }
    }

    return Promise.reject(error);
  }
);
