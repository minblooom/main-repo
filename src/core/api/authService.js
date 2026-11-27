// src/core/api/authService.js
// Authentication service connecting Login, Signup, OTP, and Password Reset screens to the backend

import { apiClient, AUTH_STORAGE_KEYS, TokenStorage } from './client';
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

    if (res.data?.success && res.data?.data) return res.data.data;
    throw new Error(res.data?.message || 'Registration failed');
  }

  /**
   * Login strictly with canonical email or phone number + password
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
   * Request a 6-digit OTP for contact verification or password reset
   */
  static async sendOtp({ contact, purpose = 'VERIFY_CONTACT' }) {
    const res = await apiClient.post('/auth/send-otp', { contact, purpose });
    if (res.data?.success && res.data?.data) return res.data.data;
    throw new Error(res.data?.message || 'Could not send verification code.');
  }

  /**
   * Verify a 6-digit OTP code
   */
  static async verifyOtp({ contact, code, purpose = 'VERIFY_CONTACT' }) {
    const res = await apiClient.post('/auth/verify-otp', { contact, code, purpose });
    if (res.data?.success && res.data?.data) {
      if (purpose === 'VERIFY_CONTACT' && res.data.data.accessToken) {
        await this.saveSession(res.data.data);
      }
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Could not verify the code.');
  }

  /**
   * Reset password using the resetToken issued after OTP verification
   */
  static async resetPassword({ resetToken, newPassword }) {
    const res = await apiClient.post('/auth/reset-password', { resetToken, newPassword });
    return res.data?.data || { reset: true };
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
      await TokenStorage.multiRemove([
        AUTH_STORAGE_KEYS.ACCESS_TOKEN,
        AUTH_STORAGE_KEYS.REFRESH_TOKEN,
      ]);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEYS.USER_PROFILE);
    }
  }

  /**
   * Check whether a persistent session exists on this device so returning users stay signed in.
   * Silently refreshes profile in the background if online.
   */
  static async hasValidSession() {
    try {
      const [access, refresh] = await Promise.all([
        TokenStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
        TokenStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
      ]);
      if (!access && !refresh) return false;

      // Silent background profile sync (interceptor auto-refreshes expired accessToken)
      apiClient
        .get('/user/me')
        .then((res) => {
          if (res?.data?.data) {
            AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER_PROFILE, JSON.stringify(res.data.data)).catch(() => {});
          }
        })
        .catch(() => {});

      return true;
    } catch {
      return false;
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
    await TokenStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await TokenStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    await AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  }
}
