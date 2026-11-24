// src/screens/arcade/engine/gameSessionManager.js
// Centralized session, favorites, recent history, and game-state persistence manager for Bloom Arcade.
// Seamlessly syncs local AsyncStorage state with backend cloud saves via ArcadeSyncService.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGameById } from './gameRegistry';
import { ArcadeSyncService } from '../../../core/api/arcadeSyncService';

const RECENT_KEY = '@mindbloom:arcade:recently_played';
const FAVOURITES_KEY = '@mindbloom:arcade:favourites';
const STATE_PREFIX = '@mindbloom:arcade:state:';

export const gameSessionManager = {
  /**
   * Get list of recently played game objects (guaranteed unique, no duplicates, with latest savedState attached)
   */
  async getRecentlyPlayed() {
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      let ids = stored ? JSON.parse(stored) : null;
      if (!ids || !Array.isArray(ids)) {
        // Initial peaceful starter games
        ids = ['bubble_pop', 'colour_crush'];
        await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(ids));
      }

      // Strict deduplication
      const uniqueIds = Array.from(new Set(ids));

      const games = await Promise.all(
        uniqueIds.map(async (id) => {
          const game = getGameById(id);
          if (!game) return null;
          const state = await this.getGameState(id);
          return {
            ...game,
            savedState: state,
          };
        })
      );
      return games.filter(Boolean);
    } catch {
      return [getGameById('bubble_pop'), getGameById('colour_crush')].filter(Boolean);
    }
  },

  /**
   * Record that a game was played recently (deduplicated: moves game to top, no duplicate cards)
   */
  async recordGamePlayed(gameId) {
    if (!gameId) return;
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      let ids = stored ? JSON.parse(stored) : ['bubble_pop', 'colour_crush'];
      if (!Array.isArray(ids)) ids = ['bubble_pop', 'colour_crush'];

      // Put latest gameId at front, filter out any existing occurrence
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
      let ids = stored ? JSON.parse(stored) : ['bubble_pop', 'colour_crush'];
      if (!Array.isArray(ids)) ids = ['bubble_pop', 'colour_crush'];

      // Filter out gameId
      ids = ids.filter((id) => id !== gameId);
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(ids));

      // Also clean up any paused game state locally and cloud
      await this.clearGameState(gameId);
      ArcadeSyncService.dismissSession(gameId).catch(() => {});

      const remainingGames = await Promise.all(
        ids.map(async (id) => {
          const game = getGameById(id);
          if (!game) return null;
          const state = await this.getGameState(id);
          return {
            ...game,
            savedState: state,
          };
        })
      );
      return remainingGames.filter(Boolean);
    } catch {
      return [];
    }
  },

  /**
   * Save game-specific progress (level, score, grid, moves, etc.)
   * In-place updates local storage and silently mirrors to backend cloud sync.
   */
  async saveGameState(gameId, state) {
    if (!gameId || !state) return;
    try {
      await AsyncStorage.setItem(
        `${STATE_PREFIX}${gameId}`,
        JSON.stringify({
          ...state,
          savedAt: Date.now(),
        })
      );
      // Ensure game is at front of recents without duplicates
      await this.recordGamePlayed(gameId);

      // Cloud mirror (non-blocking)
      const gameObj = getGameById(gameId);
      ArcadeSyncService.saveState({
        gameId,
        gameTitle: gameObj?.title || gameId,
        currentLevel: state.currentLevel || 1,
        score: state.score || 0,
        highScore: state.highScore || 0,
        statePayload: state,
        timeSpentSecs: state.timeSpentSecs || 0,
      }).catch(() => {});
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
   * Get list of favorite game objects (strictly unique, no duplicates)
   */
  async getFavourites() {
    try {
      const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
      let ids = stored ? JSON.parse(stored) : null;
      if (!ids || !Array.isArray(ids)) {
        ids = ['bubble_pop', 'canopy_runner'];
        await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
      }
      const uniqueIds = Array.from(new Set(ids));
      return uniqueIds.map((id) => getGameById(id)).filter(Boolean);
    } catch {
      return [getGameById('bubble_pop'), getGameById('canopy_runner')].filter(Boolean);
    }
  },

  /**
   * Toggle a game's favourite state (strictly unique, only appears once)
   */
  async toggleFavourite(gameId) {
    if (!gameId) return false;
    try {
      const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
      let ids = stored ? JSON.parse(stored) : ['bubble_pop', 'canopy_runner'];
      if (!Array.isArray(ids)) ids = ['bubble_pop', 'canopy_runner'];

      ids = Array.from(new Set(ids));
      const exists = ids.includes(gameId);
      if (exists) {
        ids = ids.filter((id) => id !== gameId);
      } else {
        ids = [gameId, ...ids.filter((id) => id !== gameId)];
      }
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
      ArcadeSyncService.toggleFavourite(gameId).catch(() => {});
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
