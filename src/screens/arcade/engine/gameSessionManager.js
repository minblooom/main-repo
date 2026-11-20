// src/screens/arcade/engine/gameSessionManager.js
// Centralized session, favorites, recent history, and game-state persistence manager for Bloom Arcade.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMES_CATALOG, getGameById } from './gameRegistry';

const RECENT_KEY = '@mindbloom:arcade:recently_played';
const FAVOURITES_KEY = '@mindbloom:arcade:favourites';
const STATE_PREFIX = '@mindbloom:arcade:state:';

export const gameSessionManager = {
  /**
   * Get list of recently played game objects (guaranteed unique, no duplicates)
   */
  async getRecentlyPlayed() {
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids)) {
          const uniqueIds = Array.from(new Set(ids));
          return uniqueIds.map((id) => getGameById(id)).filter(Boolean);
        }
      }
    } catch {}
    // Initial gentle starter without duplicate entries
    return [getGameById('bubble_pop'), getGameById('colour_crush')].filter(Boolean);
  },

  /**
   * Record that a game was played recently (deduplicated, latest game moves to top)
   */
  async recordGamePlayed(gameId) {
    if (!gameId) return;
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      let ids = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(ids)) ids = [];
      // Deduplicate: put gameId at front, filter out any existing entry
      ids = [gameId, ...ids.filter((id) => id !== gameId)].slice(0, 6);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(ids));
    } catch {}
  },

  /**
   * Remove a game from "Pick up where you paused"
   */
  async removeRecentGame(gameId) {
    if (!gameId) return [];
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      let ids = stored ? JSON.parse(stored) : [];
      if (Array.isArray(ids)) {
        ids = ids.filter((id) => id !== gameId);
        await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(ids));
      }
      // Also clean up any paused game state
      await this.clearGameState(gameId);
      return ids.map((id) => getGameById(id)).filter(Boolean);
    } catch {
      return [];
    }
  },

  /**
   * Save game-specific progress (level, score, grid, moves, etc.)
   */
  async saveGameState(gameId, state) {
    if (!gameId || !state) return;
    try {
      await AsyncStorage.setItem(`${STATE_PREFIX}${gameId}`, JSON.stringify({
        ...state,
        savedAt: Date.now(),
      }));
      // Also ensure this game is in recently played
      await this.recordGamePlayed(gameId);
    } catch {}
  },

  /**
   * Retrieve saved game progress
   */
  async getGameState(gameId) {
    if (!gameId) return null;
    try {
      const raw = await AsyncStorage.getItem(`${STATE_PREFIX}${gameId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear saved game progress (called on game over / victory / restart / manual removal)
   */
  async clearGameState(gameId) {
    if (!gameId) return;
    try {
      await AsyncStorage.removeItem(`${STATE_PREFIX}${gameId}`);
    } catch {}
  },

  /**
   * Get list of favorite game objects
   */
  async getFavourites() {
    try {
      const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids)) {
          const uniqueIds = Array.from(new Set(ids));
          return uniqueIds.map((id) => getGameById(id)).filter(Boolean);
        }
      }
    } catch {}
    return [getGameById('bubble_pop'), getGameById('canopy_runner')].filter(Boolean);
  },

  /**
   * Toggle a game's favourite state
   */
  async toggleFavourite(gameId) {
    if (!gameId) return false;
    try {
      const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
      let ids = stored ? JSON.parse(stored) : ['bubble_pop', 'canopy_runner'];
      if (!Array.isArray(ids)) ids = [];
      const exists = ids.includes(gameId);
      if (exists) {
        ids = ids.filter((id) => id !== gameId);
      } else {
        ids = [gameId, ...ids.filter((id) => id !== gameId)];
      }
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
      return !exists;
    } catch {
      return false;
    }
  },

  /**
   * Check if a game is favorited
   */
  async isFavourite(gameId) {
    if (!gameId) return false;
    try {
      const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
      const ids = stored ? JSON.parse(stored) : ['bubble_pop', 'canopy_runner'];
      return Array.isArray(ids) && ids.includes(gameId);
    } catch {
      return false;
    }
  },
};
