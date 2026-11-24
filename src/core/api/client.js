// src/core/api/client.js
// Central API Client for MindBloom Frontend
// Handles automatic Bearer token injection, session refresh, and offline-safe error handling.

import axios from 'axios';
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

// Keys for local session storage
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: '@mindbloom_access_token',
  REFRESH_TOKEN: '@mindbloom_refresh_token',
  USER_PROFILE: '@mindbloom_user_profile',
};

// Request Interceptor: Attach Access Token if available
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
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
        const refreshToken = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const refreshRes = await axios.post(`${DEFAULT_API_URL}/auth/refresh`, {
          refreshToken,
        });

        if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
          const newAccessToken = refreshRes.data.data.accessToken;
          await AsyncStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        // If refresh fails, clear session gracefully
        await AsyncStorage.multiRemove([
          AUTH_STORAGE_KEYS.ACCESS_TOKEN,
          AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        ]);
      }
    }

    return Promise.reject(error);
  }
);
