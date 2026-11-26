
// src/services/onboardingStorage.js
// Safe, persistent storage for MindBloom onboarding completion and user preferences
// Uses @react-native-async-storage/async-storage with an in-memory fallback for high resilience

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  COMPLETED: '@mindbloom:onboarding_completed',
  PREFERENCES: '@mindbloom:user_preferences',
  DRAFT: '@mindbloom:onboarding_draft',
};

// In-memory fallback
const memoryStore = {};

export const onboardingStorage = {
  /**
   * Check if the user has completed onboarding
   */
  async isOnboardingCompleted() {
    try {
      const val = await AsyncStorage.getItem(KEYS.COMPLETED);
      if (val !== null) return val === 'true';
    } catch {
      // Fallback
    }
    return memoryStore[KEYS.COMPLETED] === 'true';
  },

  /**
   * Set onboarding completion flag
   */
  async setOnboardingCompleted(completed = true) {
    const val = completed ? 'true' : 'false';
    memoryStore[KEYS.COMPLETED] = val;
    try {
      await AsyncStorage.setItem(KEYS.COMPLETED, val);
    } catch {
      // Fallback preserved in memory
    }
  },

  /**
   * Save user onboarding preferences (merges with existing preferences so partial saves never wipe age/gender)
   */
  async savePreferences(preferences = {}) {
    let existing = {};
    try {
      const current = await this.getPreferences();
      if (current && typeof current === 'object') existing = current;
    } catch {}
    const merged = { ...existing, ...preferences };
    const json = JSON.stringify(merged);
    memoryStore[KEYS.PREFERENCES] = json;
    try {
      await AsyncStorage.setItem(KEYS.PREFERENCES, json);
    } catch {
      // Memory fallback preserved
    }
  },

  /**
   * Retrieve saved user onboarding preferences
   */
  async getPreferences() {
    try {
      const val = await AsyncStorage.getItem(KEYS.PREFERENCES);
      if (val) return JSON.parse(val);
    } catch {
      // Fallback
    }
    if (memoryStore[KEYS.PREFERENCES]) {
      try {
        return JSON.parse(memoryStore[KEYS.PREFERENCES]);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Save draft in-progress onboarding state (for interrupted sessions)
   */
  async saveDraft(data = {}) {
    const json = JSON.stringify(data);
    memoryStore[KEYS.DRAFT] = json;
    try {
      await AsyncStorage.setItem(KEYS.DRAFT, json);
    } catch {}
  },

  /**
   * Retrieve draft in-progress onboarding state
   */
  async getDraft() {
    try {
      const val = await AsyncStorage.getItem(KEYS.DRAFT);
      if (val) return JSON.parse(val);
    } catch {}
    if (memoryStore[KEYS.DRAFT]) {
      try {
        return JSON.parse(memoryStore[KEYS.DRAFT]);
      } catch {}
    }
    return null;
  },

  /**
   * Clear all onboarding data (useful for testing or starting over)
   */
  async clearAll() {
    delete memoryStore[KEYS.COMPLETED];
    delete memoryStore[KEYS.PREFERENCES];
    delete memoryStore[KEYS.DRAFT];
    try {
      await AsyncStorage.multiRemove([KEYS.COMPLETED, KEYS.PREFERENCES, KEYS.DRAFT]);
    } catch {}
  },
};
