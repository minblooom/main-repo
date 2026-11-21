// src/core/api/arcadeSyncService.js
// Syncs Blooms Arcade progress and favourites with the backend

import { apiClient } from './client';

export class ArcadeSyncService {
  /**
   * Fetches active paused sessions from the server
   */
  static async getSessions() {
    try {
      const res = await apiClient.get('/arcade/sessions');
      return res.data?.success ? res.data.data : [];
    } catch {
      return []; // Fall back to local gameSessionManager on offline
    }
  }

  /**
   * Saves game checkpoint to the server
   */
  static async saveState({ gameId, gameTitle, currentLevel, score, highScore, statePayload, timeSpentSecs }) {
    try {
      const res = await apiClient.post('/arcade/save-state', {
        gameId,
        gameTitle,
        currentLevel: currentLevel || 1,
        score: score || 0,
        highScore: highScore || 0,
        statePayload,
        timeSpentSecs: timeSpentSecs || 0,
      });
      return res.data?.data;
    } catch (err) {
      console.warn('Game cloud sync failed, continuing offline:', err.message);
      return null;
    }
  }

  /**
   * Dismisses game from "Pick up where you paused"
   */
  static async dismissSession(gameId) {
    try {
      await apiClient.delete(`/arcade/sessions/${gameId}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Syncs favourites list
   */
  static async getFavourites() {
    try {
      const res = await apiClient.get('/arcade/favourites');
      return res.data?.success ? res.data.data : [];
    } catch {
      return [];
    }
  }

  static async toggleFavourite(gameId) {
    try {
      const res = await apiClient.post('/arcade/favourites/toggle', { gameId });
      return res.data?.data;
    } catch {
      return null;
    }
  }
}
