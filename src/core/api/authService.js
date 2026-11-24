// src/core/api/authService.js
// Authentication service connecting Login and Signup screens to the backend

import { apiClient, AUTH_STORAGE_KEYS } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  /**
   * Register a new user
   */
  static async register({ nickname, contact, password, ageBand, gender }) {
    const res = await apiClient.post('/auth/register', {
      nickname,
      contact: contact || undefined,
      password,
      ageBand,
      gender,
    });

    if (res.data?.success && res.data?.data) {
      await this.saveSession(res.data.data);
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  }

  /**
   * Login with identifier (nickname, email, or phone) + password
   */
  static async login({ identifier, password }) {
    const res = await apiClient.post('/auth/login', {
      identifier,
      password,
    });

    if (res.data?.success && res.data?.data) {
      await this.saveSession(res.data.data);
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  }

  /**
   * Step away for a moment (Logout)
   */
  static async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEYS.ACCESS_TOKEN,
        AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        AUTH_STORAGE_KEYS.USER_PROFILE,
      ]);
    }
  }

  /**
   * Check if a valid session exists locally
   */
  static async getStoredUser() {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER_PROFILE);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  static async saveSession({ user, accessToken, refreshToken }) {
    const pairs = [
      [AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      [AUTH_STORAGE_KEYS.USER_PROFILE, JSON.stringify(user)],
    ];
    await AsyncStorage.multiSet(pairs);
  }
}
